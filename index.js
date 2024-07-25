
const express = require('express')
const path = require('path')
const multer = require('multer')
const xlsx = require('xlsx')
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multiparty = require('multiparty');
const methodOverride = require('method-override')
const helmet = require('helmet')
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const moment1 = require('moment'); // Assuming you have moment.js installed for date/time handling
const bcrypt = require('bcrypt');


const generatePassword = require('generate-password');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config()




const Student = require('./models/Students')
const Account = require('./models/Accounts')
const Instructor = require('./models/Instructors')
const Question = require('./models/Questions')
const Evaluation = require('./models/Evaluations')
const Faculty = require('./models/Faculty')
const Admin = require('./models/Admin')
const Subject = require('./models/Subjects')
const Guidance = require('./models/Guidance')
const CalculatedEvaluation = require('./models/CalculatedEvaluation')
const TimeFrame = require('./models/TimeFrame')




const app = express()
const port = 3100



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const studentId = []
const studentName = []
const studentDepartment = []
const studentYearLevel = []
const studentProgram = []
const studentEnrolledSubs = []
const secretKey = crypto.randomBytes(64).toString('hex');



app.use(fileUpload());
app.use(helmet())
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true})
)



const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const mailOptions = {
  from: {
    name: 'Innovaluate',
    address: process.env.EMAIL_USER
  },
  to:['canoydaniel06@gmail.com'],
  subject:'First attempt using Nodemailer',
  text:`Hi, Good day. this is from the HTU's InnoValuate System. `,
  html:'<h1>Hi, this is Nodemailer.</h1>',

}


const sendMail = async(transporter,mailOptions)=>{
  try{
    

    await transporter.sendMail(mailOptions)
    console.log('mail sent successfully.')
  }
  catch(error){
    console.log(error.message)
  }
}

/* sendMail(transporter,mailOptions) */



app.use(session({
  secret: secretKey, // Change this to a secure key
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/evaluatePrac' }),
  cookie: {
    maxAge: 1000 * 60 * 60 // Session expires after 1 hour (adjust as needed)
  }
}));


const studentMiddleware = (req, res, next) => {

  if (req.session && req.session.user && req.session.user.type === 'student') {
    if (req.session.user.studentID == req.params.studentID) {
      

      next();
    } else {
      res.status(403).send('Forbidden: You can only access your own data.');
    }
  } else {
    res.redirect('/login');
  }
};

const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};



const adminMiddleware = (req, res, next) => {
  if (req.session.user && req.session.user.type === 'admin') {
    next();
  } else {
    res.redirect('/login');
  }
};

const guidanceMiddleware = (req, res, next) => {
  if (req.session.user && req.session.user.type === 'guidance') {

    next();
  } else {
    res.redirect('/login');
  }
};
const scheduleJob = async () => {
    try {
        console.log('Starting evaluation calculation job...');

        // Fetch the latest time frame details
        const timeFrame = await TimeFrame.findOne({}).sort({ _id: -1 });

        if (!timeFrame) {
            console.log('No time frame found.');
            return;
        }

        // Update the isActive attribute to false
        timeFrame.isActive = false;
        await timeFrame.save();
        console.log('Updated the latest TimeFrame to inactive:', timeFrame);

        const currentTimeFrame = `${timeFrame.acadYearStart}-${timeFrame.acadYearEnd}`;
        const currentSemester = timeFrame.semester;

        console.log(currentTimeFrame)
        console.log(currentSemester)

        const categories = [
            'course overview and orientation',
            'learning outcomes',
            'assessment',
            'instructional material/content',
            'teacher presence and support',
            'learning experiences and interaction',
            'technology and accessibility'
        ];

        console.log('Fetched TimeFrame:', timeFrame);

        // Fetch all teachers
        const allTeachers = await Instructor.find({});
        console.log('Fetched all teachers:', allTeachers.length);

        const evaluationsByTeacherAndSubject = {};

        for (const teacher of allTeachers) {
            // Fetch evaluations based on teacher ID, academic year, and semester
            const evaluations = await Evaluation.find({
                IDinstructor: teacher._id,
                academicYear: currentTimeFrame,
                semester: currentSemester
            }).populate('IDquestions');

            console.log(`Fetched evaluations for teacher ${teacher._id}:`, evaluations.length);

            evaluations.forEach(evaluation => {
                const subject = evaluation.IDsubject; // Assuming IDsubject is the field for the subject
                const teacherId = teacher._id.toString();
                const department = evaluation.department; // Get department from evaluation
                if (!evaluationsByTeacherAndSubject[teacherId]) {
                    evaluationsByTeacherAndSubject[teacherId] = {};
                }
                if (!evaluationsByTeacherAndSubject[teacherId][subject]) {
                    evaluationsByTeacherAndSubject[teacherId][subject] = {
                        evaluations: [],
                        department: department,
                        categoryComputation: categories.reduce((acc, category) => {
                            acc[category] = {
                                sum: 0,
                                count: 0,
                                uniqueStudents: new Set()
                            };
                            return acc;
                        }, {})
                    };
                }
                evaluationsByTeacherAndSubject[teacherId][subject].evaluations.push(evaluation);
            });
        }

        for (const teacherId in evaluationsByTeacherAndSubject) {
            for (const subject in evaluationsByTeacherAndSubject[teacherId]) {
                const { evaluations, categoryComputation, department } = evaluationsByTeacherAndSubject[teacherId][subject];

                for (const category of categories) {
                    const questions = await Question.find({ questionCategory: category });
                    categoryComputation[category].count = questions.length;
                    console.log(`Category ${category}: Found ${questions.length} questions.`);
                }

                evaluations.forEach(evaluation => {
                    const category = evaluation.IDquestions.questionCategory;
                    const answer = parseInt(evaluation.answer, 10);
                    if (categoryComputation[category]) {
                        categoryComputation[category].uniqueStudents.add(evaluation.IDstudent.toString());

                        if (answer >= 1 && answer <= 5) {
                            categoryComputation[category].sum += answer;
                        } else {
                            console.log('Unexpected rating value:', answer);
                        }
                    }
                });

                const perCategoryMetrics = {};
                const categoryScores = [];
                for (const category of categories) {
                    const totalSum = categoryComputation[category].sum;
                    const numberOfQuestions = categoryComputation[category].count;
                    const numberOfStudents = categoryComputation[category].uniqueStudents.size;

                    let metric = 0;
                    if (numberOfQuestions > 0 && numberOfStudents > 0) {
                        metric = (totalSum / numberOfStudents) / numberOfQuestions;
                        metric = parseFloat(metric.toFixed(2)); // Limit to 2 decimal places
                    }

                    perCategoryMetrics[category] = metric;
                    categoryScores.push(metric);

                    console.log(`Teacher: ${teacherId}, Subject: ${subject}, Category: ${category}, Metric: ${metric}, Unique Students: ${numberOfStudents}`);
                    console.log(`Teacher: ${teacherId}, Subject: ${subject}, Category: ${category}, Total Sum: ${totalSum}, Number of Questions: ${numberOfQuestions}`);
                }

                const grandScore = parseFloat((categoryScores.reduce((acc, score) => acc + score, 0) / categories.length).toFixed(2)); // Limit to 2 decimal places

                // Save the calculated evaluation
                const calculatedEvaluation = new CalculatedEvaluation({
                    acadYear: currentTimeFrame,
                    semester: currentSemester,
                    teacherId,
                    subjectId: subject,
                    department,
                    category1Score: perCategoryMetrics['course overview and orientation'],
                    category2Score: perCategoryMetrics['learning outcomes'],
                    category3Score: perCategoryMetrics['assessment'],
                    category4Score: perCategoryMetrics['instructional material/content'],
                    category5Score: perCategoryMetrics['teacher presence and support'],
                    category6Score: perCategoryMetrics['learning experiences and interaction'],
                    category7Score: perCategoryMetrics['technology and accessibility'],
                    grandScore
                });

                await calculatedEvaluation.save();

                console.log(`Calculated evaluation saved for Teacher: ${teacherId}, Subject: ${subject}, Grand Score: ${grandScore}`);
            }
        }

        // Clear evaluatedSubjects for all students
        await Student.updateMany({}, { $set: { evaluatedSubjects: [] } });
        console.log('Cleared evaluatedSubjects for all students.');

    } catch (error) {
        console.error('Error in scheduleJob:', error);
    }
};



/* const scheduleJob = async () => {
    try {
        console.log('Starting evaluation calculation job...');

        // Fetch the latest time frame details
        const timeFrame = await TimeFrame.findOne({}).sort({ _id: -1 });

        if (!timeFrame) {
            console.log('No time frame found.');
            return;
        }

        // Update the isActive attribute to false
        timeFrame.isActive = false;
        await timeFrame.save();
        console.log('Updated the latest TimeFrame to inactive:', timeFrame);

        const currentTimeFrame = `${timeFrame.acadYearStart}-${timeFrame.acadYearEnd}`;
        const currentSemester = timeFrame.semester;

        console.log(currentTimeFrame)
        console.log(currentSemester)

        const categories = [
            'course overview and orientation',
            'learning outcomes',
            'assessment',
            'instructional material/content',
            'teacher presence and support',
            'learning experiences and interaction',
            'technology and accessibility'
        ];

        console.log('Fetched TimeFrame:', timeFrame);

        // Fetch all teachers
        const allTeachers = await Instructor.find({});
        console.log('Fetched all teachers:', allTeachers.length);

        const evaluationsByTeacherAndSubject = {};

        for (const teacher of allTeachers) {
            // Fetch evaluations based on teacher ID, academic year, and semester
            const evaluations = await Evaluation.find({
                IDinstructor: teacher._id,
                academicYear: currentTimeFrame,
                semester: currentSemester
            }).populate('IDquestions');

            console.log(`Fetched evaluations for teacher ${teacher._id}:`, evaluations.length);

            evaluations.forEach(evaluation => {
                const subject = evaluation.IDsubject; // Assuming IDsubject is the field for the subject
                const teacherId = teacher._id.toString();
                const department = evaluation.department; // Get department from evaluation
                if (!evaluationsByTeacherAndSubject[teacherId]) {
                    evaluationsByTeacherAndSubject[teacherId] = {};
                }
                if (!evaluationsByTeacherAndSubject[teacherId][subject]) {
                    evaluationsByTeacherAndSubject[teacherId][subject] = {
                        evaluations: [],
                        department: department,
                        categoryComputation: categories.reduce((acc, category) => {
                            acc[category] = {
                                sum: 0,
                                count: 0,
                                uniqueStudents: new Set()
                            };
                            return acc;
                        }, {})
                    };
                }
                evaluationsByTeacherAndSubject[teacherId][subject].evaluations.push(evaluation);
            });
        }

        for (const teacherId in evaluationsByTeacherAndSubject) {
            for (const subject in evaluationsByTeacherAndSubject[teacherId]) {
                const { evaluations, categoryComputation, department } = evaluationsByTeacherAndSubject[teacherId][subject];

                for (const category of categories) {
                    const questions = await Question.find({ questionCategory: category });
                    categoryComputation[category].count = questions.length;
                    console.log(`Category ${category}: Found ${questions.length} questions.`);
                }

                evaluations.forEach(evaluation => {
                    const category = evaluation.IDquestions.questionCategory;
                    const answer = parseInt(evaluation.answer, 10);
                    if (categoryComputation[category]) {
                        categoryComputation[category].uniqueStudents.add(evaluation.IDstudent.toString());

                        if (answer >= 1 && answer <= 5) {
                            categoryComputation[category].sum += answer;
                        } else {
                            console.log('Unexpected rating value:', answer);
                        }
                    }
                });

                const perCategoryMetrics = {};
                const categoryScores = [];
                for (const category of categories) {
                    const totalSum = categoryComputation[category].sum;
                    const numberOfQuestions = categoryComputation[category].count;
                    const numberOfStudents = categoryComputation[category].uniqueStudents.size;

                    let metric = 0;
                    if (numberOfQuestions > 0 && numberOfStudents > 0) {
                        metric = (totalSum / numberOfStudents) / numberOfQuestions;
                        metric = parseFloat(metric.toFixed(2)); // Limit to 2 decimal places
                    }

                    perCategoryMetrics[category] = metric;
                    categoryScores.push(metric);

                    console.log(`Teacher: ${teacherId}, Subject: ${subject}, Category: ${category}, Metric: ${metric}, Unique Students: ${numberOfStudents}`);
                    console.log(`Teacher: ${teacherId}, Subject: ${subject}, Category: ${category}, Total Sum: ${totalSum}, Number of Questions: ${numberOfQuestions}`);
                }

                const grandScore = parseFloat((categoryScores.reduce((acc, score) => acc + score, 0) / categories.length).toFixed(2)); // Limit to 2 decimal places

                // Save the calculated evaluation
                const calculatedEvaluation = new CalculatedEvaluation({
                    acadYear: currentTimeFrame,
                    semester: currentSemester,
                    teacherId,
                    subjectId: subject,
                    department,
                    category1Score: perCategoryMetrics['course overview and orientation'],
                    category2Score: perCategoryMetrics['learning outcomes'],
                    category3Score: perCategoryMetrics['assessment'],
                    category4Score: perCategoryMetrics['instructional material/content'],
                    category5Score: perCategoryMetrics['teacher presence and support'],
                    category6Score: perCategoryMetrics['learning experiences and interaction'],
                    category7Score: perCategoryMetrics['technology and accessibility'],
                    grandScore
                });

                await calculatedEvaluation.save();

                console.log(`Calculated evaluation saved for Teacher: ${teacherId}, Subject: ${subject}, Grand Score: ${grandScore}`);
            }
        }

    } catch (error) {
        console.error('Error in scheduleJob:', error);
    }
}; */


/* const scheduleJob = async () => {
    try {
        console.log('Starting evaluation calculation job...');

        // Fetch time frame details
        const timeFrame = await TimeFrame.findOne({});
        const currentTimeFrame = `${timeFrame.acadYearStart}-${timeFrame.acadYearEnd}`;
        const currentSemester = timeFrame.semester;
        const categories = [
            'course overview and orientation',
            'learning outcomes',
            'assessment',
            'instructional material/content',
            'teacher presence and support',
            'learning experiences and interaction',
            'technology and accessibility'
        ];

        console.log('Fetched TimeFrame:', timeFrame);

        // Fetch all teachers
        const allTeachers = await Instructor.find({});
        console.log('Fetched all teachers:', allTeachers.length);

        const evaluationsByTeacherAndSubject = {};

        for (const teacher of allTeachers) {
            const evaluations = await Evaluation.find({ IDinstructor: teacher._id }).populate('IDquestions');
            console.log(`Fetched evaluations for teacher ${teacher._id}:`, evaluations.length);

            evaluations.forEach(evaluation => {
                const subject = evaluation.IDsubject; // Assuming IDsubject is the field for the subject
                const teacherId = teacher._id.toString();
                if (!evaluationsByTeacherAndSubject[teacherId]) {
                    evaluationsByTeacherAndSubject[teacherId] = {};
                }
                if (!evaluationsByTeacherAndSubject[teacherId][subject]) {
                    evaluationsByTeacherAndSubject[teacherId][subject] = {
                        evaluations: [],
                        categoryComputation: categories.reduce((acc, category) => {
                            acc[category] = {
                                sum: 0,
                                count: 0,
                                uniqueStudents: new Set()
                            };
                            return acc;
                        }, {})
                    };
                }
                evaluationsByTeacherAndSubject[teacherId][subject].evaluations.push(evaluation);
            });
        }

        for (const teacherId in evaluationsByTeacherAndSubject) {
            for (const subject in evaluationsByTeacherAndSubject[teacherId]) {
                const { evaluations, categoryComputation } = evaluationsByTeacherAndSubject[teacherId][subject];

                for (const category of categories) {
                    const questions = await Question.find({ questionCategory: category });
                    categoryComputation[category].count = questions.length;
                    console.log(`Category ${category}: Found ${questions.length} questions.`);
                }

                evaluations.forEach(evaluation => {
                    const category = evaluation.IDquestions.questionCategory;
                    const answer = parseInt(evaluation.answer, 10);
                    if (categoryComputation[category]) {
                        categoryComputation[category].uniqueStudents.add(evaluation.IDstudent.toString());

                        if (answer >= 1 && answer <= 5) {
                            categoryComputation[category].sum += answer;
                        } else {
                            console.log('Unexpected rating value:', answer);
                        }
                    }
                });

                const perCategoryMetrics = {};
                const categoryScores = [];
                for (const category of categories) {
                    const totalSum = categoryComputation[category].sum;
                    const numberOfQuestions = categoryComputation[category].count;
                    const numberOfStudents = categoryComputation[category].uniqueStudents.size;

                    let metric = 0;
                    if (numberOfQuestions > 0 && numberOfStudents > 0) {
                        metric = (totalSum / numberOfStudents) / numberOfQuestions;
                        metric = parseFloat(metric.toFixed(2)); // Limit to 2 decimal places
                    }

                    perCategoryMetrics[category] = metric;
                    categoryScores.push(metric);

                    console.log(`Teacher: ${teacherId}, Subject: ${subject}, Category: ${category}, Metric: ${metric}, Unique Students: ${numberOfStudents}`);
                    console.log(`Teacher: ${teacherId}, Subject: ${subject}, Category: ${category}, Total Sum: ${totalSum}, Number of Questions: ${numberOfQuestions}`);
                }

                const grandScore = parseFloat((categoryScores.reduce((acc, score) => acc + score, 0) / categories.length).toFixed(2)); // Limit to 2 decimal places

                // Save the calculated evaluation
                const calculatedEvaluation = new CalculatedEvaluation({
                    acadYear: currentTimeFrame,
                    semester: currentSemester,
                    teacherId,
                    subjectId: subject,
                    category1Score: perCategoryMetrics['course overview and orientation'],
                    category2Score: perCategoryMetrics['learning outcomes'],
                    category3Score: perCategoryMetrics['assessment'],
                    category4Score: perCategoryMetrics['instructional material/content'],
                    category5Score: perCategoryMetrics['teacher presence and support'],
                    category6Score: perCategoryMetrics['learning experiences and interaction'],
                    category7Score: perCategoryMetrics['technology and accessibility'],
                    grandScore
                });

                await calculatedEvaluation.save();

                console.log(`Calculated evaluation saved for Teacher: ${teacherId}, Subject: ${subject}, Grand Score: ${grandScore}`);
            }
        }
        

    } catch (error) {
        console.error('Error in scheduleJob:', error);
    }
}; */

/* const scheduleJob = async () => {
    try {
        console.log('Starting evaluation calculation job...');

        // Fetch the latest time frame details
        const timeFrame = await TimeFrame.findOne({}).sort({ _id: -1 });
        
        if (!timeFrame) {
            console.log('No time frame found.');
            return;
        }

        // Update the isActive attribute to false
        timeFrame.isActive = false;
        await timeFrame.save();
        console.log('Updated the latest TimeFrame to inactive:', timeFrame);

        const currentTimeFrame = `${timeFrame.acadYearStart}-${timeFrame.acadYearEnd}`;
        const currentSemester = timeFrame.semester;
        const categories = [
            'course overview and orientation',
            'learning outcomes',
            'assessment',
            'instructional material/content',
            'teacher presence and support',
            'learning experiences and interaction',
            'technology and accessibility'
        ];

        console.log('Fetched TimeFrame:', timeFrame);

        // Fetch all teachers
        const allTeachers = await Instructor.find({});
        console.log('Fetched all teachers:', allTeachers.length);

        const evaluationsByTeacherAndSubject = {};

        for (const teacher of allTeachers) {
            const evaluations = await Evaluation.find({ IDinstructor: teacher._id }).populate('IDquestions');
            console.log(`Fetched evaluations for teacher ${teacher._id}:`, evaluations.length);

            evaluations.forEach(evaluation => {
                const subject = evaluation.IDsubject; // Assuming IDsubject is the field for the subject
                const teacherId = teacher._id.toString();
                if (!evaluationsByTeacherAndSubject[teacherId]) {
                    evaluationsByTeacherAndSubject[teacherId] = {};
                }
                if (!evaluationsByTeacherAndSubject[teacherId][subject]) {
                    evaluationsByTeacherAndSubject[teacherId][subject] = {
                        evaluations: [],
                        categoryComputation: categories.reduce((acc, category) => {
                            acc[category] = {
                                sum: 0,
                                count: 0,
                                uniqueStudents: new Set()
                            };
                            return acc;
                        }, {})
                    };
                }
                evaluationsByTeacherAndSubject[teacherId][subject].evaluations.push(evaluation);
            });
        }

        for (const teacherId in evaluationsByTeacherAndSubject) {
            for (const subject in evaluationsByTeacherAndSubject[teacherId]) {
                const { evaluations, categoryComputation } = evaluationsByTeacherAndSubject[teacherId][subject];

                for (const category of categories) {
                    const questions = await Question.find({ questionCategory: category });
                    categoryComputation[category].count = questions.length;
                    console.log(`Category ${category}: Found ${questions.length} questions.`);
                }

                evaluations.forEach(evaluation => {
                    const category = evaluation.IDquestions.questionCategory;
                    const answer = parseInt(evaluation.answer, 10);
                    if (categoryComputation[category]) {
                        categoryComputation[category].uniqueStudents.add(evaluation.IDstudent.toString());

                        if (answer >= 1 && answer <= 5) {
                            categoryComputation[category].sum += answer;
                        } else {
                            console.log('Unexpected rating value:', answer);
                        }
                    }
                });

                const perCategoryMetrics = {};
                const categoryScores = [];
                for (const category of categories) {
                    const totalSum = categoryComputation[category].sum;
                    const numberOfQuestions = categoryComputation[category].count;
                    const numberOfStudents = categoryComputation[category].uniqueStudents.size;

                    let metric = 0;
                    if (numberOfQuestions > 0 && numberOfStudents > 0) {
                        metric = (totalSum / numberOfStudents) / numberOfQuestions;
                        metric = parseFloat(metric.toFixed(2)); // Limit to 2 decimal places
                    }

                    perCategoryMetrics[category] = metric;
                    categoryScores.push(metric);

                    console.log(`Teacher: ${teacherId}, Subject: ${subject}, Category: ${category}, Metric: ${metric}, Unique Students: ${numberOfStudents}`);
                    console.log(`Teacher: ${teacherId}, Subject: ${subject}, Category: ${category}, Total Sum: ${totalSum}, Number of Questions: ${numberOfQuestions}`);
                }

                const grandScore = parseFloat((categoryScores.reduce((acc, score) => acc + score, 0) / categories.length).toFixed(2)); // Limit to 2 decimal places

                // Save the calculated evaluation
                const calculatedEvaluation = new CalculatedEvaluation({
                    acadYear: currentTimeFrame,
                    semester: currentSemester,
                    teacherId,
                    subjectId: subject,
                    category1Score: perCategoryMetrics['course overview and orientation'],
                    category2Score: perCategoryMetrics['learning outcomes'],
                    category3Score: perCategoryMetrics['assessment'],
                    category4Score: perCategoryMetrics['instructional material/content'],
                    category5Score: perCategoryMetrics['teacher presence and support'],
                    category6Score: perCategoryMetrics['learning experiences and interaction'],
                    category7Score: perCategoryMetrics['technology and accessibility'],
                    grandScore
                });

                await calculatedEvaluation.save();

                console.log(`Calculated evaluation saved for Teacher: ${teacherId}, Subject: ${subject}, Grand Score: ${grandScore}`);
            }
        }
        

    } catch (error) {
        console.error('Error in scheduleJob:', error);
    }
};
 */

const sendEmails = async () => {
    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Fetch all students
        const allStudents = await Student.find({});

        // Emailing all students
        const batchSize = 500; // Gmail limit for recipients per message
        for (let i = 0; i < allStudents.length; i += batchSize) {
            const studentBatch = allStudents.slice(i, i + batchSize);

            for (const student of studentBatch) {
                const mailOptions = {
                    from: {
                        name: 'Innovaluate',
                        address: process.env.EMAIL_USER
                    },
                    to: student.email,
                    subject: 'Your HTU InnoValuate System Password',
                    text: `Hi ${student.name},\n\nGood day! This is from the HTU's InnoValuate System. Your password for the system is: ${student.password}\n\nBest regards,\nInnoValuate Team`,
                    html: `<h1>Hi ${student.name},</h1><p>Good day! This is from the HTU's InnoValuate System. Your password for the system is: <strong>${student.password}</strong></p><p>Best regards,<br>InnoValuate Team</p>`
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email sent to ${student.email}`);
                } catch (error) {
                    console.error(`Error sending email to ${student.email}:`, error);
                }
            }

            // Optional: Add a delay between batches to avoid hitting the sending limits
            await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds delay
        }
    } catch (error) {
        console.error('Error in sendEmails:', error);
    }
};
/* const scheduleJob = async () => {
    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Fetch all students and time frame details
        const allStudents = await Student.find({});
        const timeFrame = await TimeFrame.findOne({});
        const currentTimeFrame = `${timeFrame.acadYearStart}-${timeFrame.acadYearEnd}`;
        const currentSemester = timeFrame.semester;
        const categories = [
            'course overview and orientation',
            'learning outcomes',
            'assessment',
            'instructional material/content',
            'teacher presence and support',
            'learning experiences and interaction',
            'technology and accessibility'
        ];

        // Fetch all teachers
        const allTeachers = await Instructor.find({});
        const evaluationsByTeacherAndSubject = {};

        for (const teacher of allTeachers) {
            const evaluations = await Evaluation.find({ IDinstructor: teacher._id }).populate('IDquestions');

            evaluations.forEach(evaluation => {
                const subject = evaluation.IDsubject; // Assuming IDsubject is the field for the subject
                const teacherId = teacher._id.toString();
                if (!evaluationsByTeacherAndSubject[teacherId]) {
                    evaluationsByTeacherAndSubject[teacherId] = {};
                }
                if (!evaluationsByTeacherAndSubject[teacherId][subject]) {
                    evaluationsByTeacherAndSubject[teacherId][subject] = {
                        evaluations: [],
                        categoryComputation: categories.reduce((acc, category) => {
                            acc[category] = {
                                sum: 0,
                                count: 0,
                                uniqueStudents: new Set()
                            };
                            return acc;
                        }, {})
                    };
                }
                evaluationsByTeacherAndSubject[teacherId][subject].evaluations.push(evaluation);
            });
        }

        for (const teacherId in evaluationsByTeacherAndSubject) {
            for (const subject in evaluationsByTeacherAndSubject[teacherId]) {
                const { evaluations, categoryComputation } = evaluationsByTeacherAndSubject[teacherId][subject];

                for (const category of categories) {
                    const questions = await Question.find({ questionCategory: category });

                    questions.forEach(question => {
                        categoryComputation[category].count += 1;
                    });
                }

                evaluations.forEach(evaluation => {
                    const category = evaluation.IDquestions.questionCategory;
                    const answer = parseInt(evaluation.answer, 10);
                    if (categoryComputation[category]) {
                        categoryComputation[category].uniqueStudents.add(evaluation.IDstudent.toString());

                        if (answer >= 1 && answer <= 5) {
                            categoryComputation[category].sum += answer;
                        } else {
                            console.log('Unexpected rating value:', answer);
                        }
                    }
                });

                const perCategoryMetrics = {};
                const categoryScores = [];
                for (const category of categories) {
                    const totalSum = categoryComputation[category].sum;
                    const numberOfQuestions = categoryComputation[category].count;
                    const numberOfStudents = categoryComputation[category].uniqueStudents.size;

                    let metric = 0;
                    if (numberOfQuestions > 0 && numberOfStudents > 0) {
                        metric = (totalSum / numberOfStudents) / numberOfQuestions;
                        metric = parseFloat(metric.toFixed(2)); // Limit to 2 decimal places
                    }

                    perCategoryMetrics[category] = metric;
                    categoryScores.push(metric);

                    console.log(`Teacher: ${teacherId}, Subject: ${subject}, Category: ${category}, Metric: ${metric}, Unique Students: ${numberOfStudents}`);
                    console.log(`Teacher: ${teacherId}, Subject: ${subject}, Category: ${category}, Total Sum: ${totalSum}, Number of Questions: ${numberOfQuestions}`);
                }

                const grandScore = parseFloat((categoryScores.reduce((acc, score) => acc + score, 0) / categories.length).toFixed(2)); // Limit to 2 decimal places

                // Save the calculated evaluation
                const calculatedEvaluation = new CalculatedEvaluation({
                    acadYear: currentTimeFrame,
                    semester: currentSemester,
                    teacherId,
                    subjectId: subject,
                    category1Score: perCategoryMetrics['course overview and orientation'],
                    category2Score: perCategoryMetrics['learning outcomes'],
                    category3Score: perCategoryMetrics['assessment'],
                    category4Score: perCategoryMetrics['instructional material/content'],
                    category5Score: perCategoryMetrics['teacher presence and support'],
                    category6Score: perCategoryMetrics['learning experiences and interaction'],
                    category7Score: perCategoryMetrics['technology and accessibility'],
                    grandScore
                });

                await calculatedEvaluation.save();

                console.log(`Calculated evaluation saved for Teacher: ${teacherId}, Subject: ${subject}, Grand Score: ${grandScore}`);
            }
        }

        // Emailing all students
        const batchSize = 500; // Gmail limit for recipients per message
        for (let i = 0; i < allStudents.length; i += batchSize) {
            const studentBatch = allStudents.slice(i, i + batchSize);

            for (const student of studentBatch) {
                const mailOptions = {
                    from: {
                        name: 'Innovaluate',
                        address: process.env.EMAIL_USER
                    },
                    to: student.email,
                    subject: 'Your HTU InnoValuate System Password',
                    text: `Hi ${student.name},\n\nGood day! This is from the HTU's InnoValuate System. Your password for the system is: ${student.password}\n\nBest regards,\nInnoValuate Team`,
                    html: `<h1>Hi ${student.name},</h1><p>Good day! This is from the HTU's InnoValuate System. Your password for the system is: <strong>${student.password}</strong></p><p>Best regards,<br>InnoValuate Team</p>`
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email sent to ${student.email}`);
                } catch (error) {
                    console.error(`Error sending email to ${student.email}:`, error);
                }
            }

            // Optional: Add a delay between batches to avoid hitting the sending limits
            await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds delay
        }
    } catch (error) {
        console.error('Error in scheduleJob:', error);
    }
};
 */

app.get('/sendemail',(req,res)=>{
  res.render('sendEmail')
})






app.get('/uploadTest', (req, res) => {
  res.render('testUpload');
});



app.post('/test/addTeacher', async(req,res)=> {
  const {firstname, lastname, department, subjects} = req.body
  const fullname = `${firstname} ${studentLastName}`

  const separatedSubs = subjects.split(', ')

  const foundSubs= await Subject.find({code: {$in: separatedSubs}})

  const mappedSubs = foundSubs.map(subject => subject._id)

  const newInstructor =  new Instructor({
    firstname: firstname,
    lastname: lastname,
    fullname: fullname,
    department: department,
    subjects: mappedSubs
  })
  await newInstructor.save()

  
  res.send('successful')
})


app.get('/test', (req,res)=> {

  res.render('test')
})


app.get('/getQuestions', async(req,res)=> {
  const allQuestions = await Question.find({})
  res.json({questions: allQuestions})
})














app.get('/:id/showEval', async(req,res)=> {
  const count = await Evaluation.countDocuments({answer: "2"})

  res.render('showEval')
})

app.post('/saveStudents', async(req,res)=> {
  for(let i = 0; i < studentId.length; i++){
    let name = `${studentFirstName[i]} ${studentLastName[i]}`
    const addAcc = new Student(
      {studentID: studentId[i], name: name, program: studentProgram[i], yearLevel: studentYearLevel[i] }
    )
    addAcc.save()
  }res.render('addStudents', {studentId,studentFirstName,studentLastName,studentProgram,studentYearLevel})
  
})


app.post('/process-excel', upload.single('excelFile'), async (req, res) => {
  try {
    // Parse the uploaded Excel file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

    // Assuming the studentId is in the first column (A) of the first sheet
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const studentIds = Object.keys(sheet)
      .filter(cell => cell.startsWith('A') && sheet[cell].v !== 'studentId') // assuming header row
      .map(cell => sheet[cell].v)


        const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
    const studentName = Object.keys(sheet1)
      .filter(cell => cell.startsWith('B') && sheet[cell].v !== 'name') // assuming header row
      .map(cell => sheet1[cell].v)

          const sheet2 = workbook.Sheets[workbook.SheetNames[0]];
    const studentDepartment = Object.keys(sheet2)
      .filter(cell => cell.startsWith('C') && sheet[cell].v !== 'department') // assuming header row
      .map(cell => sheet2[cell].v)

          const sheet3 = workbook.Sheets[workbook.SheetNames[0]];
    const studentYear = Object.keys(sheet3)
      .filter(cell => cell.startsWith('D') && sheet[cell].v !== 'year_level') // assuming header row
      .map(cell => sheet3[cell].v)

          const sheet4 = workbook.Sheets[workbook.SheetNames[0]];
    const studentProgram = Object.keys(sheet4)
      .filter(cell => cell.startsWith('E') && sheet[cell].v !== 'program') // assuming header row
      .map(cell => sheet4[cell].v)

              const sheet5 = workbook.Sheets[workbook.SheetNames[0]];
    const studentEnrolled = Object.keys(sheet5)
      .filter(cell => cell.startsWith('F') && sheet[cell].v !== 'enrolledSubs') // assuming header row
      .map(cell => sheet5[cell].v)
      
  
    // Do something with the extracted studentIds
   studentId.push(...studentIds)
   studentId.shift()
   studentId.shift()
   studentName.push(...studentName)
   studentDepartment.push(...studentDepartment)
   studentYearLevel.push(...studentYear)
   studentProgram.push(...studentProgram)
   studentEnrolledSubs.push(...studentEnrolled)

    console.log({ success: true, message: 'Student infosc extracted successfully' })

     res.status(200).render('addStudents',{studentId,studentName,studentDepartment,studentYearLevel,studentEnrolledSubs, studentProgram,studentEnrolledSubs });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ success: false, message: 'Error processing Excel file' });
  }
});
app.get('/process-excel', (req,res)=> {
    res.render('addStudents',  {studentId,studentName,studentDepartment,studentYearLevel,studentYearLevel, studentEnrolledSubs, studentProgram} )
})






  



app.get('/:id/faculty/instructors',authMiddleware, async(req,res)=> {
    const foundInstruct = await Instructor.find({})
    res.render('showEval', {foundInstruct})
})


app.get('/facInstructors', authMiddleware,async (req, res) => {
    const teacherName = req.query.teacherName;
    const instructorData = {
        name: teacherName
    };

    const allQuestions = await Question.find({});
    const foundInstruc = await Instructor.findOne({ fullname: teacherName });
    const foundEval = await Evaluation.find({ IDinstructor: foundInstruc._id });
    const questions = [];
    const textedQuestions = [];
    for (let question of foundEval) {
        questions.push(question.IDquestions);
    }
    for (let question of questions) {
        const foundQuest = await Question.findById(question);
        textedQuestions.push(foundQuest.text);
    }

    const questionAnswers = [];
    let tempArray = [];
    let counter = 0;

    for (let question of allQuestions) {
        for (let i = 1; i <= 5; i++) {
            const eval = await Evaluation.countDocuments({
                IDquestions: question._id,
                IDinstructor: foundInstruc._id,
                answer: i
            });
            tempArray.push(eval);
            counter++;
            if (counter % 5 === 0) { 
                questionAnswers.push(tempArray); 
                tempArray = []; 
            }
        }
    }


    let total1 = 0
    let total2 = 0
    let total3 = 0
    let total4 = 0
    let total5 = 0

    for(let i of questionAnswers){
      total1 += i[0]
      total2 += i[1]
      total3 += i[2]
      total4 += i[3]
      total5 += i[4]

    }
    const totalAnswers = [total1, total2,total3,total4,total5]


    res.json({ instructorData: instructorData, textedQuestions: textedQuestions, allQuestions: allQuestions, questionAnswers: questionAnswers, totalAnswers:totalAnswers });
});





app.get('/questions',authMiddleware, async(req,res)=> {
  try{
    const questions = await Question.find({})
    if(!questions){
      res.status(404).json({error: "can't find any questions"})
      return
    }
    res.json(questions)
  }catch(error){
    console.error(error)
    res.status(500).json("internal error")
  }
})









app.get('/error',authMiddleware, (req,res)=> {
    res.render('error')
})



///guidance///guidance///guidance///guidance///guidance///guidance///guidance///guidance
/* app.get('/getCalculatedEvaluation',authMiddleware,guidanceMiddleware, async (req, res) => {
    const { teacherName, subject } = req.query;
    try {
        const foundTeacher = await Instructor.findOne({ fullname: teacherName });
        const foundSubject = await Subject.findOne({ code: subject });
        
        if (!foundTeacher || !foundSubject) {
            return res.status(404).json({ message: 'Teacher or Subject not found' });
        }

        const foundCalcEval = await CalculatedEvaluation.findOne({ teacherId: foundTeacher._id, subjectId: foundSubject._id });

        if (!foundCalcEval) {
            return res.status(404).json({ message: 'Calculated evaluation not found' });
        }

        res.json(foundCalcEval);
    } catch (error) {
        console.error('Error fetching calculated evaluation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}); */
/* app.get('/:guidanceID/getCalculatedEval', authMiddleware, guidanceMiddleware, async(req,res)=>{
  try{
    const {teacherName, acadYear, semester} = req.query
    const foundTeacher = await Instructor.findOne({ fullname: teacherName });
        const foundSubject = await Subject.findOne({ code: subject });
        
        if (!foundTeacher || !foundSubject) {
            return res.status(404).json({ message: 'Teacher or Subject not found' });
        }

        const foundCalcEval = await CalculatedEvaluation.findOne({ teacherId: foundTeacher._id, subjectId: foundSubject._id });

        if (!foundCalcEval) {
            return res.status(404).json({ message: 'Calculated evaluation not found' });
        }

        res.json(foundCalcEval);

  }catch(error){

  }
}) */
/* app.get('/renderCalculatedEvaluation',authMiddleware,guidanceMiddleware, async (req, res) => {


    const { teacherName, subject, evaluation } = req.query;
    const foundSubject = await Subject.findOne({code: subject})
    const foundTeacher = await Instructor.findOne({ fullname: teacherName });
    const timeFrame = await TimeFrame.findOne({})
    const currentAcadYear = `${timeFrame.acadYearStart}-${timeFrame.acadYearEnd}`
    const foundCalcEval = await CalculatedEvaluation.findOne({ teacherId: foundTeacher._id, subjectId: foundSubject._id });

    let gradeEquivalent = ''

    if(foundCalcEval.grandScore >= 4.5 ){
      gradeEquivalent = 'Excellent'
    }else if(foundCalcEval.grandScore >= 4.0 ){
      gradeEquivalent = 'Very Good'
    }else if(foundCalcEval.grandScore >= 3.0 ){
      gradeEquivalent = 'Good'
    }else if(foundCalcEval.grandScore >= 2.0 ){
      gradeEquivalent = 'Fair'
    }else if(foundCalcEval.grandScore >= 1.0 ){
      gradeEquivalent = 'Poor'
    }else{
      console.log('there is an error.')
    }

    let teacherdepartment = ''
    if(foundTeacher.department === 'CET'){
      teacherdepartment = "College of Engineering and Technology"
    }else if(foundTeacher.department === 'CNHS'){
      teacherdepartment = "College of Nursing and Health Sciences"
    }else if(foundTeacher.department === 'CBA'){
      teacherdepartment = "College of Business Administration"
    }else if(foundTeacher.department === 'CEAA'){
      teacherdepartment = "College of Education and Arts"
    }else if(foundTeacher.department === 'CHM'){
      teacherdepartment = "College of Hospitality and Management"
    }else if(foundTeacher.department === 'CCJE'){
      teacherdepartment = "College of Criminal Justice Education"
    }else{
      console.log('there is an error')
    }




    try {
        const evaluationData = JSON.parse(evaluation);
        console.log(evaluationData)
        res.render('toBePrinted', { teacherName, subject, evaluation: evaluationData, foundTeacher:teacherdepartment,acadYear: currentAcadYear, gradeEquivalent,gradeEquivalent});
    } catch (error) {
        console.error('Error rendering calculated evaluation:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
}); */


/* app.get('/guidance/getTeacherSubjects',authMiddleware,guidanceMiddleware, async (req, res) => {
    const { teacher } = req.query;
    try {
        // Find the instructor by fullName
        const foundInstructor = await Instructor.findOne({ fullname: teacher }).populate('subjects');
        if (!foundInstructor) {
            return res.status(404).send('Instructor not found');
        }

        // Get the subjects of the instructor
        const subjects = foundInstructor.subjects;

        // Count the number of subjects

        res.json({
            subjects: subjects
        });
    } catch (err) {
        console.error('Error fetching instructor subjects:', err);
        res.status(500).send('Server error');
    }
}); */
/* app.get('/:guidanceID/getCalculatedEvaluation', authMiddleware, guidanceMiddleware, async (req, res) => {
  try {
    const { teacherName } = req.query; // Include semester, academicYear, subject in the query

    const foundTeacher = await Instructor.findOne({ fullname: teacherName });
    const subjects = []
    if (!foundTeacher) {
      throw new Error('Teacher not found');
    }

    const foundCalculatedEvaluations = await CalculatedEvaluation.find({
      teacherId: foundTeacher._id,
   
    })

    if (foundCalculatedEvaluations.length === 0) {
      throw new Error('No evaluations found for this teacher');
    }
    const subjectIds = foundCalculatedEvaluations.map(subject => subject.subjectId);

const subjectCodesArray = await Promise.all(subjectIds.map(async (subjectId) => {
  const subject = await Subject.findOne({_id: subjectId});
  return subject.code; // Assuming 'subjectCode' is the field you want to push
}));


    console.log(subjectCodesArray)


    // Initialize sums and counts
    let count = 0;
    let sumCat1 = 0;
    let sumCat2 = 0;
    let sumCat3 = 0;
    let sumCat4 = 0;
    let sumCat5 = 0;
    let sumCat6 = 0;
    let sumCat7 = 0;
    let sumGrandScore = 0;

    // Sum up the scores
    foundCalculatedEvaluations.forEach((evaluation) => {
      count++;
      sumCat1 += evaluation.category1Score;
      sumCat2 += evaluation.category2Score;
      sumCat3 += evaluation.category3Score;
      sumCat4 += evaluation.category4Score;
      sumCat5 += evaluation.category5Score;
      sumCat6 += evaluation.category6Score;
      sumCat7 += evaluation.category7Score;
      sumGrandScore += evaluation.grandScore;
    });

    // Calculate averages
    const avgCat1 = sumCat1 / count;
    const avgCat2 = sumCat2 / count;
    const avgCat3 = sumCat3 / count;
    const avgCat4 = sumCat4 / count;
    const avgCat5 = sumCat5 / count;
    const avgCat6 = sumCat6 / count;
    const avgCat7 = sumCat7 / count;
    const avgGrandScore = sumGrandScore / count;

    // Determine grade equivalent
    let gradeEquivalent = '';
    if (avgGrandScore >= 4.5) {
      gradeEquivalent = 'Excellent';
    } else if (avgGrandScore >= 4.0) {
      gradeEquivalent = 'Very Good';
    } else if (avgGrandScore >= 3.0) {
      gradeEquivalent = 'Good';
    } else if (avgGrandScore >= 2.0) {
      gradeEquivalent = 'Fair';
    } else if (avgGrandScore >= 1.0) {
      gradeEquivalent = 'Poor';
    } else {
      gradeEquivalent = 'No Data'; // Default value for unexpected scores
    }

    // Determine teacher's department
    let teacherDepartment = '';
    switch (foundTeacher.department) {
      case 'CET':
        teacherDepartment = 'College of Engineering and Technology';
        break;
      case 'CNHS':
        teacherDepartment = 'College of Nursing and Health Sciences';
        break;
      case 'CBA':
        teacherDepartment = 'College of Business Administration';
        break;
      case 'CEAA':
        teacherDepartment = 'College of Education and Arts';
        break;
      case 'CHM':
        teacherDepartment = 'College of Hospitality and Management';
        break;
      case 'CCJE':
        teacherDepartment = 'College of Criminal Justice Education';
        break;
      default:
        teacherDepartment = 'Unknown Department'; // Default value for unknown departments
        break;
    }

    // Render the view with the evaluation data
    res.render('toBePrinted', {
      teachername: foundTeacher.fullname,
      department: teacherDepartment,
      semester: foundCalculatedEvaluations[0].semester,
      academicYear: foundCalculatedEvaluations[0].acadYear,
      subject: subjectCodesArray,
      evaluation: {
        category1Score: avgCat1,
        category2Score: avgCat2,
        category3Score: avgCat3,
        category4Score: avgCat4,
        category5Score: avgCat5,
        category6Score: avgCat6,
        category7Score: avgCat7,
        grandScore: avgGrandScore
      },
      gradeEquivalent
    });
  } catch (error) {
    console.error('Error fetching calculated evaluation:', error.message);
    res.status(500).json({ error: error.message });
  }
}); */
app.get('/:guidanceID/getCalculatedEvaluation', authMiddleware, guidanceMiddleware, async (req, res) => {
  try {
    const { teacherName,semester,academicYear } = req.query; // Include semester, academicYear, subject in the query

    const foundTeacher = await Instructor.findOne({ fullname: teacherName });
    const subjects = []
    if (!foundTeacher) {
      throw new Error('Teacher not found');
    }

    const foundCalculatedEvaluations = await CalculatedEvaluation.find({
      teacherId: foundTeacher._id,semester: semester, acadYear: academicYear
    });

    if (foundCalculatedEvaluations.length === 0) {
      throw new Error('No evaluations found for this teacher');
    }

    const subjectIds = foundCalculatedEvaluations.map(subject => subject.subjectId);

    const subjectCodesArray = await Promise.all(subjectIds.map(async (subjectId) => {
      const subject = await Subject.findOne({ _id: subjectId });
      return subject.code; // Assuming 'subjectCode' is the field you want to push
    }));

    console.log(subjectCodesArray);

    // Initialize sums and counts
    let count = 0;
    let sumCat1 = 0;
    let sumCat2 = 0;
    let sumCat3 = 0;
    let sumCat4 = 0;
    let sumCat5 = 0;
    let sumCat6 = 0;
    let sumCat7 = 0;
    let sumGrandScore = 0;

    // Sum up the scores
    foundCalculatedEvaluations.forEach((evaluation) => {
      count++;
      sumCat1 += evaluation.category1Score;
      sumCat2 += evaluation.category2Score;
      sumCat3 += evaluation.category3Score;
      sumCat4 += evaluation.category4Score;
      sumCat5 += evaluation.category5Score;
      sumCat6 += evaluation.category6Score;
      sumCat7 += evaluation.category7Score;
      sumGrandScore += evaluation.grandScore;
    });

    // Calculate averages and limit to 2 decimal points
    const avgCat1 = (sumCat1 / count).toFixed(2);
    const avgCat2 = (sumCat2 / count).toFixed(2);
    const avgCat3 = (sumCat3 / count).toFixed(2);
    const avgCat4 = (sumCat4 / count).toFixed(2);
    const avgCat5 = (sumCat5 / count).toFixed(2);
    const avgCat6 = (sumCat6 / count).toFixed(2);
    const avgCat7 = (sumCat7 / count).toFixed(2);
    const avgGrandScore = (sumGrandScore / count).toFixed(2);

    // Determine grade equivalent
    let gradeEquivalent = '';
    if (avgGrandScore >= 4.5) {
      gradeEquivalent = 'Excellent';
    } else if (avgGrandScore >= 4.0) {
      gradeEquivalent = 'Very Good';
    } else if (avgGrandScore >= 3.0) {
      gradeEquivalent = 'Good';
    } else if (avgGrandScore >= 2.0) {
      gradeEquivalent = 'Fair';
    } else if (avgGrandScore >= 1.0) {
      gradeEquivalent = 'Poor';
    } else {
      gradeEquivalent = 'No Data'; // Default value for unexpected scores
    }

    // Determine teacher's department
    let teacherDepartment = '';
    switch (foundTeacher.department) {
      case 'CET':
        teacherDepartment = 'College of Engineering and Technology';
        break;
      case 'CNHS':
        teacherDepartment = 'College of Nursing and Health Sciences';
        break;
      case 'CBA':
        teacherDepartment = 'College of Business Administration';
        break;
      case 'CEAA':
        teacherDepartment = 'College of Education and Arts';
        break;
      case 'CHM':
        teacherDepartment = 'College of Hospitality and Management';
        break;
      case 'CCJE':
        teacherDepartment = 'College of Criminal Justice Education';
        break;
      default:
        teacherDepartment = 'Unknown Department'; // Default value for unknown departments
        break;
    }

    // Render the view with the evaluation data
    res.render('toBePrinted', {
      teachername: foundTeacher.fullname,
      department: teacherDepartment,
      semester: foundCalculatedEvaluations[0].semester,
      academicYear: foundCalculatedEvaluations[0].acadYear,
      subject: subjectCodesArray,
      evaluation: {
        category1Score: avgCat1,
        category2Score: avgCat2,
        category3Score: avgCat3,
        category4Score: avgCat4,
        category5Score: avgCat5,
        category6Score: avgCat6,
        category7Score: avgCat7,
        grandScore: avgGrandScore
      },
      gradeEquivalent
    });
  } catch (error) {
    console.error('Error fetching calculated evaluation:', error.message);
    res.status(500).json({ error: error.message });
  }
});



app.get('/:guidanceID/getSelectOptions', authMiddleware, guidanceMiddleware, async (req, res) => {
  try {
    const { department } = req.query;

    // Aggregation pipeline to get distinct semesters and acadYears
    const [result] = await CalculatedEvaluation.aggregate([
      { $match: { department: department } },
      {
        $group: {
          _id: null,
          semesters: { $addToSet: "$semester" },
          acadYears: { $addToSet: "$acadYear" }
        }
      },
      {
        $project: {
          _id: 0,
          semesters: 1,
          acadYears: 1
        }
      }
    ]);

    if (!result) {
      return res.status(404).json({ message: 'No data found' });
    }

    // Separate the data into two fields
    const response = {
      semesters: result.semesters,
      acadYears: result.acadYears
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching select options:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/* app.get('/:guidanceID/getGuidanceTeacher', authMiddleware, guidanceMiddleware, async (req, res) => {
  try {
    const { department, acadYear, semester } = req.query;

    const foundCalculatedEvaluations = await CalculatedEvaluation.find({department: department, acadYear: acadYear, semester: semester})
    console.log(department)
    console.log(acadYear)
    console.log(semester)

    console.log(foundCalculatedEvaluations)




    if(!foundCalculatedEvaluations){
      throw new Error('there is an error getting the Calculated Evaluations')
    }

    res.status(200).json({ evaluations: foundCalculatedEvaluations });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
}); */

app.get('/:guidanceID/getGuidanceTeacher', authMiddleware, guidanceMiddleware, async (req, res) => {
  try {
    const { department, acadYear, semester } = req.query;
    console.log(department)
    console.log(acadYear)
    console.log(semester)

    // Find unique teacher IDs from CalculatedEvaluation based on query parameters
    const foundCalculatedEvaluations = await CalculatedEvaluation.find({ department, acadYear, semester })
      .select('teacherId')
      .distinct('teacherId');

    if (!foundCalculatedEvaluations || foundCalculatedEvaluations.length === 0) {
      return res.status(404).json({ message: 'No teachers found for the specified criteria' });
    }

    // Fetch teacher details from the instructors collection based on unique teacher IDs
    const teachers = await Instructor.find({ _id: { $in: foundCalculatedEvaluations } }).populate('subjects')
    console.log(teachers)
    // Respond with the list of teachers
    res.status(200).json({ teachers });
  } catch (error) {
    console.error('Error fetching unique teachers:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/* app.get('/guidanceGetTeacher',authMiddleware,guidanceMiddleware,async(req,res)=>{
  const {department} = req.query
  const foundTeachers = await Instructor.find({department:department})
  
  res.json({teachers: foundTeachers})
}) */
/* app.get('/:guidanceID/getSubjects', authMiddleware, guidanceMiddleware, async (req, res) => {
  try {
    const { teacher } = req.query;

    // Find the teacher by full name
    const foundTeacher = await Instructor.findOne({ fullname: teacher });

    if (!foundTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Use aggregation to get distinct academic years
    const academicYearsAggregation = await CalculatedEvaluation.aggregate([
      { $match: { teacherId: foundTeacher._id } },
      {
        $group: {
          _id: "$acadYear"
        }
      },
      {
        $project: {
          _id: 0,
          academicYear: "$_id"
        }
      }
    ]);

    // Extract the distinct academic years
    const distinctAcademicYears = academicYearsAggregation.map(entry => entry.academicYear);

    // Use aggregation to get distinct semesters
    const semestersAggregation = await CalculatedEvaluation.aggregate([
      { $match: { teacherId: foundTeacher._id } },
      {
        $group: {
          _id: "$semester"
        }
      },
      {
        $project: {
          _id: 0,
          semester: "$_id"
        }
      }
    ]);

    // Extract the distinct semesters
    const distinctSemesters = semestersAggregation.map(entry => entry.semester);

    res.json({ acadYear:distinctAcademicYears, semester: distinctSemesters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}); */



/* app.get('/:guidanceID/getSelectOption', authMiddleware, guidanceMiddleware, async(req,res)=>{

  try{
  const {department} = req.query
    console.log(department)
  const foundTeacher = await Instructor.find({department:department})
    console.log(foundTeacher)

  res.status(200).json({foundTeacher: foundTeacher})

  }catch(error){
    console.log('there is an error getting teacher of guidance:', error.message)
  }
  
}) */

app.get('/:guidanceID/guidance', authMiddleware, guidanceMiddleware, async (req, res) => {
  const { guidanceID } = req.params;
  const foundGuidance = await Guidance.findOne({ guidanceID: guidanceID });
  res.render('guidance');
});


///students
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/'); // or handle the error as needed
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});


/* app.post('/:studentID/instructors/:teacherID/:subjectcode/evaluate',authMiddleware, studentMiddleware, async (req, res) => {
    const answers = req.body;
    const { studentID, teacherID, subjectcode } = req.params;

    try {
        const foundSubject = await Subject.findOne({ code: subjectcode });
        const foundStudent = await Student.findOne({ studentID: studentID });

        Object.keys(answers).forEach(async (questionId) => {
            const rating = answers[questionId];
            const question = await Question.findById(questionId);

            if (!question) {
                console.error(`Question with ID ${questionId} not found.`);
                return; // Skip saving if question is not found
            }

            const submitEvaluation = new Evaluation({
                IDstudent: foundStudent._id,
                IDquestions: question._id,
                IDinstructor: teacherID,
                answer: rating,
                IDsubject: foundSubject._id,
                questionCategory: question.questionCategory // Assuming 'questionCategory' is the property where category is stored
            });

            await submitEvaluation.save();
        });

        res.send('Answers submitted successfully');
    } catch (error) {
        console.error('Error saving evaluation:', error);
        res.status(500).json({ error: 'Failed to save evaluation.' });
    }
}); */
app.post('/:studentID/instructors/:teacherID/:subjectcode/evaluate', authMiddleware, studentMiddleware, async (req, res) => {
    const answers = req.body;
    const { studentID, teacherID, subjectcode } = req.params;

    try {
        const foundSubject = await Subject.findOne({ code: subjectcode });
        const foundStudent = await Student.findOne({ studentID });
        const foundTimeFrame = await TimeFrame.findOne().sort({ _id: -1 });

        const foundTeacher = await Instructor.findOne({_id: teacherID})
        


        Object.keys(answers).forEach(async (questionId) => {
            const rating = answers[questionId];
            const question = await Question.findById(questionId);

            if (!question) {
                console.error(`Question with ID ${questionId} not found.`);
                return; // Skip saving if question is not found
            }

            const submitEvaluation = new Evaluation({
                IDstudent: foundStudent._id,
                IDquestions: question._id,
                IDinstructor: teacherID,
                answer: rating,
                IDsubject: foundSubject._id,
                questionCategory: question.questionCategory, // Assuming 'questionCategory' is the property where category is stored
                academicYear: `${foundTimeFrame.acadYearStart}-${foundTimeFrame.acadYearEnd}`,
                semester: foundTimeFrame.semester,
                department: foundTeacher.department
            });

            await submitEvaluation.save();
        });

        // Add the evaluated subject ID to the student's evaluatedSubjects array
        foundStudent.evaluatedSubjects.push(foundSubject._id);
        await foundStudent.save();

        // Redirect to the instructor selection page
        res.redirect(`/${studentID}/instructors`);
    } catch (error) {
        console.error('Error saving evaluation:', error);
        res.status(500).json({ error: 'Failed to save evaluation.' });
    }
});



app.get('/:studentID/instructors/:teacherID/:subjectcode/evaluate', authMiddleware, studentMiddleware, async(req,res)=> {
  const {studentID, teacherID, subjectcode} = req.params


  const category1Question = await Question.find({questionCategory: 'course overview and orientation'})
  const category2Question = await Question.find({questionCategory: 'learning outcomes'})
  const category3Question = await Question.find({questionCategory: 'assessment'})
  const category4Question = await Question.find({questionCategory: 'instructional material/content'})
  const category5Question = await Question.find({questionCategory: 'teacher presence and support'})
  const category6Question = await Question.find({questionCategory: 'learning experiences and interaction'})
  const category7Question = await Question.find({questionCategory: 'technology and accessibility'})
  


  res.render('mobile1stQuestion',{category1Question,category2Question, category3Question ,category4Question, category5Question, category6Question, category7Question,studentID,teacherID, subjectcode})
})

app.get('/:studentID/instructors', authMiddleware, studentMiddleware, async (req, res) => {
    const { studentID } = req.params;

    try {
        const foundStudent = await Student.findOne({ studentID: studentID }).populate('subjectsEnrolled evaluatedSubjects');
        const studentSubjects = foundStudent.subjectsEnrolled;
        const evaluatedSubjects = foundStudent.evaluatedSubjects.map(subject => subject._id.toString());

        const subjectIds = studentSubjects.map(subject => subject._id);

       


        const foundTeachers = await Instructor.find({
            subjects: { $in: subjectIds }
        }).populate('subjects');

        const teacherSubjectPairs = [];
        foundTeachers.forEach(teacher => {
            teacher.subjects.forEach(subject => {
                if (subjectIds.some(id => id.equals(subject._id))) {
                    teacherSubjectPairs.push({ 
                        ...teacher._doc, 
                        subject,
                        isEvaluated: evaluatedSubjects.includes(subject._id.toString())
                    });
                }
            });
        });


         
        res.render('mobileSelectInstructors', { teacherSubjectPairs, studentId: studentID });
    } catch (error) {
        console.error('Error finding teachers:', error);
        res.status(500).send('Internal Server Error');
    }
});


/* app.get('/:studentID/instructors', authMiddleware,  studentMiddleware,async (req, res) => {
  const { studentID } = req.params;

  try {
    const foundStudent = await Student.findOne({ studentID: studentID }).populate('subjectsEnrolled');
    const studentSubjects = foundStudent.subjectsEnrolled;

    const subjectIds = studentSubjects.map(subject => subject._id);

    const foundTeachers = await Instructor.find({
      department: 'CET',
      subjects: { $in: subjectIds }
    }).populate('subjects');

    // Create an array to store each teacher-subject pair
    const teacherSubjectPairs = [];
    foundTeachers.forEach(teacher => {
      teacher.subjects.forEach(subject => {
        if (subjectIds.some(id => id.equals(subject._id))) {
          teacherSubjectPairs.push({ ...teacher._doc, subject });
        }
      });
    });

    res.render('mobileSelectInstructors', { teacherSubjectPairs, studentId: studentID });
  } catch (error) {
    console.error('Error finding teachers:', error);
    res.status(500).send('Internal Server Error');
  }
}); */




///admin///admin///admin///admin///admin///admin///admin///admin///admin///admin///admin///admin
app.post('/:adminid/cancelTimeFrame',authMiddleware, adminMiddleware, async(req,res)=>{
   try {
        // Fetch the latest time frame
        const latestTimeFrame = await TimeFrame.findOne({isActive: true}).sort({ _id: -1 });

        if (!latestTimeFrame) {
            return res.status(404).json({ message: 'No time frame found' });
        }

        // Check if the time frame is already inactive
        if (!latestTimeFrame.isActive) {
            return res.status(400).json({ message: 'Time frame is already inactive' });
        }

        // Update the isActive attribute to false
        latestTimeFrame.isActive = false;
        await latestTimeFrame.save();

        // Respond with a success message
        res.status(200).json({ message: 'Time frame deactivated successfully' });
    } catch (error) {
        console.error('Error deactivating time frame:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})


app.delete('/:adminId/deleteTimeFrame',authMiddleware, adminMiddleware, (req, res) => {
    TimeFrame.deleteMany({})
        .then(() => {
            res.sendStatus(204); // Use sendStatus to send a proper 204 response
        })
        .catch((err) => {
            res.status(500).json({ error: 'Error deleting time frames.' });
        });
});

app.post('/:adminId/setTimeFrame', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const setTimeFrame = new TimeFrame({
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            acadYearStart: req.body.startAcadYear,
            acadYearEnd: req.body.endAcadYear,
            semester: req.body.sem,
            isActive: true
        });

        const doc = await setTimeFrame.save();

        console.log('Server Current Time:', new Date().toISOString());

        const endDate = moment(doc.endDate).tz('Asia/Manila').format('YYYY-MM-DD');
        const endDateTimeString = `${endDate}T${doc.endTime}:00`;
        const endDateTime = moment.tz(endDateTimeString, 'Asia/Manila').toDate();

        console.log('Calculated End DateTime (Philippines Time):', endDateTime.toISOString());

        console.log('Scheduling job for evaluation processing...');
        schedule.scheduleJob(endDateTime, scheduleJob);

        console.log('Starting email sending job immediately...');
        sendEmails();

        res.json({ message: 'success' });
    } catch (err) {
        console.error('Error saving time frame:', err);
        res.status(500).json({ error: 'Error saving time frame.' });
    }
});

/* app.get('/:adminId/getTimeFrame', async (req, res) => {
    const { adminId } = req.params;

    try {
        const foundTimeFrame = await TimeFrame.findOne().sort({ _id: -1 });

        if (!foundTimeFrame) {
            // If no time frame is found, send a 200 response with a message
            return res.status(200).json({ message: 'No time frame found' });
        }

        // If a time frame is found, send the response
        res.status(200).json({ foundTimeFrame });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); */
app.get('/:adminId/getTimeFrame',authMiddleware,adminMiddleware, async (req, res) => {
    const { adminId } = req.params;

    try {
        // Check for an active time frame
        let foundTimeFrame = await TimeFrame.findOne({ isActive: true });

        
            if (!foundTimeFrame) {
                // If no time frame is found at all, send a 200 response with a message
                return res.status(200).json({ message: 'No time frame found' });
          
        }

        // If a time frame is found, send the response
        res.status(200).json({ foundTimeFrame });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


/* app.post('/:adminId/setTimeFrame',authMiddleware,adminMiddleware, async (req, res) => {
    try {
        const setTimeFrame = new TimeFrame({
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            acadYearStart: req.body.startAcadYear,
            acadYearEnd: req.body.endAcadYear,
            semester: req.body.sem
        });

        const doc = await setTimeFrame.save();

        console.log('Server Current Time:', new Date().toISOString());

        const endDate = moment(doc.endDate).tz('Asia/Manila').format('YYYY-MM-DD');
        const endDateTimeString = `${endDate}T${doc.endTime}:00`;
        const endDateTime = moment.tz(endDateTimeString, 'Asia/Manila').toDate();

        console.log('Calculated End DateTime (Philippines Time):', endDateTime.toISOString());

        if (endDateTime > new Date()) {
            console.log('Scheduling job...');

            schedule.scheduleJob(endDateTime, scheduleJob);

            res.json({ message: 'success' });
        } else {
            console.error('End date/time is in the past. Job not scheduled.');
            res.status(400).json({ error: 'End date/time is in the past. Job not scheduled.' });
        }
    } catch (err) {
        console.error('Error saving time frame:', err);
        res.status(500).json({ error: 'Error saving time frame.' });
    }
}); */

app.delete('/:adminId/deleteQuestion',authMiddleware, adminMiddleware,async (req, res) => {
    const { questionText } = req.query;
    
    await Question.deleteOne({ text: questionText });

    res.json({ message: 'successful' });
});
app.put('/:adminId/:questionId/updateQuestion', authMiddleware, adminMiddleware, async (req, res) => {
  const { adminId, questionId } = req.params;
  const { questionCategory, questionText } = req.query;

  try {
    const foundQuestion = await Question.findByIdAndUpdate(
      questionId,
      { text: questionText, questionCategory: questionCategory },
      { new: true } // This option ensures the updated document is returned
    );

    if (!foundQuestion) {
      throw new Error('Question not found or not updated successfully');
    }

    res.status(200).json({ message: 'Question updated successfully', question: foundQuestion });
  } catch (error) {
    console.error('Error updating question:', error.message);
    res.status(500).json({ message: 'An error occurred while updating the question', error: error.message });
  }
});


/* app.put('/:adminId/:questionId/updateQuestion', authMiddleware, adminMiddleware, async(req,res)=>{
  const {adminId, questionId} = req.params
  const {questionCategory, questionText} = req.query
  try{

    const foundQUestion = await Question.findByIdAndUpdate(questionId, {text: questionText, questionCategory:questionCategory})

    await foundQUestion.save()

    
  }catch(error){

  }
}) */
app.get('/:adminId/getQuestionInfo', authMiddleware, adminMiddleware, async(req,res)=>{
  const {question} = req.query
  console.log(question)
  try{

    function extractText(input) {
  // Regular expression to match the number and the period at the start of the string
    const regex = /^\d+\.\s*/;
    
    // Replace the matched portion with an empty string and trim any extra whitespace
    const result = input.replace(regex, '').trim();
    
    return result;
}
  const questionText = extractText(question)
    const foundQuestion = await Question.findOne({text: questionText})
    console.log(foundQuestion)

    if(!foundQuestion){
      throw new Error('No question found.')
    }
    res.status(200).json(foundQuestion)

  }catch(e){
    res.status(404).json(e.message)
  }
})

app.post('/:adminId/addQuestion',authMiddleware,adminMiddleware, (req,res)=>{
  const {questionText, addQuestionCategory} = req.body


  const newQuestion = new Question(
    {questionCategory: addQuestionCategory, text: questionText }
  )
  newQuestion.save()

  res.redirect('http://localhost:3100/test')

})

app.get('/:adminId/getQuestions',authMiddleware,adminMiddleware,async(req,res)=>{
  const {questionCategory} = req.query
  const{id} = req.params

  const foundQuestions = await Question.find({questionCategory: questionCategory})

  res.json({foundQuestions:foundQuestions})  

})

app.delete('/:adminId/toBeDeleteStudents',authMiddleware,adminMiddleware, async (req, res) => {
    const { year, department, program } = req.query;

    try {
        const result = await Student.deleteMany({ yearLevel: year, department: department, program: program });
        res.status(200).json({ message: 'Students successfully deleted', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error deleting students:', error);
        res.status(500).json({ message: 'Failed to delete students', error: error.message });
    }
});

app.post('/:adminId/addBulkTeacher', authMiddleware,adminMiddleware,async (req,res)=>{
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const teacherSheet = req.files.bulkTeacher;
  const workbook = xlsx.read(teacherSheet.data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  try {
    for (const row of rows) {
      const { firstname, lastname, department, subjects:subjectsString} = row;


      const subjectCodes = subjectsString ? subjectsString.split(', ') : [];

      const subjects = await Subject.find({ code: { $in: subjectCodes } }).select('_id');
      const subjectIds = subjects.map(subject => subject._id);

 

      const newInstructor = new Instructor({
        firstname: firstname,
        lastname: lastname,
        fullname: `${firstname} ${lastname}`,
        department: department,
        subjects: subjectIds
      });

      await newInstructor.save();
    }
    res.send('instructors imported successfully.');
  } catch (err) {
    console.error('Error importing instructors:', err);
    res.status(500).send('Error importing instructors.');
  }
})
app.post('/:adminId/addBulkSubject', authMiddleware, adminMiddleware, async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const subjectSheet = req.files.subjectFile;
  const workbook = xlsx.read(subjectSheet.data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  try {
    const existingSubjects = await Subject.find({ code: { $in: rows.map(row => row.code) } });
    const existingCodes = new Set(existingSubjects.map(subject => subject.code));

    const newSubjects = rows.filter(row => !existingCodes.has(row.code)).map(row => ({
      code: row.code,
      name: row.name,
      year: row.year,
      department: row.department,
      program: row.program.replace(/\s+/g, '').split(',')
    }));

    await Subject.insertMany(newSubjects);

    res.send('Subjects imported successfully.');
  } catch (err) {
    console.error('Error importing subjects:', err);
    res.status(500).send('Error importing subjects.');
  }
});

/* app.post('/:adminId/addBulkSubject', authMiddleware,adminMiddleware,async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const subjectSheet = req.files.subjectFile;
  const workbook = xlsx.read(subjectSheet.data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  try {
    for (const row of rows) {
      const { code, name, department, year, program } = row;

      // Remove spaces and split the program field into an array
      const programArray = program.replace(/\s+/g, '').split(',');

      const newSubs = new Subject({
        code: code,
        name: name,
        year: year,
        department: department,
        program: programArray
      });

      await newSubs.save();
    }
    res.send('Subjects imported successfully.');
  } catch (err) {
    console.error('Error importing subjects:', err);
    res.status(500).send('Error importing subjects.');
  }
}); */

/* app.post('/:adminId/addBulkSubject',async(req,res)=>{
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const subjectSheet = req.files.subjectFile;
  const workbook = xlsx.read(subjectSheet.data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  try {
    for (const row of rows) {
      const { code, name, department, year, program} = row;
 

      const newSubs = new Subject({
        code: code,
        name: name,
        year: year,
        department: department,
        program: program
      });

      await newSubs.save();
    }
    res.send('subjects imported successfully.');
  } catch (err) {
    console.error('Error importing subjects:', err);
    res.status(500).send('Error importing subjects.');
  }
}) */
app.delete('/:adminId/deleteIndividualSubject',authMiddleware,adminMiddleware,async(req,res)=>{
  
  try{
    const {subjectCode} = req.query

    const foundSubject = await Subject.findOne({code: subjectCode})

    if(!foundSubject){
      res.status(404).json({message:'error finding subject:', subjectCode})
    }

    await Subject.deleteOne({code: subjectCode})

    res.status(200).json({message:'Successful deleting subject:', subjectCode})


  }catch(error){
      console.error('Error deleting subject:', error);
      res.status(500).send('Error deleting subject');
  }
  


})



app.post('/:adminId/addIndividualSubject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { subjectName, subjectCode, subjectYear, subjectDepartment, subjectProgram } = req.body;
    const { adminId } = req.params;

    // Check if the subject already exists
    const existingSubject = await Subject.findOne({ code: subjectCode });

    if (existingSubject) {
      return res.status(400).json({ message: 'Subject already exists' });
    }

    const newSub = new Subject({
      code: subjectCode,
      name: subjectName,
      department: subjectDepartment,
      year: subjectYear,
      program: subjectProgram
    });

    await newSub.save();

    res.status(200).redirect(`http://localhost:3100/${adminId}/admin`);
  } catch (error) {
    res.status(500).json({ message: 'There is an error adding Subject' });
  }
});


/* app.post('/:adminId/addIndividualSubject',authMiddleware,adminMiddleware,async(req,res)=>{
  try{
    const {subjectName, subjectCode,subjectYear,subjectDepartment, subjectProgram} = req.body
    const {adminId} = req.params
    const newSub = new Subject({
      code: subjectCode,
      name: subjectName,
      department: subjectDepartment,
      year: subjectYear,
      program: subjectProgram
    })

    await newSub.save()

    res.status(200).redirect(`localhost:3100/${adminId}/admin`)
  }
  catch(error){
    res.status(500).json({message: 'There is an error adding Subject'})
  }
}) */
app.get('/:adminId/getSubjectInfo', authMiddleware, adminMiddleware, async(req,res)=>{
  const {subjectName} = req.query
  console.log(subjectName)
  try {
    const foundSubject = await Subject.findOne({name: subjectName})
    console.log(foundSubject)
  
    if(!foundSubject){
      throw new Error('No subject found')
    }
    res.status(200).json(foundSubject)
    
  } catch (error) {
    res.status(404).json(error.message)
  }
})

app.get('/:adminId/getStudentInfo', authMiddleware, adminMiddleware, async(req,res)=>{

    const {studentName, studentID } = req.query


  try{
    const foundStudent = await Student.findOne({name: studentName, studentID: studentID}).populate('subjectsEnrolled')

    if(!foundStudent){
      throw new Error('No student found')
    }
    res.status(200).json(foundStudent)

    console.log(studentName)
    console.log(foundStudent)


  }catch(e){
    res.status(404).json({error:e.message})
  }
})
app.get('/:adminId/getIndividualStudentSubject', authMiddleware,adminMiddleware,async (req,res)=>{
  const { department } = req.query;
    try {
        const subjects = await Subject.find({ department: department });
        res.json({subjects: subjects});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
})
app.get('/:adminId/getConfirmDeleteStudent',authMiddleware,adminMiddleware, async(req,res)=>{
  try{
    const {adminId} = req.params
    const {studentID} = req.query

    const foundStudent = await Student.findOne({studentID: studentID})

    if(!foundStudent){
      res.status(404).json({message:'there is an error'})
    }

    res.json({foundStudent:foundStudent})

  }catch(e){
    console.log(e.message)
  }
})

app.delete('/:adminId/deleteIndividualStudent',authMiddleware,adminMiddleware, async(req,res)=>{
const {adminId} = req.params

try{
  const {studentID} = req.query
  const foundStudent = await Student.findOne({studentID: studentID})
  await Student.findByIdAndDelete(foundStudent)

  res.redirect(`localhost:3100/${adminId}/admin`)

}catch(error){
  console.log('there is an error deleting individual student', error.message)
}
})

/* app.post('/:adminId/addIndividualStudent', async (req, res) => {
  try {
    const { adminId } = req.params;
    const { studentName, studentID, studentEmail, studentProgram, studentDepartment, studentYear, studentSubjects } = req.body;

    console.log(req.body)
    if (!studentSubjects || !Array.isArray(studentSubjects)) {
      throw new Error('Invalid or missing studentSubjects');
    }

    const subjectID = [];

    for (let i = 0; i < studentSubjects.length; i++) {
      let foundSub = await Subject.findOne({ code: studentSubjects[i] });
      if (foundSub) {
        subjectID.push(foundSub._id);
      } else {
        console.log(`Subject not found: ${studentSubjects[i]}`);
      }
    }


    const password = generatePassword.generate({
      length: 6,
      numbers: false,
      symbols: false,
      uppercase: true,
      lowercase: true
    });

    const newStudent = new Student({
      studentID: studentID,
      name: studentName,
      email: studentEmail,
      program: studentProgram,
      department: studentDepartment,
      yearLevel: studentYear,
      password: password,
      subjectsEnrolled: subjectID
    });

    await newStudent.save();

    res.status(200).json().redirect(`http://localhost:3100/${adminId}/admin`); // Add http:// in the URLs

  } catch (error) {
    console.log('There is an error creating individual student:', error.message);
    res.status(500).send('An error occurred');
  }
}); */
app.put('/:adminId/:studentId/updateIndividualStudent', authMiddleware, adminMiddleware, async (req,res)=>{
  const {adminId, studentId} = req.params
  try {
        const { studentName, studentID, studentEmail, studentProgram, studentDepartment, studentYear, studentSubjects } = req.body;


        const subjectID = [];
        for (let i = 0; i < studentSubjects.length; i++) {
        let foundSub = await Subject.findOne({ code: studentSubjects[i] });
        if (foundSub) {
          subjectID.push(foundSub._id);
        } else {
          console.log(`Subject not found: ${studentSubjects[i]}`);
        }
      }


        const updateStudent = await Student.findByIdAndUpdate(studentId, {
          studentID: studentID,
          name: studentName,
          email: studentEmail,
          program: studentProgram,
          department: studentDepartment,
          yearLevel: studentYear,
          subjectsEnrolled: subjectID
        })
        await updateStudent.save()

    res.status(200).json({ message: 'Student created successfully' });

  } catch (error) {
     console.log('There is an error creating individual student:', error.message);
    res.status(500).send({ error: 'An error occurred' });
  }
})

app.post('/:adminId/addIndividualStudent', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { adminId } = req.params;
    const { studentName, studentID, studentEmail, studentProgram, studentDepartment, studentYear, studentSubjects } = req.body;

    console.log(req.body);
    if (!studentSubjects || !Array.isArray(studentSubjects)) {
      throw new Error('Invalid or missing studentSubjects');
    }

    // Check if the student already exists
    const existingStudent = await Student.findOne({ $or: [{ studentID: studentID }, { email: studentEmail }] });

    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const subjectID = [];
    for (let i = 0; i < studentSubjects.length; i++) {
      let foundSub = await Subject.findOne({ code: studentSubjects[i] });
      if (foundSub) {
        subjectID.push(foundSub._id);
      } else {
        console.log(`Subject not found: ${studentSubjects[i]}`);
      }
    }

    const password = generatePassword.generate({
      length: 6,
      numbers: false,
      symbols: false,
      uppercase: true,
      lowercase: true
    });

    const newStudent = new Student({
      studentID: studentID,
      name: studentName,
      email: studentEmail,
      program: studentProgram,
      department: studentDepartment,
      yearLevel: studentYear,
      password: password,
      subjectsEnrolled: subjectID
    });

    await newStudent.save();

    res.status(200).json({ message: 'Student created successfully' });

  } catch (error) {
    console.log('There is an error creating individual student:', error.message);
    res.status(500).send({ error: 'An error occurred' });
  }
});

app.post('/:adminId/uploadTest', authMiddleware, adminMiddleware, async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const studentFile = req.files.studentFile;
  const workbook = xlsx.read(studentFile.data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  try {
    for (const row of rows) {
      const { studentId, name, department, year_level, program, enrolledSubs: subjectsString, email } = row;

      // Check if the student already exists
      const existingStudent = await Student.findOne({ $and: [{ studentID: studentId }, { email: email }] });

      if (existingStudent) {
        console.log(`Student already exists: ${name}`);
        continue; // Skip this student
      }

      // Check if subjectsString is defined and split it
      const subjectCodes = subjectsString ? subjectsString.split(', ') : [];

      // Map subject codes to ObjectIds
      const subjects = await Subject.find({ code: { $in: subjectCodes } }).select('_id');
      const subjectIds = subjects.map(subject => subject._id);

      // Generate a random password
      const password = generatePassword.generate({
        length: 6,
        numbers: false,
        symbols: false,
        uppercase: true,
        lowercase: true
      });

      const newStudent = new Student({
        studentID: studentId,
        name: name,
        department: department,
        yearLevel: year_level,
        program: program,
        subjectsEnrolled: subjectIds,
        password: password,
        email: email
      });

      await newStudent.save();
      console.log(`Saved student: ${name} with password: ${password}`);
    }
    res.send('Students imported successfully.');
  } catch (err) {
    console.error('Error importing students:', err);
    res.status(500).send('Error importing students.');
  }
});

/* app.post('/:adminId/addIndividualStudent',authMiddleware,adminMiddleware, async (req, res) => {
  try {
    const { adminId } = req.params;
    const { studentName, studentID, studentEmail, studentProgram, studentDepartment, studentYear, studentSubjects } = req.body;

    console.log(req.body);
    if (!studentSubjects || !Array.isArray(studentSubjects)) {
      throw new Error('Invalid or missing studentSubjects');
    }

    const subjectID = [];
    for (let i = 0; i < studentSubjects.length; i++) {
      let foundSub = await Subject.findOne({ code: studentSubjects[i] });
      if (foundSub) {
        subjectID.push(foundSub._id);
      } else {
        console.log(`Subject not found: ${studentSubjects[i]}`);
      }
    }

    const password = generatePassword.generate({
      length: 6,
      numbers: false,
      symbols: false,
      uppercase: true,
      lowercase: true
    });

    const newStudent = new Student({
      studentID: studentID,
      name: studentName,
      email: studentEmail,
      program: studentProgram,
      department: studentDepartment,
      yearLevel: studentYear,
      password: password,
      subjectsEnrolled: subjectID
    });

    await newStudent.save();

    res.status(200).json({ message: 'Student created successfully' });

  } catch (error) {
    console.log('There is an error creating individual student:', error.message);
    res.status(500).send({ error: 'An error occurred' });
  }
}); */

/* app.post('/:adminId/uploadTest',authMiddleware,adminMiddleware, async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const studentFile = req.files.studentFile;
  const workbook = xlsx.read(studentFile.data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  try {
    for (const row of rows) {
      const { studentId, name, department, year_level, program, enrolledSubs: subjectsString, email } = row;
      // Check if subjectsString is defined and split it
      const subjectCodes = subjectsString ? subjectsString.split(', ') : [];

      // Map subject codes to ObjectIds
      const subjects = await Subject.find({ code: { $in: subjectCodes } }).select('_id');
      const subjectIds = subjects.map(subject => subject._id);

      // Generate a random password
      const password = generatePassword.generate({
        length: 6,
        numbers: false,
        symbols: false,
        uppercase: true,
        lowercase: true
      });

      const newStudent = new Student({
        studentID: studentId,
        name: name,
        department: department,
        yearLevel: year_level,
        program: program,
        subjectsEnrolled: subjectIds,
        password: password,
        email: email
      });

      await newStudent.save();
      console.log(`Saved student: ${name} with password: ${password}`);
    }
    res.send('Students imported successfully.');
  } catch (err) {
    console.error('Error importing students:', err);
    res.status(500).send('Error importing students.');
  }
}); */

app.get('/:adminId/studentList',authMiddleware,adminMiddleware,async(req,res)=> {
  const {year, department, program} = req.query

const foundStudents = await Student.find({
    yearLevel: year,
    department: department,
    program: program
  });


  res.json({students: foundStudents})
})


app.get('/:adminId/subjectCodes',authMiddleware,adminMiddleware, async(req,res)=>{
  const {department} = req.query
  const allSubs = await Subject.find({department: department})
  res.json({allSubs: allSubs})
})

/* app.put('/:adminId/updateForm',authMiddleware,adminMiddleware, (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            res.status(500).send('Error uploading file');
            return;
        }

        const id = req.params.id;
        const updatedData = {
            firstname: fields.firstname[0],
            lastname: fields.lastname[0],
            age: parseInt(fields.age[0]), // Convert age to number
            address: fields.address[0],
            department: fields.department[0],
            fullname: `${fields.firstname[0]} ${fields.lastname[0]}`
        };

        if (files.image && files.image.length > 0 && files.image[0].size > 0) {
            const imageFile = files.image[0];
            const imagePath = imageFile.path;
            const newImagePath = './public/images/' + uuidv4() + path.extname(imageFile.originalFilename);
            const correctedPath = newImagePath.substring(8);

            try {
                fs.copyFileSync(imagePath, newImagePath);
                updatedData.imageURL = correctedPath;
            } catch (error) {
                console.error('Error copying file:', error);
                res.status(500).send('Error uploading file');
                return;
            }
        }

        try {
            const updatedInstructor = await Instructor.findByIdAndUpdate(id, updatedData, { new: true });
            res.send('Instructor updated successfully');
        } catch (error) {
            console.error('Error updating instructor:', error);
            res.status(500).send('Error updating instructor');
        }
    });
}); */


app.get('/:adminId/getTeacherSubjects', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const subjectIds = JSON.parse(req.query.subjectIds);
        const subjects = await Subject.find({ _id: { $in: subjectIds } });

        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).send('Error fetching subjects');
    }
});

app.get('/:admin/getFilteredSubjects',authMiddleware,adminMiddleware,async(req,res)=>{
  try{
    const{subjectDep, subjectYear, subjectProgram} = req.query
    const foundSubs = await Subject.find({department:subjectDep, year:subjectYear,program:subjectProgram})

    
    

    res.status(200).json({foundSubs: foundSubs})
  }catch(error){
    console.error('error fetching filtered subjects:', error)
    res.status(500).send('Error fetching available subjects');

  }

  
})

// Route to get available subjects by department
app.get('/:adminId/getAvailableSubjects', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const department = req.query.department;
        const availableSubjects = await Subject.find({ department })
        res.json(availableSubjects);
    } catch (error) {
        console.error('Error fetching available subjects:', error);
        res.status(500).send('Error fetching available subjects');
    }
});

// Route to update instructor information
app.post('/:adminId/:teacherID/updateForm', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { teacherID } = req.params;
        const { firstname, lastname, department, subjects } = req.body;
        const subjectCodes = JSON.parse(subjects);

        const instructor = await Instructor.findById(teacherID);
        if (!instructor) {
            return res.status(404).send('Instructor not found');
        }

        // Find subject IDs from subject codes
        const foundSubjects = await Subject.find({ code: { $in: subjectCodes } });
        const subjectIds = foundSubjects.map(subject => subject._id);

        instructor.firstname = firstname;
        instructor.lastname = lastname;
        instructor.department = department;
        instructor.subjects = subjectIds;

        await instructor.save();
        res.json({ message: 'Instructor updated successfully' });
    } catch (error) {
        console.error('Error updating instructor:', error);
        res.status(500).send('Error updating instructor');
    }
});

/* app.post('/addForm',authMiddleware,adminMiddleware,  (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, async(err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            res.status(500).send('Error uploading file');
            return;
        }

        // Extract form fields
        const firstname = fields.firstname[0];
        const lastname = fields.lastname[0];
        const department = fields.department[0];
        const subjectCodes = fields.subjectCodes[0]


        const separatedSubs = subjectCodes.split(',')
        const foundSubs = await Subject.find({code: {$in: separatedSubs}})
        const mappedSubs = foundSubs.map(subject => subject._id)

        const fullname = `${firstname} ${lastname}`;

        // Check if an image was uploaded
        if (files.image && files.image[0] && files.image[0].originalFilename) {
            const imageFile = files.image[0];
            const imagePath = imageFile.path;
            const newImagePath = './public/images/' + uuidv4() + path.extname(imageFile.originalFilename);
            const correctedPath = newImagePath.substring(8);

            // Copy the file to the desired location
            fs.copyFile(imagePath, newImagePath, (err) => {
                if (err) {
                    console.error('Error copying file:', err);
                    res.status(500).send('Error uploading file');
                    return;
                }

                // Save form data and file path to the database
                const newTeacher = new Instructor({
                    firstname: firstname,
                    lastname: lastname,
                    department: department,
                    fullname: fullname,
                    imageURL: correctedPath,
                    subjects: mappedSubs
                });

                newTeacher.save()
                    .then(() => {
                        res.send('File uploaded successfully');
                    })
                    .catch((error) => {
                        console.error('Error saving to database:', error);
                        res.status(500).send('Error saving to database');
                    });
            });
        } else {
            // No image uploaded, use default image path
            const newTeacher = new Instructor({
                firstname: firstname,
                lastname: lastname,
                department: department,
                fullname: fullname,
                imageURL: '/images/userLogo.png', // Default image path
                subjects: mappedSubs
            });

            newTeacher.save()
                .then(() => {
                    res.send('Instructor added successfully with default image');
                })
                .catch((error) => {
                    console.error('Error saving to database:', error);
                    res.status(500).send('Error saving to database');
                });
        }
    });
}); */
app.post('/:adminId/addForm', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { firstname, lastname, department, subjectCodes } = req.query;
    if (!subjectCodes) {
      throw new Error('subjectCodes is undefined');
    }


    const separatedSubs = subjectCodes.split(',');
    const uniqueSubs = [...new Set(separatedSubs)]; // Remove duplicates
    const foundSubs = await Subject.find({ code: { $in: uniqueSubs } });
    const mappedSubs = foundSubs.map(subject => subject._id);

    const fullname = `${firstname} ${lastname}`;

    // Save form data to the database
    const newTeacher = new Instructor({
      firstname: firstname,
      lastname: lastname,
      department: department,
      fullname: fullname,
      subjects: mappedSubs
    });

    await newTeacher.save();
    res.json('Instructor added successfully');
  } catch (error) {
    console.error('Error saving to database:', error);
    res.status(500).send('Error saving to database');
  }
});



app.delete('/:adminId/removeInstructor',authMiddleware,adminMiddleware, async (req, res) => {
    try {
        const fullName = req.body.fullName;

        // Find the teacher by full name
        const foundTeacher = await Instructor.findOne({ fullname: fullName });

        // Check if teacher is found
        if (!foundTeacher) {
            return res.status(404).send('Teacher not found');
        }

        // Delete the teacher by ID
        await Instructor.findByIdAndDelete(foundTeacher._id);

        res.sendStatus(200).json(); // Sending a success status code
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).send('Error deleting teacher');
    }
});

/* app.get('/:adminId/getTimeFrame', async (req, res) => {
    const { adminId } = req.params;

    try {
        const foundTimeFrame = await TimeFrame.findOne({});

        if (!foundTimeFrame) {
            // If no time frame is found, send a response and return immediately
            return res.status(404).json({ error: 'Time frame not found' });
        }

        // If a time frame is found, send the response
        res.status(200).json({ foundTimeFrame });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); */

app.get('/:adminId/findTeacher',authMiddleware,adminMiddleware,async(req,res)=> {
  const fullname = req.query.teacherName
  const foundTeacher = await Instructor.findOne({fullname: fullname})
  res.json({foundTeacher: foundTeacher})
})


app.get('/:adminId/cetDepartmentInstructors', authMiddleware,adminMiddleware,async (req, res) => {
  const allTeachers = await Instructor.find({ department: "CET" }).populate('subjects');
  res.json({ allTeachers: allTeachers });
});

app.get('/:adminId/cnhsDepartmentInstructors',authMiddleware,adminMiddleware, async(req,res)=> {
  const allTeachers = await Instructor.find({department:"CNHS"}).populate('subjects');
  res.json({allTeachers: allTeachers})
})

app.get('/:adminId/chmDepartmentInstructors', authMiddleware,adminMiddleware,async(req,res)=> {
  const allTeachers = await Instructor.find({department:"CHM"}).populate('subjects');
  res.json({allTeachers: allTeachers})
})

app.get('/:adminId/cbaDepartmentInstructors', authMiddleware,adminMiddleware,async(req,res)=> {
  const allTeachers = await Instructor.find({department:"CBA"}).populate('subjects');
  res.json({allTeachers: allTeachers})
})

app.get('/:adminId/ceaaDepartmentInstructors',authMiddleware,adminMiddleware, async(req,res)=> {
  const allTeachers = await Instructor.find({department:"CEAA"}).populate('subjects');
  res.json({allTeachers: allTeachers})
})
app.get('/:adminId/ccjeDepartmentInstructors',authMiddleware,adminMiddleware, async(req,res)=> {
  const allTeachers = await Instructor.find({department:"CCJE"}).populate('subjects');
  res.json({allTeachers: allTeachers})
})


app.get('/:adminId/adminInstructors',authMiddleware,adminMiddleware, async(req,res)=> {
    const {teacherName} = req.query
    const allTeachers = await Instructor.find({})
    res.json({allTeachers: allTeachers})
  })

app.get('/:adminId/admin', authMiddleware,adminMiddleware, (req, res) => {

  const{adminId} = req.params
  res.render('admin',{adminId})
})

////login ////login  ////login  ////login  ////login ////login ////login ////login ////login ////login 
app.post('/:id/setpassword', async (req, res) => {
  const { id } = req.params;
  const { password, confirmpassword } = req.body;

  if (password !== confirmpassword) {
    return res.status(400).send('Passwords do not match.');
  }

  try {
    const foundUser = await Student.findById(id) || await Admin.findById(id) || await Guidance.findById(id);

    if (!foundUser) {
      return res.status(404).send('User not found.');
    }

    foundUser.password = password;
    foundUser.hasChangedPassword = true;
    await foundUser.save();

    req.session.user = { id: foundUser._id, type: req.session.user.type };
    if (req.session.user.type === 'student') {
      res.redirect(`/${foundUser._id}/instructors`);
    } else if (req.session.user.type === 'admin') {
      res.redirect(`/${foundUser._id}/admin`);
    } else if (req.session.user.type === 'guidance') {
      res.redirect(`/${foundUser._id}/guidance`);
    }
  } catch (error) {
    console.error('Error setting password:', error);
    res.status(500).send('An error occurred.');
  }
});

app.get('/:id/setpassword', async (req, res) => {
  const { id } = req.params;

  try {
    const foundUser = await Student.findById(id) || await Admin.findById(id) || await Guidance.findById(id);
    
    if (!foundUser) {
      return res.status(404).send('User not found.');
    }

    res.render('setPassword', { foundAcc: foundUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('An error occurred.');
  }
});



/* app.post('/login', async (req, res) => {
  const { accountID, password } = req.body;

  try {
    let foundUser = null;
    let userType = '';

    if (accountID.startsWith('2')) {
      foundUser = await Student.findOne({ studentID: accountID });
      userType = 'student';
    } else if (accountID.startsWith('1')) {
      foundUser = await Admin.findOne({ adminID: accountID });
      userType = 'admin';
    } else if (accountID.startsWith('7')) {
      foundUser = await Guidance.findOne({ guidanceID: accountID });
      userType = 'guidance';
    }

    if (!foundUser || password !== foundUser.password) {
      return res.redirect('/login'); // Or send an error message
    }

    if (userType === 'student') {
      const timeFrame = await TimeFrame.findOne(); // Adjust the query to get the correct timeframe document

      if (timeFrame) {
        const currentDate = moment.tz('Asia/Manila');
        const startDate = moment.tz(timeFrame.startDate, 'Asia/Manila');
        const endDate = moment.tz(timeFrame.endDate, 'Asia/Manila');

        const [startHour, startMinute] = timeFrame.startTime.split(':').map(Number);
        const [endHour, endMinute] = timeFrame.endTime.split(':').map(Number);

        startDate.set({ hour: startHour, minute: startMinute });
        endDate.set({ hour: endHour, minute: endMinute });

        if (currentDate.isBefore(startDate) || currentDate.isAfter(endDate)) {
          return res.redirect('/login'); // Or send an error message
        }
      } else {
        return res.redirect('/login'); // Or send an error message if timeframe is not set
      }
    }

    req.session.user = {
      _id: foundUser._id,
      type: userType,
      studentID: foundUser.studentID // Save studentID in the session
    };

    if ((userType === 'admin' || userType === 'guidance') && !foundUser.hasChangedPassword) {
      return res.redirect(`/${foundUser._id}/setpassword`);
    }

    if (userType === 'student') {
      res.redirect(`/${foundUser.studentID}/instructors`);
    } else if (userType === 'admin') {
      res.redirect(`/${foundUser._id}/admin`);
    } else if (userType === 'guidance') {
      res.redirect(`/${foundUser._id}/guidance`);
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}); */

app.post('/login', async (req, res) => {
  const { accountID, password } = req.body;

  try {
    let foundUser = null;
    let userType = '';

    if (accountID.startsWith('2')) {
      foundUser = await Student.findOne({ studentID: accountID });
      userType = 'student';
    } else if (accountID.startsWith('1')) {
      foundUser = await Admin.findOne({ adminID: accountID });
      userType = 'admin';
    } else if (accountID.startsWith('7')) {
      foundUser = await Guidance.findOne({ guidanceID: accountID });
      userType = 'guidance';
    }

    if (!foundUser) {
      return res.redirect('/login'); // User not found
    }

    // Compare passwords (assuming passwords are hashed)


    if (userType === 'student') {
      // Fetch the latest active time frame
      const timeFrame = await TimeFrame.findOne({ isActive: true }).sort({ _id: -1 });

      if (timeFrame) {
        const currentDate = moment.tz('Asia/Manila');
        const startDate = moment.tz(timeFrame.startDate, 'Asia/Manila');
        const endDate = moment.tz(timeFrame.endDate, 'Asia/Manila');

        const [startHour, startMinute] = timeFrame.startTime.split(':').map(Number);
        const [endHour, endMinute] = timeFrame.endTime.split(':').map(Number);

        startDate.set({ hour: startHour, minute: startMinute });
        endDate.set({ hour: endHour, minute: endMinute });

        if (currentDate.isBefore(startDate) || currentDate.isAfter(endDate)) {
          return res.redirect('/login'); // Not within the timeframe
        }
      } else {
        return res.redirect('/login'); // No active timeframe available
      }
    }

    req.session.user = {
      _id: foundUser._id,
      type: userType,
      studentID: foundUser.studentID || null, // Save studentID in the session (if available)
    };

    if ((userType === 'admin' || userType === 'guidance') && !foundUser.hasChangedPassword) {
      return res.redirect(`/${foundUser._id}/setpassword`);
    }

    if (userType === 'student') {
      res.redirect(`/${foundUser.studentID}/instructors`);
    } else if (userType === 'admin') {
      res.redirect(`/${foundUser._id}/admin`);
    } else if (userType === 'guidance') {
      res.redirect(`/${foundUser._id}/guidance`);
    }

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});



/* app.post('/login', async (req, res) => {
  const { accountID, password } = req.body;

  try {
    let foundUser = null;
    let userType = '';

    if (accountID.startsWith('2')) {
      foundUser = await Student.findOne({ studentID: accountID });
      userType = 'student';
    } else if (accountID.startsWith('1')) {
      foundUser = await Admin.findOne({ adminID: accountID });
      userType = 'admin';
    } else if (accountID.startsWith('7')) {
      foundUser = await Guidance.findOne({ guidanceID: accountID });
      userType = 'guidance';
    }

    if (!foundUser || password !== foundUser.password) {
      return res.redirect('/login'); // Or send an error message
    }

    req.session.user = {
      _id: foundUser._id,
      type: userType,
      studentID: foundUser.studentID // Save studentID in the session
    };

    if ((userType === 'admin' || userType === 'guidance') && !foundUser.hasChangedPassword) {
      return res.redirect(`/${foundUser._id}/setpassword`);
    }

    if (userType === 'student') {
      res.redirect(`/${foundUser.studentID}/instructors`);
    } else if (userType === 'admin') {
      res.redirect(`/${foundUser._id}/admin`);
    } else if (userType === 'guidance') {
      res.redirect(`/${foundUser._id}/guidance`);
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}); */




app.get('/login', (req,res)=> {
    res.render('login')
})


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('An error occurred while logging out.');
    }
    res.redirect('/login');
  });
});

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/${req.session.user.id}/${req.session.user.type}`);
  } else {
    res.render('login');
  }
});



///server///server///server///server///server///server///server///server///server///server///server
app.listen(port, ()=> {
    console.log('app is now listening at port: ',port)
})


/* 
app.post('/:id/instructors/evaluate', (req, res) => {
   const { id } = req.params; // Extract parameters from URL
    const { teacherName } = req.body; // Extract form data
    for(let key in req.body){
      console.log(req.body[key])
      console.log(key)
      console.log(req.body)
    }


    // Send response
    res.send('Form data received');
}); */

/* app.post('/:id/instructors/:teachername', async(req,res)=> {
    const {id, teachername} = req.params
    const foundInstructor = await Instructor.findOne({name: teachername})
    
    for(let key in req.body){
      const newEval = new Evaluation(
            {IDstudent: id, IDinstructor: foundInstructor._id, IDquestions: key, answer: req.body[key] }
        )
        newEval.save()
        
          }
    const foundAcc = await Account.findOne({IDstudent: id})
    foundAcc.notYetVoted = false  
    res.send(req.body)
   

})
 */



/* app.get('/:id/instructors/:teachername', async(req,res)=> {
    const {teachername, id} = req.params
    const foundTeacher = await Instructor.findOne({name: teachername})
    const questions = await Question.find({})
    res.render('instructorDetails', {foundTeacher, questions,id})
})

 */


/* app.post('/:id/instructors/:teacherId/evaluate',async(req,res)=> {
  const {id, teacherId} = req.params
  for(let key in req.body){
    const trimmedKey = key.trim()
    const newEval = new Evaluation({IDstudent: id, IDquestions: trimmedKey, IDinstructor: teacherId, answer: req.body[key]})
    await newEval.save()
  }
  const foundStud = await Student.findById(id)
  const foundAcc = await Account.findOne({IDstudent: foundStud._id})

  foundAcc.notYetVoted = false
  await foundAcc.save()
  res.send(req.body)
}) */

/* app.get('/:id/instructors/:teacherId', async (req,res)=> {
  const {id, teacherId} = req.params
  const foundTeacher = await Instructor.findById(teacherId)
  const questions = await Question.find({})
  res.render('mobileQuestions', {id,teacherId,foundTeacher, questions })
}) */


/* 
app.get('/instructors', async (req, res) => {
    try {
        const name = req.query.name;
        const teacherNames = ['daniel', 'vincent', 'lloyd']
        const instructor = await Instructor.findOne({ name });
        if (!instructor) {
            res.status(404).json({ error: 'Instructor not found' });
            return;
        }
        res.json(instructor);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}); */

/* app.get('/:id/instructors', async(req,res)=> {
  const {id} = req.params
  const instructors = await Instructor.find({})
  res.render('mobileSelectInstructors', {instructors, id})
}) */



/* app.get('/:id/instructors', async(req,res)=> {
    const {id} = req.params
    const teachers = await Instructor.find({})
    res.render('selectInstructor', {teachers, id})
}) */
