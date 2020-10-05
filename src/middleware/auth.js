const jwt=require('jsonwebtoken')
const user=require('../models/user')
const User = require('../models/user')
//with middleware: new request-->do something-->run route handler

const auth=async(req,res,next)=>{
    //console.log('auth middleware')
    try{
        //find header user is going to provide
        const token=req.header('Authorization').replace('Bearer ','')
        //now check the token if valid (authenticate the header)
        const decoded=jwt.verify(token,process.env.JWT_CODE)
        //find the user with this id who has that authentication token still stored
        //if the user logs out thus token will be valid
        const user=await User.findOne({_id:decoded._id , 'tokens.token':token})

        if(!user){
            throw new Error()
        }
        //give the route handler access to the user that we fetch from db
        req.user=user
        //we save token so that if we logout from one device we get login to another
        //i.e route handlers will have acess to tat token and we delete a specific token
        req.token=token
        //console.log(req)
        next()
    }
    catch(e){
         res.status(401).send({error:'Please autenticate.'})
    }
   
}
module.exports=auth