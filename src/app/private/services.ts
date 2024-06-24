import { PrismaClient } from "@prisma/client";
import { Intents } from "./intents";
import { WebhookRequest, WebhookResponse } from "./types";
import { simpleMessage } from "./utils";
import { pcp_messages } from "./messages";
import { params} from "./parameters";

// This should create a single instance in most scenarios
// Var variables are stored in global objects.

const prisma : PrismaClient = new PrismaClient();

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
        console.log('HandleRequest ERROR : ' + error);
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
            // @ts-expect-error
            const province = data.queryResult!.parameters[params.provincia]! as string;
            response = await pcpHandler(province);
            break;
        
        default:
            throw new Error('Gateway ERROR : Matching Intent was not found');
    }

    return response;
}

async function pcpHandler(province_name : string)
{
    const response = {} as WebhookResponse;
    const region = await prisma.regions.findUnique({where : {name : province_name}});


    if(region?.available)
    {
        response.fulfillmentMessages = simpleMessage(pcp_messages.success(province_name));
    }
    else response.fulfillmentMessages = simpleMessage(pcp_messages.fail(province_name));

    return response;

}


