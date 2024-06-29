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

* ${pack.internet.name} *
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
* ${pack.name} *
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
* ${pack.name} *
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

export const cc_messages = 
{
    success : (province_name : string) => 
`
¡Estás de suerte porque nuestros servicios están disponibles en ${province_name}!

Recordá que a la hora de buscar un plan, puedo ayudarte a contratar el que más te convenga.
`,
    
    fail : (province_name : string) => 
`
Lamentamos informarte que nuestros servicios no están disponibles en ${province_name}.

Siento no poder serte de ayuda :(
`,

    waitForAnswer : () => 
`
¿Querés saber nuestra cobertura? Escribe la provincia por la que preguntas y con gusto te diré si tenemos disponibilidad.
`
}

export const pbcc_messages = 
{
    success : () => 
`
Tu plan fue cancelado satisfactoriamente.
¡Esperamos que vuelvas!
`,
    
    invalidCode : () => 
`
No he encontrado ningún cliente con ese código. Comprueba que tenés un código correcto.
`,

    fail : () => 
`
¡Vaya! Ocurrió un error y no pude cancelar tu plan. Te recomiendo realizar el trámite desde nuestra página web.
`
}

export const pc_messages = 
{
    success(pack : {internet : Internet_planes, tv : Television_planes | null, movil : Movil_planes | null})
    { 
        const price_internet = pack.internet.price;
        const price_tv = pack.tv?.price ?? 0;
        const price_movil = pack.movil?.price ?? 0;
        const final_price = price_internet + price_tv + price_movil;
        const text =
`
¡Listo! A continuación te recuerdo tu plan:

* ${pack.internet.name} *
- Bajada : ${pack.internet.downstream} Mb/s
- Subida : ${pack.internet.upstream} Mb/s
- Precio : $ ${pack.internet.price}
${pcf_messages.setTvPackMessage(pack.tv)}
${pcf_messages.setMovilPackMessage(pack.movil)}

Precio final : $ ${final_price}
`
        return text;
    }
    ,
    
    invalidCode : () => 
`
No he encontrado ningún cliente con ese código. Comprueba que tenés un código correcto.
`,
    waitForAnswer : () => 
    `
    ¡Claro! Dime tu código de usuario y recordaré el plan que posees.
    `
}

export const pcm_messages = 
{
    invalidCode()
    {
        return 'El código que ingresaste no pertenece a ningún cliente. Corrobora tu código para continuar.';
    },

    success()
    {
        const text =
`
De acuerdo.
A continuación, necesito que me anotes los servicios que va a tener tu nuevo plan.
Por ejemplo:

 - Internet Dual, TV Plus, Movil Connect 

Podés omitir los planes que no quieras.
`
    return text;
    }
}

export const pmf_messages = 
{
    success()
    {
        return '¡Listo! He modificado tu plan satisfactoriamente. :)'
    }

}
/*
export const rgp_messages = 
{
    withHelp : (selected : number) =>          
`
Has seleccionado la opción [${selected}].
Por suerte, puedo darte unos consejos para resolver este problema.
¿Te gustaría recibir ayuda? En caso que no, continuaremos con el reclamo.
` 
    withoutHelp : () => 
    {

    }
}
    */

export const ra_messages = 
{
    success: (type : number) => getHelpMessage(type),

    waitForAnswer : () => 
`
¿Necesitás ayuda? ¡Acá estoy!
Para continuar, necesito que me expliqués en qué te puedo asistir.
De los inconvenientes listados debajo, ¿cuál corresponde a tu problema?

1- No tengo conexión a internet.
2- Se me desconfiguró el router/modem.
3- No funciona la red móvil.
4- No me anda la Televisión.
5- No puedo pagar mi factura.
6- Otro
7- Quiero saber el significa de un término
`
}

//1 - Internet 2 - Router 3 - Movil 4 - Television 5 - Factura 6 - Contratar
function getHelpMessage(type : number)
{
    let msg : string;
    switch(type)
    {
        case 1:
            msg = 
`
¿Tenés problemas de conexión a Internet?
Te recomiendo realizar los siguientes pasos:

1. Verificá si existe una interrupción del servicio en tu zona. 
Podés consultarlo desde nuestra página web.

2. Tratá de acceder a diferentes sitios. 
El problema puede estar con la aplicación, servicio o sitio web que estás intentando acceder. 
Si solo un sitio web o servicio no está funcionando correctamente, tu conexión probablemente esté bien.

- 2.1. Comprueba el código de error del navegador
A veces, esto puede ocurrir por una mala configuración de dirección IP o de servidor DNS.

3. Revisá tus cable y reiniciá tu router.
Para reiniciar, podés desconectar y conectar los cables o apretar el botón de reinicio.
Comprueba que no tengas cables sueltos o dañados.
Si es un problema de cobertura, prueba moviendo tu router a una ubicación diferente.


¿Fueron estos consejos de utilidad para resolver el problema?
`
            break;
        case 2:
            msg = 
`
¿Tenés problemas con tu modem/router?
Te recomiendo realizar los siguientes pasos:

1- Si necesitás cambiar la contraseña del Wi-Fi.
Nota: La información de sesión y la IP están en una etiqueta en la parte inferior del router.
a) Introduce la dirección IP de tu router en el navegador (generalmente es 192.168.1.1).
b) Ingresá con tu usuario y contraseña.
c) Entrá en los ajustes de la red Wi-Fi.
d) Buscá la sección de seguridad y cambiá la contraseña.

2- Si el modem no funciona.
Visualizá si las luces del módem están encendidas, apagadas o titilan. 
Te recomendamos siempre reiniciarlo desconectándolo de la corriente eléctrica y volviéndolo a conectar luego de 10 segundos.
Si las luces se encendieron, tendrás que esperar a que todas estén prendidas para verificar si podés navegar. 
Si no se encendieron, por favor, comprobá que los cables estén correctamente conectados al módem. 
Si aún así continúan sin prenderse, conectá tu módem a otro toma corriente. 

3- Si hay poca cobertura
Colocá el modem en un lugar con la menor cantidad de obstáculos y en una ubicación céntrica con respecto a las zonas de uso.
Si la distancia a cubrir es muy grande, es posible que requieras el uso de repetidores Wi-Fi.


¿Fueron estos consejos de utilidad para resolver el problema?
`
                break;
            case 3:
            msg = 
`
¿Tenés problemas con la red móvil?
Te recomiendo realizar los siguientes pasos:

1. Verificá que estés dentro del área de cobertura.
Podés consultarlo desde nuestra página web.

2. Comprobá que tengás datos disponibles.

2. Verificá que tu PC o celular no esté en 'Modo Avión'.

3. Configura tu celular para que selecciona una red automáticamente.
Podes hacerlo desde los ajustes de red móvil.

4. Como última instancia, podés probar reiniciando el dispositivo.


¿Fueron estos consejos de utilidad para resolver el problema?
`
                break;
            case 4:
                msg = 
`
¿Tenés problemas con la televisión?
Te recomiendo realizar los siguientes pasos:

1- Si no hay señal
Es posible que haya un corte en el servicio. Debería solucionarse a la brevedad.
Probá reiniciando el decodificador. Desenchufalo, esperá 10 segundos y volvelo a enchufar.


1. Si aparece un código de error.
Probá reiniciando el decodificador. Desenchufalo, esperá 10 segundos y volvelo a enchufar.
Si persiste, ponete en contacto con soporte y entregales el número.


¿Fueron estos consejos de utilidad para resolver el problema?

`
                break;
            case 5:
                msg = 
`
¿Tenés problemas con tu factura?
Te recomiendo realizar los siguientes pasos:

1- Métodos de pago
Podés pagar tu factura de manera presencial en efectivo, por transferencia y tarjeta de crédito o débito.
También podés pagar desde nuestra página web.

2- Si no recibiste tu factura
Podés ver y abonar tu factura a través de la web accediendo con tu usuario.
El no recibimiento de tu factura no te exime del pago.
Adicionalmente podés generar un reclamo de factura perdida.

3- Si tu factura venció
Igualmente podés abonarla a través de los medios de pago habituales. 
Se pueden cobrar intereses por mora y/o sufrir bajas del servicio.

        
¿Fueron estos consejos de utilidad para resolver el problema?

`
                break;
            case 6:
                msg = 
`
Si tu problema es otro lamentablemente no puedo ayudarte.
Te recomiendo contactar con nuestro soporte y/o generar un reclamo.
`
                break;

            default:
                msg = 'Parece que has pedido ayuda para un problema del que no estoy capacitado. Lo siento.'
                break;
    }
    return msg;
}