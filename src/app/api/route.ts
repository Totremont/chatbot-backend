
//POST request to HOST

import { WebhookRequest, WebhookResponse } from "../private/types";

export async function POST(request: Request) 
{
    try
    {
        const raw_data = await request.json();
        console.log('Raw json received: \n' + JSON.stringify(raw_data));

        const typed_data = await request.json() as WebhookRequest;
        
        console.log('Typed json received: \n' + JSON.stringify(typed_data));
    }
    catch(e : any)
    {
        console.log('Parsing error: ' + e);
    };

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