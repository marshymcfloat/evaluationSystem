const teacherList = document.querySelectorAll('.teacherList');
const selectedTeacher = document.querySelector('#selectedTeacher');
const questionsContainer = document.querySelector('.questionsContainer')
const questionListContainer = document.querySelector('.questionListContainer')
const questionTextContainer = document.querySelector('.questionTextContainer')
const total1 = document.querySelector('#total1')
const total2 = document.querySelector('#total2')
const total3 = document.querySelector('#total3')
const total4 = document.querySelector('#total4')
const total5 = document.querySelector('#total5')



teacherList.forEach(teacher => {
    teacher.addEventListener('click', function() {
        const teacherName = teacher.innerText;
        const queryString = `?teacherName=${encodeURIComponent(teacherName)}`;
        fetch(`/facInstructors${queryString}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
    const { instructorData, textedQuestions, allQuestions, questionAnswers,totalAnswers } = data;
    selectedTeacher.innerText = instructorData.name;
    
    for (let i = 0; i < allQuestions.length; i++) {
        const question = allQuestions[i];
        const answers = questionAnswers[i];
        const questionListContainer = document.createElement('div');
        questionListContainer.classList.add('questionListContainer');

        const questionTextContainer = document.createElement('div');
        questionTextContainer.classList.add('questionTextContainer');
        const li = document.createElement('li');
        li.innerText = `${question.text}`;
        questionTextContainer.appendChild(li);

        const questionListScores = document.createElement('div');
        questionListScores.classList.add('questionListScores');

        for (let j = 0; j < answers.length; j++) {
            const answer = answers[j];
            const spanId = `span${j + 1}`; // Calculate ID for the span
            const questionsSpan = document.createElement('span');
            questionsSpan.id = spanId;
            questionsSpan.innerHTML = answer;
            questionListScores.appendChild(questionsSpan);
        }

 
        questionListContainer.appendChild(questionTextContainer);
        questionListContainer.appendChild(questionListScores);
        questionsContainer.appendChild(questionListContainer);
        total1.innerHTML = totalAnswers[0]
        total2.innerHTML = totalAnswers[1]
        total3.innerHTML = totalAnswers[2]
        total4.innerHTML = totalAnswers[3]
        total5.innerHTML = totalAnswers[4]


    }
})

            .catch(error => {
                console.error('Error fetching data:', error);
            });
            questionsContainer.innerHTML = ""
    });
});
