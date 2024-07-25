const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now conntected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})



const studentSchema = new mongoose.Schema({
    studentID: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    yearLevel: {
        type: String,
        enum: ["1st", "2nd", "3rd", "4th"]
    },
    department:{
        type: String,
        enum: ["CET", 'CCJE', 'CNHS', 'CBA', 'CEAA', 'CHM']
    }, hasVoted: {
        type: Boolean,
        default: false
    }, subjectsEnrolled: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Subject'
    },password:{
        type: String,
        required: true
    },
    evaluatedSubjects:{
        type: [ mongoose.Schema.Types.ObjectId],
        ref: 'Subject'
    },
    email:{
        type: String
    }
    
})

const Student = mongoose.model('Student', studentSchema)


/* Student.insertMany([
    {studentID: 202011111, name: "Daniel Canoy", program: 'BSIT', yearLevel: "3rd", department: "CET", subjectsEnrolled: ['66603427a9c5c6d57125b343', '66603427a9c5c6d57125b344', '66603427a9c5c6d57125b345', '66603427a9c5c6d57125b346', '66603427a9c5c6d57125b347'] },
    {studentID: 202011112, name: "Vincent Martinez", program: 'BSIT', yearLevel: "3rd", department: "CET", subjectsEnrolled: ['66603427a9c5c6d57125b343', '66603427a9c5c6d57125b344', '66603427a9c5c6d57125b345', '66603427a9c5c6d57125b346', '66603427a9c5c6d57125b347'] },
    {studentID: 202011113, name: "Anne Lim", program: 'BSN', yearLevel: "4th", department: "CNHS", subjectsEnrolled: ['66603427a9c5c6d57125b343', '66603427a9c5c6d57125b344', '66603427a9c5c6d57125b345', '66603427a9c5c6d57125b346', '66603427a9c5c6d57125b347'] }
    ,{studentID: 202011114, name: "Clarissa Mae Ang", program: 'BSIT', yearLevel: "3rd", department: "CET", subjectsEnrolled: ['66603427a9c5c6d57125b343', '66603427a9c5c6d57125b344', '66603427a9c5c6d57125b345', '66603427a9c5c6d57125b346', '66603427a9c5c6d57125b347'] }
]) */

module.exports = Student