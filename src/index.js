//run code by 'npm run dev'
//we exported express server
const express=require('express')
const app=express()
//we established connection with mongoose
require('./db/mongoose')

//we connect with models
const User=require('./models/user')
const Task=require('./models/task')

//connecting with routers
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

//if app is deployed on site we will get the port using process.env.port
const port=process.env.port || 3000

//configuring express to automatically parse the incoming json from HTTP request for us
//RESUORCE CREATION ENDPOINTS
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//This is rest API we are able to send data via HTTP request, off to the express
// server using a pre defined operation. we are able to perform some predefined operation on the db


app.listen(port,'0.0.0.0',()=>{
     console.log('server is up on port '+port )
})

///set environment variables by using this
//as we need it locally on our machine not on heroku so we use --save -dev
//npm i env-cmd --save-dev
