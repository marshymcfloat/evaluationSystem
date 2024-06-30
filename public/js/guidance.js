const settingsContainerSelect = document.querySelector('.departmentSelectContainer select')
const settingsContainerElement = document.querySelector('.settingsContainer')
const contentsContainer = document.querySelector('.contentsContainer')
const teachersSelectContainer = document.querySelector('.teachersSelectContainer')


settingsContainerSelect.addEventListener('change', ()=> {
    teachersSelectContainer.innerHTML = ''
    const teachersSelectContainerLabel = document.createElement('label')
    teachersSelectContainerLabel.innerHTML = 'Instructors: '

    const teachersSelectContainerSelect = document.createElement('select')
    teachersSelectContainerLabel.name = 'instructors'

    teachersSelectContainer.appendChild(teachersSelectContainerLabel)
    teachersSelectContainer.appendChild(teachersSelectContainerSelect)
    settingsContainerElement.appendChild(teachersSelectContainer)

    let departmentSelectValue = settingsContainerSelect.value
    const queryString = `/guidanceGetTeacher?department=${encodeURIComponent(departmentSelectValue)}`
    fetch(queryString).then((response)=>{
        if(!response.ok){
            throw new Error('There is an error getting teachers in guidance')
        }
        return response.json()
    }).then((data)=> {
            const teachersSelectContainerElement = document.querySelector('.teachersSelectContainer select')
            teachersSelectContainerElement.innerHTML = ''

            const teachersSelectContainerDefault = document.createElement('option')
            teachersSelectContainerDefault.value = ''
            teachersSelectContainerDefault.innerHTML = 'SELECT TEACHER'
            teachersSelectContainerElement.appendChild(teachersSelectContainerDefault)

            data.teachers.forEach(teacher => {
                const teachersSelectContainerSelectOption = document.createElement('option')
                teachersSelectContainerSelectOption.value = `${teacher.fullname}`
                teachersSelectContainerSelectOption.innerHTML = `${teacher.fullname}`
                teachersSelectContainerElement.appendChild(teachersSelectContainerSelectOption)
            });


            teachersSelectContainerElement.addEventListener('change',()=>{

                const queryString = `/guidance/getTeacherSubjects?teacher=${encodeURIComponent(teachersSelectContainerElement.value)}`
                console.log(queryString)
                fetch(queryString).then((response)=> {
                    if(!response.ok){
                        throw new Error('there is an error in fetching guidance teacher subjects')
                    }
                    return response.json()
                }).then((data)=>{
                    
                    contentsContainer.innerHTML = ''

                    data.subjects.forEach(subject=>{
                        const eachEvaluation = document.createElement('div')
                        eachEvaluation.classList.add('eachEvaluation')

                        const eachEvaluationSpan = document.createElement('span')
                        eachEvaluationSpan.innerHTML = `${subject.code}`
                        eachEvaluation.appendChild(eachEvaluationSpan)

                        const eachEvaluationButton = document.createElement('button')
                        eachEvaluationButton.innerHTML = `Download`
                        eachEvaluation.appendChild(eachEvaluationButton)

                        contentsContainer.appendChild(eachEvaluation)
                    })

                    const eachEvaluationElements = document.querySelectorAll('.eachEvaluation')

  eachEvaluationElements.forEach(eval => {
    eval.addEventListener('click', () => {
        const teachersSelectContainerElement2 = document.querySelector('.teachersSelectContainer select');
        const evaluateSubject = eval.firstChild.innerHTML;
        console.log(evaluateSubject);

        const queryString = `/getCalculatedEvaluation?teacherName=${encodeURIComponent(teachersSelectContainerElement2.value)}&subject=${encodeURIComponent(evaluateSubject)}`;
        fetch(queryString).then((response) => {
            if (!response.ok) {
                throw new Error('There is an error fetching calculated evaluations');
            }
            return response.json();
        }).then((data) => {
            console.log(data);
            // Navigate to a new page or update the DOM with the received data
            const renderQueryString = `/renderCalculatedEvaluation?teacherName=${encodeURIComponent(teachersSelectContainerElement2.value)}&subject=${encodeURIComponent(evaluateSubject)}&evaluation=${encodeURIComponent(JSON.stringify(data))}`;
            window.location.href = renderQueryString;
        }).catch((e) => {
            console.log(e.message);
        });
    });
});




                }).catch((e)=>{
                    console.log('there is an error saying: ', e.message)
                })
            })


        
    }).catch((e)=>{
        console.log(`there is an error saying: ${e.message}`)
    })
})