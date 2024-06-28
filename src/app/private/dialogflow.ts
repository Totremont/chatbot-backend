
//Display name and ids of intents 

export const Intents = 
{
    plan_contratar_province : {display : 'Plan-contratar - provincia', id : '4437bec8-077c-4eaf-bca2-8bb71603b62b'},
    plan_contratar_final : {display : 'Plan-contratar - provincia - usuarios - uso - TV - Movil', id : '2d6065e3-ca6d-495d-9854-b4f383bdccb0'},
    plan_contratar_affirmative : {display : 'Plan-contratar - afirmativo'},

    cobertura_conocer : {display : 'cobertura-conocer' },
    cobertura_conocer_province : {display : 'cobertura-conocer - provincia' },

    plan_cancelar : {display : 'Plan-baja - continuar - cancelar'},
    plan_cancelar_modificar : {display : 'Plan-baja - modificar - codigo'},
    plan_modificar_final : {display : 'Plan-baja - modificar - codigo - lista'},

    plan_consultar : {display : 'plan-consultar'},
    plan_consultar_codigo : {display : 'plan-consultar - codigo'}
}

export const Params = 
{
    provincia : {name : 'provincia'},
    servicio_uso : {name : 'servicio-uso'},
    servicio_tv : {name : 'servicio-tv'},
    servicio_movil : {name : 'servicio-movil'},
    servicio_usuarios : {name : 'servicio-usuarios'},
    servicio_codigo : {name : 'servicio-codigo'},
    servicio_internet : {name : 'servicio-internet'}
}

export const Contexts = 
{
    plan_contratar(session : string) 
    {
        const object = {
        name : `projects/chatbot-production-426720/agent/sessions/${session}/contexts/plan-contratar`,
        friendly: 'plan-contratar'
        }
        return object
    },
    plan_modificar(session : string) 
    {
        const object = {
        name : `projects/chatbot-production-426720/agent/sessions/${session}/contexts/plan-baja-modificar-codigo-followup`,
        }
        return object
    }
} 

export const Events = 
{
    conversation_end : {name : 'conversation-end'},
    plan_modificar : {name : 'plan-modificar'},
}
