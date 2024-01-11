const mongoose = require('mongoose')
const valModel = new mongoose.Schema({
    firstName:String,

    lastName:String,

    userName:String,

    email:String,

    isVerified:{
    type:Boolean,
    default:false
},

    phoneNumber: String,

    password:String,

    token:String


},{timestamps:true})


const userModel = new mongoose.model("validation",valModel)
module.exports =userModel