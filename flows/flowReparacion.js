const { addKeyword } = require("@bot-whatsapp/bot");
const { getUser, getTicket } = require("../api/users.service.js");
const { readFileSync } = require("fs");
const { join } = require("path");
const delay = (ms) => new Promise((res =>  setTimeout(res, ms)))

/**
 * Recuperamos el prompt "TECNICO" se lee las instrucciones del prompt tecnico
 */
const getPrompt = async () => {
  const pathPromp = join(process.cwd(), "promps");
  const text = readFileSync(join(pathPromp, "01_TECNICO.txt"), "utf-8");
  return text;
};

/**
 * Exportamos
 * @param {*} chatgptClass
 * @returns
 */
module.exports = {
  flowReparacion: (chatgptClass) => {
    return addKeyword("1", {
      sensitive: true,
    })
        .addAction(async (ctx, { endFlow, flowDynamic, provider }) => {
        
      
        await flowDynamic("Consultando en la base de datos...");


        const jid = ctx.key.remoteJid//se obtiene el id del whatsApp
        const refProvider = await provider.getInstance()

        await refProvider.presenceSubscribe(jid)
        await delay(100)

        await refProvider.sendPresenceUpdate('composing', jid)


        const user = await getUser(ctx.from);//Consultamos a strapi! ctx.from = numero

       try{

        if(user.data[0] !== undefined){

          console.log("Hola soy el usuario", user.data[0].id)

          const lastTicket = await getTicket(user.data[0].id);

          console.log(lastTicket);
      
   
           if (!lastTicket.data.length) {
             await flowDynamic("No tienes ticket abierto!");
             return endFlow();
           }
   
           const listTickets = lastTicket.data
             .map(
               (i) =>
                 `ID_REF:${i.id}, cliente:${user.data[0].username}, model:${i.attributes.model}, description: ${i.attributes.description}, status:${i.attributes.status}`
             )
             .join("\n");
   
             console.log(listTickets);
   
           const data = await getPrompt();
   
           await chatgptClass.handleMsgChatGPT(data);//Dicinedole actua!!
   
   
           const textFromAI = await chatgptClass.handleMsgChatGPT(
             `cliente=${user.data[0].username}, lista_de_reparaciones="${listTickets}"`
           );
   
   
           await flowDynamic(textFromAI.text);

        }else{
          await flowDynamic("El usuario no ha sido registrado en la BD contacte a su administrador");
          console.log("El usuario no ha sido registrado en la BD contacte a su administrador")
        }

       }catch (e){
          console.log(e)
       }

      })
      .addAnswer(
        `Tienes otra pregunta? o duda?`,
        { capture: true },
        async (ctx, { fallBack }) => {
          // ctx.body = es lo que la peronsa escribe!!
          
          if(!ctx.body.toLowerCase().includes('ofertas')){
              const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body);//chatgpt analiza
              await fallBack(textFromAI.text);//se lo envia a wpp
          }
        }
      );
  },
};