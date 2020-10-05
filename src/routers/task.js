const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()

// saving Task
router.post('/tasks',auth,async(req,res)=>{
    // const task=new Task(req.body)
    const task=new Task({
        //we use ES6 spread operator thats going to copy all the request
        // properties from body over to this object e.g desc,completed
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(404).send(e)
    }
})


//endpoint for fething 
//GET tasks?completed=true 
//pagination
//GET tasks?limit=10&skip=20
//GET tasks?sortby=createdAt:desc
router.get('/tasks',auth,async(req,res)=>{
    try{
        const match={}
        const sort={}
        if(req.query.completed){
            // if req.query.completed is true then match.completed is true else false
            match.completed= (req.query.completed==='true')
        }
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            //to sort by desc use -1 and asc use 1
            sort[parts[0]] = parts[1]==='desc' ? -1 : 1  
        }
        //populate allows us to popualate data from a relationship
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send()
    }
    
})

//fething a task by id
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
      //find the task created by owner not by others
       const task= await Task.findOne({_id , owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)    
    }
    catch(e){
        res.status(500).send()
    }
     
})

//http endpoints for updating users
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdated=['description','completed']
    const isValidOperation=updates.every((update) => allowedUpdated.includes(update))
    if(!isValidOperation){
        return  res.status(400).send('Error:Please enter valid update!')
    }
try{
    const task = await Task.findOne({_id: req.params.id , owner: req.user._id})
    if(!task){
        return res.status(404).send()
    }
    updates.forEach((update)=>task[update]=req.body[update])
    await task.save()
    res.status(201).send(task)
}
catch(e){
    res.status(400).send(e)
}
})
//deleting task
router.delete('/tasks/:id',auth,async(req,res)=>{

    const _id = req.params.id
    try{

        const task=await Task.findOneAndDelete({_id:_id,owner:req.user._id})
        if(!task){
            return res.status(404).send('Error: Task not found')
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }

})

module.exports=router