import { Internet_planes, Movil_planes, Television_planes } from "@prisma/client"

export const pcp_messages = 
{
    success : (province_name : string) => 
    `
        Afortunadamente, nuestros servicios están disponibles en ${province_name}.

        ¿Cuántas personas se conectarán a la red habitualmente?
    `,
    
    fail : (province_name : string) => 
    `
        Lamentamos informarte que nuestros servicios no están disponibles en ${province_name}.

        Siento no poder serte de ayuda :(
    `
}

export const pcf_messages = 
{
    success
    (
        pack : {internet : Internet_planes, tv : Television_planes | null, movil : Movil_planes | null},
        userType : string,
        users : number
    )
    { 
        const price_internet = pack.internet.price;
        const price_tv = pack.tv?.price ?? 0;
        const price_movil = pack.movil?.price ?? 0;
        const final_price = price_internet + price_tv + price_movil;
        const text =
        `
        ¡Todo listo!
        Encontré el plan perfecto para vos según tus necesidades:

        - Uso: ${userType}
        - Usuarios: ${users}
        
        Además agregué los servicios extras que hayas solicitado.
        Verás el plan a continuación.

        *${pack.internet.name}*
        - Bajada : ${pack.internet.downstream} Mb/s
        - Subida : ${pack.internet.upstream} Mb/s
        - Precio : $ ${pack.internet.price}
        ${this.setTvPackMessage(pack.tv)}
        ${this.setMovilPackMessage(pack.movil)}

        Precio final : $ ${final_price}

        ¿Te gustaria contratarlo?
        `
        return text;
    },
    
    setMovilPackMessage(pack : Movil_planes | null)
    {
        let text = '';
        if(pack)
        {
            text =  
            `
            *${pack.name}*
            - Datos : ${pack.data} GB
            - Velocidad : ${pack.generations}
            - Con Roaming? : ${pack.roaming ? 'SI' : 'NO'}
            - Extras : ${pack.extras[0]}
            - Precio : $ ${pack.price}
            `
        }
        return text;
    } 
    ,
    setTvPackMessage(pack : Television_planes | null)
    {
        let text = '';
        if(pack)
        {  
            text =
            `
            *${pack.name}*
            - Canales : ${pack.channels}
            - Canales FHD : ${pack.fhd_channels}
            - Canales UHD : ${pack.uhd_channels_}
            - Extras : ${pack.extras[0]}
            - Precio : $ ${pack.price}
            `
        }
        return text;
    } 
}

export const pca_messages = 
{
    success : (client_code : string) => 
    `
        ¡Felicidades! Ya eres usuario de Bit-Stream
        El siguiente es tu código de cliente. Es importante que lo guardes.

        ${client_code}

        Con este código podrás luego comprobar tu plan o cancelarlo.
        ¡Que disfrutes de tu plan!

    `,
    
    fail : () => 
    `
        Lamento informarte que ocurrió un error y no pude procesar tu pedido. Lo siento.
    `
}