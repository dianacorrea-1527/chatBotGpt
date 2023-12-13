const axios = require("axios");


/**
 * Consultamos inventario
 * @param {*} id
 * @returns
 */
const getItems = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:1337/api/items`);
    console.log(response.data)
      return response.data;

   
      }catch (e) {
        console.log(e);
        return null;
        }
    }; 
   
module.exports = { getItems }