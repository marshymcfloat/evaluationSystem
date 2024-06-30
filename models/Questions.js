/* const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now conntected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})

const questionsSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    score: {
        type: Number,
        default: 0,
    },
    noMessage: {
        type: Boolean,
        default: true
    }
})

const Question = mongoose.model('Question', questionsSchema)

module.exports = Question */

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/evaluatePrac').then(()=> {
    console.log('mongoose is now conntected.')
}).catch((e)=> {
    console.log('mongoose has an error:', e.message)
})


const questionsSchema = new mongoose.Schema({
     text: {
        type: String,
        required: true
    },
    questionCategory: {
        type: String,
        required: true,
        enum: ['course overview and orientation', 'learning outcomes', 'assessment', 'instructional material/content', 'teacher presence and support', 'learning experiences and interaction', 'technology and accessibility']
    }
})
const Question = mongoose.model('Question', questionsSchema)

/* Question.insertMany([
    {text: 'Course overview and orientation were clear and easy to understand.', questionCategory: 'course overview and orientation'},
    {text: 'Goals and objectives of the course were communicated effectively.', questionCategory: 'course overview and orientation'},
    {text: 'Course materials and resources were thoroughly explained.', questionCategory: 'course overview and orientation'},
    {text: 'Detailed schedule of assignments and assessments were provided.', questionCategory: 'course overview and orientation'},
    {text: 'Expectations and grading criteria were clearly outlined', questionCategory: 'course overview and orientation'},
    {text: 'Clearly defined and communicated.', questionCategory: 'learning outcomes'},
    {text: 'Provided opportunities to achieve the learning outcomes of the course.', questionCategory: 'learning outcomes'},
    {text: 'Assignments and assessments were aligned with the stated learning outcomes of the course.', questionCategory: 'learning outcomes'},
    {text: 'Constructive feedback helped understand how to improve and meet the learning outcomes.', questionCategory: 'learning outcomes'},
    {text: 'Course content and activities were relevant and contributed to understanding the learning outcomes', questionCategory: 'learning outcomes'},
    {text: 'Clearly explained and aligned with the learning outcomes.', questionCategory: 'assessment'},
    {text: 'Provided a variety of assessment methods.', questionCategory: 'assessment'},
    {text: 'Fair and accurate', questionCategory: 'assessment'},
    {text: 'Timely feedback on assessments were provided to help improve performance', questionCategory: 'assessment'},
    {text: 'Criteria for assessments were clearly communicated and consistently applied', questionCategory: 'assessment'},
    {text: 'Instructional materials and content were relevant and engaging.', questionCategory: 'instructional material/content'},
    {text: 'Materials and contet were well-organized and easy to follow.', questionCategory: 'instructional material/content'},
    {text: 'Used a variety of instructional materials to enhance understanding of the course material.', questionCategory: 'instructional material/content'},
    {text: 'Provided sufficient depth and breadth of information to support the learning outcomes.', questionCategory: 'instructional material/content'},
    {text: 'Multimedia and technology resources were integrated into the course content.', questionCategory: 'instructional material/content'},
    {text: 'Consistently present and actively engaged with the class.', questionCategory: 'teacher presence and support'},
    {text: 'Accessible and responsive to student questions and concerns.', questionCategory: 'teacher presence and support'},
    {text: 'Provided timely and constructive feedback on assignments and assessments.', questionCategory: 'teacher presence and support'},
    {text: "Demonstrated a genuine interest in students' learning and success", questionCategory: 'teacher presence and support'},
    {text: 'Effectively facilitated class discussions and encouraged student participation', questionCategory: 'teacher presence and support'},
    {text: 'Engaging and thought-provoking', questionCategory: 'learning experiences and interaction'},
    {text: 'Provided opportunities for active participation and hands-on learning.', questionCategory: 'learning experiences and interaction'},
    {text: 'Class discussions and group activities enhanced understanding of the course material.', questionCategory: 'learning experiences and interaction'},
    {text: 'Encouraged a respectful and inclusive learning environment.', questionCategory: 'learning experiences and interaction'},
    {text: 'Teaching-Learning engagement contributed positively to learning experience.', questionCategory: 'learning experiences and interaction'},
    {text: 'The technology used in the course was easy to access and use', questionCategory: 'technology and accessibility'},
    {text: 'Techonology was effectively integrated into the learning experience.', questionCategory: 'technology and accessibility'},
    {text: 'The online learning platform was user-friendly and supported learning needs.', questionCategory: 'technology and accessibility'},
    {text: 'The instructor provided clear instructions on how to use the technology and resources required for the course.', questionCategory: 'technology and accessibility'},
    {text: 'The course materials and technology were accessible to all students.', questionCategory: 'technology and accessibility'},
]) */


module.exports = Question

