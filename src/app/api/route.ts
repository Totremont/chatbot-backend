
//POST request to HOST

import { WebhookRequest, WebhookResponse } from "../private/types";

export async function POST(request: Request) 
{
    console.log('Received a POST request');
    try
    {
        const raw_data = await request.json();
        console.log('Raw json received: \n' + JSON.stringify(raw_data));

        const typed_data = raw_data as WebhookRequest;

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

export async function GET(request: Request) 
{
    console.log('Received a GET request');
    try
    {
        if(request.body)
        {
            const raw_data = await request.json();
            console.log('Raw json received: \n' + JSON.stringify(raw_data));

            const typed_data = raw_data as WebhookRequest;

            console.log('Typed json received: \n' + JSON.stringify(typed_data));
        } 
        else console.log('Request with empty body');
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