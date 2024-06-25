
//POST request to HOST

import { handleRequest } from "../private/services";
import { WebhookRequest} from "../private/types";

export async function POST(request: Request) 
{
    try
    {
        const typed_data = await request.json() as WebhookRequest;
        const response = await handleRequest(typed_data);

        if(response?.ok) return Response.json(response.response);
        else
        {
            console.log('Response error: service returned error');
            return Response.error();
        }
    }
    catch(e : any)
    {
        console.log('Request parsing error: ' + e);
        return Response.error();
    };
    
}