
//POST request to HOST

import { WebhookRequest, WebhookResponse } from "../private/types";

export async function POST(request: Request) 
{
    try{
    const data = await request.json() as WebhookRequest;
    console.log("Data received: \n" + JSON.stringify(data));
    }catch(e : any){};

    const response : WebhookResponse = 
    { 
        fulfillmentMessages : 
        [
            {
                text : 
                {
                    text : ['Este mensaje es una prueba']
                }
            }
        ]
    };

    return Response.json(response);
    
}

export async function GET(request: Request) 
{
    const data = await request.json() as WebhookRequest;
    console.log("Data received: \n" + JSON.stringify(data));

    const response : WebhookResponse = 
    { 
        fulfillmentMessages : 
        [
            {
                text : 
                {
                    text : ['Este mensaje es una prueba']
                }
            }
        ]
    };
    
    return Response.json(response);
    
}