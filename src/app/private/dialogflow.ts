
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
    plan_consultar_codigo : {display : 'plan-consultar - codigo'}, 

    reclamo_generar : {display : 'reclamo-generar' },
    reclamo_generar_ayuda : {display : 'reclamo-generar - problema - ayuda' },

    reclamo_generar_problema : {display: 'reclamo-generar - problema'},

    //Generando reclamo
    reclamo_generar_continuar : {display : 'reclamo-generar - problema - continuar'},

    //Para pasar el número de reclamo hacia desc-codigo
    reclamo_generar_desc : {display : 'reclamo-generar - descripcion'},

    reclamo_generar_desc_cod : {display : 'reclamo-generar - descripcion - codigo'},
    //reclamo_final : {display : 'reclamo-final'},

    reclamo_ayuda : {display : 'Reclamo-ayuda'},
    reclamo_ayuda_problema: {display : 'Reclamo-ayuda - problema'},

    reclamo_ayuda_inutil_affirmative : {display : 'Reclamo-ayuda - inutil - si'},

    //Ver reclamos
    reclamo_consultar : {display : 'reclamo-consultar'},
    reclamo_consultar_codigo : {display : 'reclamo-consultar - codigo'},

    terminologia : {display : 'terminologia'},
    terminologia_valor : {display : 'terminologia - valor'},

}

export const Params = 
{
    provincia : {name : 'provincia'},
    servicio_uso : {name : 'servicio-uso'},
    servicio_tv : {name : 'servicio-tv'},
    servicio_movil : {name : 'servicio-movil'},
    servicio_usuarios : {name : 'servicio-usuarios'},
    servicio_codigo : {name : 'servicio-codigo'},
    servicio_internet : {name : 'servicio-internet'},
    servicio_ayuda : {name : 'servicio-ayuda'},
    
    reclamo_numero : {name: 'reclamo-numero'},
    
    termino : {name: 'termino'},
    termino_numero: {name: 'termino-numero'}


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
        const object = 
        {
            name : `projects/chatbot-production-426720/agent/sessions/${session}/contexts/plan-baja-modificar-codigo-followup`,
        }
        return object
    },

    reclamo_ayuda_respuesta(session : string)
    {
        const object = 
        {
            name : `projects/chatbot-production-426720/agent/sessions/${session}/contexts/reclamo-ayuda-respuesta`,
        }
        return object
    },
 
    //Contexto para obtener problema y llevarlo a solucion
    reclamo_generar_problema(session : string)
    {
        const object = 
        {
            name : `projects/chatbot-production-426720/agent/sessions/${session}/contexts/reclamo-generar-problema-followup`,
        }
        return object
    },

    //Evento que se pasa a la solución
    reclamo_generar_ayuda(session : string)
    {
        const object = 
        {
            name : `projects/chatbot-production-426720/agent/sessions/${session}/contexts/reclamo-generar-ayuda`,
        }
            return object
    },

    //Evento que recibe el creador de reclamos.
    reclamo_registrar(session : string)
    {
        const object = 
        {
            name : `projects/chatbot-production-426720/agent/sessions/${session}/contexts/${Events.reclamo_registrar.name}`,
        }
        return object
    },

    //Acá obtiene el número de problema el reclamo-generar - descripcion - codigo
    reclamo_registrar_desc_followup(session : string)
    {
        const object = 
        {
            name : `projects/chatbot-production-426720/agent/sessions/${session}/contexts/reclamo-generar-descripcion-followup`,
        }
        return object
    }

} 

//Eventos se tratan como output context
export const Events = 
{
    conversation_end : {name : 'conversation-end'},
    plan_modificar : {name : 'plan-modificar'},
    //Trigger para ir a Intent de ayuda
    reclamo_generar_ayuda : {name : 'reclamo-generar-ayuda'},

    //Event que activa la creación de un reclamo.
    reclamo_registrar : {name : 'reclamo-registrar'}

}

export const project_id = 'chatbot-production-426720';
