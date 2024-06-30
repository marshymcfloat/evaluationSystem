const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now conntected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})


const evaluationsSchema = new mongoose.Schema({
    IDstudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    IDquestions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    IDinstructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    }, 
    IDsubject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    answer: {
        type: String
    }
    ,questionCategory:{
        type: String
    }

})

const Evaluation = mongoose.model('Evaluation', evaluationsSchema)

module.exports = Evaluation