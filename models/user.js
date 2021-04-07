const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const UserSchema=new Schema({
    email:{
        type:String,
        required: true,
        unique:true
    }
})

UserSchema.plugin(passportLocalMongoose); //its gonna add username and password to our schema and will automatically check for username to be unique and will give us some additional methods to useetc.

module.exports=mongoose.model('User',UserSchema);