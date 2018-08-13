require('dotenv').config();
import axios from 'axios';
import _ from 'lodash';
import sleep from 'await-sleep'

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

    for(let i = 0; i<coll.length-1;i++){
        // console.log(element);
        await sleep(500);
        console.log(coll[i].id);
        await axios.post(reqMode,{id: coll[i].id}).then(response =>{
            console.log(response.data + ' - OK');
            return response;
        }).catch(error => {
            console.log(error.response.data);
            return error;
        })
    };

    await Promise.all(promisearr);
    process.exit();process.exit(0);
}

raw(reqMode, argument);