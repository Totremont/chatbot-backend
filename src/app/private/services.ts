import { PrismaClient } from "@prisma/client";
import { Contexts, Events, Intents, Params } from "./dialogflow";
import { WebhookRequest, WebhookResponse } from "./types";
import { simpleMessage } from "./utils";
import { pca_messages, pcf_messages, pcp_messages } from "./messages";

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
        
        default:
            throw new Error('Gateway ERROR : Matching Intent was not found');
    }

    return response;
}

async function pcpHandler(data : WebhookRequest)
{
    // @ts-expect-error
    const province = data.queryResult!.parameters[Params.provincia.name]! as string;
    const response = {} as WebhookResponse;
    const region = await prisma.regions.findUnique({where : {name : province}});


    if(region?.available)
    {
        response.fulfillmentMessages = simpleMessage(pcp_messages.success(province));
    }
    else response.fulfillmentMessages = simpleMessage(pcp_messages.fail(province));

    return response;

}

async function pcfHandler(data : WebhookRequest)
{
    const parameters = data.queryResult.outputContexts?.find(it => it.name === Contexts.plan_contratar.name)?.parameters;
    let response = {} as WebhookResponse;
    if(parameters)
    {
        const users = parameters[Params.servicio_usuarios.name as keyof {}] as number ?? 0;
        const service = parameters[Params.servicio_uso.name as keyof {}] as string ?? '';
        const tv_pack = parameters[Params.servicio_tv.name as keyof {}] as string ?? '';
        const movil_pack = parameters[Params.servicio_movil.name as keyof {}]as string ?? '';

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
    let response = {} as WebhookResponse;
    const parameters = data.queryResult.outputContexts?.find(it => it.name === Contexts.plan_contratar.name)?.parameters;
    if(parameters)
    {
        const users = parameters[Params.servicio_usuarios.name as keyof {}] as number ?? 0;
        const service = parameters[Params.servicio_uso.name as keyof {}] as string ?? '';
        const tv_pack = parameters[Params.servicio_tv.name as keyof {}] as string ?? '';
        const movil_pack = parameters[Params.servicio_movil.name as keyof {}] as string ?? '';
        const province = parameters[Params.provincia.name as keyof {}] as string ?? '';


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
        response.followupEventInput = 
        {
            name : Events.conversation_end.name,
            languageCode : 'es'
        }
        return response;
    }
    else throw new Error('PCA: Parameters are null');

}


