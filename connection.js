


import mongoose from 'mongoose'

async function connectwithmongo(url){
try{
    mongoose.connect(url);
    console.log("mongodb connected successfully with server....")
}
catch(err){
    console.log(err);
}
}
export{connectwithmongo}