const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now connected')
}).catch((e)=> {
    console.log('mongoose has an error', e)
})



const adminSchema = new mongoose.Schema({
    adminID : {
        type: Number,
        minLength: 10,
        maxLength: 10,
        required: true
        
    },
    hasNoAccount: {
        type: Boolean,
        default: true
    }

})

const Admin = mongoose.model('Admin', adminSchema)

/* const newAdmin = new Admin({
    adminID: 1234567890
})

 newAdmin.save()
 */

 module.exports = Admin