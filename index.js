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

axios.defaults.baseURL = process.env.TARGET_BASE_URL;

let scripts = {
    item,
    vendor,
    customer,
    brand,
    itemRand,
    vendorRand,
    customerRand,
    brandRand,
    order
};


function item(){
    let ids = argument.split(',');
    ids.forEach( (item,index) =>{
        sendItem(item);
    });
}

function vendor(){
    let ids = argument.split(',');

    ids.forEach( (item,index) =>{
        sendVendor(item);
    });
}

function customer(){
    let ids = argument.split(',');
    ids.forEach( (item,index) =>{
        sendCustomer(item);
    });
}

function brand(){
    let ids = argument.split(',');
    ids.forEach( (item,index) =>{
        sendBrand(item);
    });
}

function order(){
    let ids = argument.split(',');
    ids.forEach( (item,index) =>{
        sendOrder(item);
    });
}

function itemRand(){

}

function vendorRand(){

}

function customerRand(){

}

function brandRand(){

}


function sendItem(id){
    sendRequest('item', {id: id});
}

function sendVendor(id){
    sendRequest('vendor', {id: id});
}

function sendCustomer(id){
    sendRequest('customer', {id: id});
}

function sendBrand(id){

    sendRequest('brand', {id: id});
}

function sendOrder(id){

    sendRequest('order', {id: id});
}

function vendorExists($boboId){

}
function customerExists($boboId){

}
function brandExists($boboId){

}
function itemExists($boboId){

}


function sendRequest(endpoint, data){
        axios.post(endpoint,data).then(response =>{
        console.log(response.data);
    }).catch(error => {
        console.log(error.response.data);
    })
}

scripts[reqMode]();
// console.log(reqMode);