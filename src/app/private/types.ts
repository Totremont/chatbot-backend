
export type WebhookRequest = 
{
    session: string,
    responseId: string,
    queryResult: 
    {
        queryText: string,
        languageCode?: string,
        speechRecognitionConfidence?: number,
        action?: string,
        parameters?: Parameters,
        allRequiredParamsPresent: boolean,
        cancelsSlotFilling?: boolean,
        fulfillmentText?: string,
        fulfillmentMessages: [Object],
        webhookSource?: string,
        webhookPayload?: Object,
        outputContexts?: [{name : string, lifespanCount : number, parameters : Parameters}],
        intent: {displayName : string, id : string},
        intentDetectionConfidence: number,
        diagnosticInfo?: Object,
        sentimentAnalysisResult?: Object,
    },
    originalDetectIntentRequest?: Object
}

/*

    Use "" for empty strings
    Use {} or null for empty objects
    Use [] or null for empty arrays

*/
export type WebhookResponse = 
{   
  fulfillmentText?: string,
  fulfillmentMessages: [Object],
  source?: string,
  payload?: Object,
  outputContexts?: [Object],
  followupEventInput?: {name : string, parameters : Parameters, languageCode : string},
  sessionEntityTypes?: [Object]
}

type Parameters = {[key : string] : string | number}
