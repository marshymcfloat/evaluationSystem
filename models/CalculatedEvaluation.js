const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now connected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})

const calculatedEvaluationSchema = new mongoose.Schema({
    department:{
        type: String,
        required: true
    },
    acadYear:{
        type: String,
        required: true
    },
    semester:{
        type: String,
        required: true
    },
     teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
        category1Score : {
        type: Number,
        required: true
    },  category2Score : {
        type: Number,
        required: true
    },  category3Score : {
        type: Number,
        required: true
    },  category4Score : {
        type: Number,
        required: true
    },  category5Score : {
        type: Number,
        required: true
    },  category6Score : {
        type: Number,
        required: true
    } , category7Score : {
        type: Number,
        required: true
    }, grandScore: {
        type: Number,
        required: true
    }
})

const CalculatedEvaluation = mongoose.model('CalculatedEvaluation', calculatedEvaluationSchema )

CalculatedEvaluation.findByIdAndUpdate(
  '668e0614e23702ecfc9a468e', 
  { department: 'CET' }
);


module.exports = CalculatedEvaluation