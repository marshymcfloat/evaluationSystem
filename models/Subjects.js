const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now connected')
}).catch((e)=> {
    console.log(`there is an error saying: ${e.message}` )
})

const subjectSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        enum: ['ITTF101', 'ITAM132', 'GEUS201', 'GEPH202', 'RESH401', 'PATH100', 'NSTP201', 'ITIC102', 'GEES210', 'GECW203', 'GEMM204', 'RECM402', 'PATHFIT200', 'NSTP202', 'ITCI103', 'GEIC211', 'GEPC205', 'GEAA2066', 'GEST207', 'RELS403', 'PATHFIT300', 'ITCP105', 'ITCI104', 'ITIM107', 'GEEM212', 'GEET208', 'RECH404', 'PATHFIT400', 'ITCP106', 'ITDS108', 'ITIM109', 'ITDS110', 'ITOP111', 'ITNT114', 'ITAD112', 'ITED113', 'GERL209', 'ITIP116', 'ITSI117', 'ITWS124', 'ITNT115', 'ITIA120', 'ITSA122', 'ITTE129', 'ITDM119', 'ITCP125', 'ITCP126', 'ITPR130', 'ITFS131', 'ITSI127', 'ITIA121', 'ITQM128', 'ITPT123', 'ITSI118', 'NCM401', 'NCM402', 'NCM403', 'NCM404', 'NCM405', 'NCM406', 'NCM407', 'NCM408']
    },
    name: {
        type: String
    },
    department: {
        type: String
    }
});


const Subject = mongoose.model('Subject', subjectSchema)

/* Subject.insertMany([
    { code: 'NCM401', department: 'CNHS' },
    { code: 'NCM402', department: 'CNHS' },
    { code: 'NCM403', department: 'CNHS' },
    { code: 'NCM404', department: 'CNHS' },
    { code: 'NCM405', department: 'CNHS' },
    { code: 'NCM406', department: 'CNHS' },
    { code: 'NCM407', department: 'CNHS' },
    { code: 'NCM408', department: 'CNHS' }
]) */

module.exports = Subject