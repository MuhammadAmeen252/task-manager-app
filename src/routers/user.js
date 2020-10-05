const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const router=new express.Router()
const {sendWelcomeMail,sendDeleteProfileMail}=require('../emails/account')

//When user signs up
router.post('/users',async(req,res)=>{
    const user=new User(req.body)
    //we use try catch so if first async await dont rum it gives us error
    // immediately not after running other async awaits
    try{
        await user.save()
        sendWelcomeMail(user.email,user.name)
        const token=await user.generateAuthToken()
        //if await user.save runs then res is send otherwise it goes to catch block
        res.status(201).send({user,token})
    }
    catch (e){
        res.status(404).send(e)
    }
})

//endpoints for login
router.post('/users/login',async(req,res)=>{
    try{
            const user=await User.findByCredientials(req.body.email,req.body.password)
            const token=await user.generateAuthToken()
            res.send({user,token})
    }
    catch(e){
            res.status(404).send(e)
    }
})

//logout of current device
router.post('/users/logout',auth,async(req,res)=>{
    try{
        // it remove the token of device from which u logged in
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            //if tokens.token !== req.token it returns false filtering it out
            return tokens.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

//logout of all devices
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

//resource reading endpoints for reading profile
//we passes the middleware function as the 2nd argument for the route we want to authenticate 
router.get('/users/me', auth ,async(req,res)=>{
    
        res.send(req.user)
})


//http endpoints for updating users
router.patch('/users/me',auth,async(req,res)=>{
        const updates=Object.keys(req.body)
        const allowedUpdated=['name','email','password','age']
        const isValidOperation=updates.every((update) => allowedUpdated.includes(update))
        if(!isValidOperation){
            return  res.status(400).send('Error:Please enter valid update!')
        }
    try{
        //to update more than one user so we use loop iteration
        const user = req.user
        //we use bracket notation to update property dynamically
        //bcz we dont know user is going to update name,email etc
        updates.forEach((update) => user[update]=req.body[update])
        await user.save()

        if(!user){
            return res.status(404).send(e)
        }
        res.send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})


//deleting user
router.delete('/users/me',auth,async(req,res)=>{

    try{  
        await req.user.remove()
        sendDeleteProfileMail(req.user.email,req.user.name) 
        res.send(req.user)
    }
    catch(e){
        res.status(500).send(e.message)
    }

})
//uploading image
const upload=multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,callback){
        //we use regular expression here if file has and extension doc or docx its accepted else not
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Please upload a jpg,jpeg or png file of max 1MB size'))
        }
        callback(undefined,true)

    }
})
//chose name 'avatar' for the key when registering the middleware 
//In postman under body in  form data set up key name avatar and select file as data
//make sure user is authenticated before uploading pic so we use auth
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    //avatr in user model saves the binary format of img file
    //we use sharp to crop and format img to png so it dont takes much memory
    const buffer = await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})
//deleting profile pic
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
//fething an avatar(profile pic) i.e getting binary data of image from db and converting it t0 img
//go to http://localhost:3000/users/5f64925df72fb7348479c976/avatar to see image
router.get('/users/:id/avatar',async (req,res)=>{
//use try catch if image is not found
    try{
        const user=await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error('The avatar image not found!')
        }
        //tell requester what type of data u are getting back i.e jpeg image
        //set response header(name of res header,value u want to set)
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports=router