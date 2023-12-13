const axios = require ("axios");

/**
 * Obtenemos datos del usuario basado en el numero de telefono
 * @param {*} phone
 * @returns
 */
const getUser = async (phone) => {
  try {
      const llamadoStrapiUsuarios = `http://127.0.0.1:1337/api/usuarios?filters[phone][$eq]=${phone}`
      console.log(llamadoStrapiUsuarios)
      const response = await axios.get(`http://127.0.0.1:1337/api/usuarios?filters[phone][$eq]=${phone}`);
console.log(response.data)
      return response.data;

  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Consultamos el ticket de soporte
 * @param {*} id
 * @returns
 */
const getTicket = async (id) => {
  try {
    const queryCollectionTicket = `http://127.0.0.1:1337/api/tickets/?populate[user_id][filters][id][$eq]=${id}`
    console.log(queryCollectionTicket)
    const response= await axios.get(`http://127.0.0.1:1337/api/tickets/?populate[user_id][filters][id][$eq]=${id}`);
    console.log(response.data)
      return response.data;

   
      }catch (e) {
        console.log(e);
        return null;
        }
    }; 

module.exports = { getUser, getTicket };