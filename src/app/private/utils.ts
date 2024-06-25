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