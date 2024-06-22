
//POST request to HOST

import { WebhookRequest, WebhookResponse } from "../private/types";

export async function POST(request: Request) 
{
    try
    {
        const typed_data = await request.json() as WebhookRequest;
        const raw_data = await request.json();

        //const raw_body = await request.body
        console.log('Raw json received: \n' + JSON.stringify(raw_data));
        console.log('Typed json received: \n' + JSON.stringify(typed_data));
    }
    catch(e : any)
    {
        console.log('Parsing error');
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