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

app.use(fileUpload());
app.use(helmet())
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))


app.delete('/:adminId/deleteTimeFrame', (req, res) => {
    TimeFrame.deleteMany({})
        .then(() => {
            res.sendStatus(204); // Use sendStatus to send a proper 204 response
        })
        .catch((err) => {
            res.status(500).json({ error: 'Error deleting time frames.' });
        });
});

/*  */
  /*   */
const scheduleJob = async () => {
    try {
        const allTeachers = await Instructor.find({});
        const timeFrame = await TimeFrame.findOne({})
        const evaluationsByTeacherAndSubject = {};
        const currentTimeFrame = `${timeFrame.acadYearStart}-${timeFrame.acadYearEnd}`
        const currentSemester = timeFrame.semester
        const categories = [
            'course overview and orientation',
            'learning outcomes',
            'assessment',
            'instructional material/content',
            'teacher presence and support',
            'learning experiences and interaction',
            'technology and accessibility'
        ];

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
    } catch (error) {
        console.error('Error fetching evaluations:', error);
    }
};






app.post('/:adminId/setTimeFrame', async (req, res) => {
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
});






app.delete('/:adminId/deleteQuestion', async (req, res) => {
    const { questionText } = req.query;
    
    await Question.deleteOne({ text: questionText });

    res.json({ message: 'successful' });
});


app.post('/:adminId/addQuestion', (req,res)=>{
  const {questionText, addQuestionCategory} = req.body

  console.log(questionText, addQuestionCategory)

  const newQuestion = new Question(
    {questionCategory: addQuestionCategory, text: questionText }
  )
  newQuestion.save()

  res.redirect('http://localhost:3100/test')

})



app.get('/:adminId/getQuestions', async(req,res)=>{
  const {questionCategory} = req.query
  const{id} = req.params

  const foundQuestions = await Question.find({questionCategory: questionCategory})

  res.json({foundQuestions:foundQuestions})  

})

app.delete('/toBeDeleteStudents', async (req, res) => {
    const { year, department, program } = req.query;

    try {
        const result = await Student.deleteMany({ yearLevel: year, department: department, program: program });
        res.status(200).json({ message: 'Students successfully deleted', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error deleting students:', error);
        res.status(500).json({ message: 'Failed to delete students', error: error.message });
    }
});


app.get('/uploadTest', (req, res) => {
  res.render('testUpload');
});

app.post('/uploadTest', async (req, res) => {
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
      const { studentId, name, department, year_level, program, enrolledSubs: subjectsString } = row;
      
      // Check if subjectsString is defined and split it
      const subjectCodes = subjectsString ? subjectsString.split(', ') : [];

      // Map subject codes to ObjectIds
      const subjects = await Subject.find({ code: { $in: subjectCodes } }).select('_id');
      const subjectIds = subjects.map(subject => subject._id);

    

      const newStudent = new Student({
        studentID: studentId,
        name: name,
        department: department,
        yearLevel: year_level,
        program: program,
        subjectsEnrolled: subjectIds
      })

      await newStudent.save();
      console.log(`Saved student: ${name}`);
    }
    res.send('Students imported successfully.');
  } catch (err) {
    console.error('Error importing students:', err);
    res.status(500).send('Error importing students.');
  }
});



app.get('/studentList',async(req,res)=> {
  const {year, department, program} = req.query

const foundStudents = await Student.find({
    yearLevel: year,
    department: department,
    program: program
  });


  res.json({students: foundStudents})
})


app.get('/subjectCodes', async(req,res)=>{
  const {department} = req.query
  console.log(department)
  const allSubs = await Subject.find({department: department})
  res.json({allSubs: allSubs})
})






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


app.put('/:id/updateForm', (req, res) => {
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
});




app.post('/addForm',  (req, res) => {
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
});


app.delete('/removeInstructor', async (req, res) => {
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

        res.sendStatus(200); // Sending a success status code
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).send('Error deleting teacher');
    }
});




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





app.get('/getCalculatedEvaluation', async (req, res) => {
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
});

app.get('/renderCalculatedEvaluation', async (req, res) => {


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
});


app.get('/guidance/getTeacherSubjects', async (req, res) => {
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
});


app.get('/guidanceGetTeacher',async(req,res)=>{
  const {department} = req.query
  const foundTeachers = await Instructor.find({department:department})
  
  res.json({teachers: foundTeachers})
})


app.get('/:guidanceID/guidance',async(req,res)=> {
  
  const{guidanceID} = req.query
  const foundGuidance = await Guidance.findOne({
    guidanceID:guidanceID})
  res.render('guidance')
})
  



app.get('/:id/faculty/instructors', async(req,res)=> {
    const foundInstruct = await Instructor.find({})
    res.render('showEval', {foundInstruct})
})


app.get('/facInstructors', async (req, res) => {
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



app.get('/findTeacher',async(req,res)=> {
  const fullname = req.query.teacherName
  const foundTeacher = await Instructor.findOne({fullname: fullname})
  res.json({foundTeacher: foundTeacher})
})


app.get('/cetDepartmentInstructors', async (req, res) => {
  const allTeachers = await Instructor.find({ department: "CET" }).populate('subjects');
  res.json({ allTeachers: allTeachers });
});

app.get('/cnhsDepartmentInstructors', async(req,res)=> {
  const allTeachers = await Instructor.find({department:"CNHS"})
  res.json({allTeachers: allTeachers})
})

app.get('/chmDepartmentInstructors', async(req,res)=> {
  const allTeachers = await Instructor.find({department:"CHM"})
  res.json({allTeachers: allTeachers})
})

app.get('/cbaDepartmentInstructors', async(req,res)=> {
  const allTeachers = await Instructor.find({department:"CBA"})
  res.json({allTeachers: allTeachers})
})

app.get('/ceaaDepartmentInstructors', async(req,res)=> {
  const allTeachers = await Instructor.find({department:"CEAA"})
  res.json({allTeachers: allTeachers})
})
app.get('/ccjeDepartmentInstructors', async(req,res)=> {
  const allTeachers = await Instructor.find({department:"CCJE"})
  res.json({allTeachers: allTeachers})
})

app.get('/questions', async(req,res)=> {
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




app.post('/:studentID/instructors/:teacherID/:subjectcode/evaluate', async (req, res) => {
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
});



app.get('/:studentID/instructors/:teacherID/:subjectcode/evaluate', async(req,res)=> {
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



app.get('/:studentID/instructors', async (req, res) => {
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
});





app.get('/error', (req,res)=> {
    res.render('error')
})
app.post('/:id/setpassword', async (req, res) => {
  const { password, confirmpassword } = req.body;
  const { id } = req.params;

  try {
    if (password === confirmpassword) {
      const determineRole = async () => {
        const foundStud = await Student.findById(id);
        const foundFac = await Faculty.findById(id);
        
        if (foundStud !== null) {
          return foundStud;
        } else {
          return foundFac;
        }
      };

      const foundRole = await determineRole();
      console.log(foundRole)
      if (foundRole !== null) {
        // Check if it's a Student
        if (foundRole instanceof Student) {
          const newAcc = new Account({
            password: password,
            IDstudent: foundRole._id,
          });

          await newAcc.save();
          foundRole.hasNoAccount = false;
          await foundRole.save();
        }
        // Check if it's a Faculty
        else if (foundRole instanceof Faculty) {
          const newAcc = new Account({
            password: password,
            IDfaculty: foundRole._id,
          });

          await newAcc.save();
          foundRole.hasNoAccount = false;
          await foundRole.save();
        }

        res.redirect(`/${id}/instructors`);
      } else {
        // Handle the case where neither Student nor Faculty is found
        res.render('error', { error: 'User not found' });
      }
    }
  } catch (error) {
    console.log(error);
    res.render('error', { error });
  }
});





app.get('/adminInstructors', async(req,res)=> {
    const {teacherName} = req.query
    const allTeachers = await Instructor.find({})
    res.json({allTeachers: allTeachers})
  })

app.get('/:id/admin', (req,res)=> {

  const{id} = req.params
  res.render('admin',{id})
})

app.get('/:id/setpassword', async(req,res)=>{
    const{id} = req.params
    const selectWhatAcc = async() => {
        const foundStud = await Student.findById(id)
        const foundFac = await Faculty.findById(id)
        if(foundStud !== null){
            return foundStud
        }else{
            return foundFac
        }
    }
    const foundAcc = await selectWhatAcc()
    res.render('setPassword', {foundAcc})
})


app.post('/login', async(req,res)=> {
     const { studentId, password } = req.body;

  try {
    if (studentId === "") {
      res.redirect('/error');
    } else {    
      const foundStudent = await Student.findOne({ studentID: studentId });
      const foundAcc = foundStudent ? await Account.findOne({ IDstudent: foundStudent._id }) : null;

      if (foundStudent && foundStudent.studentID == studentId && password === "" && foundStudent.hasNoAccount === true) {
        res.redirect(`/${foundStudent._id}/setpassword`);
      } else if (foundStudent && foundStudent.studentID == studentId && password === foundAcc?.password && foundStudent.hasNoAccount === false) {
        res.redirect(`/${foundStudent._id}/instructors`);

        /******************************************************FACULTY*********************************************************/
      } else if (await Faculty.findOne({ facultyID: studentId })) {
            const foundFaculty = await Faculty.findOne({facultyID: studentId})
            const foundAcc = await Account.findOne({IDfaculty: foundFaculty._id})
        if(foundFaculty.hasNoAccount === true ){
            res.redirect(`/${foundFaculty._id}/setpassword`)
        }else if(foundFaculty.hasNoAccount === false && foundAcc.password === password){
            res.redirect(`/${foundFaculty._id}/faculty/instructors`)
        }
      }
    }
}catch(error){ 
    console.log(error)
    res.render('error', error)
}


})



app.get('/login', (req,res)=> {
    res.render('login')
})


app.get('/',(req,res)=> {
    res.redirect('/login')
})


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
