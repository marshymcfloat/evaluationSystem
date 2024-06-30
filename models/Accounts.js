const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now conntected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})



const accountSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    IDstudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        default: null
    },
    IDguidance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guidance",
        default: null
    },
    IDadmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null
    },notYetVoted: {
        type: Boolean,
        default: true
    }
})


const Account = mongoose.model('Account', accountSchema)

module.exports = Account

