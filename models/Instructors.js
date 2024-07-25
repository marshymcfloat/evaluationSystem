const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now conntected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})
const departmentSubjects = {
    CET: ['ITTF101', 'ITAM132', 'GEUS201', 'GEPH202', 'RESH401', 'PATH100', 'NSTP201', 'ITIC102', 'GEES210', 'GECW203', 'GEMM204',  'RECM402', 'PATHFIT200', 'NSTP202', 'ITCI103', 'GEIC211', 'GEPC205', 'GEAA2066', 'GEST207', 'RELS403', 'PATHFIT300', 'ITCP105', 'ITCI104', 'ITIM107', 'GEEM212', 'GEET208', 'RECH404', 'PATHFIT400', 'ITCP106', 'ITDS108', 'ITIM109', 'ITDS110', 'ITOP111', 'ITNT114', 'ITAD112', 'ITED113', 'GERL209', 'ITIP116', 'ITSI117', 'ITWS124', 'ITNT115', 'ITIA120', 'ITSA122', 'ITTE129', 'ITDM119', 'ITCP125', 'ITCP126', 'ITPR130', 'ITFS131', 'ITSI127', 'ITIA121', 'ITQM128', 'ITPT123', 'ITSI118']
};

const instructorsSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    fullname: {
        type: String
    },
    department:{
    type: String,
    enum: ["CET", 'CCJE', 'CNHS', 'CBA', 'CEAA', 'CHM']
},
    subjects: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Subject'  
    },
})



instructorsSchema.set('toJSON', { virtuals: true })
const Instructor = mongoose.model('Instructor', instructorsSchema)



/* const newInstructor = new Instructor({firstname: "Ellaine", lastname: 'Pe', fullname: "Ellaine Pe", department: 'CET', subjects: ['66603427a9c5c6d57125b34b']})

newInstructor.save() */



/* Instructor.insertMany([
    {firstname: "Ronilo", lastname: " Gayutin III", age: 26, address: "Bgy. San Miguel, Puerto Princesa City, Palawan", imageURL: "/images/gayutin.jpg", fullname: `Ronilo Gayutin III`, department: "CET"},
    {firstname: "Alexis", lastname:"Diosaban", age: 27, address: "Bgy. San Pedro, Puerto Princesa City, Palawan", imageURL: "/images/diosoban.jpg", fullname: `Alexis Diosaban`, department: "CET"},
    {firstname: "Lou Vanessa" , lastname: "Limon", age: 25, address: "Bgy. San Miguel, Puerto Princesa City, Palawan", imageURL: "/images/lou.jpg", fullname: `Lou Vanessa Limon`, department: "CET"},
    {firstname: "Daniel", lastname: "Canoy", fullname: "Daniel Canoy", age: 22, address: "Puerto Princesa City, Palawan"},
    {firstname: "Allaine" , lastname: "Castro", fullname: "Allaine Castro", age: 26, address: "Puerto Princesa City, Palawan", department: "CNHS"},
    {firstname: "Rodrigo", lastname: "Duterte", fullname: "Rodgrigo Duterte", age: 62, address: "Davao city, Davao", department: "CCJE"},
    {firstname: "Bato", lastname: "Dela Rosa", fullname: "Bato Dela Rosa", age: 62, address: "Davao city, Davao", department: "CCJE"},
    {firstname: "Ellaine" , lastname: "Canoy", fullname: "Ellaine Canoy", age: 34, address: "Puerto Princesa City, Palawan", department: "CNHS"},
     {firstname: 'Danielle', lastname: 'Candy',fullname: "Danielle Canoy", age: 21, address:"PPC, Palawan", department: "CEAA"}
]) */

/* Instructor.insertMany([
    {firstname: "Angel", lastname: "Magdangal", fullname: "Angel Magdangal",department: "CET", subjects:['ITTF101', 'ITAM132', 'GEUS201', 'GEPH202', 'RESH401', 'PATH100', 'NSTP201']},

    {firstname}
]) */

module.exports = Instructor

