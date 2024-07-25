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
        /* enum: ['ITTF101', 'ITAM132', 'GEUS201', 'GEPH202', 'RESH401', 'PATH100', 'NSTP201', 'ITIC102', 'GEES210', 'GECW203', 'GEMM204', 'RECM402', 'PATHFIT200', 'NSTP202', 'ITCI103', 'GEIC211', 'GEPC205', 'GEAA2066', 'GEST207', 'RELS403', 'PATHFIT300', 'ITCP105', 'ITCI104', 'ITIM107', 'GEEM212', 'GEET208', 'RECH404', 'PATHFIT400', 'ITCP106', 'ITDS108', 'ITIM109', 'ITDS110', 'ITOP111', 'ITNT114', 'ITAD112', 'ITED113', 'GERL209', 'ITIP116', 'ITSI117', 'ITWS124', 'ITNT115', 'ITIA120', 'ITSA122', 'ITTE129', 'ITDM119', 'ITCP125', 'ITCP126', 'ITPR130', 'ITFS131', 'ITSI127', 'ITIA121', 'ITQM128', 'ITPT123', 'ITSI118', 'NCM401', 'NCM402', 'NCM403', 'NCM404', 'NCM405', 'NCM406', 'NCM407', 'NCM408'] */
    },
    name: {
        type: String,
        required: true
    },
    department: {
        type: [String],
        required: true
    },
    year:{
        type:String,
        enum: ['1st', '2nd','3rd','4th'],
        required: true

    },
    program:{
        type: [String],
        required: true
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

    /* Subject.insertMany([
        {code: 'ITTF 101', name: 'Information Technology Fundamentals', department: 'CET', year: '1st',program: 'BSIT'},
        {code: 'ITAM 132', name: 'Applied Engineering Mathematics', department: 'CET', year: '1st',program: ['BSIT', 'BSCE', 'BSCPE', 'BSGE']},
        {code: 'GEEUS 201', name: 'Understanding the Self', department: 'CET, CNHS, CBA', year: '1st',program: 'BSIT'},
        {code: 'GEPH 202', name: 'Reading in Philippine History', department: 'CET', year: '1st',program: 'BSIT'},
        {code: 'RESH 401', name: 'Salvation History', department: ['CET','CNHS', 'CCJE','CEAA'], year: '1st',program: 'BSIT'},
        {code: 'PATHFIT 100', name: 'Pyhsical Activities Toward Health and Fitness Movement Competency Training', department: ['CET', 'CNHS', 'CEAA', ], year: '1st',program: ['BSIT', 'BSN', 'BSBIO']},
        {code: 'NSTP 201', name: 'National Service Training Program 2', department: 'CET', year: '1st',program: 'BSIT'},
        {code: 'ITIC 102', name: 'Introduction to Computing', department: 'CET', year: '1st',program: 'BSIT'}, */
       /*  {code: 'GEES 210', name: 'Information Technology Fundamentals', department: 'CET', year: '1st',program: 'BSIT'},
        {code: 'GECW 203', name: 'Information Technology Fundamentals', department: 'CET', year: '1st',program: 'BSIT'},
        {code: 'GEEM 204', name: 'Information Technology Fundamentals', department: 'CET', year: '1st',program: 'BSIT'},
        {code: 'RECM 402', name: 'Information Technology Fundamentals', department: 'CET', year: '1st',program: 'BSIT'}, */
        /* {code: 'PATHFIT 200', name: 'Information Technology Fundamentals', department: 'CET', year: '1st',program: 'BSIT'},
        {code: 'NSTP 202', name: 'Information Technology Fundamentals', department: 'CET', year: '1st',program: 'BSIT'},
        {code: 'NCM 401', name: 'Nursing Cemerut Material 1', department: 'CNHS', year: '1st',program: 'BSN'},
        {code: 'NCM 402', name: 'Nursing Cemerut Material 2', department: 'CNHS', year: '1st',program: 'BSN'},
        {code: 'NCM 403', name: 'Nursing Cemerut Material 3', department: 'CNHS', year: '2nd',program: 'BSN'},
        {code: 'NCM 404', name: 'Nursing Cemerut Material 4', department: 'CNHS', year: '2nd',program: 'BSN'},
        {code: 'NCM 405', name: 'Nursing Cemerut Material 5', department: 'CNHS', year: '3rd',program: 'BSN'},
        {code: 'RD 101', name: 'Nursing Return Demonstration', department: 'CNHS', year: '3rd',program: 'BSN'},





    ]) */

module.exports = Subject