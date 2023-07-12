const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const WsProvider = require('@bot-whatsapp/provider/baileys')
const DBProvider = require('@bot-whatsapp/database/mock')

const flujoPrincipal = addKeyword(['hola','olis','buenas']).addAnswer(['Bienvenido a mi tienda', 'hoy tenemos ofertas'])
.addAnswer('cual es tu email',{capture :true},(ctx,{fallBack})=>{
    if (!ctx.body.includes('@')){
        return fallBack()
    }
    console.log('Mensaje entrante :',ctx.body)
})
.addAnswer('En los siguientes minutos te envio un email')
const flujoSecundario = addKeyword('Gracias').addAnswer('de nada')

const main = async () => {
    const adapterDB = new DBProvider()
    const adapterFlow = createFlow([flujoPrincipal,flujoSecundario])
    const adapterProvider = createProvider(WsProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
