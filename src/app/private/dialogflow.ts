
//Display name and ids of intents 

export const Intents = 
{
    plan_contratar_province : {display : 'Plan-contratar - provincia', id : '4437bec8-077c-4eaf-bca2-8bb71603b62b'},
    plan_contratar_final : {display : 'Plan-contratar - provincia - usuarios - uso - TV - Movil', id : '2d6065e3-ca6d-495d-9854-b4f383bdccb0'},
    plan_contratar_affirmative : {display : 'Plan-contratar - afirmativo'},
}

export const Params = 
{
    provincia : {name : 'provincia'},
    servicio_uso : {name : 'servicio-uso'},
    servicio_tv : {name : 'servicio-tv'},
    servicio_movil : {name : 'servicio-movil'},
    servicio_usuarios : {name : 'servicio-usuarios'},
}

export const Contexts = 
{
    plan_contratar : {name : 'projects/chatbot-production-426720/agent/sessions/d97fb4b6-64c8-3461-5696-972d7b09ca07/contexts/plan-contratar'}
} 

export const Events = 
{
    conversation_end : {name : 'conversation-end'}
}
