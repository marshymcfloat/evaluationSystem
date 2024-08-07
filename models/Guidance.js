const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now connected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})

const guidanceSchema = new mongoose.Schema({
    guidanceID:{
        type: String,
    },
    password:{
        type: String,
        required: true
    },
     hasChangedPassword:{
        type:Boolean,
        default: false
    }
})

const Guidance = mongoose.model('Guidance', guidanceSchema)


module.exports = Guidance

/* const newGuidance = new Guidance({
    guidanceID: '700001',
    password:'T2dC7m'
})
newGuidance.save() */