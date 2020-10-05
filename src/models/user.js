const mongoose=require('mongoose')
const validator=require('validator')
//encrypting password
const bcrypt=require('bcryptjs')
//we use jsonwebtoken so that user can only delete his tasks not of others after login
//and the login expires afetr sometime
const jwt=require('jsonwebtoken')
const Task=require('../models/task')
//middleware is used to customize the model
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                 throw new Error("email is invalid!")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password'))
            throw new Error('Password cannot be "password"!')
        }
    },
    age:{
        type: Number,
        validate(value){
            if(value<0){
                throw new Error('Age must be grater than 0')
            }
        }
    },
    //we use tokens array bcz we can login from different devices so we need different token fro each device
    //so if we logout from one we can from from the other session
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
},
{
    //to create track of when user was created or updated
    timestamps: true
})
//for methods on the upper USER model
userSchema.statics.findByCredientials= async(email,password)=>{
      const user=await User.findOne({email})

      if(!user){
          throw new Error('Unable to login! Invalid email !')
      }
      const isMatch= await bcrypt.compare(password,user.password)
      if(!isMatch){
        throw new Error('Unable to login! Invalid password!')
      }
      return user
}

//when we call res.send() its calling json.stringify() behind the scenes
//whenever the object gets stringify toJSON() is called so we use it here to hide data
//bcz to stringify is called and with it toJSON is called everytime response is send

userSchema.methods.toJSON=function(){
    const user=this
    //get our raw object with user data attached
    //it will remove all the stuff mongoose has on it to perform operations
    const userObject= user.toObject()
    delete userObject.password
    delete userObject.tokens
    //we delete img to dispplay to user bcz it takes much time to fetch binary data of img
    delete userObject.avatar
    return userObject

}

//we use virtual property that is not data stored in db but the relationship btw two entities
userSchema.virtual('tasks',{
    //It is ref to Task db
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//for methods on the instance and individual user 
userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_CODE)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

//we are using middleware property of mongoose to check the data before saving
// we have to use simple function bcz arrow functions dont do binding
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8) 
    }
    //next makes the pre to go on next stage i.e save the model else it will stop here
    next()
})

//delete the user tasks when user is removed
userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})

//creating model of moongoose and then creating an instance of model and then saving it
const User=mongoose.model('User',userSchema)

module.exports = User