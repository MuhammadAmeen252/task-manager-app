const mongoose=require('mongoose')
const taskSchema=new mongoose.Schema({
    description:{
        type: String,
        required:true,
        trim:true
            
    },
    completed:{
        type: Boolean,
        required:false,
        default:false
    },
    owner:{
        //the data stored in types is going to be object id
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //it is ref to User db
        ref: 'User'
    }
},
{
    timestamps:true
})
const Task=mongoose.model('Task',taskSchema)

module.exports=Task