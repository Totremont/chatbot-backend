
//POST request to HOST

import { handleRequest } from "../private/services";
import { WebhookRequest, WebhookResponse } from "../private/types";

export async function POST(request: Request) 
{
    try
    {
        const typed_data = await request.json() as WebhookRequest;
        const response = await handleRequest(typed_data);
        return Response.json(response);
    }
    catch(e : any)
    {
        console.log('Request parsing error: ' + e);
        return Response.error();
    };
    
}