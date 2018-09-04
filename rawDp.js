





require('dotenv').config();
  import axios from 'axios';
  import _ from 'lodash';
  import sleep from 'await-sleep'
  
  const reqMode = process.env.REQ_MODE;
  const Knex = require('knex');
  axios.defaults.baseURL = process.env.TARGET_DEALPOS_URL;
  axios.defaults.headers = {Authorization: 'Bearer a734e7cfd1a75696ee5fec015f5a2c5734f89d28'};

  const knex = Knex({
      client: 'mysql2',
      connection: {
          host : process.env.SOURCE_DB_HOST,
          user : process.env.SOURCE_DB_USER,
          password : process.env.SOURCE_DB_PASSWORD,
          database : process.env.SOURCE_DB
      }
  });
  


  let argument = '';
  if(!_.isNil(process.argv[2])){
      argument = process.argv[2];
  }
  async function raw(param, query){
      let ids = [];
      let data = await knex.raw(query);
      let coll = data[0];
      // let promises = [];
      // coll.forEach(element => {
      //     console.log('push:', element.id);
      //     promises.push(axios.post(reqMode),{id: element.id});
      // });
  
      // await axios.all(promises).then(function(results) {
      //     results.forEach(function(response) {
      //         console.log(response.value);
      //         mainObject[response.identifier] = response.value;
      //     })
      // });
  
        console.log(coll);
        let dataToSend = {};

      for(let i = 0; i<coll.length;i++){
    
    
        switch (reqMode){
            case 'product':
                dataToSend = {
                    user_id: 1,
                    products: [coll[i].id]
                };
                
                
                break;
            case 'customer':
                dataToSend ={
                    users: [
                        coll[i].id
                    ]
                };
                break;
            case 'promo':
                dataToSend = {
                    user_id: 1,
                    status: 'add',
                    promos: [coll[i].id]
                };
                break;
        }

          // console.log(element);
          await sleep(500);
          console.log(coll[i].id);
          await axios.post(reqMode,dataToSend).then(async response =>{
              console.log(response.data + ' - OK');
              if(reqMode=='product'){
                await sendSkus(coll[i].id)
            }
              return response;
          }).catch(error => {
              console.log(error);
              return error;
          })
      };
  
    //   await Promise.all(promisearr);
      process.exit();process.exit(0);
  }
  
  raw(reqMode, argument);

async function sendSkus(product_id){
    let skus = [];
    skus = await knex.raw('SELECT * FROM skus WHERE product_id = ' + product_id);
    let skusData = skus[0];
    let stocks = [];
    let stocksData = [];
    if(skusData){
        for(let j = 0; j < skusData.length;j++){
            stocks = await knex.raw('SELECT * FROM stocks WHERE number = "S' + skusData[j].number + '"')
            stocksData = stocks[0];
            if(stocksData.length){
                for(let i = 0; i< stocksData.length; i++){
                    await axios.post('sku', 
                        {
                            user_id : 1,
                            skus: [{
                                id: skusData[j].id,
                                qty: stocksData[i].quantity -  stocksData[i].hold,
                                location: stocksData[i].store_id
                            }]
                        }
                    ).then(response => {
                        console.log('sku')
                        return response;
                    })
                }
            }
        }
    }
    return '';
}