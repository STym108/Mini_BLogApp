import mongoose, { Schema } from 'mongoose'

const blogschema=mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    body:{
      type:String,
      required:true

    },
    coverimage:{
        type:String,
        required:false
    },
    createdby:{
       type:Schema.Types.ObjectId,
       ref:'blogCollection'
    }

},{timestamps:true})

const blogdata=mongoose.model("blogdata",blogschema)

export{blogdata}