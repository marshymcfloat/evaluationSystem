const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now conntected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})

const facultySchema = new mongoose.Schema({
    facultyID: {
        type: Number,
        required: true
    },
    hasNoAccount: {
        type: Boolean,
        default: true
    }
})

const Faculty = mongoose.model('Faculty', facultySchema)


/* const newFaculty = new Faculty({
    facultyID: 1000001
})

newFaculty.save()
 */
module.exports = Faculty