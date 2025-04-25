var mongoose=require('mongoose')


var userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique: true  
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:Number,
        default:0,

    },
    cart:{
        type:Array,
        default:[]
    },
    resetPasswordOTP: {
        type: String
    },
    resetPasswordExpiry: {
        type: Date
    }},
    {
        timestamps:true
    },
    


)

module.exports=mongoose.model('Users',userSchema)