const mongoose= require('mongoose')
const bcrypt=require('bcrypt')

const UserSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String,
        unique:true,
        trim:true

    },
    first_name:{
        required: true,
        type: String,
        trim: true

    },
    last_name:{
        required: true,
        type: String,
        trim: true

    },
    org_name:{
        required: true,
        type: String,
        trim: true

    },
    password:{
        required: true,
        type:String
    }
   
})

UserSchema.statics.authenticate = (email,password,cb)=>{
    User.findOne({email})
    .exec((err,user)=>{
        if(err) return cb(err)
        else if(!user){
            let err= new Error("user not found!")
            err.status = 401 //forbidden
            return next(err)
        }

        bcrypt.compare(password,user.password, function(err,result){
            if(err) return cb(err)
            if(result == true)
                return cb(null,user)
        })
    })
}



//this pre function is defined only on the schema

UserSchema.pre('save',function(next){
    //by doing this we get the data of the curret user
    let user= this
    bcrypt.hash(user.password, 10 , function(err,hash){
        if(err) return next(err)
        user.password= hash
        next()
    })

})


const User= mongoose.model('User',UserSchema)
module.exports = User

