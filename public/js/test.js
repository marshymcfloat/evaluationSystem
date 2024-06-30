const questionSelectElement = document.querySelector('#questionCategory')
const innerLowerPart = document.querySelector('.innerQuestionLowerPart')

const questionAddBtn = document.querySelector('.questionAddBtn')
questionAddBtn.addEventListener('click',()=>{
    const addQuestionModal = document.createElement('div')
    addQuestionModal.classList.add('addQuestionModal')

    const modalBackground = document.createElement('div')
    modalBackground.classList.add('modalBackground')

    const addQuestionBody = document.createElement('div')
    addQuestionBody.classList.add('addQuestionBody')

    const addQuestionTopContainer = document.createElement('div')
    addQuestionTopContainer.classList.add('addQuestionTopContainer')

    const addQuestionexitButtonContainer = document.createElement('div')
    addQuestionexitButtonContainer.classList.add('addQuestionexitButtonContainer')
    addQuestionexitButtonContainer.innerHTML = '+'
    addQuestionexitButtonContainer.onclick = () =>{
        const addQuestionModal = document.querySelector('.addQuestionModal')

        addQuestionModal.remove()
    }

    addQuestionTopContainer.appendChild(addQuestionexitButtonContainer)

    const addQuestionBottomContainer = document.createElement('div')
    addQuestionBottomContainer.classList.add('addQuestionBottomContainer')

    const AddQuestionForm = document.createElement('form')
    AddQuestionForm.action = '/addQuestion'
    AddQuestionForm.method = 'POST'

    const addQuestionCategoryContainer = document.createElement('div')
    addQuestionCategoryContainer.classList.add('addQuestionCategoryContainer')

    const addQuestionCategoryLabel = document.createElement('label')
    addQuestionCategoryLabel.for = 'addQuestionCategory'
    addQuestionCategoryLabel.innerHTML = 'Question Category: '

    const addQuestionCategorySelect = document.createElement('select')
    addQuestionCategorySelect.name = 'addQuestionCategory'
    addQuestionCategorySelect.id = 'addQuestionCategory'

/*     const questionOption1 = document.createElement('option')
    questionOption1.value = ''
    questionOption1.innerHTML = 'SELECT QUESTION CATEGORY'
    addQuestionCategorySelect.appendChild(questionOption1) */

    const questionOption2 = document.createElement('option')
    questionOption2.value = 'course overview and orientation'
    questionOption2.innerHTML = 'COURSE OVERVIEW ORIENTATION'
    addQuestionCategorySelect.appendChild(questionOption2)

    const questionOption3 = document.createElement('option')
    questionOption3.value = 'learning outcomes'
    questionOption3.innerHTML = 'LEARNING OUTCOMES'
    addQuestionCategorySelect.appendChild(questionOption3)

    const questionOption4 = document.createElement('option')
    questionOption4.value = 'assessment'
    questionOption4.innerHTML = 'ASSESSMENT'
    addQuestionCategorySelect.appendChild(questionOption4)

    const questionOption5 = document.createElement('option')
    questionOption5.value = "instructional material/content"
    questionOption5.innerHTML = 'INSTRUCTIONAL MATERIAL/CONTENT'
    addQuestionCategorySelect.appendChild(questionOption5)

    const questionOption6 = document.createElement('option')
    questionOption6.value = 'teacher presence and support'
    questionOption6.innerHTML = 'TEACHER PRESENCE AND SUPPORT'
    addQuestionCategorySelect.appendChild(questionOption6)

    const questionOption7 = document.createElement('option')
    questionOption7.value = 'learning experiences and interaction'
    questionOption7.innerHTML = 'LEARNING EXPERIENCES AND INTERACTION'
    addQuestionCategorySelect.appendChild(questionOption7)
    
     const questionOption8 = document.createElement('option')
    questionOption8.value = 'technology and accessibility'
    questionOption8.innerHTML = 'TECHNOLOGY AND ACCESSIBILITY'
    addQuestionCategorySelect.appendChild(questionOption8)

    const addQuestionTextContainer = document.createElement('div')
    addQuestionTextContainer.classList.add('addQuestionTextContainer')

    const addQuestionTextLabel = document.createElement('label')
    addQuestionTextLabel.for = 'addQuestionText'
    addQuestionTextLabel.innerHTML = 'Question: '

    const addQuestionTextInput = document.createElement('input')
    addQuestionTextInput.name = 'questionText'
    addQuestionTextInput.placeholder = 'Please type the question here.'
    addQuestionTextInput.type = 'text'

    const addQuestionButtonContainer = document.createElement('div')
    addQuestionButtonContainer.classList.add('addQuestionButtonContainer')

    const addQuestionButtonContainerButton = document.createElement('button')
    addQuestionButtonContainerButton.innerHTML = 'Save'
    addQuestionButtonContainer.appendChild(addQuestionButtonContainerButton)


    addQuestionCategoryContainer.appendChild(addQuestionCategoryLabel)
    addQuestionCategoryContainer.appendChild(addQuestionCategorySelect)


    addQuestionTextContainer.appendChild(addQuestionTextLabel)
    addQuestionTextContainer.appendChild(addQuestionTextInput)
    addQuestionTextContainer.appendChild(addQuestionButtonContainer)

    AddQuestionForm.appendChild(addQuestionCategoryContainer)
    AddQuestionForm.appendChild(addQuestionTextContainer)

    addQuestionBottomContainer.appendChild(AddQuestionForm)

    addQuestionBody.appendChild(addQuestionTopContainer)
    addQuestionBody.appendChild(addQuestionBottomContainer)

    addQuestionModal.appendChild(modalBackground)
    addQuestionModal.appendChild(addQuestionBody)

    const body = document.querySelector('body')
    body.appendChild(addQuestionModal)



})




function fetchAndRenderQuestions(category) {
    innerLowerPart.innerHTML = '';
    const queryString = `/getQuestions?questionCategory=${encodeURIComponent(category)}`;
    
    fetch(queryString).then((response) => {
        if (!response.ok) {
            throw new Error('There is an error fetching questions');
        }
        return response.json();
    }).then((data) => {
        let counter = 1;
        data.foundQuestions.forEach(question => {
            const eachQuestion = document.createElement('div');
            eachQuestion.classList.add('eachQuestion');

            const questionTextContainer = document.createElement('div');
            questionTextContainer.classList.add('questionTextContainer');

            const questionTextContainerSpan = document.createElement('span');
            questionTextContainerSpan.innerHTML = `${counter}. ${question.text}`;

            const questionButtonContainer = document.createElement('div');
            questionButtonContainer.classList.add('questionButtonContainer');
            questionButtonContainer.id = `${question.text}`;

            const questionButtonContainerSpan = document.createElement('span');
            questionButtonContainerSpan.innerHTML = '-';

            questionButtonContainer.appendChild(questionButtonContainerSpan);
            questionTextContainer.appendChild(questionTextContainerSpan);
            eachQuestion.appendChild(questionTextContainer);
            eachQuestion.appendChild(questionButtonContainer);
            innerLowerPart.appendChild(eachQuestion);
            counter++;
        });

        addRemoveQuestionEventListeners();
    }).catch((e) => {
        console.log(e.message);
    });
}

function addRemoveQuestionEventListeners() {
    const questionButtonContainerElement = document.querySelectorAll('.questionButtonContainer');
    questionButtonContainerElement.forEach((element) => {
        element.addEventListener('click', () => {
            const removeQuestionModal = document.createElement('div');
            removeQuestionModal.classList.add('removeQuestionModal');

            const modalBackground = document.createElement('div');
            modalBackground.classList.add('modalBackground');

            const removeQuestionBody = document.createElement('div');
            removeQuestionBody.classList.add('removeQuestionBody');

            const removeQuestionTopContainer = document.createElement('div');
            removeQuestionTopContainer.classList.add('removeQuestionTopContainer');

            const removeQuestionexitButtonContainer = document.createElement('div');
            removeQuestionexitButtonContainer.classList.add('removeQuestionexitButtonContainer');
            removeQuestionexitButtonContainer.innerHTML = '+';
            removeQuestionexitButtonContainer.onclick = () => {
                const removeQuestionModalElement = document.querySelector('.removeQuestionModal');
                removeQuestionModalElement.remove();
            };
            removeQuestionTopContainer.appendChild(removeQuestionexitButtonContainer);

            const removeQuestionBottomContainer = document.createElement('div');
            removeQuestionBottomContainer.classList.add('removeQuestionBottomContainer');

            const removeQuestionTextContainer = document.createElement('div');
            removeQuestionTextContainer.classList.add('removeQuestionTextContainer');
            removeQuestionTextContainer.innerHTML = 'Are you sure you want to remove this question?';

            const removeQuestionButtonContainer = document.createElement('div');
            removeQuestionButtonContainer.classList.add('removeQuestionButtonContainer');

            const removeQuestionButtonNo = document.createElement('button');
            removeQuestionButtonNo.innerHTML = 'No';
            removeQuestionButtonNo.onclick = () => {
                const removeQuestionModalElement = document.querySelector('.removeQuestionModal');
                removeQuestionModalElement.remove();
            };

            const removeQuestionButtonYes = document.createElement('button');
            removeQuestionButtonYes.innerHTML = 'Yes';
            removeQuestionButtonYes.classList.add('removeQuestionButtonYes');
            removeQuestionButtonYes.id = `${element.id}`;

            removeQuestionButtonContainer.appendChild(removeQuestionButtonNo);
            removeQuestionButtonContainer.appendChild(removeQuestionButtonYes);

            removeQuestionBottomContainer.appendChild(removeQuestionTextContainer);
            removeQuestionBottomContainer.appendChild(removeQuestionButtonContainer);

            removeQuestionBody.appendChild(removeQuestionTopContainer);
            removeQuestionBody.appendChild(removeQuestionBottomContainer);

            removeQuestionModal.appendChild(modalBackground);
            removeQuestionModal.appendChild(removeQuestionBody);

            const body = document.querySelector('body');
            body.appendChild(removeQuestionModal);

            const removeQuestionButtonYesElement = document.querySelector('.removeQuestionButtonYes');
            removeQuestionButtonYesElement.addEventListener('click', () => {
                const selectedCategory = document.querySelector('select[name="questionCategory"]').value;
                const queryString = `/deleteQuestion?questionText=${encodeURIComponent(removeQuestionButtonYesElement.id)}&category=${encodeURIComponent(selectedCategory)}`;

                fetch(queryString, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    if (!response.ok) {
                        throw new Error('There is an error deleting the question.');
                    }
                    return response.json();
                }).then((data) => {
                    console.log(data.message);
                    window.location.href = `http://localhost:3100/test?category=${encodeURIComponent(selectedCategory)}`;
                }).catch((e) => {
                    console.log(e.message);
                });
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category) {
        questionSelectElement.value = category;
        fetchAndRenderQuestions(category);
    }
});

questionSelectElement.addEventListener('change', () => {
    fetchAndRenderQuestions(questionSelectElement.value);
});




/* const departmentSelect = document.querySelector('#department')

departmentSelect.addEventListener('change',()=>{
    const programSelect = document.querySelector('#program')

    if(departmentSelect.value === 'CET'){
        programSelect.innerHTML = ''
        const option1 = document.createElement('option')
        option1.value = 'BSIT'
        option1.innerHTML = 'BSIT'
        programSelect.appendChild(option1)

        const option2 = document.createElement('option')
        option2.value = 'BSCPE'
        option2.innerHTML = 'BSCPE'
        programSelect.appendChild(option2)

        const option3 = document.createElement('option')
        option3.value = 'BSCE'
        option3.innerHTML = 'BSCE'
        programSelect.appendChild(option3)

        const option4 = document.createElement('option')
        option4.value = 'BSGE'
        option4.innerHTML = 'BSGE'
        programSelect.appendChild(option4)


    }else if(departmentSelect.value === 'CBA'){
        programSelect.innerHTML = ''

        const option1 = document.createElement('option')
        option1.value = 'BSA'
        option1.innerHTML = 'BSA'
        programSelect.appendChild(option1)

         const option2 = document.createElement('option')
        option2.value = 'BSBA'
        option2.innerHTML = 'BSBA'
        programSelect.appendChild(option2)

    }else if(departmentSelect.value === 'CCJE'){
        programSelect.innerHTML = ''

        const option1 = document.createElement('option')
        option1.value = 'BSCrim'
        option1.innerHTML = 'BSCrim'
        programSelect.appendChild(option1)

        
    }
    else if(departmentSelect.value === 'CNHS'){
        programSelect.innerHTML = ''

        const option1 = document.createElement('option')
        option1.value = 'BSN'
        option1.innerHTML = 'BSN'
        programSelect.appendChild(option1)

        const option2 = document.createElement('option')
        option2.value = 'BSBio'
        option2.innerHTML = 'BSBio'
        programSelect.appendChild(option2)

    }else if(departmentSelect.value === 'CHM'){
        programSelect.innerHTML = ''

        const option1 = document.createElement('option')
        option1.value = 'BSHM'
        option1.innerHTML = 'BSHM'
        programSelect.appendChild(option1)

        
    }
    else if(departmentSelect.value === 'CEAA'){
        programSelect.innerHTML = ''

        const option1 = document.createElement('option')
        option1.value = 'BAPolSci'
        option1.innerHTML = 'BAPolSci'
        programSelect.appendChild(option1)

        const option2 = document.createElement('option')
        option2.value = 'BEEd'
        option2.innerHTML = 'BEEd'
        programSelect.appendChild(option2)

        const option3 = document.createElement('option')
        option3.value = 'BSEd'
        option3.innerHTML = 'BSCE'
        programSelect.appendChild(option3)

    }

        
})

const innerFilterOptionContainer = document.querySelectorAll('.innerFilterOptionContainer select')

innerFilterOptionContainer.forEach((select)=> {
    select.addEventListener('change', ()=> {

        const departmentSelect2 = document.querySelector('#department')
        const programSelect = document.querySelector('#program')
        const yearSelect= document.querySelector('#year')
        
        const queryString = `/studentList?year=${encodeURIComponent(yearSelect.value)}&department=${encodeURIComponent(departmentSelect2.value)}&program=${encodeURIComponent(programSelect.value)}`
        fetch(queryString).then((response)=> {
            if(!response.ok){
                throw new Error('error network in studentList')
            }
            return response.json()
        }).then((data)=> {
            const innerstudentListContainer = document.querySelector('.innerstudentListContainer')
            innerstudentListContainer.innerHTML = ''
            const {students} = data

            students.forEach(student => {
                const eachStudent = document.createElement('div')
                eachStudent.classList.add('eachStudent')

                const nameSpan = document.createElement('span')
                nameSpan.innerHTML = student.name
                nameSpan.id = `name`

                eachStudent.appendChild(nameSpan)

                const depSpan = document.createElement('span')
                 depSpan.innerHTML = student.department
                eachStudent.appendChild(depSpan)

                const yearSpan = document.createElement('span')
                 yearSpan.innerHTML = student.yearLevel
                eachStudent.appendChild(yearSpan)

                const programSpan = document.createElement('span')
                 programSpan.innerHTML = student.program
                eachStudent.appendChild(programSpan)

                innerstudentListContainer.appendChild(eachStudent)
            });

        }).catch((e)=> {
            console.log(`there is an error saying: ${e}`)
        })

    })
})

let departmentValue = ''
let programValue = ''
let yearValue = ''

innerFilterOptionContainer.forEach((select)=>{
    select.addEventListener('change',()=>{
        const departmentSelect2 = document.querySelector('#department')
        const programSelect = document.querySelector('#program')
        const yearSelect= document.querySelector('#year')

        departmentValue = departmentSelect2.value
        programValue = programSelect.value
        yearValue = yearSelect.value
    })
})






const removeButton = document.querySelector('#removeStudents')
removeButton.addEventListener('click',()=> {
    
    const body = document.querySelector('body')

    const confirmModal = document.createElement('div')
    confirmModal.classList.add('confirmModal')

    const modalBackground = document.createElement('div')
    modalBackground.classList.add('modalBackground')

    const confirmModalBody = document.createElement('div')
    confirmModalBody.classList.add('confirmModalBody')

    const topContainer = document.createElement('div')
    topContainer.classList.add('topContainer')

    const exitButtonContainer = document.createElement('div')
    exitButtonContainer.classList.add('exitButtonContainer')
    exitButtonContainer.innerHTML = '+'
    exitButtonContainer.onclick = function() {
  removeModal();
};
    topContainer.appendChild(exitButtonContainer)

    const bottomContainer = document.createElement('div')
    bottomContainer.classList.add('bottomContainer')

    const textContainer = document.createElement('div')
    textContainer.classList.add('textContainer')
    textContainer.innerHTML = 'Do you want to remove all students?'
    bottomContainer.appendChild(textContainer)

    const buttonsContainer = document.createElement('div')
    buttonsContainer.classList.add('buttonsContainer')

    const buttonNo = document.createElement('button')
    buttonNo.innerHTML = 'No'
    buttonNo.classList.add('buttonNo')
    buttonNo.onclick = function() {
  removeModal();
};
    buttonsContainer.appendChild(buttonNo)

    const buttonYes = document.createElement('button')
    buttonYes.innerHTML = 'Yes'
    buttonYes.classList.add('buttonYes')
    buttonsContainer.appendChild(buttonYes)

    bottomContainer.appendChild(buttonsContainer)
    confirmModalBody.appendChild(topContainer)
    confirmModalBody.appendChild(bottomContainer)
    confirmModal.appendChild(modalBackground)
    confirmModal.appendChild(confirmModalBody)
    body.appendChild(confirmModal)

  

    const buttonYesElement = document.querySelector('.buttonYes')
    
    buttonYesElement.addEventListener('click',()=>{
        const queryString = `/toBeDeleteStudents?department=${encodeURIComponent(departmentValue)}&program=${encodeURIComponent(programValue)}&year=${encodeURIComponent(yearValue)}`
            fetch(queryString, {
        method: 'DELETE', 
    }).then((response)=>{
                if(!response.ok){
                    throw new Error('error deleting students')
                }
            }).then((data)=>{
                console.log(data.message)
            }).catch((e)=>{
                console.log(e.message)
            })
    })



    const removeModal = () => {
        confirmModal.remove()
    }


})


const innerstudentListContainer = document.querySelector('.innerstudentListContainer');
const observer = new MutationObserver(() => {
    if (innerstudentListContainer.innerHTML.trim() === '') {
        const removeStudents = document.querySelector('#removeStudents')
        removeStudents.disabled = true
    } else {
        const removeStudents = document.querySelector('#removeStudents')
        removeStudents.disabled = false
    }
});
const config = { childList: true, subtree: true };
observer.observe(innerstudentListContainer, config);

const uploadFile = document.querySelector('.uploadFile')
const uploadButton = document.querySelector('.uploadButton')

uploadFile.addEventListener('change', ()=> {
    if (uploadFile.files.length > 0) {
      uploadButton.disabled = false;
    } else {
      uploadButton.disabled = true;
    }
}) */








/* document.addEventListener('DOMContentLoaded', () => {
    const toBeAddedSubjects = document.querySelector('.toBeAddedSubjects');
    const addedSubjects = document.querySelector('.addedSubjects');
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'subjectCodes';
    hiddenInput.value = '';
    document.querySelector('form').appendChild(hiddenInput);

    fetch('/subjectCodes')
        .then((response) => {
            if (!response.ok) {
                throw new Error('network response is not okay');
            }
            return response.json();
        })
        .then((data) => {
            const subjects = data.allSubs;

            subjects.forEach((subject) => {
                const eachToBeAddedSub = document.createElement('div');
                eachToBeAddedSub.classList.add('eachToBeAddedSub');
                eachToBeAddedSub.textContent = subject.code;

                toBeAddedSubjects.appendChild(eachToBeAddedSub);

                eachToBeAddedSub.addEventListener('click', () => {
                    const eachSub = document.createElement('div');
                    eachSub.classList.add('eachSub');
                    eachSub.textContent = subject.code;

                    const exitButton = document.createElement('div');
                    exitButton.classList.add('exitButton');
                    exitButton.textContent = '×';
                    eachSub.appendChild(exitButton);

                    addedSubjects.appendChild(eachSub);
                    eachToBeAddedSub.remove(); 

                    updateHiddenInput(hiddenInput, subject.code, 'add');

                    exitButton.addEventListener('click', () => {
                        eachSub.remove();
                        toBeAddedSubjects.appendChild(eachToBeAddedSub);

                        updateHiddenInput(hiddenInput, subject.code, 'remove');
                    });
                    console.log(hiddenInput)
                });
            });
        })
        .catch((e) => {
            console.error('There is an error:', e.message);
        });

    function updateHiddenInput(input, code, action) {
        let currentValues = input.value ? input.value.split(',') : [];
        if (action === 'add') {
            if (!currentValues.includes(code)) {
                currentValues.push(code);
            }
        } else if (action === 'remove') {
            currentValues = currentValues.filter((value) => value !== code);
        }
        input.value = currentValues.join(',');
    }
}); */

/* const removeButton = document.querySelector('#removeStudents')
        removeButton.addEventListener('click',()=>{
            const queryString = `/toBeDeleteStudents?department=${encodeURIComponent(departmentValue)}&program=${encodeURIComponent(programValue)}&year=${encodeURIComponent(yearValue)}`
            fetch(queryString, {
        method: 'DELETE', 
    }).then((response)=>{
                if(!response.ok){
                    throw new Error('error deleting students')
                }
            }).then((data)=>{
                console.log(data.message)
            }).catch((e)=>{
                console.log(e.message)
            })
        }) */
/* questionSelectElement.addEventListener('change',()=> {
    innerLowerPart.innerHTML = ''
    const queryString = `/getQuestions?questionCategory=${encodeURIComponent(questionSelectElement.value)}`
    fetch(queryString).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error fetching questions')
        }
        return response.json()
    }).then((data)=> {
        let counter = 1
        data.foundQuestions.forEach(question => {
            
            const eachQuestion = document.createElement('div')
            eachQuestion.classList.add('eachQuestion')

            const questionTextContainer = document.createElement('div')
            questionTextContainer.classList.add('questionTextContainer')
            
            const questionTextContainerSpan = document.createElement('span')
            questionTextContainerSpan.innerHTML = `${counter}. ${question.text}`

            const questionButtonContainer = document.createElement('div')
            questionButtonContainer.classList.add('questionButtonContainer')
            questionButtonContainer.id= `${question.text}`
            
            const questionButtonContainerSpan = document.createElement('span')
            questionButtonContainerSpan.innerHTML = '-'

            questionButtonContainer.appendChild(questionButtonContainerSpan)
            questionTextContainer.appendChild(questionTextContainerSpan)
            eachQuestion.appendChild(questionTextContainer)
            eachQuestion.appendChild(questionButtonContainer)
            innerLowerPart.appendChild(eachQuestion)
            counter++

        });
        const questionButtonContainerElement = document.querySelectorAll('.questionButtonContainer')
        questionButtonContainerElement.forEach((element)=>{
            element.addEventListener('click',()=>{
                const removeQuestionModal = document.createElement('div')
                removeQuestionModal.classList.add('removeQuestionModal')

                const modalBackground = document.createElement('div')
                modalBackground.classList.add('modalBackground')

                const removeQuestionBody = document.createElement('div')
                removeQuestionBody.classList.add('removeQuestionBody')

                const removeQuestionTopContainer = document.createElement('div')
                removeQuestionTopContainer.classList.add('removeQuestionTopContainer')

                const removeQuestionexitButtonContainer = document.createElement('div')
                removeQuestionexitButtonContainer.classList.add('removeQuestionexitButtonContainer')
                removeQuestionexitButtonContainer.innerHTML = '+'
                removeQuestionexitButtonContainer.onclick = ()=> {
                    const removeQuestionModalElement = document.querySelector('.removeQuestionModal')

                    removeQuestionModalElement.remove()
                }
                removeQuestionTopContainer.appendChild(removeQuestionexitButtonContainer)


                const removeQuestionBottomContainer = document.createElement('div')
                removeQuestionBottomContainer.classList.add('removeQuestionBottomContainer')

                const removeQuestionTextContainer = document.createElement('div')
                removeQuestionTextContainer.classList.add('removeQuestionTextContainer')
                removeQuestionTextContainer.innerHTML = 'Are you sure you want to remove this question?'

                const removeQuestionButtonContainer = document.createElement('div')
                removeQuestionButtonContainer.classList.add('removeQuestionButtonContainer')

                const removeQuestionButtonNo = document.createElement('button')
                removeQuestionButtonNo.innerHTML = 'No'
                removeQuestionButtonNo.onclick = ()=>{
                    const removeQuestionModalElement = document.querySelector('.removeQuestionModal')

                    removeQuestionModalElement.remove()
                }

                const removeQuestionButtonYes = document.createElement('button')
                removeQuestionButtonYes.innerHTML = 'Yes'
                removeQuestionButtonYes.classList.add('removeQuestionButtonYes')
                removeQuestionButtonYes.id = `${element.id}`

                removeQuestionButtonContainer.appendChild(removeQuestionButtonNo)
                removeQuestionButtonContainer.appendChild(removeQuestionButtonYes)

                removeQuestionBottomContainer.appendChild(removeQuestionTextContainer)
                removeQuestionBottomContainer.appendChild(removeQuestionButtonContainer)

                removeQuestionBody.appendChild(removeQuestionTopContainer)
                removeQuestionBody.appendChild(removeQuestionBottomContainer)

                removeQuestionModal.appendChild(modalBackground)
                removeQuestionModal.appendChild(removeQuestionBody)

                const body = document.querySelector('body')

                body.appendChild(removeQuestionModal)




                const removeQuestionButtonYesElement = document.querySelector('.removeQuestionButtonYes')

                  removeQuestionButtonYesElement.addEventListener('click', () => {
        const selectedCategory = document.querySelector('select[name="questionCategory"]').value;
        const queryString = `/deleteQuestion?questionText=${encodeURIComponent(removeQuestionButtonYesElement.id)}&category=${encodeURIComponent(selectedCategory)}`;

        fetch(queryString, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (!response.ok) {
                throw new Error('There is an error deleting the question.');
            }
            return response.json();
        }).then((data) => {
            console.log(data.message);
            window.location.href = `http://localhost:3100/test?category=${encodeURIComponent(selectedCategory)}`;
        }).catch((e) => {
            console.log(e.message);
        });
    });




            })

        })
            
    }).catch((e)=>{
        console.log(e.message)
    })
})
 */