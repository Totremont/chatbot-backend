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



export const rgdc_messages = 
{
    invalidCode : () => 
`
El código que ingresaste no pertenece a ningún usuario. Corroborá que tu información es correcta.
`,
    success : () => 
`
Anotado.
Por último, necesito que des una breve descripción de tu inconveniente para darle más información a nuestro soporte.
Lo siguiente que escribas se agregará como parte de tu reclamo.
Si querés cancelar esta operación, escribí 'Cancelar';

`
}

//1 - Datos 2 - Gen 3 - Velocidad 4 - Fibra 5 - Streaming 6 - HD 
export const t_messages = 
{
    success : (term : number) => getExplainMessage(term),
    waitForAnswer : () => 
`
¿Querés que te explique un término? ¡Con gusto!
Estoy capacitado para resolver dudas sobre:

1- Datos y redes móviles.
2- Generaciones móviles (3G, 4G, 5G).
3- Velocidades de Internet.
4- Sobre la fibra óptica.
5- Sobre los servicios de streaming.
6- Sobre las resoluciones y calidad de televisión.

¿En cuál de ellos te puedo asistir?
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

export const rgd_messages =
{
    success : () => 
`
Para poder generar un reclamo, primero necesito que me proveas de tu código de usuario. 
De esta forma, quedará asociado a tu cuenta y podrás consultarlo más adelante.
` 
}

export const rgf_messages =
{
    success : () => 
`
¡Listo! Tu reclamo fue subido y pronto será atendido por un empleado de soporte.
Recordá que podés ver el estado todos tus reclamos con tu código de usuario.
` 
}








function getExplainMessage(term : number)
{
    let text = '';
    switch(term)
    {
        case 1:
            text = 
`
¿No entendés que son los datos móviles o gigas? ¡Te ayudo!

Nuestra red móvil te permiten conectarte a Internet adentro y fuera de tu casa y sin depender de una red Wi-Fi.
Al contratar un pack de telefonía obtenés acceso a la misma para consumir una cierta cantidad de contenido durante un período determinado (un mes).
Tu consumo se mide en Gigabytes (Gigas o GB), que es una unidad de trasferencia de información entre dispositivos, a lo largo de Internet. Estos son los 'datos móviles'.
Cada vez que consumís (descargás o subís) contenido usando la red móvil (ej: acceder a una página web, ver videos, etc) estás gastando los datos que tenés asignados.
Cuando tus datos se agotan, tenés que esperar hasta el próximo mes para renovarlos.

Tu celular tiene funciones que te permiten ver la cantidad de datos móviles que has consumido a lo largo de un período.

Espero te haya sido de ayuda.
`;
            break;
        case 2:
            text = 
            `
¿No entendés que es el 4G, 5G? ¡Te ayudo!

Los distintos avances en las tecnologías de la telefonía móvil han sido categorizados como 'generaciones' utilizando la abreviatura 'G' desde el 0G.
Con 'movil' no nos referimos solo a los celulares, sino a las comunicaciones inalámbricas.
Las redes móviles terrestres se basan en antenas para recibir y transmitir señales.
También existen las redes satelitales que retransmiten señales utilizando satélites en el espacio.

El cambio más importante ocurrió con la llegada del *3G*, debido a que permitió globalizar y acelerar el acceso a Internet desde los teléfonos, usando las redes móviles.

Resumidamente, tu celular convierte información en ondas de radio que se envían a la antena más cercana. Ésta las procesa y retransmite hacia donde deben ir. El proceso inverso se da cuando recibes información.
Esto te permite acceder a Internet desde tu celular o móvil.

Las subsiguientes tecnologías (4G y 5G) han seguido mejorando las capacidades de las redes móviles. 
Las redes *4G* son hasta 5 veces más rápidas que las 3G y ofrecen menor latencia y mayor ancho de banda.
Las redes *5G* son la última generación y se estima que pueden ser hasta 100 veces más rápidas que el 4G.

Si querés más información: [acá te dejo un enlace](https://darwincav.com/es/whats-the-difference-between-3g-4g-and-5g/).

Espero te haya sido de ayuda.
`;
            break;
        case 3:
            text = 
            `
¿No entendés que son los MB/s? ¡Te ayudo!

Te daré un resumen de los términos que necesitás saber antes de contratar Bit-Stream.

1 - Velocidad: Se refiere a la cantidad de datos que transmitís por Internet en un rango de tiempo.
1.1 - Subida : Datos que subís a Internet. Por ejemplo, cuando almacenás un archivo en la nube.
1.2 - Bajada : Datos que recibís desde Internet. Por ejemplo, cuando visitás una página web o descargás un archivo.

2 - Unidades: todas son relativas al 'bit', que es la unidad mínima de información digital.
- Mb/s : Mide el consumo en megabits por segundo. Es importante no confundir con megabyte (*B* mayúscula MB/s).
- MB/s : Megabytes por segundo. Un byte equivale a 8 bits y, por tanto, es una unidad 8 veces mayor al megabit.
- GB/s : Gigabytes por segundo. Equivale a 1024 MB/s. No es utilizada para medir velocidad por ser muy grande.

3 - Conversión: Nuestros planes ofrecen velocidades medidas en Mb/s. Para calcular cuánto equivale en MB/s tenés que dividir el valor por 8.


Espero te haya sido de ayuda.
`;
            break;
        case 4:
            text = 
            `
¿No entendés que es la fibra óptica? ¡Te ayudo!

La Internet por fibra óptica es una tecnología compleja que permite la transmisión de información en forma de luz, en lugar de electricidad.
El tramo entre la línea de la red de fibra principal y el usuario final se denomina "última milla".
Esta tecnología ofrece un ancho de banda muy superior al de los cables de par trenzado DSL o las redes Wi-Fi, con un alto grado de confiabilidad y baja latencia.

Eso es todo lo que tenés que saber.
Para más información: [te dejo este enlace](https://espanol.centurylink.com/home/help/internet/fiber/what-is-fiber-internet.html).


Espero te haya sido de ayuda.
`;
            break;
        case 5:
            text = 
            `
¿No entendés que es el Streaming? ¡Te ayudo!

El concepto de streaming se refiere a cualquier contenido que se puede disfrutar a través de internet en tiempo real. 
Los podcasts, películas, programas de TV y videos en vivo son ejemplos de contenido streaming.
Llevan este nombre (del inglés - stream: flujo, corriente) debido a que el contenido lo vas obteniendo a medida que lo vas consumiendo.
Desde el punto de vista de Internet, el contenido 'fluje' desde los servidores a tu dispositivo a lo largo del tiempo.


Espero te haya sido de ayuda.
`;
            break;
        case 6:
            text = 
            `
¿No entendés que es la televisión HD, 4K? ¡Te ayudo!

Te daré un resumen de los términos que necesitás saber antes de contratar Bit-Stream.

1 - Resolución: Se refiere a la cantidad de pixeles que conforman una imagen. A mayor resolución, mayor claridad y calidad.
La resolución se mide en: [pixeles horizontales] x [pixeles verticales] y los píxeles totales salen de esta multiplicación.
1.1 - HD (High Definition): 1280x720
1.2 - FHD (Full High Definition): 1920x1080
1.3 - UHD ó 4K : 3840x2160. Es una resolución 4 veces superior al FHD y 9 veces al HD.

Es importante que entiendas que, para que un contenido se reproduzca en una resolución determinada, se debe cumplir que tanto tu pantalla como el dispositivo de reproducción soporten esa resolución.
Las pantallas de una resolución determinada soportan esa y todas las inferiores.
Los dispositivos de reproducción pueden ser un decodificador o un servicio de streaming Netflix o YouTube. En estos casos, la resolución máxima soportada dependerá del plan y/o video correspondiente.


Espero te haya sido de ayuda.
`;
        break;
    default:
        text = 'Parece que me pediste ayuda con un término que desconozco. Lo siento';
        break;

    }
    return text;
}
