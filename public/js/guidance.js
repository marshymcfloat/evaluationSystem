




/* const settingsContainerSelect = document.querySelector('.departmentSelectContainer select')
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
}) */


/* const departmentSelect = document.querySelector('#departmentSelect')
const guidanceTeacherSelect = document.querySelector('#guidanceTeacherSelect')
const guidanceAcadYearSelect = document.querySelector('#guidanceAcadYearSelect')
const guidanceSemesterSelect = document.querySelector('#guidanceSemesterSelect')
const selectElements = document.querySelectorAll('#guidanceTeacherSelect, #guidanceAcadYearSelect, #guidanceSemesterSelect')

departmentSelect.addEventListener('change',()=>{
    
    fetch(`/${guidanceId}/getSelectOption?department=${encodeURIComponent(departmentSelect.value)}`).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error getting select options')
        }
        return response.json()
    }).then((data)=>{
        const teachers = data.foundTeacher
        const defaultOption = document.createElement('option')
        guidanceTeacherSelect.innerHTML = ''
        defaultOption.innerText = 'SELECT INSTRUCTOR'
        guidanceTeacherSelect.appendChild(defaultOption)
        teachers.forEach(teacher => {
            const teacherOption = document.createElement('option')
            teacherOption.value = teacher.fullname
            teacherOption.innerText = teacher.fullname

            guidanceTeacherSelect.appendChild(teacherOption)
        });
    }).catch((error)=>{

    })
})


guidanceTeacherSelect.addEventListener('change',()=>{
    fetch(`/${guidanceId}/getTeacherEvaluation?teacher=${encodeURIComponent(guidanceTeacherSelect.value)}`).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error getting the evaluation for ',guidanceTeacherSelect.value)
        }
        return response.json()
    }).then((data)=>{
        guidanceAcadYearSelect.innerHTML = ''
        guidanceSemesterSelect.innerHTML = ''
        const acadYearDefaultOption = document.createElement('option')
        acadYearDefaultOption.innerHTML = 'SELECT ACADEMIC YEAR'
        guidanceAcadYearSelect.appendChild(acadYearDefaultOption)

        const semesterDefaultOption = document.createElement('option')
        semesterDefaultOption.innerHTML = 'SELECT SEMESTER'
        guidanceSemesterSelect.appendChild(semesterDefaultOption)

        const acadYear = data.acadYear
        console.log(data)
        acadYear.forEach((acadYear)=>{
            const acadYearOption = document.createElement('option')
            acadYearOption.value = acadYear
            acadYearOption.innerText = acadYear
            guidanceAcadYearSelect.appendChild(acadYearOption)

        })

        const semester = data.semester

        semester.forEach((semester)=>{
            const semesterOption = document.createElement('option')
            semesterOption.value = semester
            semesterOption.innerText = semester
            guidanceSemesterSelect.appendChild(semesterOption)
        })


    }).catch((e)=>{
        console.log(e.message)
    })
})


selectElements.forEach((select)=>{
    select.addEventListener('change',()=>{
       const queryString = `/${guidanceId}/getSubjects?teacherName=${encodeURIComponent(guidanceTeacherSelect.value)}&acadYear=${encodeURIComponent(guidanceAcadYearSelect.value)}&semester=${encodeURIComponent(guidanceSemesterSelect.value)}`

    })
})

 */

const url = window.location.href;
const pathParts = url.split('/').filter(part => part !== ''); // Split the URL by '/' and filter out empty parts
const guidanceId = pathParts[pathParts.length - 2]; // Assuming 'guidanceID' is the second last part of the URL




/* const departmentSelect = document.querySelector('#departmentSelect')
const contentsContainer = document.querySelector('.contentsContainer')
departmentSelect.addEventListener('change',()=>{
    
    fetch(`/${guidanceId}/getGuidanceTeacher?department=${encodeURIComponent(departmentSelect.value)}`).then((response)=>{
        if(!response.ok){
            throw new Error('There is an error fetching teachers by department')
        }
        return response.json()
    }).then((data)=>{
        const teachers = data.teachers
        contentsContainer.innerHTML = ''
        teachers.forEach((teacher)=>{
           const eachTeacher = document.createElement('div')
           eachTeacher.classList.add('eachTeacher')

           const eachTeacherSpan1 = document.createElement('span')
           eachTeacherSpan1.innerHTML = teacher.fullname
           eachTeacher.appendChild(eachTeacherSpan1)

           const eachTeacherSpan2 = document.createElement('span')
           eachTeacherSpan2.innerHTML = teacher.department
           eachTeacher.appendChild(eachTeacherSpan2)

           const eachTeacherSpan3 = document.createElement('span')
           eachTeacherSpan3.innerHTML = teacher.subjects.map(subject => subject.code).join(', ')
           eachTeacher.appendChild(eachTeacherSpan3)

           contentsContainer.appendChild(eachTeacher)
        })

        const eachTeacherElements = document.querySelectorAll('.eachTeacher');
eachTeacherElements.forEach((element) => {
  element.addEventListener('click', () => {
    console.log(guidanceId)
    fetch(`/${guidanceId}/getCalculatedEvaluation?teacherName=${encodeURIComponent(element.firstChild.innerHTML)}&`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('There is an error fetching calculated evaluation');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Handle th e fetched data here
      })
      .catch((e) => {
        console.log(e.message);
      });
  });
});

       


    }).catch((e)=>{
        console.log(e.message)
    })

})      */

const allSelectElements = document.querySelectorAll('#acadYearSelect, #semesterSelect')
const departmentSelect = document.querySelector('#departmentSelect')
const acadYearSelect = document.querySelector('#acadYearSelect')
const semesterSelect = document.querySelector('#semesterSelect')
const contentsContainer = document.querySelector('.contentsContainer')


departmentSelect.addEventListener('change',()=>{
    fetch(`/${guidanceId}/getSelectOptions?department=${departmentSelect.value}`).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error getting select options')
        }
        return response.json()
    }).then((data)=>{
        acadYearSelect.innerHTML = ''
        semesterSelect.innerHTML = ''
        const acadYear = data.acadYears
        const sem = data.semesters

        acadYear.forEach((year)=>{
            const yearOption = document.createElement('option')
            yearOption.value = acadYear
            yearOption.innerHTML = acadYear

            acadYearSelect.appendChild(yearOption)
        })

        sem.forEach((sem)=>{
            const semOption = document.createElement('option')
            semOption.value = sem
            semOption.innerHTML = sem

            semesterSelect.appendChild(semOption)
        })

        fetch(`/${guidanceId}/getGuidanceTeacher?department=${encodeURIComponent(departmentSelect.value)}&acadYear=${encodeURIComponent(acadYearSelect.value)}&semester=${encodeURIComponent(semesterSelect.value)}`).then((response)=>{
        if(!response.ok){
            throw new Error('There is an error fetching teachers by department')
        }
        return response.json()
    }).then((data)=>{
        const teachers = data.teachers
        contentsContainer.innerHTML = ''
        teachers.forEach((teacher)=>{
            const eachTeacher = document.createElement('div')
            eachTeacher.classList.add('eachTeacher')

            const eachTeacherSpan1 = document.createElement('span')
            eachTeacherSpan1.innerHTML = teacher.fullname
            eachTeacher.appendChild(eachTeacherSpan1)

            const eachTeacherSpan2 = document.createElement('span')
            eachTeacherSpan2.innerHTML = teacher.department
            eachTeacher.appendChild(eachTeacherSpan2)

            const eachTeacherSpan3 = document.createElement('span')
            eachTeacherSpan3.innerHTML = `${teacher.subjects.map(subject => subject.code).join(', ')}`
            eachTeacher.appendChild(eachTeacherSpan3)

            contentsContainer.appendChild(eachTeacher)
        })

           const eachTeacherElements = document.querySelectorAll('.eachTeacher');
eachTeacherElements.forEach((element) => {
  element.addEventListener('click', () => {
    
    const teacherName = encodeURIComponent(element.firstChild.innerHTML);
    const semester = 'semester'; // replace with the actual semester value
    const academicYear = 'academicYear'; // replace with the actual academic year value
    const subject = 'subject'; // replace with the actual subject value

    // Redirect to the toBePrinted view
    window.location.href = `/${guidanceId}/getCalculatedEvaluation?teacherName=${teacherName}`;
  });
});


        

    }).catch((e)=>{

        console.log(e.message)
    })
    }).catch((e)=>{
        console.log(e.message)
    })
})


/* allSelectElements.forEach((element)=>{
    element.addEventListener('change', ()=>{
        fetch(`/${guidanceId}/getGuidanceTeacher?department=${encodeURIComponent(departmentSelect.value)}&academicYear${encodeURIComponent(acadYearSelect.value)}&semester=${encodeURIComponent(semesterSelect.value)}`).then((response)=>{
        if(!response.ok){
            throw new Error('There is an error fetching teachers by department')
        }
        return response.json()
    }).then((data)=>{


    })
    })
}) */


    allSelectElements.forEach((element)=>{
        element.addEventListener('change',()=>{
            fetch(`/${guidanceId}/getGuidanceTeacher?department=${encodeURIComponent(departmentSelect.value)}&acadYear=${encodeURIComponent(acadYearSelect.value)}&semester=${encodeURIComponent(semesterSelect.value)}`).then((response)=>{
        if(!response.ok){
            throw new Error('There is an error fetching teachers by department')
        }
        return response.json()
    }).then((data)=>{
        const teachers = data.teachers
        contentsContainer.innerHTML = ''
        teachers.forEach((teacher)=>{
            const eachTeacher = document.createElement('div')
            eachTeacher.classList.add('eachTeacher')

            const eachTeacherSpan1 = document.createElement('span')
            eachTeacherSpan1.innerHTML = teacher.fullname
            eachTeacher.appendChild(eachTeacherSpan1)

            const eachTeacherSpan2 = document.createElement('span')
            eachTeacherSpan2.innerHTML = teacher.department
            eachTeacher.appendChild(eachTeacherSpan2)

            const eachTeacherSpan3 = document.createElement('span')
            eachTeacherSpan3.innerHTML = `${teacher.subjects.map(subject => subject.code).join(', ')}`
            eachTeacher.appendChild(eachTeacherSpan3)

            contentsContainer.appendChild(eachTeacher)
        })

        const eachTeacherElements = document.querySelectorAll('.eachTeacher');
eachTeacherElements.forEach((element) => {
  element.addEventListener('click', () => {
    const teacherName = encodeURIComponent(element.firstChild.innerHTML);
    const semester = 'semester'; // replace with the actual semester value
    const academicYear = 'academicYear'; // replace with the actual academic year value
    const subject = 'subject'; // replace with the actual subject value
    // Redirect to the toBePrinted view

    window.location.href = `/${guidanceId}/getCalculatedEvaluation?teacherName=${teacherName}&semester=${encodeURIComponent(semesterSelect.value)}&academicYear=${encodeURIComponent(acadYearSelect.value)}`;
  });
});

    }).catch((e)=>{

        console.log(e.message)
    })



        })
    })
    

    