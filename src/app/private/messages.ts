
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