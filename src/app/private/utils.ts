
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

export function getRandomInt(max : number) 
{
  return Math.floor(Math.random() * max);
}