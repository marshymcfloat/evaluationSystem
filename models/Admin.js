const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now connected')
}).catch((e)=> {
    console.log('mongoose has an error', e)
})



const adminSchema = new mongoose.Schema({
    adminID : {
        type: String,
        required: true
        
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

const Admin = mongoose.model('Admin', adminSchema)

/* const newAdmin = new Admin({
    adminID: '111111',
    password:'Ph83aL'
})

 newAdmin.save()
 */

 module.exports = Admin