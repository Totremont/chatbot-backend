import { Internet_planes, PrismaClient } from "@prisma/client";
import { Contexts, Events, Intents, Params } from "./dialogflow";
import { WebhookRequest, WebhookResponse } from "./types";
import { getSession, simpleMessage } from "./utils";
import { cc_messages, pbcc_messages, pc_messages, pca_messages, pcf_messages, pcm_messages, pcp_messages, pmf_messages } from "./messages";

// This should create a single instance in most scenarios
// Var variables are stored in global objects.

const prisma : PrismaClient = new PrismaClient();

// == Data objects ==

// == Global handler ==

export async function handleRequest(data : WebhookRequest)
{ 
    let response : WebhookResponse | null = null;
    let error = false;
    try
    {
        response = await gateway(data);
    } 
    catch(error : any)
    {
        console.log(error);
        error = true;
    }
    finally{ return {ok : !error, response} }
};


//Calls corresponding service
async function gateway(data : WebhookRequest)
{
    let response : WebhookResponse | null = null;

    switch(data.queryResult.intent.displayName)
    {
        case Intents.plan_contratar_province.display:
            response = await pcpHandler(data);
            break;
        case Intents.plan_contratar_final.display:
            response = await pcfHandler(data);
            break;
        case Intents.plan_contratar_affirmative.display:
            response = await pcaHandler(data);
            break;
        case Intents.cobertura_conocer.display:
        case Intents.cobertura_conocer_province.display:
            response = await ccHandler(data);
            break;
        case Intents.plan_cancelar.display:
            response = await pbccHandler(data);
            break;
        case Intents.plan_cancelar_modificar.display:
            response = await pcmHandler(data);
            break;
        case Intents.plan_modificar_final.display:
            response = await pmfHandler(data);
            break;
        case Intents.plan_consultar.display:
        case Intents.plan_consultar_codigo.display:
            response = await pcHandler(data);
            break;
        
        default:
            throw new Error('Gateway ERROR : Matching Intent was not found');
    }

    return response;
}

async function pcpHandler(data : WebhookRequest)
{
    const province = data.queryResult.parameters?.[Params.provincia.name] as string;
    const response = {} as WebhookResponse;

    if(province)
    {
        const region = await prisma.regions.findUnique({where : {name : province}});
        if(region?.available) response.fulfillmentMessages = simpleMessage(pcp_messages.success(province));     
        else response.fulfillmentMessages = simpleMessage(pcp_messages.fail(province));
    }
    else throw new Error('PCP: Parameter is null');

    return response;

}

async function pcfHandler(data : WebhookRequest)
{
    const session = getSession(data);
    const parameters = data.queryResult.outputContexts?.find
    (
        it => it.name === Contexts.plan_contratar(session).name
    )?.parameters;

    let response = {} as WebhookResponse;
    if(parameters)
    {
        const users = parameters?.[Params.servicio_usuarios.name] as number;
        const service = parameters?.[Params.servicio_uso.name] as string;
        const tv_pack = parameters?.[Params.servicio_tv.name] as string;
        const movil_pack = parameters?.[Params.servicio_movil.name]as string;

        const pack = {internet : '', tv : tv_pack, movil : movil_pack}

        //Internet
        if(service && service == 'Intensivo')
        {
            if(users > 4) pack.internet = 'Internet Nova';
            else if(users > 2) pack.internet = 'Internet Estela';
            else pack.internet = 'Internet Dual';
        }
        else //Casual o nulo
        {
            if(users > 8) pack.internet = 'Internet Nova';
            else if(users > 5) pack.internet = 'Internet Estela';
            else if(users > 2) pack.internet = 'Internet Dual';
            else pack.internet = 'Internet Single';
        }  

        const values = await Promise.all(
        [
            prisma.internet_planes.findUnique({where : {name : pack.internet}}),
            prisma.television_planes.findUnique({where : {name : pack.tv}}),
            prisma.movil_planes.findUnique({where : {name : pack.movil}})
        ]);

        const chosen_packs = {internet : values[0]!, tv : values[1], movil : values[2]};
        response.fulfillmentMessages = simpleMessage(pcf_messages.success(chosen_packs,service,users));
        return response;
    }
    else throw new Error('PCF: Parameters are null');
}

//Procesar pedido del cliente
async function pcaHandler(data : WebhookRequest)
{
    const session = getSession(data);
    const parameters = data.queryResult.outputContexts?.find
    (
        it => it.name === Contexts.plan_contratar(session).name
    )?.parameters;

    let response = {} as WebhookResponse;
    if(parameters)
    {
        const users = parameters?.[Params.servicio_usuarios.name] as number;
        const service = parameters?.[Params.servicio_uso.name] as string;
        const tv_pack = parameters?.[Params.servicio_tv.name] as string;
        const movil_pack = parameters?.[Params.servicio_movil.name] as string;
        const province = parameters?.[Params.provincia.name] as string;


        const pack = {internet : '', tv : tv_pack, movil : movil_pack}

        //Internet
        if(service && service == 'Intensivo')
        {
            if(users > 4) pack.internet = 'Internet Nova';
            else if(users > 2) pack.internet = 'Internet Estela';
            else pack.internet = 'Internet Dual';
        }
        else //Casual o nulo
        {
            if(users > 8) pack.internet = 'Internet Nova';
            else if(users > 5) pack.internet = 'Internet Estela';
            else if(users > 2) pack.internet = 'Internet Dual';
            else pack.internet = 'Internet Single';
        }  

        const values = await Promise.all(
        [
            prisma.internet_planes.findUnique({where : {name : pack.internet}}),
            prisma.television_planes.findUnique({where : {name : pack.tv}}),
            prisma.movil_planes.findUnique({where : {name : pack.movil}})
        ]);

        const chosen_packs = {internet : values[0]!, tv : values[1], movil : values[2]};

        const price_internet = chosen_packs.internet.price;
        const price_tv = chosen_packs.tv?.price ?? 0;
        const price_movil = chosen_packs.movil?.price ?? 0;
        const final_price = price_internet + price_tv + price_movil;

        const full_pack = 
        `${chosen_packs.internet.name} ${chosen_packs.tv?.name ?? ''} ${chosen_packs.movil?.name ?? ''}`;

        const client = await prisma.clients.create
        (
            {
                data:
                {
                    client_name : 'John',
                    client_code : 'Doe',
                    client_region : province,
                    includes_tv : !!chosen_packs.tv,
                    tv_pack : chosen_packs.tv?.name ?? '',
                    channels : chosen_packs.tv?.channels ?? 0,
                    hd_channels : chosen_packs.tv?.fhd_channels ?? 0,
                    includes_movil : !!chosen_packs.movil,
                    movil_pack : chosen_packs.movil?.name ?? '',
                    roaming : chosen_packs.movil?.roaming ?? false,
                    downstream : chosen_packs.internet.downstream,
                    internet_pack : chosen_packs.internet.name,
                    movil_data : chosen_packs.movil?.data ?? 0,
                    movil_extras : chosen_packs.movil?.extras ?? [''],
                    movil_gens : chosen_packs.movil?.generations ?? '',
                    total_price : final_price,
                    tv_extras : chosen_packs.tv?.extras ?? [''],
                    uhd_channels : chosen_packs.tv?.uhd_channels_ ?? 0,
                    upstream : chosen_packs.internet.upstream,
                    full_pack : full_pack

                }
            }
        );

        response.fulfillmentMessages = simpleMessage(pca_messages.success(client.id));
        /* No funciona como esperaba
        response.followupEventInput = 
        {
            name : Events.conversation_end.name,
            languageCode : 'es'
        }
        */
        return response;
    }
    else throw new Error('PCA: Parameters are null');

}

async function ccHandler(data : WebhookRequest)
{
    let response = {} as WebhookResponse;
    const province = data.queryResult.parameters?.[Params.provincia.name] as string;
    if(province)
    {
        const region = await prisma.regions.findUnique({where : {name : province}});
        if(region?.available) response.fulfillmentMessages = simpleMessage(cc_messages.success(province));
        else response.fulfillmentMessages =  simpleMessage(cc_messages.fail(province));
    }
    else response.fulfillmentMessages =  simpleMessage(cc_messages.waitForAnswer());

    return response;
}

async function pbccHandler(data : WebhookRequest)
{
    let response = {} as WebhookResponse;
    const code = data.queryResult.parameters?.[Params.servicio_codigo.name] as string;
    if(code)
    {
        const result = await prisma.clients.delete({where : {id : code}});
        if(result) response.fulfillmentMessages = simpleMessage(pbcc_messages.success());
        else response.fulfillmentMessages =  simpleMessage(pbcc_messages.invalidCode());
    }
    else throw new Error('PBCC: No user code was provided or found');

    return response;
}

async function pcHandler(data : WebhookRequest)
{
    let response = {} as WebhookResponse;
    const code = data.queryResult.parameters?.[Params.servicio_codigo.name] as string;
    if(code)
    {
        const client = await prisma.clients.findUnique({where : {id : code}});
        if(client)
        {
            const values = await Promise.all(
                [
                    prisma.internet_planes.findUnique({where : {name : client.internet_pack}}),
                    prisma.television_planes.findUnique({where : {name : client.tv_pack}}),
                    prisma.movil_planes.findUnique({where : {name : client.movil_pack}})
                ]
            );
            const pack = {internet : values[0]!, tv : values[1], movil : values[2] };
            response.fulfillmentMessages = simpleMessage(pc_messages.success(pack));
        }
        else response.fulfillmentMessages =  simpleMessage(pc_messages.invalidCode());
    }
    else response.fulfillmentMessages =  simpleMessage(pc_messages.waitForAnswer());

    return response;
}

async function pcmHandler(data : WebhookRequest)
{
    let response = {} as WebhookResponse;
    const code = data.queryResult.parameters?.[Params.servicio_codigo.name] as string;
    if(code)
    {
        const client = await prisma.clients.findUnique({where : {id : code}});
        if(client) response.fulfillmentMessages = simpleMessage(pcm_messages.success());     
        else response.fulfillmentMessages = simpleMessage(pcm_messages.invalidCode());

        return response;
    }
    else throw new Error('PCM: No user code was found');
}

async function pmfHandler(data : WebhookRequest)
{
    let response = {} as WebhookResponse;
    const session = getSession(data);
    const out_parameters = data.queryResult.outputContexts?.find
    (
        it => it.name === Contexts.plan_modificar(session).name
    )?.parameters;
    
    const code = out_parameters?.[Params.servicio_codigo.name] as string;

    if(data.queryResult.parameters && code)
    {
        const internet_pack = data.queryResult.parameters?.[Params.servicio_internet.name] as string;
        const tv_pack = data.queryResult.parameters?.[Params.servicio_tv.name] as string;
        const movil_pack = data.queryResult.parameters?.[Params.servicio_movil.name] as string;

        const pack = {internet : internet_pack, tv : tv_pack, movil : movil_pack}

        const values = await Promise.all(
        [
            prisma.internet_planes.findUnique({where : {name : pack.internet}}),
            prisma.television_planes.findUnique({where : {name : pack.tv}}),
            prisma.movil_planes.findUnique({where : {name : pack.movil}})
        ]);

        const chosen_packs = {internet : values[0]!, tv : values[1], movil : values[2]};

        const price_internet = chosen_packs.internet.price;
        const price_tv = chosen_packs.tv?.price ?? 0;
        const price_movil = chosen_packs.movil?.price ?? 0;
        const final_price = price_internet + price_tv + price_movil;

        const full_pack = 
        `${chosen_packs.internet.name} ${chosen_packs.tv?.name ?? ''} ${chosen_packs.movil?.name ?? ''}`;

        const client = await prisma.clients.update
        (
            {
                where : {id : code},
                data:
                {
                    includes_tv : !!chosen_packs.tv,
                    tv_pack : chosen_packs.tv?.name ?? '',
                    channels : chosen_packs.tv?.channels ?? 0,
                    hd_channels : chosen_packs.tv?.fhd_channels ?? 0,
                    includes_movil : !!chosen_packs.movil,
                    movil_pack : chosen_packs.movil?.name ?? '',
                    roaming : chosen_packs.movil?.roaming ?? false,
                    downstream : chosen_packs.internet.downstream,
                    internet_pack : chosen_packs.internet.name,
                    movil_data : chosen_packs.movil?.data ?? 0,
                    movil_extras : chosen_packs.movil?.extras ?? [''],
                    movil_gens : chosen_packs.movil?.generations ?? '',
                    total_price : final_price,
                    tv_extras : chosen_packs.tv?.extras ?? [''],
                    uhd_channels : chosen_packs.tv?.uhd_channels_ ?? 0,
                    upstream : chosen_packs.internet.upstream,
                    full_pack : full_pack
                }
            }
        );

        response.fulfillmentMessages = simpleMessage(pmf_messages.success());

        return response;
    }
    else throw new Error('PMF: Parameters are null');

}


