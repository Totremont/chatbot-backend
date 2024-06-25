
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
        parameters?: Object,
        allRequiredParamsPresent: boolean,
        cancelsSlotFilling?: boolean,
        fulfillmentText?: string,
        fulfillmentMessages: [Object],
        webhookSource?: string,
        webhookPayload?: Object,
        outputContexts?: [{name : string, lifespanCount : number, parameters : {}}],
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
  followupEventInput?: Object,
  sessionEntityTypes?: [Object]
}
