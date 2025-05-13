import mongoose,{ Schema } from "mongoose";

const commentschema =mongoose.Schema({

    content:{
        type:String,
        required:true
    },
    createdby:{
        type:Schema.Types.ObjectId,
        ref:'blogCollection'
     },
     blogId:{
    type:Schema.Types.ObjectId,
    ref:'blogdata'
     },
})
const commentcollection=mongoose.model("commentcollection",commentschema)

export{commentcollection}