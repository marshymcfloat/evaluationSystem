const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now connected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})

const calculatedEvaluationSchema = new mongoose.Schema({
    acadYear:{
        type: String
    },
    semester:{
        type: String
    },
     teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
        category1Score : {
        type: Number
    },  category2Score : {
        type: Number
    },  category3Score : {
        type: Number
    },  category4Score : {
        type: Number
    },  category5Score : {
        type: Number
    },  category6Score : {
        type: Number
    } , category7Score : {
        type: Number
    }, grandScore: {
        type: Number
    }
})

const CalculatedEvaluation = mongoose.model('CalculatedEvaluation', calculatedEvaluationSchema )

module.exports = CalculatedEvaluation