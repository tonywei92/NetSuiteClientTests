require('dotenv').config();
import axios from 'axios';
import _ from 'lodash';
import BrandMap from './Models/BrandMap';
import CustomerMap from './Models/CustomerMap';
import SkuMap from './Models/SkuMap';
import VendorMap from './Models/VendorMap';
const Knex = require('knex');

const knex = Knex({
    client: 'mysql2',
    connection: {
        host : process.env.SOURCE_DB_HOST,
        user : process.env.SOURCE_DB_USER,
        password : process.env.SOURCE_DB_PASSWORD,
        database : process.env.SOURCE_DB
    }
});

const reqMode = process.env.REQ_MODE;
let argument = '';
if(!_.isNil(process.argv[2])){
    argument = process.argv[2];
}

axios.defaults.baseURL = process.env.TARGET_DEALPOS_URL;
axios.defaults.headers = {Authorization: 'Bearer a734e7cfd1a75696ee5fec015f5a2c5734f89d28'};

let scripts = {
    product,
    customer,
    promo,
    itemRand,
    vendorRand,
    customerRand,
    brandRand,
};


async function product(){
    let ids = argument.split(',');
    for(let i=0; i< ids.length; i++ ){
        await sendProduct(ids[i]);
    };
    return '';
}

async function customer(){
    let ids = argument.split(',');
    for(let i=0; i< ids.length; i++){
        await sendCustomer(ids[i]);
    };
    return '';
}

async function promo(){
    let ids = argument.split(',');
    for(let i=0; i< ids.length; i++){
        await sendPromo(ids[i]);
    };
    return '';
}

function itemRand(){

}

function vendorRand(){

}

function customerRand(){

}

function brandRand(){

}


async function sendProduct(id){
    await sendRequest('product',
    {
        user_id: 1,
        products: [id]
    },id);
    return '';
}

async function sendCustomer(id){
    await sendRequest('customer', {
        users: [
            id
        ]
    },id);
    return '';
}

async function sendPromo(id){
    await sendRequest('promo', {
        user_id: 1,
        status: 'add',
        promos: [id]
    },id);
    return '';
}

function vendorExists($boboId){

}
function customerExists($boboId){

}
function brandExists($boboId){

}
function itemExists($boboId){

}


async function sendRequest(endpoint, data,id){
    return await axios.post(endpoint,data).then(async response =>{
        console.log('============data: ' , data);
        console.log(response.data);
        if(reqMode=='product'){
            await sendSkus(id);
        }
        return '';
    }).catch(error => {
        console.log(error);
    })
}

scripts[reqMode]();
// console.log(reqMode);

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