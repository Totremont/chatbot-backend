import { WebhookRequest } from "./types";

/*
{
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          "Text response from webhook"
        ]
      }
    }
  ]
}
*/
export function simpleMessage(message : string)
{
    const data : [Object] = [{text : {text : [message]}}]
    return data; 

}

export function payloadMessage(message : string)
{
    const data : [Object] = [{payload : {telegram : {text : message, parseMode: 'Markdown' }}}]
    return data; 

}


//"session": "projects/project-id/agent/sessions/session-id"

export function getSession(data : WebhookRequest)
{
    const sessionRaw = data.session;
    //console.log("Session: " + sessionRaw);
    if(sessionRaw)
    {
      const arr = sessionRaw.split('/');
      const session = arr[arr.length - 1];
      //console.log("Session ID: " + session);
      return session;
    }
    else throw new Error('Error: Session ID was not found');
}

export const Reclamo = 
{
  PENDIENTE : 'Pendiente',
  DESCARTADO : 'Descartado',
  SOLUCIONADO : 'Solucionado'
}

export function indexToProblem(num : number)
{
    switch(num)
    {
        case 1:
          return 'Internet'
        case 2:
          return 'Router'
        case 3:
          return 'Red Movil'
        case 4:
          return 'Televisión'
        case 5:
          return 'Factura'
        default:
          return 'Otro'
    }
}

export function problemToIndex(problem : string)
{
    switch(problem)
    {
        case 'Internet':
            return 1;
        case 'Router':
            return 2;
        case 'Movil':
            return 3;
        case 'Televisión':
            return 4;
        case 'Factura':
            return 5;
        default:
            return -1;
    }
}

export function termToIndex(term : string)
{
  switch(term)
  {
      case 'Datos':
          return 1;         
      case 'Gen':
          return 2;         
      case 'Velocidad':
          return 3;         
      case 'Fibra':
          return 4;        
      case 'Streaming':
          return 5;         
      case 'HD':
          return 6;
      default:
        return -1;
          
  }
}