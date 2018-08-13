require('dotenv').config();
import axios from 'axios';
import _ from 'lodash';
const reqMode = process.env.REQ_MODE;
const Knex = require('knex');
axios.defaults.baseURL = process.env.TARGET_BASE_URL;
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
    let promisearr = data[0].map(element => {
        // console.log(element);
        return await axios.post(reqMode,data).then(response =>{
            console.log(response.data);
            return response;
        }).catch(error => {
            console.log(error.response.data);
            return error;
        })
    });;

    await Promise.all(promisearr);
    process.exit();process.exit(0);
}

raw(reqMode, argument);