const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/test").then(()=>{
    console.log('Mongodb connected');
}).catch((error)=>{
    console.log(error);
})
const userschema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    firstname:{
        type:String,
        required:true,
        minlength:1,
    },
    lastname:{
        type:String,
        required:true,
        minlength:1,
    },
    
})
const User=mongoose.model('User',userschema);
module.exports={
    User
}