const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now conntected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})


const evaluationsSchema = new mongoose.Schema({
    IDstudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    IDquestions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    IDinstructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    }, 
    IDsubject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    answer: {
        type: String,
        required: true
    }
    ,questionCategory:{
        type: String,
        required: true
    },
    academicYear:{
        type: String,
        required: true
    },
    semester:{
        type: String,
        enum: ['1st','2nd', '3rd'],
        required: true
    },department:{
        type: String,
        required: true
    }
    
})

const Evaluation = mongoose.model('Evaluation', evaluationsSchema)

module.exports = Evaluation