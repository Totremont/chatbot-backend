import { Internet_planes, PrismaClient } from "@prisma/client";
import { Contexts, Events, Intents, Params, project_id } from "./dialogflow";
import { WebhookRequest, WebhookResponse } from "./types";
import { problemToIndex, getSession, payloadMessage, simpleMessage, termToIndex, indexToProblem, Reclamo } from "./utils";
import { cc_messages, pbcc_messages, pc_messages, pca_messages, pcf_messages, pcm_messages, pcp_messages, pmf_messages, ra_messages, rgd_messages, rgdc_messages, rgf_messages, t_messages } from "./messages";

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

        case Intents.reclamo_ayuda.display:
        case Intents.reclamo_ayuda_problema.display:
            response = await raHandler(data);
            break;
        
        case Intents.reclamo_generar_desc.display:
            response = await rgdHandler(data);
            break;
        case Intents.reclamo_generar_desc_cod.display:
            response = await rgdcHandler(data);
            break;
        
        //Para generar el evento de creación de reclamo
        case Intents.reclamo_generar_continuar.display:
            response = await rgcHandler(data);
            break;

        case Intents.reclamo_final.display:
            response = await rgfHandler(data);
            break;

        case Intents.terminologia.display:
        case Intents.terminologia_valor.display:
            response = tHandler(data);
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

        console.log()

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

//Este intent se puede triggerear por parámetro (opcional) o evento
function raHandler(data : WebhookRequest)
{
    const response = {} as WebhookResponse;
    const session = getSession(data);
    const param = data.queryResult.parameters?.[Params.servicio_ayuda.name] as string;
    const param_num = data.queryResult.parameters?.[Params.reclamo_numero.name] as number;

    //Si viene del evento reclamo-generar-ayuda
    const param_event = data.queryResult.outputContexts?.
    find(it => it.name === Contexts.reclamo_generar_ayuda(session).name)?.
    parameters?.[Params.reclamo_numero.name] as number;

    if(param_event || param_num) //Ya es un número
    {
        let type = param_num;
        if(!param_num) type = param_event;
        response.fulfillmentMessages = simpleMessage(ra_messages.success(type));
        response.outputContexts = 
        [
            {
                name : Contexts.reclamo_ayuda_respuesta(session).name,
                lifespanCount : 2,
                parameters : {}
            }
        ]
    }
    else if(param)  //Convertir a número
    {
        let type = -1;
        type = problemToIndex(param);
        response.fulfillmentMessages = simpleMessage(ra_messages.success(type));
        response.outputContexts = 
        [
            {
                name : Contexts.reclamo_ayuda_respuesta(session).name,
                lifespanCount : 2,
                parameters : {}
            }
        ]
    }
    else response.fulfillmentMessages = simpleMessage(ra_messages.waitForAnswer());
    return response;
}

function tHandler(data : WebhookRequest)
{
    const response = {} as WebhookResponse;
    const term = data.queryResult.parameters?.[Params.termino.name] as string;
    const term_num = data.queryResult.parameters?.[Params.termino_numero.name] as number;
    let type = term_num;

    if(term) type = termToIndex(term);
    
    if(type) response.fulfillmentMessages = payloadMessage(t_messages.success(type));
    else response.fulfillmentMessages = simpleMessage(t_messages.waitForAnswer());

    return response;
    
}

//Generamos el evento reclamo-generar-ayuda con el parámetro del número de problema
function rgaHandler(data : WebhookRequest)
{
    const response = {} as WebhookResponse;
    const session = getSession(data);
    const param = data.queryResult.outputContexts?.find(it => it.name === Contexts.reclamo_generar_problema(session).name);
    const type = param?.parameters?.[Params.reclamo_numero.name] as number;
    if(type)
    {
        response.followupEventInput = 
        {
            name : Events.reclamo_generar_ayuda.name,
            parameters : {'reclamo-numero' : type},
            languageCode : 'es'
        };
    }
    else throw new Error('RGA: No problem type was found');

    return response;

}

//Generamos el evento reclamo-registrar
function rgcHandler(data : WebhookRequest)
{
    const response = {} as WebhookResponse;
    const session = getSession(data);
    const param = data.queryResult.outputContexts?.find(it => it.name === Contexts.reclamo_generar_problema(session).name);
    const type = param?.parameters?.[Params.reclamo_numero.name] as number;
    if(type)
    {
        response.followupEventInput = 
        {
            name : Events.reclamo_registrar.name,
            parameters : {'reclamo-numero' : type},
            languageCode : 'es'
        };
    }
    else throw new Error('RGA: No problem type was found');

    return response;

}

async function rgdHandler(data : WebhookRequest)
{
    const response = {} as WebhookResponse;
    const session = getSession(data);
    //Parametros del evento reclamo-registrar
    const params = data.queryResult.outputContexts?.
    find(it => it.name === Contexts.reclamo_registrar(session).name)?.parameters;
    const problem_num = params?.[Params.reclamo_numero.name] as number;
    const problem_type = params?.[Params.servicio_ayuda.name] as string;
    if(problem_num || problem_type)
    {
        response.fulfillmentMessages = simpleMessage(rgd_messages.success());
        response.outputContexts = 
        [
            {
                name: Contexts.reclamo_registrar_desc_followup(session).name,
                lifespanCount : 2,
                parameters : 
                {
                    'servicio-ayuda' : problem_type,
                    'reclamo-numero' : problem_num
                }
            }
        ]
    }
    else throw new Error('RGD: Event did not have parameters');

    return response;

}

async function rgdcHandler(data : WebhookRequest)
{
    const response = {} as WebhookResponse;
    const code = data.queryResult.parameters?.[Params.servicio_codigo.name] as string;
    const session = getSession(data);
    const params = data.queryResult.outputContexts?.
    find(it => it.name === Contexts.reclamo_registrar_desc_followup(session).name)?.parameters;

    const problem_num = params?.[Params.reclamo_numero.name] as number;     //Puede llegar como número o texto.
    let problem_type = params?.[Params.servicio_ayuda.name] as string;
    if(!!problem_type && problem_num) problem_type = indexToProblem(problem_num);

    if(code && problem_type)
    {
        const client = await prisma.clients.findUnique({where : {id : code}});
        if(client)
        {
            response.fulfillmentMessages = simpleMessage(rgdc_messages.success());
            response.outputContexts = 
            [
                {
                    name: Contexts.reclamo_registrar_final(session).name,
                    lifespanCount : 2,
                    parameters : 
                    {
                        'servicio-codigo' : code,
                        'servicio-ayuda' : problem_type
                    }

                }
            ]

        }
        else response.fulfillmentMessages = simpleMessage(rgdc_messages.invalidCode());
    }
    else throw new Error('RGDC: User code was not found');
    return response;
}


async function rgfHandler(data : WebhookRequest)
{
    const response = {} as WebhookResponse;
    const session = getSession(data);

    const desc = data.queryResult.queryText;
    const params = data.queryResult.outputContexts?.
    find(it => it.name === Contexts.reclamo_registrar_final(session).name)?.parameters;

    const code = params?.[Params.servicio_codigo.name] as string;
    let problem_type = params?.[Params.servicio_ayuda.name] as string;

    if(code && problem_type)
    {
        const reclamo = await prisma.reclamos.create(
        {
            data : 
            {
                category : problem_type,
                description : desc,
                expedition : new Date(),
                status : Reclamo.PENDIENTE,
                user_code : code
            }
        })
        response.fulfillmentMessages = simpleMessage(rgf_messages.success());
    }
    else throw new Error('RGF: Parameters to create reclamo were not found');

    return response;

}






