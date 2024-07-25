const options = document.querySelectorAll('#options')
const innerRightContainer = document.querySelector('.innerRightContainer')
const modalUpdate = document.querySelector('.modalUpdate')
const body = document.querySelector('body')
const adminId = getAdminIdFromUrl();
const subjectBody = document.querySelector('.subjectBody')
const subjectListContainer = document.querySelector('.subjectListContainer')
const addIndividualSubjectModal = document.querySelector('.addIndividualSubjectModal')
const addIndividualStudentModal = document.querySelector('.addIndividualStudentModal')





for(let option of options){
    option.addEventListener('click', ()=> {
        innerRightContainer.innerHTML = ''
        if(option.innerHTML === 'Instructors'){
            subjectBody.style.display = 'none';

            const filterContainer = document.createElement('div')

            filterContainer.classList.add('filterContainer')
            const filterContainerLabel = document.createElement('label')
            filterContainerLabel.setAttribute('for', 'department')
            filterContainerLabel.innerHTML ="Department:"
            filterContainer.appendChild(filterContainerLabel)


            const filterContainerSelect = document.createElement('select')
            filterContainerSelect.name = "department"
            filterContainerSelect.id = "department"
            
            const optionDefault = document.createElement('option')
            optionDefault.value = ""
            optionDefault.innerHTML = "SELECT DEPARTMENT"
            filterContainerSelect.appendChild(optionDefault)


            const option1 = document.createElement('option')
            option1.value = "CET"
            option1.innerHTML = "CET"
            filterContainerSelect.appendChild(option1)

            
            const option2 = document.createElement('option')
            option2.value = "CBA"
            option2.innerHTML = "CBA"
            filterContainerSelect.appendChild(option2)
            
            const option3 = document.createElement('option')
            option3.value = "CEAA"
            option3.innerHTML = "CEAA"
            filterContainerSelect.appendChild(option3)
            
            const option4 = document.createElement('option')
            option4.value = "CHM"
            option4.innerHTML = "CHM"
            filterContainerSelect.appendChild(option4)


            const option5 = document.createElement('option')
            option5.value = "CNHS"
            option5.innerHTML = "CNHS"
            filterContainerSelect.appendChild(option5)

            const option6 = document.createElement('option')
            option6.value = "CCJE"
            option6.innerHTML = "CCJE"
            filterContainerSelect.appendChild(option6)



            const addBulkInstructorContainer = document.createElement('div')
            addBulkInstructorContainer.classList.add('addBulkInstructorContainer')

            const addBulkTeacherForm = document.createElement('form')
            addBulkTeacherForm.action = `/${adminId}/addBulkTeacher`
            addBulkTeacherForm.enctype = 'multipart/form-data'
            addBulkTeacherForm.method = 'POST'


            const addBulkTeacherInput = document.createElement('input')
            addBulkTeacherInput.type = 'file'
            addBulkTeacherInput.name = 'bulkTeacher'
            addBulkTeacherInput.id = 'bulkTeacher'

            const addBulkTeacherButton  = document.createElement('button')
            addBulkTeacherButton.type = 'submit'
            addBulkTeacherButton.innerText = 'Submit'

            addBulkTeacherForm.appendChild(addBulkTeacherInput)
            addBulkTeacherForm.appendChild(addBulkTeacherButton)
            addBulkInstructorContainer.appendChild(addBulkTeacherForm)

            filterContainer.appendChild(filterContainerSelect)
            filterContainer.appendChild(addBulkInstructorContainer)


            const instructorListContainer = document.createElement('div')
            instructorListContainer.classList.add('instructorListContainer')



            innerRightContainer.appendChild(filterContainer)
            innerRightContainer.appendChild(instructorListContainer)


         filterContainerSelect.addEventListener('change', () => {
    if (filterContainerSelect.value === "CET") {
        instructorListContainer.innerHTML = ""
        fetch(`/${adminId}/cetDepartmentInstructors`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {

                const { allTeachers } = data;
                for (let teacher of allTeachers) {

                console.log(allTeachers)

                const eachTeacherContainer = document.createElement('div');
                eachTeacherContainer.classList.add('eachTeacherContainer');


                const teacherInfoContainer = document.createElement('div');
                teacherInfoContainer.classList.add('teacherInfoContainer');
                
                const spanName = document.createElement('span')
                spanName.id = 'fullname'
                spanName.innerHTML = `Name: ${teacher.firstname} ${teacher.lastname}` 
                const spanFirstname = document.createElement('span');

                spanFirstname.id = 'firstname';
                spanFirstname.innerHTML = `Firstname: ${teacher.firstname}`;

                const spanLastname = document.createElement('span');
                spanLastname.id = 'lastname';
                spanLastname.innerHTML = `Lastname: ${teacher.lastname}`;

                const spanSubjects = document.createElement('span');
                spanSubjects.id = 'subjects';
                spanSubjects.innerHTML = `Subjects: ${teacher.subjects.map(subject => subject.code).join(', ')}`;

                teacherInfoContainer.appendChild(spanName);
                teacherInfoContainer.appendChild(spanSubjects);
                    
                    

                    const teacherOptionsContainer = document.createElement('div')
                    teacherOptionsContainer.classList.add('teacherOptionsContainer')
                    const updateIcon = document.createElement('div')
                    updateIcon.classList.add('updateIcon')
                    const elementUpdateIconImg = document.createElement('img')
                    elementUpdateIconImg.src = '/images/updateIcon.svg'
                    updateIcon.id = `${teacher.fullname}`
                    updateIcon.appendChild(elementUpdateIconImg)




                    const removeIcon = document.createElement('div')
                    removeIcon.classList.add('removeIcon')
                    const elementRemoveIconImg = document.createElement('img')
                    elementRemoveIconImg.src = '/images/removeIcon.svg'
                    removeIcon.appendChild(elementRemoveIconImg)
                    removeIcon.id = `${teacher.fullname}`



                    teacherOptionsContainer.appendChild(updateIcon)
                    teacherOptionsContainer.appendChild(removeIcon)


                   


                    /* eachTeacherContainer.appendChild(teacherIconContainer) */
                    eachTeacherContainer.appendChild(teacherInfoContainer)
                    eachTeacherContainer.appendChild(teacherOptionsContainer)
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    instructorListContainer.appendChild(addTeacherContainer)

                    const addTeacherContainerH1 = document.createElement('h1')
                    addTeacherContainerH1.innerHTML = "+"
                    addTeacherContainer.appendChild(addTeacherContainerH1)





                const updateIcon = document.querySelectorAll('.updateIcon');

for (let icon of updateIcon) {
    icon.addEventListener('click', () => {

        fetch(`/${adminId}/findTeacher?teacherName=${encodeURIComponent(icon.id)}`).then((response) => {
            if (!response.ok) {
                throw new Error('There is an error while fetching');
            }
            return response.json();
        }).then(data => {
            const foundTeacher = data.foundTeacher;

            const updateFormForm = document.createElement('form');
            updateFormForm.action = `/${adminId}/${foundTeacher._id}/updateForm`;
            updateFormForm.method = 'POST';
            updateFormForm.enctype = 'multipart/form-data';

            const modalUpdate = document.createElement('div');
            modalUpdate.classList.add('modalUpdate');

            const modalBackground = document.createElement('div');
            modalBackground.classList.add('modalBackground');

            const modalUpdateForm = document.createElement('div');
            modalUpdateForm.classList.add('modalUpdateForm');
            updateFormForm.appendChild(modalUpdateForm);

            const modalUpdateFormP = document.createElement('p');
            modalUpdateFormP.innerHTML = `Update Information`;
            modalUpdateForm.appendChild(modalUpdateFormP);

            const updateInfoContainer = document.createElement('div');
            updateInfoContainer.classList.add('updateInfoContainer');
            modalUpdateForm.appendChild(updateInfoContainer);

            const inputsContainer = document.createElement('div');
            inputsContainer.classList.add('inputsContainer');
            updateInfoContainer.appendChild(inputsContainer);

            const Firstname = document.createElement('input');
            Firstname.type = 'text';
            Firstname.placeholder = 'Firstname';
            Firstname.name = 'firstname';
            Firstname.value = `${foundTeacher.firstname}`;
            inputsContainer.appendChild(Firstname);

            const Lastname = document.createElement('input');
            Lastname.type = 'text';
            Lastname.placeholder = 'Lastname';
            Lastname.name = 'lastname';
            Lastname.value = `${foundTeacher.lastname}`;
            inputsContainer.appendChild(Lastname);

            const department = document.createElement('select');
            department.name = 'department';
            department.id = 'updateDepartmentSelect';

            const selectDepartment = document.createElement('option');
            selectDepartment.innerHTML = "SELECT DEPARTMENT";
            department.appendChild(selectDepartment);

            const departments = ["CET", "CBA", "CEAA", "CHM", "CNHS", "CCJE"];
            departments.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep;
                option.innerHTML = dep;
                if (dep === foundTeacher.department) {
                    option.selected = true;
                }
                department.appendChild(option);
            });

            const addSubjectsContainer = document.createElement('div');
            addSubjectsContainer.classList.add('addSubjectsContainer');

            const toBeAddedSubjects = document.createElement('div');
            toBeAddedSubjects.classList.add('toBeAddedSubjects');

            const addedSubjects = document.createElement('div');
            addedSubjects.classList.add('addedSubjects');
            addSubjectsContainer.appendChild(addedSubjects);
            addSubjectsContainer.appendChild(toBeAddedSubjects);

            inputsContainer.appendChild(department);
            inputsContainer.appendChild(addSubjectsContainer);

            department.addEventListener('change', () => {
                console.log('meow');
                fetchAndDisplaySubjects(department.value);
            });

            // Fetch and display subjects
            const fetchAndDisplaySubjects = (department) => {
                fetch(`/${adminId}/getTeacherSubjects?subjectIds=${JSON.stringify(foundTeacher.subjects)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching subjects');
                        }
                        return response.json();
                    })
                    .then(subjects => {
                        addedSubjects.innerHTML = ''; // Clear existing subjects
                        subjects.forEach(subject => {
                            addSubjectToAddedSubjects(subject);
                        });

                        return fetch(`/${adminId}/getAvailableSubjects?department=${encodeURIComponent(department)}`);
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching available subjects');
                        }
                        return response.json();
                    })
                    .then(available => {
                        console.log(available)
                        toBeAddedSubjects.innerHTML = ''; // Clear toBeAddedSubjects
                        available.forEach(subject => {
                            if (!foundTeacher.subjects.includes(subject._id)) {
                                addSubjectToToBeAddedSubjects(subject);
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching subjects:', error));
            };

            // Initial fetch of subjects
            fetchAndDisplaySubjects(foundTeacher.department);

            const updateButtonContainer = document.createElement('div');
            updateButtonContainer.classList.add('updateButtonContainer');
            modalUpdateForm.appendChild(updateButtonContainer);

            const updateButtonContainerButton = document.createElement('button');
            updateButtonContainerButton.innerHTML = "Save";
            updateButtonContainerButton.type = 'submit';
            updateButtonContainer.appendChild(updateButtonContainerButton);

            const exitBtnModalUpdate = document.createElement('div');
            exitBtnModalUpdate.classList.add('exitBtnModalUpdate');
            exitBtnModalUpdate.innerHTML = '+';
            exitBtnModalUpdate.onclick = () => {
                modalUpdate.remove();
            };

            modalUpdateForm.appendChild(exitBtnModalUpdate);

            modalUpdate.appendChild(modalBackground);
            modalUpdate.appendChild(updateFormForm);
            document.body.appendChild(modalUpdate);

            // Collecting updated subjects upon form submission
            updateFormForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const updatedSubjects = [];
                addedSubjects.querySelectorAll('.eachSub').forEach(item => {
                    const subjectCode = item.firstChild.textContent.trim();
                    updatedSubjects.push(subjectCode);
                });

                // Add the updated subjects to the form data
                const formData = new FormData(updateFormForm);
                formData.append('subjects', JSON.stringify(updatedSubjects));

                // Send the form data using fetch
                fetch(updateFormForm.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update the instructor');
                    }
                    return response.json();
                }).then(result => {
                    console.log('Instructor updated successfully:', result);
                    modalUpdate.remove();
                }).catch(error => console.error('Error updating instructor:', error));
            });

            function addSubjectToAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    addedSubjects.removeChild(eachSub);
                    addSubjectToToBeAddedSubjects(subject);
                });

                addedSubjects.appendChild(eachSub);
            }

            function addSubjectToToBeAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    toBeAddedSubjects.removeChild(eachSub);
                    addSubjectToAddedSubjects(subject);
                });

                toBeAddedSubjects.appendChild(eachSub);
            }
        }).catch(error => {
            console.error('Error fetching teacher:', error);
        });
    });
}




                const removeIcon = document.querySelectorAll('.removeIcon')

                for(let icon of removeIcon){
                    icon.addEventListener('click', ()=> {
                        const modalRemove = document.createElement('div')
                        modalRemove.classList.add('modalRemove')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')
                        modalRemove.appendChild(modalBackground)


                        const modalRemoveForm = document.createElement('div')
                        modalRemoveForm.classList.add('modalRemoveForm')
                        modalRemove.appendChild(modalRemoveForm)


                        const modalRemoveTextsContainer = document.createElement('div')
                        modalRemoveTextsContainer.classList.add('modalRemoveTextsContainer')
                        const modalRemoveTextsContainerP = document.createElement('p')
                        modalRemoveTextsContainerP.innerHTML = `Are you sure you are going to remove ${icon.id}`
                        modalRemoveTextsContainer.appendChild(modalRemoveTextsContainerP)
                        modalRemoveForm.appendChild(modalRemoveTextsContainer)


                        const modalRemoveButtonsContainer = document.createElement('div')
                        modalRemoveButtonsContainer.classList.add('modalRemoveButtonsContainer')
                        modalRemoveForm.appendChild(modalRemoveButtonsContainer)
                        const modalRemoveButtonsContainerNo = document.createElement('button')
                        modalRemoveButtonsContainerNo.innerHTML = 'No'
                        modalRemoveButtonsContainerNo.id = "confirmNo"

                        const modalRemoveButtonsContainerYes = document.createElement('button')
                        modalRemoveButtonsContainerYes.innerHTML = 'Yes'
                        modalRemoveButtonsContainerYes.id = "confirmYes"


                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerNo)
                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerYes)
                        

                        const exitBtnModalRemove = document.createElement('div')
                        exitBtnModalRemove.classList.add('exitBtnModalRemove')
                        exitBtnModalRemove.innerHTML = '+'
                        modalRemoveForm.appendChild(exitBtnModalRemove)
                        exitBtnModalRemove.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                

                        modalRemoveButtonsContainerNo.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                     
                        
                        modalRemove.classList.remove('modalHidden')
                        body.appendChild(modalRemove)


                        modalRemoveButtonsContainerYes.addEventListener('click', () => {
    const teacherFullName = icon.id; // Assuming the id contains the full name
                            console.log(teacherFullName)
    fetch(`/${adminId}/removeInstructor`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName: teacherFullName }) // Sending the full name in the request body
    })
    .then(response => {
        if (response.ok) {
            // Successfully deleted
            // You can update your UI accordingly
        } else {
            // Handle error
            console.error('Failed to delete teacher');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
});



                    })
                }


                        const addTeacherButton = document.querySelector('.addTeacherContainer')

                        addTeacherButton.addEventListener('click', ()=> {

                        const formAdd = document.createElement('form')
                        formAdd.action ='/addForm'
                        formAdd.method ='POST'
                        formAdd.enctype = 'multipart/form-data'
                        const modalAddTeacher = document.createElement('div')
                        modalAddTeacher.classList.add('modalAddTeacher')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')


                        const modalAddTeacherForm = document.createElement('div')
                        modalAddTeacherForm.classList.add('modalAddTeacherForm')

                        const modalAddTeacherFormP = document.createElement('p')
                        modalAddTeacherFormP.innerHTML = `Add Teacher`
                        modalAddTeacherForm.appendChild(modalAddTeacherFormP)

                        const addTeacherInfoContainer = document.createElement('div')
                        addTeacherInfoContainer.classList.add('addTeacherInfoContainer')
                        modalAddTeacherForm.appendChild(addTeacherInfoContainer)

                       
                        
                        const inputsContainer = document.createElement('div')
                        inputsContainer.classList.add('inputsContainer')
                        addTeacherInfoContainer.appendChild(inputsContainer)

                        const Firstname = document.createElement('input')
                        Firstname.type = 'text'
                        Firstname.placeholder = 'Firstname'
                        Firstname.name = 'firstname'
                        Firstname.id = 'firstname'
                        inputsContainer.appendChild(Firstname)

                        const Lastname = document.createElement('input')
                        Lastname.type = 'text'
                        Lastname.placeholder = 'Lastname'
                        Lastname.name = 'lastname'
                        Lastname.id = 'lastname'
                        inputsContainer.appendChild(Lastname)
                        
                        const department = document.createElement('select')
                        department.name = 'department'
                        department.id = 'addFormDepartment'
                        department.classList.add('department')
                        const selectDepartment = document.createElement('option')

                        selectDepartment.innerHTML = "SELECT DEPARTMENT"
                        department.appendChild(selectDepartment)

                        const CET = document.createElement('option')
                        CET.value = "CET"
                        CET.innerHTML = "CET"
                        department.appendChild(CET)

                        const CBA = document.createElement('option')
                        CBA.value = "CBA"
                        CBA.innerHTML = "CBA"
                        department.appendChild(CBA)

                        const CEAA = document.createElement('option')
                        CEAA.value = "CEAA"
                        CEAA.innerHTML = "CEAA"
                        department.appendChild(CEAA)

                        const CHM = document.createElement('option')
                        CHM.value = "CHM"
                        CHM.innerHTML = "CHM"
                        department.appendChild(CHM)

                        const CNHS = document.createElement('option')
                        CNHS.value = "CNHS"
                        CNHS.innerHTML = "CNHS"
                        department.appendChild(CNHS)

                        const CCJE = document.createElement('option')
                        CCJE.value = "CCJE"
                        CCJE.innerHTML = "CCJE"
                        department.appendChild(CCJE)


                        

                        const addSubjectsContainer = document.createElement('div')
                        addSubjectsContainer.classList.add('addSubjectsContainer')



                        const addedSubjects = document.createElement('div')
                        addedSubjects.classList.add('addedSubjects')
                        addSubjectsContainer.appendChild(addedSubjects)

                        const toBeAddedSubjects = document.createElement('div')
                        toBeAddedSubjects.classList.add('toBeAddedSubjects')
                        addSubjectsContainer.appendChild(toBeAddedSubjects)

                   
                        
                        const addTeacherButtonContainer = document.createElement('div')
                        addTeacherButtonContainer.classList.add('addTeacherButtonContainer')
                        modalAddTeacherForm.appendChild(addTeacherButtonContainer)

                        const addTeacherButtonContainerButton = document.createElement('button')
                        addTeacherButtonContainerButton.innerHTML = "Add"
                        addTeacherButtonContainer.appendChild(addTeacherButtonContainerButton)

                        const exitBtnModalAddTeacher = document.createElement('div')
                        exitBtnModalAddTeacher.classList.add('exitBtnModalAddTeacher')
                        exitBtnModalAddTeacher.innerHTML = '+'
                        exitBtnModalAddTeacher.onclick = () => {
                            modalAddTeacher.remove()
                        }
                       
                        modalAddTeacherForm.appendChild(exitBtnModalAddTeacher)

                        inputsContainer.appendChild(department)
                        modalAddTeacher.appendChild(modalBackground)
                        modalAddTeacher.appendChild(modalAddTeacherForm)
                        inputsContainer.appendChild(addSubjectsContainer)

                        
                        body.appendChild(modalAddTeacher)
                        formAdd.appendChild(modalAddTeacherForm)
                        modalAddTeacher.appendChild(formAdd)
                    

                    const departmentElement = document.querySelector('.department');
departmentElement.addEventListener('change', () => {
    const toBeAddedSubjectsContainer = document.querySelector('.toBeAddedSubjects');
    toBeAddedSubjectsContainer.innerHTML = '';
    
    const queryString = `/${adminId}/subjectCodes?department=${encodeURIComponent(departmentElement.value)}`;
    fetch(queryString)
        .then((response) => {
            if (!response.ok) {
                throw new Error('The fetch network is not okay.');
            }
            return response.json();
        })
        .then((data) => {
            const toBeAddedSubjects = document.querySelector('.toBeAddedSubjects');
            const addedSubjects = document.querySelector('.addedSubjects');
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'subjectCodes';
            hiddenInput.value = '';
            hiddenInput.id = 'hiddenInput'
            formAdd.appendChild(hiddenInput);
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
                    exitButton.textContent = '+';
                    eachSub.appendChild(exitButton);

                    addedSubjects.appendChild(eachSub);
                    eachToBeAddedSub.remove(); 

                    updateHiddenInput(hiddenInput, subject.code, 'add');
                    console.log(hiddenInput)
                    exitButton.addEventListener('click', () => {
                        eachSub.remove();
                        toBeAddedSubjects.appendChild(eachToBeAddedSub);

                        updateHiddenInput(hiddenInput, subject.code, 'remove');
                    });
                });
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


 formAdd.addEventListener('submit', (event) => {
    event.preventDefault();
    const addedSubjectsElement = document.querySelectorAll('.eachSub');
    const firstnameInput = document.querySelector('#firstname')
    const lastnameInput = document.querySelector('#lastname')
    const depSelect = document.querySelector('#addFormDepartment')

    const addedSubs = [];
    
    addedSubjectsElement.forEach((subject) => {
        addedSubs.push(subject.firstChild.textContent.trim());
    });

    const queryString = `/${adminId}/addForm?firstname=${encodeURIComponent(firstnameInput.value)}&lastname=${encodeURIComponent(lastnameInput.value)}&department=${encodeURIComponent(depSelect.value)}&subjectCodes=${addedSubs}`
    fetch(queryString, {
        method: 'POST'
    }).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error in posting /addForm')
        }
        return response.json()
    }).then((data)=>{
        formAdd.reset()
        modalAddTeacher.remove()
    }).catch((error)=>{
        console.log(error.message)
    })

    
});
                                
                            
                        })
            }).catch((e)=>{
                 console.log(e.message)
            })

           
    } else if (filterContainerSelect.value === "CBA") {
        instructorListContainer.innerHTML = ""

        fetch(`/${adminId}/cbaDepartmentInstructors`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {

                const { allTeachers } = data;
                for (let teacher of allTeachers) {
                const eachTeacherContainer = document.createElement('div');
                eachTeacherContainer.classList.add('eachTeacherContainer');


                const teacherInfoContainer = document.createElement('div');
                teacherInfoContainer.classList.add('teacherInfoContainer');
                
                const spanName = document.createElement('span')
                spanName.id = 'fullname'
                spanName.innerHTML = `Name: ${teacher.firstname} ${teacher.lastname}` 
                const spanFirstname = document.createElement('span');

                spanFirstname.id = 'firstname';
                spanFirstname.innerHTML = `Firstname: ${teacher.firstname}`;

                const spanLastname = document.createElement('span');
                spanLastname.id = 'lastname';
                spanLastname.innerHTML = `Lastname: ${teacher.lastname}`;

                const spanSubjects = document.createElement('span');
                spanSubjects.id = 'subjects';
                spanSubjects.innerHTML = `Subjects: ${teacher.subjects.map(subject => subject.code).join(', ')}`;

                teacherInfoContainer.appendChild(spanName);
                teacherInfoContainer.appendChild(spanSubjects);
                    
                    

                    const teacherOptionsContainer = document.createElement('div')
                    teacherOptionsContainer.classList.add('teacherOptionsContainer')
                    const updateIcon = document.createElement('div')
                    updateIcon.classList.add('updateIcon')
                    const elementUpdateIconImg = document.createElement('img')
                    elementUpdateIconImg.src = '/images/updateIcon.svg'
                    updateIcon.id = `${teacher.fullname}`
                    updateIcon.appendChild(elementUpdateIconImg)




                    const removeIcon = document.createElement('div')
                    removeIcon.classList.add('removeIcon')
                    const elementRemoveIconImg = document.createElement('img')
                    elementRemoveIconImg.src = '/images/removeIcon.svg'
                    removeIcon.appendChild(elementRemoveIconImg)
                    removeIcon.id = `${teacher.fullname}`



                    teacherOptionsContainer.appendChild(updateIcon)
                    teacherOptionsContainer.appendChild(removeIcon)


                   


                    /* eachTeacherContainer.appendChild(teacherIconContainer) */
                    eachTeacherContainer.appendChild(teacherInfoContainer)
                    eachTeacherContainer.appendChild(teacherOptionsContainer)
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    instructorListContainer.appendChild(addTeacherContainer)

                    const addTeacherContainerH1 = document.createElement('h1')
                    addTeacherContainerH1.innerHTML = "+"
                    addTeacherContainer.appendChild(addTeacherContainerH1)





const updateIcon = document.querySelectorAll('.updateIcon');

for (let icon of updateIcon) {
    icon.addEventListener('click', () => {

        fetch(`/${adminId}/findTeacher?teacherName=${encodeURIComponent(icon.id)}`).then((response) => {
            if (!response.ok) {
                throw new Error('There is an error while fetching');
            }
            return response.json();
        }).then(data => {
            const foundTeacher = data.foundTeacher;

            const updateFormForm = document.createElement('form');
            updateFormForm.action = `/${adminId}/${foundTeacher._id}/updateForm`;
            updateFormForm.method = 'POST';
            updateFormForm.enctype = 'multipart/form-data';

            const modalUpdate = document.createElement('div');
            modalUpdate.classList.add('modalUpdate');

            const modalBackground = document.createElement('div');
            modalBackground.classList.add('modalBackground');

            const modalUpdateForm = document.createElement('div');
            modalUpdateForm.classList.add('modalUpdateForm');
            updateFormForm.appendChild(modalUpdateForm);

            const modalUpdateFormP = document.createElement('p');
            modalUpdateFormP.innerHTML = `Update Information`;
            modalUpdateForm.appendChild(modalUpdateFormP);

            const updateInfoContainer = document.createElement('div');
            updateInfoContainer.classList.add('updateInfoContainer');
            modalUpdateForm.appendChild(updateInfoContainer);

            const inputsContainer = document.createElement('div');
            inputsContainer.classList.add('inputsContainer');
            updateInfoContainer.appendChild(inputsContainer);

            const Firstname = document.createElement('input');
            Firstname.type = 'text';
            Firstname.placeholder = 'Firstname';
            Firstname.name = 'firstname';
            Firstname.value = `${foundTeacher.firstname}`;
            inputsContainer.appendChild(Firstname);

            const Lastname = document.createElement('input');
            Lastname.type = 'text';
            Lastname.placeholder = 'Lastname';
            Lastname.name = 'lastname';
            Lastname.value = `${foundTeacher.lastname}`;
            inputsContainer.appendChild(Lastname);

            const department = document.createElement('select');
            department.name = 'department';
            department.id = 'updateDepartmentSelect';

            const selectDepartment = document.createElement('option');
            selectDepartment.innerHTML = "SELECT DEPARTMENT";
            department.appendChild(selectDepartment);

            const departments = ["CET", "CBA", "CEAA", "CHM", "CNHS", "CCJE"];
            departments.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep;
                option.innerHTML = dep;
                if (dep === foundTeacher.department) {
                    option.selected = true;
                }
                department.appendChild(option);
            });

            const addSubjectsContainer = document.createElement('div');
            addSubjectsContainer.classList.add('addSubjectsContainer');

            const toBeAddedSubjects = document.createElement('div');
            toBeAddedSubjects.classList.add('toBeAddedSubjects');

            const addedSubjects = document.createElement('div');
            addedSubjects.classList.add('addedSubjects');
            addSubjectsContainer.appendChild(addedSubjects);
            addSubjectsContainer.appendChild(toBeAddedSubjects);

            inputsContainer.appendChild(department);
            inputsContainer.appendChild(addSubjectsContainer);

            department.addEventListener('change', () => {
                console.log('meow');
                fetchAndDisplaySubjects(department.value);
            });

            // Fetch and display subjects
            const fetchAndDisplaySubjects = (department) => {
                fetch(`/${adminId}/getSubjects?subjectIds=${JSON.stringify(foundTeacher.subjects)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching subjects');
                        }
                        return response.json();
                    })
                    .then(subjects => {
                        addedSubjects.innerHTML = ''; // Clear existing subjects
                        subjects.forEach(subject => {
                            addSubjectToAddedSubjects(subject);
                        });

                        return fetch(`/${adminId}/getAvailableSubjects?department=${encodeURIComponent(department)}`);
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching available subjects');
                        }
                        return response.json();
                    })
                    .then(available => {
                        console.log(available)
                        toBeAddedSubjects.innerHTML = ''; // Clear toBeAddedSubjects
                        available.forEach(subject => {
                            if (!foundTeacher.subjects.includes(subject._id)) {
                                addSubjectToToBeAddedSubjects(subject);
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching subjects:', error));
            };

            // Initial fetch of subjects
            fetchAndDisplaySubjects(foundTeacher.department);

            const updateButtonContainer = document.createElement('div');
            updateButtonContainer.classList.add('updateButtonContainer');
            modalUpdateForm.appendChild(updateButtonContainer);

            const updateButtonContainerButton = document.createElement('button');
            updateButtonContainerButton.innerHTML = "Save";
            updateButtonContainerButton.type = 'submit';
            updateButtonContainer.appendChild(updateButtonContainerButton);

            const exitBtnModalUpdate = document.createElement('div');
            exitBtnModalUpdate.classList.add('exitBtnModalUpdate');
            exitBtnModalUpdate.innerHTML = '+';
            exitBtnModalUpdate.onclick = () => {
                modalUpdate.remove();
            };

            modalUpdateForm.appendChild(exitBtnModalUpdate);

            modalUpdate.appendChild(modalBackground);
            modalUpdate.appendChild(updateFormForm);
            document.body.appendChild(modalUpdate);

            // Collecting updated subjects upon form submission
            updateFormForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const updatedSubjects = [];
                addedSubjects.querySelectorAll('.eachSub').forEach(item => {
                    const subjectCode = item.firstChild.textContent.trim();
                    updatedSubjects.push(subjectCode);
                });

                // Add the updated subjects to the form data
                const formData = new FormData(updateFormForm);
                formData.append('subjects', JSON.stringify(updatedSubjects));

                // Send the form data using fetch
                fetch(updateFormForm.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update the instructor');
                    }
                    return response.json();
                }).then(result => {
                    console.log('Instructor updated successfully:', result);
                    modalUpdate.remove();
                }).catch(error => console.error('Error updating instructor:', error));
            });

            function addSubjectToAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    addedSubjects.removeChild(eachSub);
                    addSubjectToToBeAddedSubjects(subject);
                });

                addedSubjects.appendChild(eachSub);
            }

            function addSubjectToToBeAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    toBeAddedSubjects.removeChild(eachSub);
                    addSubjectToAddedSubjects(subject);
                });

                toBeAddedSubjects.appendChild(eachSub);
            }
        }).catch(error => {
            console.error('Error fetching teacher:', error);
        });
    });
}






                const removeIcon = document.querySelectorAll('.removeIcon')

                for(let icon of removeIcon){
                    icon.addEventListener('click', ()=> {
                        const modalRemove = document.createElement('div')
                        modalRemove.classList.add('modalRemove')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')
                        modalRemove.appendChild(modalBackground)


                        const modalRemoveForm = document.createElement('div')
                        modalRemoveForm.classList.add('modalRemoveForm')
                        modalRemove.appendChild(modalRemoveForm)


                        const modalRemoveTextsContainer = document.createElement('div')
                        modalRemoveTextsContainer.classList.add('modalRemoveTextsContainer')
                        const modalRemoveTextsContainerP = document.createElement('p')
                        modalRemoveTextsContainerP.innerHTML = `Are you sure you are going to remove ${icon.id}`
                        modalRemoveTextsContainer.appendChild(modalRemoveTextsContainerP)
                        modalRemoveForm.appendChild(modalRemoveTextsContainer)


                        const modalRemoveButtonsContainer = document.createElement('div')
                        modalRemoveButtonsContainer.classList.add('modalRemoveButtonsContainer')
                        modalRemoveForm.appendChild(modalRemoveButtonsContainer)
                        const modalRemoveButtonsContainerNo = document.createElement('button')
                        modalRemoveButtonsContainerNo.innerHTML = 'No'
                        modalRemoveButtonsContainerNo.id = "confirmNo"

                        const modalRemoveButtonsContainerYes = document.createElement('button')
                        modalRemoveButtonsContainerYes.innerHTML = 'Yes'
                        modalRemoveButtonsContainerYes.id = "confirmYes"


                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerNo)
                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerYes)
                        

                        const exitBtnModalRemove = document.createElement('div')
                        exitBtnModalRemove.classList.add('exitBtnModalRemove')
                        exitBtnModalRemove.innerHTML = '+'
                        modalRemoveForm.appendChild(exitBtnModalRemove)
                        exitBtnModalRemove.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                

                        modalRemoveButtonsContainerNo.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                     
                        
                        modalRemove.classList.remove('modalHidden')
                        body.appendChild(modalRemove)


                        modalRemoveButtonsContainerYes.addEventListener('click', () => {
    const teacherFullName = icon.id; // Assuming the id contains the full name
                            console.log(teacherFullName)
    fetch(`/${adminId}/removeInstructor`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName: teacherFullName }) // Sending the full name in the request body
    })
    .then(response => {
        if (response.ok) {
            // Successfully deleted
            // You can update your UI accordingly
        } else {
            // Handle error
            console.error('Failed to delete teacher');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
});



                    })
                }


                        const addTeacherButton = document.querySelector('.addTeacherContainer')

                        addTeacherButton.addEventListener('click', ()=> {

                        const formAdd = document.createElement('form')
                        formAdd.action ='/addForm'
                        formAdd.method ='POST'
                        formAdd.enctype = 'multipart/form-data'
                        const modalAddTeacher = document.createElement('div')
                        modalAddTeacher.classList.add('modalAddTeacher')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')


                        const modalAddTeacherForm = document.createElement('div')
                        modalAddTeacherForm.classList.add('modalAddTeacherForm')

                        const modalAddTeacherFormP = document.createElement('p')
                        modalAddTeacherFormP.innerHTML = `Add Teacher`
                        modalAddTeacherForm.appendChild(modalAddTeacherFormP)

                        const addTeacherInfoContainer = document.createElement('div')
                        addTeacherInfoContainer.classList.add('addTeacherInfoContainer')
                        modalAddTeacherForm.appendChild(addTeacherInfoContainer)

                       
                        
                        const inputsContainer = document.createElement('div')
                        inputsContainer.classList.add('inputsContainer')
                        addTeacherInfoContainer.appendChild(inputsContainer)

                        const Firstname = document.createElement('input')
                        Firstname.type = 'text'
                        Firstname.placeholder = 'Firstname'
                        Firstname.name = 'firstname'
                        Firstname.id = 'firstname'
                        inputsContainer.appendChild(Firstname)

                        const Lastname = document.createElement('input')
                        Lastname.type = 'text'
                        Lastname.placeholder = 'Lastname'
                        Lastname.name = 'lastname'
                        Lastname.id = 'lastname'
                        inputsContainer.appendChild(Lastname)
                        
                        const department = document.createElement('select')
                        department.name = 'department'
                        department.id = 'addFormDepartment'
                        department.classList.add('department')
                        const selectDepartment = document.createElement('option')

                        selectDepartment.innerHTML = "SELECT DEPARTMENT"
                        department.appendChild(selectDepartment)

                        const CET = document.createElement('option')
                        CET.value = "CET"
                        CET.innerHTML = "CET"
                        department.appendChild(CET)

                        const CBA = document.createElement('option')
                        CBA.value = "CBA"
                        CBA.innerHTML = "CBA"
                        department.appendChild(CBA)

                        const CEAA = document.createElement('option')
                        CEAA.value = "CEAA"
                        CEAA.innerHTML = "CEAA"
                        department.appendChild(CEAA)

                        const CHM = document.createElement('option')
                        CHM.value = "CHM"
                        CHM.innerHTML = "CHM"
                        department.appendChild(CHM)

                        const CNHS = document.createElement('option')
                        CNHS.value = "CNHS"
                        CNHS.innerHTML = "CNHS"
                        department.appendChild(CNHS)

                        const CCJE = document.createElement('option')
                        CCJE.value = "CCJE"
                        CCJE.innerHTML = "CCJE"
                        department.appendChild(CCJE)


                        

                        const addSubjectsContainer = document.createElement('div')
                        addSubjectsContainer.classList.add('addSubjectsContainer')



                        const addedSubjects = document.createElement('div')
                        addedSubjects.classList.add('addedSubjects')
                        addSubjectsContainer.appendChild(addedSubjects)

                        const toBeAddedSubjects = document.createElement('div')
                        toBeAddedSubjects.classList.add('toBeAddedSubjects')
                        addSubjectsContainer.appendChild(toBeAddedSubjects)

                   
                        
                        const addTeacherButtonContainer = document.createElement('div')
                        addTeacherButtonContainer.classList.add('addTeacherButtonContainer')
                        modalAddTeacherForm.appendChild(addTeacherButtonContainer)

                        const addTeacherButtonContainerButton = document.createElement('button')
                        addTeacherButtonContainerButton.innerHTML = "Add"
                        addTeacherButtonContainer.appendChild(addTeacherButtonContainerButton)

                        const exitBtnModalAddTeacher = document.createElement('div')
                        exitBtnModalAddTeacher.classList.add('exitBtnModalAddTeacher')
                        exitBtnModalAddTeacher.innerHTML = '+'
                        exitBtnModalAddTeacher.onclick = () => {
                            modalAddTeacher.remove()
                        }
                       
                        modalAddTeacherForm.appendChild(exitBtnModalAddTeacher)

                        inputsContainer.appendChild(department)
                        modalAddTeacher.appendChild(modalBackground)
                        modalAddTeacher.appendChild(modalAddTeacherForm)
                        inputsContainer.appendChild(addSubjectsContainer)

                        
                        body.appendChild(modalAddTeacher)
                        formAdd.appendChild(modalAddTeacherForm)
                        modalAddTeacher.appendChild(formAdd)
                    

                    const departmentElement = document.querySelector('.department');
departmentElement.addEventListener('change', () => {
    const toBeAddedSubjectsContainer = document.querySelector('.toBeAddedSubjects');
    toBeAddedSubjectsContainer.innerHTML = '';
    
    const queryString = `/${adminId}/subjectCodes?department=${encodeURIComponent(departmentElement.value)}`;
    fetch(queryString)
        .then((response) => {
            if (!response.ok) {
                throw new Error('The fetch network is not okay.');
            }
            return response.json();
        })
        .then((data) => {
            const toBeAddedSubjects = document.querySelector('.toBeAddedSubjects');
            const addedSubjects = document.querySelector('.addedSubjects');
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'subjectCodes';
            hiddenInput.value = '';
            hiddenInput.id = 'hiddenInput'
            formAdd.appendChild(hiddenInput);
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
                    exitButton.textContent = '+';
                    eachSub.appendChild(exitButton);

                    addedSubjects.appendChild(eachSub);
                    eachToBeAddedSub.remove(); 

                    updateHiddenInput(hiddenInput, subject.code, 'add');
                    console.log(hiddenInput)
                    exitButton.addEventListener('click', () => {
                        eachSub.remove();
                        toBeAddedSubjects.appendChild(eachToBeAddedSub);

                        updateHiddenInput(hiddenInput, subject.code, 'remove');
                    });
                });
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


 formAdd.addEventListener('submit', (event) => {
    event.preventDefault();
    const addedSubjectsElement = document.querySelectorAll('.eachSub');
    const firstnameInput = document.querySelector('#firstname')
    const lastnameInput = document.querySelector('#lastname')
    const depSelect = document.querySelector('#addFormDepartment')

    const addedSubs = [];
    
    addedSubjectsElement.forEach((subject) => {
        addedSubs.push(subject.firstChild.textContent.trim());
    });

    const queryString = `/${adminId}/addForm?firstname=${encodeURIComponent(firstnameInput.value)}&lastname=${encodeURIComponent(lastnameInput.value)}&department=${encodeURIComponent(depSelect.value)}&subjectCodes=${addedSubs}`
    fetch(queryString, {
        method: 'POST'
    }).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error in posting /addForm')
        }
        return response.json()
    }).then((data)=>{
        
    }).catch((error)=>{
        console.log(error.message)
    })

    
});
                                
                            
                        })
            })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }else if(filterContainerSelect.value === "CEAA"){
        instructorListContainer.innerHTML = ""

fetch(`/${adminId}/ceaaDepartmentInstructors`)

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
           .then(data => {

                const { allTeachers } = data;
                for (let teacher of allTeachers) {
                const eachTeacherContainer = document.createElement('div');
                eachTeacherContainer.classList.add('eachTeacherContainer');


                const teacherInfoContainer = document.createElement('div');
                teacherInfoContainer.classList.add('teacherInfoContainer');
                
                const spanName = document.createElement('span')
                spanName.id = 'fullname'
                spanName.innerHTML = `Name: ${teacher.firstname} ${teacher.lastname}` 
                const spanFirstname = document.createElement('span');

                spanFirstname.id = 'firstname';
                spanFirstname.innerHTML = `Firstname: ${teacher.firstname}`;

                const spanLastname = document.createElement('span');
                spanLastname.id = 'lastname';
                spanLastname.innerHTML = `Lastname: ${teacher.lastname}`;

                const spanSubjects = document.createElement('span');
                spanSubjects.id = 'subjects';
                spanSubjects.innerHTML = `Subjects: ${teacher.subjects.map(subject => subject.code).join(', ')}`;

                teacherInfoContainer.appendChild(spanName);
                teacherInfoContainer.appendChild(spanSubjects);
                    
                    

                    const teacherOptionsContainer = document.createElement('div')
                    teacherOptionsContainer.classList.add('teacherOptionsContainer')
                    const updateIcon = document.createElement('div')
                    updateIcon.classList.add('updateIcon')
                    const elementUpdateIconImg = document.createElement('img')
                    elementUpdateIconImg.src = '/images/updateIcon.svg'
                    updateIcon.id = `${teacher.fullname}`
                    updateIcon.appendChild(elementUpdateIconImg)




                    const removeIcon = document.createElement('div')
                    removeIcon.classList.add('removeIcon')
                    const elementRemoveIconImg = document.createElement('img')
                    elementRemoveIconImg.src = '/images/removeIcon.svg'
                    removeIcon.appendChild(elementRemoveIconImg)
                    removeIcon.id = `${teacher.fullname}`



                    teacherOptionsContainer.appendChild(updateIcon)
                    teacherOptionsContainer.appendChild(removeIcon)


                   


                    /* eachTeacherContainer.appendChild(teacherIconContainer) */
                    eachTeacherContainer.appendChild(teacherInfoContainer)
                    eachTeacherContainer.appendChild(teacherOptionsContainer)
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    instructorListContainer.appendChild(addTeacherContainer)

                    const addTeacherContainerH1 = document.createElement('h1')
                    addTeacherContainerH1.innerHTML = "+"
                    addTeacherContainer.appendChild(addTeacherContainerH1)





                const updateIcon = document.querySelectorAll('.updateIcon');

for (let icon of updateIcon) {
    icon.addEventListener('click', () => {

        fetch(`/${adminId}/findTeacher?teacherName=${encodeURIComponent(icon.id)}`).then((response) => {
            if (!response.ok) {
                throw new Error('There is an error while fetching');
            }
            return response.json();
        }).then(data => {
            const foundTeacher = data.foundTeacher;

            const updateFormForm = document.createElement('form');
            updateFormForm.action = `/${adminId}/${foundTeacher._id}/updateForm`;
            updateFormForm.method = 'POST';
            updateFormForm.enctype = 'multipart/form-data';

            const modalUpdate = document.createElement('div');
            modalUpdate.classList.add('modalUpdate');

            const modalBackground = document.createElement('div');
            modalBackground.classList.add('modalBackground');

            const modalUpdateForm = document.createElement('div');
            modalUpdateForm.classList.add('modalUpdateForm');
            updateFormForm.appendChild(modalUpdateForm);

            const modalUpdateFormP = document.createElement('p');
            modalUpdateFormP.innerHTML = `Update Information`;
            modalUpdateForm.appendChild(modalUpdateFormP);

            const updateInfoContainer = document.createElement('div');
            updateInfoContainer.classList.add('updateInfoContainer');
            modalUpdateForm.appendChild(updateInfoContainer);

            const inputsContainer = document.createElement('div');
            inputsContainer.classList.add('inputsContainer');
            updateInfoContainer.appendChild(inputsContainer);

            const Firstname = document.createElement('input');
            Firstname.type = 'text';
            Firstname.placeholder = 'Firstname';
            Firstname.name = 'firstname';
            Firstname.value = `${foundTeacher.firstname}`;
            inputsContainer.appendChild(Firstname);

            const Lastname = document.createElement('input');
            Lastname.type = 'text';
            Lastname.placeholder = 'Lastname';
            Lastname.name = 'lastname';
            Lastname.value = `${foundTeacher.lastname}`;
            inputsContainer.appendChild(Lastname);

            const department = document.createElement('select');
            department.name = 'department';
            department.id = 'updateDepartmentSelect';

            const selectDepartment = document.createElement('option');
            selectDepartment.innerHTML = "SELECT DEPARTMENT";
            department.appendChild(selectDepartment);

            const departments = ["CET", "CBA", "CEAA", "CHM", "CNHS", "CCJE"];
            departments.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep;
                option.innerHTML = dep;
                if (dep === foundTeacher.department) {
                    option.selected = true;
                }
                department.appendChild(option);
            });

            const addSubjectsContainer = document.createElement('div');
            addSubjectsContainer.classList.add('addSubjectsContainer');

            const toBeAddedSubjects = document.createElement('div');
            toBeAddedSubjects.classList.add('toBeAddedSubjects');

            const addedSubjects = document.createElement('div');
            addedSubjects.classList.add('addedSubjects');
            addSubjectsContainer.appendChild(addedSubjects);
            addSubjectsContainer.appendChild(toBeAddedSubjects);

            inputsContainer.appendChild(department);
            inputsContainer.appendChild(addSubjectsContainer);

            department.addEventListener('change', () => {
                console.log('meow');
                fetchAndDisplaySubjects(department.value);
            });

            // Fetch and display subjects
            const fetchAndDisplaySubjects = (department) => {
                fetch(`/${adminId}/getSubjects?subjectIds=${JSON.stringify(foundTeacher.subjects)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching subjects');
                        }
                        return response.json();
                    })
                    .then(subjects => {
                        addedSubjects.innerHTML = ''; // Clear existing subjects
                        subjects.forEach(subject => {
                            addSubjectToAddedSubjects(subject);
                        });

                        return fetch(`/${adminId}/getAvailableSubjects?department=${encodeURIComponent(department)}`);
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching available subjects');
                        }
                        return response.json();
                    })
                    .then(available => {
                        console.log(available)
                        toBeAddedSubjects.innerHTML = ''; // Clear toBeAddedSubjects
                        available.forEach(subject => {
                            if (!foundTeacher.subjects.includes(subject._id)) {
                                addSubjectToToBeAddedSubjects(subject);
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching subjects:', error));
            };

            // Initial fetch of subjects
            fetchAndDisplaySubjects(foundTeacher.department);

            const updateButtonContainer = document.createElement('div');
            updateButtonContainer.classList.add('updateButtonContainer');
            modalUpdateForm.appendChild(updateButtonContainer);

            const updateButtonContainerButton = document.createElement('button');
            updateButtonContainerButton.innerHTML = "Save";
            updateButtonContainerButton.type = 'submit';
            updateButtonContainer.appendChild(updateButtonContainerButton);

            const exitBtnModalUpdate = document.createElement('div');
            exitBtnModalUpdate.classList.add('exitBtnModalUpdate');
            exitBtnModalUpdate.innerHTML = '+';
            exitBtnModalUpdate.onclick = () => {
                modalUpdate.remove();
            };

            modalUpdateForm.appendChild(exitBtnModalUpdate);

            modalUpdate.appendChild(modalBackground);
            modalUpdate.appendChild(updateFormForm);
            document.body.appendChild(modalUpdate);

            // Collecting updated subjects upon form submission
            updateFormForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const updatedSubjects = [];
                addedSubjects.querySelectorAll('.eachSub').forEach(item => {
                    const subjectCode = item.firstChild.textContent.trim();
                    updatedSubjects.push(subjectCode);
                });

                // Add the updated subjects to the form data
                const formData = new FormData(updateFormForm);
                formData.append('subjects', JSON.stringify(updatedSubjects));

                // Send the form data using fetch
                fetch(updateFormForm.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update the instructor');
                    }
                    return response.json();
                }).then(result => {
                    console.log('Instructor updated successfully:', result);
                    modalUpdate.remove();
                }).catch(error => console.error('Error updating instructor:', error));
            });

            function addSubjectToAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    addedSubjects.removeChild(eachSub);
                    addSubjectToToBeAddedSubjects(subject);
                });

                addedSubjects.appendChild(eachSub);
            }

            function addSubjectToToBeAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    toBeAddedSubjects.removeChild(eachSub);
                    addSubjectToAddedSubjects(subject);
                });

                toBeAddedSubjects.appendChild(eachSub);
            }
        }).catch(error => {
            console.error('Error fetching teacher:', error);
        });
    });
}




                const removeIcon = document.querySelectorAll('.removeIcon')

                for(let icon of removeIcon){
                    icon.addEventListener('click', ()=> {
                        const modalRemove = document.createElement('div')
                        modalRemove.classList.add('modalRemove')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')
                        modalRemove.appendChild(modalBackground)


                        const modalRemoveForm = document.createElement('div')
                        modalRemoveForm.classList.add('modalRemoveForm')
                        modalRemove.appendChild(modalRemoveForm)


                        const modalRemoveTextsContainer = document.createElement('div')
                        modalRemoveTextsContainer.classList.add('modalRemoveTextsContainer')
                        const modalRemoveTextsContainerP = document.createElement('p')
                        modalRemoveTextsContainerP.innerHTML = `Are you sure you are going to remove ${icon.id}`
                        modalRemoveTextsContainer.appendChild(modalRemoveTextsContainerP)
                        modalRemoveForm.appendChild(modalRemoveTextsContainer)


                        const modalRemoveButtonsContainer = document.createElement('div')
                        modalRemoveButtonsContainer.classList.add('modalRemoveButtonsContainer')
                        modalRemoveForm.appendChild(modalRemoveButtonsContainer)
                        const modalRemoveButtonsContainerNo = document.createElement('button')
                        modalRemoveButtonsContainerNo.innerHTML = 'No'
                        modalRemoveButtonsContainerNo.id = "confirmNo"

                        const modalRemoveButtonsContainerYes = document.createElement('button')
                        modalRemoveButtonsContainerYes.innerHTML = 'Yes'
                        modalRemoveButtonsContainerYes.id = "confirmYes"


                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerNo)
                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerYes)
                        

                        const exitBtnModalRemove = document.createElement('div')
                        exitBtnModalRemove.classList.add('exitBtnModalRemove')
                        exitBtnModalRemove.innerHTML = '+'
                        modalRemoveForm.appendChild(exitBtnModalRemove)
                        exitBtnModalRemove.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                

                        modalRemoveButtonsContainerNo.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                     
                        
                        modalRemove.classList.remove('modalHidden')
                        body.appendChild(modalRemove)


                        modalRemoveButtonsContainerYes.addEventListener('click', () => {
    const teacherFullName = icon.id; // Assuming the id contains the full name
                            console.log(teacherFullName)
    fetch(`/${adminId}/removeInstructor`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName: teacherFullName }) // Sending the full name in the request body
    })
    .then(response => {
        if (response.ok) {
            // Successfully deleted
            // You can update your UI accordingly
        } else {
            // Handle error
            console.error('Failed to delete teacher');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
});



                    })
                }


                        const addTeacherButton = document.querySelector('.addTeacherContainer')

                        addTeacherButton.addEventListener('click', ()=> {

                        const formAdd = document.createElement('form')
                        formAdd.action ='/addForm'
                        formAdd.method ='POST'
                        formAdd.enctype = 'multipart/form-data'
                        const modalAddTeacher = document.createElement('div')
                        modalAddTeacher.classList.add('modalAddTeacher')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')


                        const modalAddTeacherForm = document.createElement('div')
                        modalAddTeacherForm.classList.add('modalAddTeacherForm')

                        const modalAddTeacherFormP = document.createElement('p')
                        modalAddTeacherFormP.innerHTML = `Add Teacher`
                        modalAddTeacherForm.appendChild(modalAddTeacherFormP)

                        const addTeacherInfoContainer = document.createElement('div')
                        addTeacherInfoContainer.classList.add('addTeacherInfoContainer')
                        modalAddTeacherForm.appendChild(addTeacherInfoContainer)

                       
                        
                        const inputsContainer = document.createElement('div')
                        inputsContainer.classList.add('inputsContainer')
                        addTeacherInfoContainer.appendChild(inputsContainer)

                        const Firstname = document.createElement('input')
                        Firstname.type = 'text'
                        Firstname.placeholder = 'Firstname'
                        Firstname.name = 'firstname'
                        Firstname.id = 'firstname'
                        inputsContainer.appendChild(Firstname)

                        const Lastname = document.createElement('input')
                        Lastname.type = 'text'
                        Lastname.placeholder = 'Lastname'
                        Lastname.name = 'lastname'
                        Lastname.id = 'lastname'
                        inputsContainer.appendChild(Lastname)
                        
                        const department = document.createElement('select')
                        department.name = 'department'
                        department.id = 'addFormDepartment'
                        department.classList.add('department')
                        const selectDepartment = document.createElement('option')

                        selectDepartment.innerHTML = "SELECT DEPARTMENT"
                        department.appendChild(selectDepartment)

                        const CET = document.createElement('option')
                        CET.value = "CET"
                        CET.innerHTML = "CET"
                        department.appendChild(CET)

                        const CBA = document.createElement('option')
                        CBA.value = "CBA"
                        CBA.innerHTML = "CBA"
                        department.appendChild(CBA)

                        const CEAA = document.createElement('option')
                        CEAA.value = "CEAA"
                        CEAA.innerHTML = "CEAA"
                        department.appendChild(CEAA)

                        const CHM = document.createElement('option')
                        CHM.value = "CHM"
                        CHM.innerHTML = "CHM"
                        department.appendChild(CHM)

                        const CNHS = document.createElement('option')
                        CNHS.value = "CNHS"
                        CNHS.innerHTML = "CNHS"
                        department.appendChild(CNHS)

                        const CCJE = document.createElement('option')
                        CCJE.value = "CCJE"
                        CCJE.innerHTML = "CCJE"
                        department.appendChild(CCJE)


                        

                        const addSubjectsContainer = document.createElement('div')
                        addSubjectsContainer.classList.add('addSubjectsContainer')



                        const addedSubjects = document.createElement('div')
                        addedSubjects.classList.add('addedSubjects')
                        addSubjectsContainer.appendChild(addedSubjects)

                        const toBeAddedSubjects = document.createElement('div')
                        toBeAddedSubjects.classList.add('toBeAddedSubjects')
                        addSubjectsContainer.appendChild(toBeAddedSubjects)

                   
                        
                        const addTeacherButtonContainer = document.createElement('div')
                        addTeacherButtonContainer.classList.add('addTeacherButtonContainer')
                        modalAddTeacherForm.appendChild(addTeacherButtonContainer)

                        const addTeacherButtonContainerButton = document.createElement('button')
                        addTeacherButtonContainerButton.innerHTML = "Add"
                        addTeacherButtonContainer.appendChild(addTeacherButtonContainerButton)

                        const exitBtnModalAddTeacher = document.createElement('div')
                        exitBtnModalAddTeacher.classList.add('exitBtnModalAddTeacher')
                        exitBtnModalAddTeacher.innerHTML = '+'
                        exitBtnModalAddTeacher.onclick = () => {
                            modalAddTeacher.remove()
                        }
                       
                        modalAddTeacherForm.appendChild(exitBtnModalAddTeacher)

                        inputsContainer.appendChild(department)
                        modalAddTeacher.appendChild(modalBackground)
                        modalAddTeacher.appendChild(modalAddTeacherForm)
                        inputsContainer.appendChild(addSubjectsContainer)

                        
                        body.appendChild(modalAddTeacher)
                        formAdd.appendChild(modalAddTeacherForm)
                        modalAddTeacher.appendChild(formAdd)
                    

                    const departmentElement = document.querySelector('.department');
departmentElement.addEventListener('change', () => {
    const toBeAddedSubjectsContainer = document.querySelector('.toBeAddedSubjects');
    toBeAddedSubjectsContainer.innerHTML = '';
    
    const queryString = `/${adminId}/subjectCodes?department=${encodeURIComponent(departmentElement.value)}`;
    fetch(queryString)
        .then((response) => {
            if (!response.ok) {
                throw new Error('The fetch network is not okay.');
            }
            return response.json();
        })
        .then((data) => {
            const toBeAddedSubjects = document.querySelector('.toBeAddedSubjects');
            const addedSubjects = document.querySelector('.addedSubjects');
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'subjectCodes';
            hiddenInput.value = '';
            hiddenInput.id = 'hiddenInput'
            formAdd.appendChild(hiddenInput);
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
                    exitButton.textContent = '+';
                    eachSub.appendChild(exitButton);

                    addedSubjects.appendChild(eachSub);
                    eachToBeAddedSub.remove(); 

                    updateHiddenInput(hiddenInput, subject.code, 'add');
                    console.log(hiddenInput)
                    exitButton.addEventListener('click', () => {
                        eachSub.remove();
                        toBeAddedSubjects.appendChild(eachToBeAddedSub);

                        updateHiddenInput(hiddenInput, subject.code, 'remove');
                    });
                });
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


 formAdd.addEventListener('submit', (event) => {
    event.preventDefault();
    const addedSubjectsElement = document.querySelectorAll('.eachSub');
    const firstnameInput = document.querySelector('#firstname')
    const lastnameInput = document.querySelector('#lastname')
    const depSelect = document.querySelector('#addFormDepartment')

    const addedSubs = [];
    
    addedSubjectsElement.forEach((subject) => {
        addedSubs.push(subject.firstChild.textContent.trim());
    });

    const queryString = `/${adminId}/addForm?firstname=${encodeURIComponent(firstnameInput.value)}&lastname=${encodeURIComponent(lastnameInput.value)}&department=${encodeURIComponent(depSelect.value)}&subjectCodes=${addedSubs}`
    fetch(queryString, {
        method: 'POST'
    }).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error in posting /addForm')
        }
        return response.json()
    }).then((data)=>{
        
    }).catch((error)=>{
        console.log(error.message)
    })

    
});
                                
                            
                        })
            })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }else if(filterContainerSelect.value === "CHM"){
        instructorListContainer.innerHTML = ""

fetch(`/${adminId}/chmDepartmentInstructors`)

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
           .then(data => {

                const { allTeachers } = data;
                for (let teacher of allTeachers) {
                const eachTeacherContainer = document.createElement('div');
                eachTeacherContainer.classList.add('eachTeacherContainer');


                const teacherInfoContainer = document.createElement('div');
                teacherInfoContainer.classList.add('teacherInfoContainer');
                
                const spanName = document.createElement('span')
                spanName.id = 'fullname'
                spanName.innerHTML = `Name: ${teacher.firstname} ${teacher.lastname}` 
                const spanFirstname = document.createElement('span');

                spanFirstname.id = 'firstname';
                spanFirstname.innerHTML = `Firstname: ${teacher.firstname}`;

                const spanLastname = document.createElement('span');
                spanLastname.id = 'lastname';
                spanLastname.innerHTML = `Lastname: ${teacher.lastname}`;

                const spanSubjects = document.createElement('span');
                spanSubjects.id = 'subjects';
                spanSubjects.innerHTML = `Subjects: ${teacher.subjects.map(subject => subject.code).join(', ')}`;

                teacherInfoContainer.appendChild(spanName);
                teacherInfoContainer.appendChild(spanSubjects);
                    
                    

                    const teacherOptionsContainer = document.createElement('div')
                    teacherOptionsContainer.classList.add('teacherOptionsContainer')
                    const updateIcon = document.createElement('div')
                    updateIcon.classList.add('updateIcon')
                    const elementUpdateIconImg = document.createElement('img')
                    elementUpdateIconImg.src = '/images/updateIcon.svg'
                    updateIcon.id = `${teacher.fullname}`
                    updateIcon.appendChild(elementUpdateIconImg)




                    const removeIcon = document.createElement('div')
                    removeIcon.classList.add('removeIcon')
                    const elementRemoveIconImg = document.createElement('img')
                    elementRemoveIconImg.src = '/images/removeIcon.svg'
                    removeIcon.appendChild(elementRemoveIconImg)
                    removeIcon.id = `${teacher.fullname}`



                    teacherOptionsContainer.appendChild(updateIcon)
                    teacherOptionsContainer.appendChild(removeIcon)


                   


                    /* eachTeacherContainer.appendChild(teacherIconContainer) */
                    eachTeacherContainer.appendChild(teacherInfoContainer)
                    eachTeacherContainer.appendChild(teacherOptionsContainer)
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    instructorListContainer.appendChild(addTeacherContainer)

                    const addTeacherContainerH1 = document.createElement('h1')
                    addTeacherContainerH1.innerHTML = "+"
                    addTeacherContainer.appendChild(addTeacherContainerH1)





                const updateIcon = document.querySelectorAll('.updateIcon');

for (let icon of updateIcon) {
    icon.addEventListener('click', () => {

        fetch(`/${adminId}/findTeacher?teacherName=${encodeURIComponent(icon.id)}`).then((response) => {
            if (!response.ok) {
                throw new Error('There is an error while fetching');
            }
            return response.json();
        }).then(data => {
            const foundTeacher = data.foundTeacher;

            const updateFormForm = document.createElement('form');
            updateFormForm.action = `/${adminId}/${foundTeacher._id}/updateForm`;
            updateFormForm.method = 'POST';
            updateFormForm.enctype = 'multipart/form-data';

            const modalUpdate = document.createElement('div');
            modalUpdate.classList.add('modalUpdate');

            const modalBackground = document.createElement('div');
            modalBackground.classList.add('modalBackground');

            const modalUpdateForm = document.createElement('div');
            modalUpdateForm.classList.add('modalUpdateForm');
            updateFormForm.appendChild(modalUpdateForm);

            const modalUpdateFormP = document.createElement('p');
            modalUpdateFormP.innerHTML = `Update Information`;
            modalUpdateForm.appendChild(modalUpdateFormP);

            const updateInfoContainer = document.createElement('div');
            updateInfoContainer.classList.add('updateInfoContainer');
            modalUpdateForm.appendChild(updateInfoContainer);

            const inputsContainer = document.createElement('div');
            inputsContainer.classList.add('inputsContainer');
            updateInfoContainer.appendChild(inputsContainer);

            const Firstname = document.createElement('input');
            Firstname.type = 'text';
            Firstname.placeholder = 'Firstname';
            Firstname.name = 'firstname';
            Firstname.value = `${foundTeacher.firstname}`;
            inputsContainer.appendChild(Firstname);

            const Lastname = document.createElement('input');
            Lastname.type = 'text';
            Lastname.placeholder = 'Lastname';
            Lastname.name = 'lastname';
            Lastname.value = `${foundTeacher.lastname}`;
            inputsContainer.appendChild(Lastname);

            const department = document.createElement('select');
            department.name = 'department';
            department.id = 'updateDepartmentSelect';

            const selectDepartment = document.createElement('option');
            selectDepartment.innerHTML = "SELECT DEPARTMENT";
            department.appendChild(selectDepartment);

            const departments = ["CET", "CBA", "CEAA", "CHM", "CNHS", "CCJE"];
            departments.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep;
                option.innerHTML = dep;
                if (dep === foundTeacher.department) {
                    option.selected = true;
                }
                department.appendChild(option);
            });

            const addSubjectsContainer = document.createElement('div');
            addSubjectsContainer.classList.add('addSubjectsContainer');

            const toBeAddedSubjects = document.createElement('div');
            toBeAddedSubjects.classList.add('toBeAddedSubjects');

            const addedSubjects = document.createElement('div');
            addedSubjects.classList.add('addedSubjects');
            addSubjectsContainer.appendChild(addedSubjects);
            addSubjectsContainer.appendChild(toBeAddedSubjects);

            inputsContainer.appendChild(department);
            inputsContainer.appendChild(addSubjectsContainer);

            department.addEventListener('change', () => {
                console.log('meow');
                fetchAndDisplaySubjects(department.value);
            });

            // Fetch and display subjects
            const fetchAndDisplaySubjects = (department) => {
                fetch(`/${adminId}/getSubjects?subjectIds=${JSON.stringify(foundTeacher.subjects)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching subjects');
                        }
                        return response.json();
                    })
                    .then(subjects => {
                        addedSubjects.innerHTML = ''; // Clear existing subjects
                        subjects.forEach(subject => {
                            addSubjectToAddedSubjects(subject);
                        });

                        return fetch(`/${adminId}/getAvailableSubjects?department=${encodeURIComponent(department)}`);
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching available subjects');
                        }
                        return response.json();
                    })
                    .then(available => {
                        console.log(available)
                        toBeAddedSubjects.innerHTML = ''; // Clear toBeAddedSubjects
                        available.forEach(subject => {
                            if (!foundTeacher.subjects.includes(subject._id)) {
                                addSubjectToToBeAddedSubjects(subject);
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching subjects:', error));
            };

            // Initial fetch of subjects
            fetchAndDisplaySubjects(foundTeacher.department);

            const updateButtonContainer = document.createElement('div');
            updateButtonContainer.classList.add('updateButtonContainer');
            modalUpdateForm.appendChild(updateButtonContainer);

            const updateButtonContainerButton = document.createElement('button');
            updateButtonContainerButton.innerHTML = "Save";
            updateButtonContainerButton.type = 'submit';
            updateButtonContainer.appendChild(updateButtonContainerButton);

            const exitBtnModalUpdate = document.createElement('div');
            exitBtnModalUpdate.classList.add('exitBtnModalUpdate');
            exitBtnModalUpdate.innerHTML = '+';
            exitBtnModalUpdate.onclick = () => {
                modalUpdate.remove();
            };

            modalUpdateForm.appendChild(exitBtnModalUpdate);

            modalUpdate.appendChild(modalBackground);
            modalUpdate.appendChild(updateFormForm);
            document.body.appendChild(modalUpdate);

            // Collecting updated subjects upon form submission
            updateFormForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const updatedSubjects = [];
                addedSubjects.querySelectorAll('.eachSub').forEach(item => {
                    const subjectCode = item.firstChild.textContent.trim();
                    updatedSubjects.push(subjectCode);
                });

                // Add the updated subjects to the form data
                const formData = new FormData(updateFormForm);
                formData.append('subjects', JSON.stringify(updatedSubjects));

                // Send the form data using fetch
                fetch(updateFormForm.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update the instructor');
                    }
                    return response.json();
                }).then(result => {
                    console.log('Instructor updated successfully:', result);
                    modalUpdate.remove();
                }).catch(error => console.error('Error updating instructor:', error));
            });

            function addSubjectToAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    addedSubjects.removeChild(eachSub);
                    addSubjectToToBeAddedSubjects(subject);
                });

                addedSubjects.appendChild(eachSub);
            }

            function addSubjectToToBeAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    toBeAddedSubjects.removeChild(eachSub);
                    addSubjectToAddedSubjects(subject);
                });

                toBeAddedSubjects.appendChild(eachSub);
            }
        }).catch(error => {
            console.error('Error fetching teacher:', error);
        });
    });
}



                const removeIcon = document.querySelectorAll('.removeIcon')

                for(let icon of removeIcon){
                    icon.addEventListener('click', ()=> {
                        const modalRemove = document.createElement('div')
                        modalRemove.classList.add('modalRemove')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')
                        modalRemove.appendChild(modalBackground)


                        const modalRemoveForm = document.createElement('div')
                        modalRemoveForm.classList.add('modalRemoveForm')
                        modalRemove.appendChild(modalRemoveForm)


                        const modalRemoveTextsContainer = document.createElement('div')
                        modalRemoveTextsContainer.classList.add('modalRemoveTextsContainer')
                        const modalRemoveTextsContainerP = document.createElement('p')
                        modalRemoveTextsContainerP.innerHTML = `Are you sure you are going to remove ${icon.id}`
                        modalRemoveTextsContainer.appendChild(modalRemoveTextsContainerP)
                        modalRemoveForm.appendChild(modalRemoveTextsContainer)


                        const modalRemoveButtonsContainer = document.createElement('div')
                        modalRemoveButtonsContainer.classList.add('modalRemoveButtonsContainer')
                        modalRemoveForm.appendChild(modalRemoveButtonsContainer)
                        const modalRemoveButtonsContainerNo = document.createElement('button')
                        modalRemoveButtonsContainerNo.innerHTML = 'No'
                        modalRemoveButtonsContainerNo.id = "confirmNo"

                        const modalRemoveButtonsContainerYes = document.createElement('button')
                        modalRemoveButtonsContainerYes.innerHTML = 'Yes'
                        modalRemoveButtonsContainerYes.id = "confirmYes"


                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerNo)
                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerYes)
                        

                        const exitBtnModalRemove = document.createElement('div')
                        exitBtnModalRemove.classList.add('exitBtnModalRemove')
                        exitBtnModalRemove.innerHTML = '+'
                        modalRemoveForm.appendChild(exitBtnModalRemove)
                        exitBtnModalRemove.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                

                        modalRemoveButtonsContainerNo.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                     
                        
                        modalRemove.classList.remove('modalHidden')
                        body.appendChild(modalRemove)


                        modalRemoveButtonsContainerYes.addEventListener('click', () => {
    const teacherFullName = icon.id; // Assuming the id contains the full name
                            console.log(teacherFullName)
    fetch(`/${adminId}/removeInstructor`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName: teacherFullName }) // Sending the full name in the request body
    })
    .then(response => {
        if (response.ok) {
            // Successfully deleted
            // You can update your UI accordingly
        } else {
            // Handle error
            console.error('Failed to delete teacher');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
});



                    })
                }


                        const addTeacherButton = document.querySelector('.addTeacherContainer')

                        addTeacherButton.addEventListener('click', ()=> {

                        const formAdd = document.createElement('form')
                        formAdd.action ='/addForm'
                        formAdd.method ='POST'
                        formAdd.enctype = 'multipart/form-data'
                        const modalAddTeacher = document.createElement('div')
                        modalAddTeacher.classList.add('modalAddTeacher')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')


                        const modalAddTeacherForm = document.createElement('div')
                        modalAddTeacherForm.classList.add('modalAddTeacherForm')

                        const modalAddTeacherFormP = document.createElement('p')
                        modalAddTeacherFormP.innerHTML = `Add Teacher`
                        modalAddTeacherForm.appendChild(modalAddTeacherFormP)

                        const addTeacherInfoContainer = document.createElement('div')
                        addTeacherInfoContainer.classList.add('addTeacherInfoContainer')
                        modalAddTeacherForm.appendChild(addTeacherInfoContainer)

                       
                        
                        const inputsContainer = document.createElement('div')
                        inputsContainer.classList.add('inputsContainer')
                        addTeacherInfoContainer.appendChild(inputsContainer)

                        const Firstname = document.createElement('input')
                        Firstname.type = 'text'
                        Firstname.placeholder = 'Firstname'
                        Firstname.name = 'firstname'
                        Firstname.id = 'firstname'
                        inputsContainer.appendChild(Firstname)

                        const Lastname = document.createElement('input')
                        Lastname.type = 'text'
                        Lastname.placeholder = 'Lastname'
                        Lastname.name = 'lastname'
                        Lastname.id = 'lastname'
                        inputsContainer.appendChild(Lastname)
                        
                        const department = document.createElement('select')
                        department.name = 'department'
                        department.id = 'addFormDepartment'
                        department.classList.add('department')
                        const selectDepartment = document.createElement('option')

                        selectDepartment.innerHTML = "SELECT DEPARTMENT"
                        department.appendChild(selectDepartment)

                        const CET = document.createElement('option')
                        CET.value = "CET"
                        CET.innerHTML = "CET"
                        department.appendChild(CET)

                        const CBA = document.createElement('option')
                        CBA.value = "CBA"
                        CBA.innerHTML = "CBA"
                        department.appendChild(CBA)

                        const CEAA = document.createElement('option')
                        CEAA.value = "CEAA"
                        CEAA.innerHTML = "CEAA"
                        department.appendChild(CEAA)

                        const CHM = document.createElement('option')
                        CHM.value = "CHM"
                        CHM.innerHTML = "CHM"
                        department.appendChild(CHM)

                        const CNHS = document.createElement('option')
                        CNHS.value = "CNHS"
                        CNHS.innerHTML = "CNHS"
                        department.appendChild(CNHS)

                        const CCJE = document.createElement('option')
                        CCJE.value = "CCJE"
                        CCJE.innerHTML = "CCJE"
                        department.appendChild(CCJE)


                        

                        const addSubjectsContainer = document.createElement('div')
                        addSubjectsContainer.classList.add('addSubjectsContainer')



                        const addedSubjects = document.createElement('div')
                        addedSubjects.classList.add('addedSubjects')
                        addSubjectsContainer.appendChild(addedSubjects)

                        const toBeAddedSubjects = document.createElement('div')
                        toBeAddedSubjects.classList.add('toBeAddedSubjects')
                        addSubjectsContainer.appendChild(toBeAddedSubjects)

                   
                        
                        const addTeacherButtonContainer = document.createElement('div')
                        addTeacherButtonContainer.classList.add('addTeacherButtonContainer')
                        modalAddTeacherForm.appendChild(addTeacherButtonContainer)

                        const addTeacherButtonContainerButton = document.createElement('button')
                        addTeacherButtonContainerButton.innerHTML = "Add"
                        addTeacherButtonContainer.appendChild(addTeacherButtonContainerButton)

                        const exitBtnModalAddTeacher = document.createElement('div')
                        exitBtnModalAddTeacher.classList.add('exitBtnModalAddTeacher')
                        exitBtnModalAddTeacher.innerHTML = '+'
                        exitBtnModalAddTeacher.onclick = () => {
                            modalAddTeacher.remove()
                        }
                       
                        modalAddTeacherForm.appendChild(exitBtnModalAddTeacher)

                        inputsContainer.appendChild(department)
                        modalAddTeacher.appendChild(modalBackground)
                        modalAddTeacher.appendChild(modalAddTeacherForm)
                        inputsContainer.appendChild(addSubjectsContainer)

                        
                        body.appendChild(modalAddTeacher)
                        formAdd.appendChild(modalAddTeacherForm)
                        modalAddTeacher.appendChild(formAdd)
                    

                    const departmentElement = document.querySelector('.department');
departmentElement.addEventListener('change', () => {
    const toBeAddedSubjectsContainer = document.querySelector('.toBeAddedSubjects');
    toBeAddedSubjectsContainer.innerHTML = '';
    
    const queryString = `/${adminId}/subjectCodes?department=${encodeURIComponent(departmentElement.value)}`;
    fetch(queryString)
        .then((response) => {
            if (!response.ok) {
                throw new Error('The fetch network is not okay.');
            }
            return response.json();
        })
        .then((data) => {
            const toBeAddedSubjects = document.querySelector('.toBeAddedSubjects');
            const addedSubjects = document.querySelector('.addedSubjects');
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'subjectCodes';
            hiddenInput.value = '';
            hiddenInput.id = 'hiddenInput'
            formAdd.appendChild(hiddenInput);
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
                    exitButton.textContent = '+';
                    eachSub.appendChild(exitButton);

                    addedSubjects.appendChild(eachSub);
                    eachToBeAddedSub.remove(); 

                    updateHiddenInput(hiddenInput, subject.code, 'add');
                    console.log(hiddenInput)
                    exitButton.addEventListener('click', () => {
                        eachSub.remove();
                        toBeAddedSubjects.appendChild(eachToBeAddedSub);

                        updateHiddenInput(hiddenInput, subject.code, 'remove');
                    });
                });
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


 formAdd.addEventListener('submit', (event) => {
    event.preventDefault();
    const addedSubjectsElement = document.querySelectorAll('.eachSub');
    const firstnameInput = document.querySelector('#firstname')
    const lastnameInput = document.querySelector('#lastname')
    const depSelect = document.querySelector('#addFormDepartment')

    const addedSubs = [];
    
    addedSubjectsElement.forEach((subject) => {
        addedSubs.push(subject.firstChild.textContent.trim());
    });

    const queryString = `/${adminId}/addForm?firstname=${encodeURIComponent(firstnameInput.value)}&lastname=${encodeURIComponent(lastnameInput.value)}&department=${encodeURIComponent(depSelect.value)}&subjectCodes=${addedSubs}`
    fetch(queryString, {
        method: 'POST'
    }).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error in posting /addForm')
        }
        return response.json()
    }).then((data)=>{
        
    }).catch((error)=>{
        console.log(error.message)
    })

    
});
                                
                            
                        })
            })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }else if(filterContainerSelect.value === "CNHS"){

        instructorListContainer.innerHTML = ""
        fetch(`/${adminId}/cnhsDepartmentInstructors`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {

                const { allTeachers } = data;
                for (let teacher of allTeachers) {

                console.log(allTeachers)

                const eachTeacherContainer = document.createElement('div');
                eachTeacherContainer.classList.add('eachTeacherContainer');


                const teacherInfoContainer = document.createElement('div');
                teacherInfoContainer.classList.add('teacherInfoContainer');
                
                const spanName = document.createElement('span')
                spanName.id = 'fullname'
                spanName.innerHTML = `Name: ${teacher.firstname} ${teacher.lastname}` 
                const spanFirstname = document.createElement('span');

                spanFirstname.id = 'firstname';
                spanFirstname.innerHTML = `Firstname: ${teacher.firstname}`;

                const spanLastname = document.createElement('span');
                spanLastname.id = 'lastname';
                spanLastname.innerHTML = `Lastname: ${teacher.lastname}`;

                const spanSubjects = document.createElement('span');
                spanSubjects.id = 'subjects';
                spanSubjects.innerHTML = `Subjects: ${teacher.subjects.map(subject => subject.code).join(', ')}`;

                teacherInfoContainer.appendChild(spanName);
                teacherInfoContainer.appendChild(spanSubjects);
                    
                    

                    const teacherOptionsContainer = document.createElement('div')
                    teacherOptionsContainer.classList.add('teacherOptionsContainer')
                    const updateIcon = document.createElement('div')
                    updateIcon.classList.add('updateIcon')
                    const elementUpdateIconImg = document.createElement('img')
                    elementUpdateIconImg.src = '/images/updateIcon.svg'
                    updateIcon.id = `${teacher.fullname}`
                    updateIcon.appendChild(elementUpdateIconImg)




                    const removeIcon = document.createElement('div')
                    removeIcon.classList.add('removeIcon')
                    const elementRemoveIconImg = document.createElement('img')
                    elementRemoveIconImg.src = '/images/removeIcon.svg'
                    removeIcon.appendChild(elementRemoveIconImg)
                    removeIcon.id = `${teacher.fullname}`



                    teacherOptionsContainer.appendChild(updateIcon)
                    teacherOptionsContainer.appendChild(removeIcon)


                   


                    /* eachTeacherContainer.appendChild(teacherIconContainer) */
                    eachTeacherContainer.appendChild(teacherInfoContainer)
                    eachTeacherContainer.appendChild(teacherOptionsContainer)
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    instructorListContainer.appendChild(addTeacherContainer)

                    const addTeacherContainerH1 = document.createElement('h1')
                    addTeacherContainerH1.innerHTML = "+"
                    addTeacherContainer.appendChild(addTeacherContainerH1)





                const updateIcon = document.querySelectorAll('.updateIcon');

for (let icon of updateIcon) {
    icon.addEventListener('click', () => {

        fetch(`/${adminId}/findTeacher?teacherName=${encodeURIComponent(icon.id)}`).then((response) => {
            if (!response.ok) {
                throw new Error('There is an error while fetching');
            }
            return response.json();
        }).then(data => {
            const foundTeacher = data.foundTeacher;

            const updateFormForm = document.createElement('form');
            updateFormForm.action = `/${adminId}/${foundTeacher._id}/updateForm`;
            updateFormForm.method = 'POST';
            updateFormForm.enctype = 'multipart/form-data';

            const modalUpdate = document.createElement('div');
            modalUpdate.classList.add('modalUpdate');

            const modalBackground = document.createElement('div');
            modalBackground.classList.add('modalBackground');

            const modalUpdateForm = document.createElement('div');
            modalUpdateForm.classList.add('modalUpdateForm');
            updateFormForm.appendChild(modalUpdateForm);

            const modalUpdateFormP = document.createElement('p');
            modalUpdateFormP.innerHTML = `Update Information`;
            modalUpdateForm.appendChild(modalUpdateFormP);

            const updateInfoContainer = document.createElement('div');
            updateInfoContainer.classList.add('updateInfoContainer');
            modalUpdateForm.appendChild(updateInfoContainer);

            const inputsContainer = document.createElement('div');
            inputsContainer.classList.add('inputsContainer');
            updateInfoContainer.appendChild(inputsContainer);

            const Firstname = document.createElement('input');
            Firstname.type = 'text';
            Firstname.placeholder = 'Firstname';
            Firstname.name = 'firstname';
            Firstname.value = `${foundTeacher.firstname}`;
            inputsContainer.appendChild(Firstname);

            const Lastname = document.createElement('input');
            Lastname.type = 'text';
            Lastname.placeholder = 'Lastname';
            Lastname.name = 'lastname';
            Lastname.value = `${foundTeacher.lastname}`;
            inputsContainer.appendChild(Lastname);

            const department = document.createElement('select');
            department.name = 'department';
            department.id = 'updateDepartmentSelect';

            const selectDepartment = document.createElement('option');
            selectDepartment.innerHTML = "SELECT DEPARTMENT";
            department.appendChild(selectDepartment);

            const departments = ["CET", "CBA", "CEAA", "CHM", "CNHS", "CCJE"];
            departments.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep;
                option.innerHTML = dep;
                if (dep === foundTeacher.department) {
                    option.selected = true;
                }
                department.appendChild(option);
            });

            const addSubjectsContainer = document.createElement('div');
            addSubjectsContainer.classList.add('addSubjectsContainer');

            const toBeAddedSubjects = document.createElement('div');
            toBeAddedSubjects.classList.add('toBeAddedSubjects');

            const addedSubjects = document.createElement('div');
            addedSubjects.classList.add('addedSubjects');
            addSubjectsContainer.appendChild(addedSubjects);
            addSubjectsContainer.appendChild(toBeAddedSubjects);

            inputsContainer.appendChild(department);
            inputsContainer.appendChild(addSubjectsContainer);

            department.addEventListener('change', () => {
                console.log('meow');
                fetchAndDisplaySubjects(department.value);
            });

            // Fetch and display subjects
            const fetchAndDisplaySubjects = (department) => {
                fetch(`/${adminId}/getTeacherSubjects?subjectIds=${JSON.stringify(foundTeacher.subjects)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching subjects');
                        }
                        return response.json();
                    })
                    .then(subjects => {
                        addedSubjects.innerHTML = ''; // Clear existing subjects
                        subjects.forEach(subject => {
                            addSubjectToAddedSubjects(subject);
                        });

                        return fetch(`/${adminId}/getAvailableSubjects?department=${encodeURIComponent(department)}`);
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching available subjects');
                        }
                        return response.json();
                    })
                    .then(available => {
                        toBeAddedSubjects.innerHTML = ''; // Clear toBeAddedSubjects
                        available.forEach(subject => {
                            if (!foundTeacher.subjects.includes(subject._id)) {
                                addSubjectToToBeAddedSubjects(subject);
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching subjects:', error));
            };

            // Initial fetch of subjects
            fetchAndDisplaySubjects(foundTeacher.department);

            const updateButtonContainer = document.createElement('div');
            updateButtonContainer.classList.add('updateButtonContainer');
            modalUpdateForm.appendChild(updateButtonContainer);

            const updateButtonContainerButton = document.createElement('button');
            updateButtonContainerButton.innerHTML = "Save";
            updateButtonContainerButton.type = 'submit';
            updateButtonContainer.appendChild(updateButtonContainerButton);

            const exitBtnModalUpdate = document.createElement('div');
            exitBtnModalUpdate.classList.add('exitBtnModalUpdate');
            exitBtnModalUpdate.innerHTML = '+';
            exitBtnModalUpdate.onclick = () => {
                modalUpdate.remove();
            };

            modalUpdateForm.appendChild(exitBtnModalUpdate);

            modalUpdate.appendChild(modalBackground);
            modalUpdate.appendChild(updateFormForm);
            document.body.appendChild(modalUpdate);

            // Collecting updated subjects upon form submission
            updateFormForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const updatedSubjects = [];
                addedSubjects.querySelectorAll('.eachSub').forEach(item => {
                    const subjectCode = item.firstChild.textContent.trim();
                    updatedSubjects.push(subjectCode);
                });

                // Add the updated subjects to the form data
                const formData = new FormData(updateFormForm);
                formData.append('subjects', JSON.stringify(updatedSubjects));

                // Send the form data using fetch
                fetch(updateFormForm.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update the instructor');
                    }
                    return response.json();
                }).then(result => {
                    console.log('Instructor updated successfully:', result);
                    modalUpdate.remove();
                }).catch(error => console.error('Error updating instructor:', error));
            });

            function addSubjectToAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    addedSubjects.removeChild(eachSub);
                    addSubjectToToBeAddedSubjects(subject);
                });

                addedSubjects.appendChild(eachSub);
            }

            function addSubjectToToBeAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    toBeAddedSubjects.removeChild(eachSub);
                    addSubjectToAddedSubjects(subject);
                });

                toBeAddedSubjects.appendChild(eachSub);
            }
        }).catch(error => {
            console.error('Error fetching teacher:', error);
        });
    });
}




                const removeIcon = document.querySelectorAll('.removeIcon')

                for(let icon of removeIcon){
                    icon.addEventListener('click', ()=> {
                        const modalRemove = document.createElement('div')
                        modalRemove.classList.add('modalRemove')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')
                        modalRemove.appendChild(modalBackground)


                        const modalRemoveForm = document.createElement('div')
                        modalRemoveForm.classList.add('modalRemoveForm')
                        modalRemove.appendChild(modalRemoveForm)


                        const modalRemoveTextsContainer = document.createElement('div')
                        modalRemoveTextsContainer.classList.add('modalRemoveTextsContainer')
                        const modalRemoveTextsContainerP = document.createElement('p')
                        modalRemoveTextsContainerP.innerHTML = `Are you sure you are going to remove ${icon.id}`
                        modalRemoveTextsContainer.appendChild(modalRemoveTextsContainerP)
                        modalRemoveForm.appendChild(modalRemoveTextsContainer)


                        const modalRemoveButtonsContainer = document.createElement('div')
                        modalRemoveButtonsContainer.classList.add('modalRemoveButtonsContainer')
                        modalRemoveForm.appendChild(modalRemoveButtonsContainer)
                        const modalRemoveButtonsContainerNo = document.createElement('button')
                        modalRemoveButtonsContainerNo.innerHTML = 'No'
                        modalRemoveButtonsContainerNo.id = "confirmNo"

                        const modalRemoveButtonsContainerYes = document.createElement('button')
                        modalRemoveButtonsContainerYes.innerHTML = 'Yes'
                        modalRemoveButtonsContainerYes.id = "confirmYes"


                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerNo)
                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerYes)
                        

                        const exitBtnModalRemove = document.createElement('div')
                        exitBtnModalRemove.classList.add('exitBtnModalRemove')
                        exitBtnModalRemove.innerHTML = '+'
                        modalRemoveForm.appendChild(exitBtnModalRemove)
                        exitBtnModalRemove.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                

                        modalRemoveButtonsContainerNo.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                     
                        
                        modalRemove.classList.remove('modalHidden')
                        body.appendChild(modalRemove)


                        modalRemoveButtonsContainerYes.addEventListener('click', () => {
    const teacherFullName = icon.id; // Assuming the id contains the full name
    fetch(`/${adminId}/removeInstructor`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName: teacherFullName }) // Sending the full name in the request body
    })
    .then(response => {
        if (response.ok) {
            // Successfully deleted
            // You can update your UI accordingly
        } else {
            // Handle error
            console.error('Failed to delete teacher');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
});



                    })
                }


                        const addTeacherButton = document.querySelector('.addTeacherContainer')

                        addTeacherButton.addEventListener('click', ()=> {

                        const formAdd = document.createElement('form')
                        formAdd.action ='/addForm'
                        formAdd.method ='POST'
                        formAdd.enctype = 'multipart/form-data'
                        const modalAddTeacher = document.createElement('div')
                        modalAddTeacher.classList.add('modalAddTeacher')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')


                        const modalAddTeacherForm = document.createElement('div')
                        modalAddTeacherForm.classList.add('modalAddTeacherForm')

                        const modalAddTeacherFormP = document.createElement('p')
                        modalAddTeacherFormP.innerHTML = `Add Teacher`
                        modalAddTeacherForm.appendChild(modalAddTeacherFormP)

                        const addTeacherInfoContainer = document.createElement('div')
                        addTeacherInfoContainer.classList.add('addTeacherInfoContainer')
                        modalAddTeacherForm.appendChild(addTeacherInfoContainer)

                       
                        
                        const inputsContainer = document.createElement('div')
                        inputsContainer.classList.add('inputsContainer')
                        addTeacherInfoContainer.appendChild(inputsContainer)

                        const Firstname = document.createElement('input')
                        Firstname.type = 'text'
                        Firstname.placeholder = 'Firstname'
                        Firstname.name = 'firstname'
                        Firstname.id = 'firstname'
                        inputsContainer.appendChild(Firstname)

                        const Lastname = document.createElement('input')
                        Lastname.type = 'text'
                        Lastname.placeholder = 'Lastname'
                        Lastname.name = 'lastname'
                        Lastname.id = 'lastname'
                        inputsContainer.appendChild(Lastname)
                        
                        const department = document.createElement('select')
                        department.name = 'department'
                        department.id = 'addFormDepartment'
                        department.classList.add('department')
                        const selectDepartment = document.createElement('option')

                        selectDepartment.innerHTML = "SELECT DEPARTMENT"
                        department.appendChild(selectDepartment)

                        const CET = document.createElement('option')
                        CET.value = "CET"
                        CET.innerHTML = "CET"
                        department.appendChild(CET)

                        const CBA = document.createElement('option')
                        CBA.value = "CBA"
                        CBA.innerHTML = "CBA"
                        department.appendChild(CBA)

                        const CEAA = document.createElement('option')
                        CEAA.value = "CEAA"
                        CEAA.innerHTML = "CEAA"
                        department.appendChild(CEAA)

                        const CHM = document.createElement('option')
                        CHM.value = "CHM"
                        CHM.innerHTML = "CHM"
                        department.appendChild(CHM)

                        const CNHS = document.createElement('option')
                        CNHS.value = "CNHS"
                        CNHS.innerHTML = "CNHS"
                        department.appendChild(CNHS)

                        const CCJE = document.createElement('option')
                        CCJE.value = "CCJE"
                        CCJE.innerHTML = "CCJE"
                        department.appendChild(CCJE)


                        

                        const addSubjectsContainer = document.createElement('div')
                        addSubjectsContainer.classList.add('addSubjectsContainer')



                        const addedSubjects = document.createElement('div')
                        addedSubjects.classList.add('addedSubjects')
                        addSubjectsContainer.appendChild(addedSubjects)

                        const toBeAddedSubjects = document.createElement('div')
                        toBeAddedSubjects.classList.add('toBeAddedSubjects')
                        addSubjectsContainer.appendChild(toBeAddedSubjects)

                   
                        
                        const addTeacherButtonContainer = document.createElement('div')
                        addTeacherButtonContainer.classList.add('addTeacherButtonContainer')
                        modalAddTeacherForm.appendChild(addTeacherButtonContainer)

                        const addTeacherButtonContainerButton = document.createElement('button')
                        addTeacherButtonContainerButton.innerHTML = "Add"
                        addTeacherButtonContainer.appendChild(addTeacherButtonContainerButton)

                        const exitBtnModalAddTeacher = document.createElement('div')
                        exitBtnModalAddTeacher.classList.add('exitBtnModalAddTeacher')
                        exitBtnModalAddTeacher.innerHTML = '+'
                        exitBtnModalAddTeacher.onclick = () => {
                            modalAddTeacher.remove()
                        }
                       
                        modalAddTeacherForm.appendChild(exitBtnModalAddTeacher)

                        inputsContainer.appendChild(department)
                        modalAddTeacher.appendChild(modalBackground)
                        modalAddTeacher.appendChild(modalAddTeacherForm)
                        inputsContainer.appendChild(addSubjectsContainer)

                        
                        body.appendChild(modalAddTeacher)
                        formAdd.appendChild(modalAddTeacherForm)
                        modalAddTeacher.appendChild(formAdd)
                    

                    const departmentElement = document.querySelector('.department');
departmentElement.addEventListener('change', () => {
    const toBeAddedSubjectsContainer = document.querySelector('.toBeAddedSubjects');
    toBeAddedSubjectsContainer.innerHTML = '';
    
    const queryString = `/${adminId}/subjectCodes?department=${encodeURIComponent(departmentElement.value)}`;
    fetch(queryString)
        .then((response) => {
            if (!response.ok) {
                throw new Error('The fetch network is not okay.');
            }
            return response.json();
        })
        .then((data) => {
            const toBeAddedSubjects = document.querySelector('.toBeAddedSubjects');
            const addedSubjects = document.querySelector('.addedSubjects');
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'subjectCodes';
            hiddenInput.value = '';
            hiddenInput.id = 'hiddenInput'
            formAdd.appendChild(hiddenInput);
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
                    exitButton.textContent = '+';
                    eachSub.appendChild(exitButton);

                    addedSubjects.appendChild(eachSub);
                    eachToBeAddedSub.remove(); 

                    updateHiddenInput(hiddenInput, subject.code, 'add');
                    exitButton.addEventListener('click', () => {
                        eachSub.remove();
                        toBeAddedSubjects.appendChild(eachToBeAddedSub);

                        updateHiddenInput(hiddenInput, subject.code, 'remove');
                    });
                });
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


 formAdd.addEventListener('submit', (event) => {
    event.preventDefault();
    const addedSubjectsElement = document.querySelectorAll('.eachSub');
    const firstnameInput = document.querySelector('#firstname')
    const lastnameInput = document.querySelector('#lastname')
    const depSelect = document.querySelector('#addFormDepartment')

    const addedSubs = [];
    
    addedSubjectsElement.forEach((subject) => {
        addedSubs.push(subject.firstChild.textContent.trim());
    });

    const queryString = `/${adminId}/addForm?firstname=${encodeURIComponent(firstnameInput.value)}&lastname=${encodeURIComponent(lastnameInput.value)}&department=${encodeURIComponent(depSelect.value)}&subjectCodes=${addedSubs}`
    fetch(queryString, {
        method: 'POST'
    }).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error in posting /addForm')
        }
        return response.json()
    }).then((data)=>{
        formAdd.reset()
        modalAddTeacher.remove()
    }).catch((error)=>{
        console.log(error.message)
    })

    
});
                                
                            
                        })
            }).catch((e)=>{
                 console.log(e.message)
            })
        i/* nstructorListContainer.innerHTML = ""

        fetch(`/${adminId}/cnhsDepartmentInstructors`)

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
           .then(data => {

                const { allTeachers } = data;
                console.log(allTeachers)
                for (let teacher of allTeachers) {
                const eachTeacherContainer = document.createElement('div');
                eachTeacherContainer.classList.add('eachTeacherContainer');


                const teacherInfoContainer = document.createElement('div');
                teacherInfoContainer.classList.add('teacherInfoContainer');
                
                const spanName = document.createElement('span')
                spanName.id = 'fullname'
                spanName.innerHTML = `Name: ${teacher.firstname} ${teacher.lastname}` 
                const spanFirstname = document.createElement('span');

                spanFirstname.id = 'firstname';
                spanFirstname.innerHTML = `Firstname: ${teacher.firstname}`;

                const spanLastname = document.createElement('span');
                spanLastname.id = 'lastname';
                spanLastname.innerHTML = `Lastname: ${teacher.lastname}`;

                const spanSubjects = document.createElement('span');
                spanSubjects.id = 'subjects';
                spanSubjects.innerHTML = `Subjects: ${teacher.subjects.map(subject => subject.code).join(', ')}`;

                teacherInfoContainer.appendChild(spanName);
                teacherInfoContainer.appendChild(spanSubjects);
                    
                    

                    const teacherOptionsContainer = document.createElement('div')
                    teacherOptionsContainer.classList.add('teacherOptionsContainer')
                    const updateIcon = document.createElement('div')
                    updateIcon.classList.add('updateIcon')
                    const elementUpdateIconImg = document.createElement('img')
                    elementUpdateIconImg.src = '/images/updateIcon.svg'
                    updateIcon.id = `${teacher.fullname}`
                    updateIcon.appendChild(elementUpdateIconImg)




                    const removeIcon = document.createElement('div')
                    removeIcon.classList.add('removeIcon')
                    const elementRemoveIconImg = document.createElement('img')
                    elementRemoveIconImg.src = '/images/removeIcon.svg'
                    removeIcon.appendChild(elementRemoveIconImg)
                    removeIcon.id = `${teacher.fullname}`



                    teacherOptionsContainer.appendChild(updateIcon)
                    teacherOptionsContainer.appendChild(removeIcon)


                   


                    eachTeacherContainer.appendChild(teacherInfoContainer)
                    eachTeacherContainer.appendChild(teacherOptionsContainer)
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    instructorListContainer.appendChild(addTeacherContainer)

                    const addTeacherContainerH1 = document.createElement('h1')
                    addTeacherContainerH1.innerHTML = "+"
                    addTeacherContainer.appendChild(addTeacherContainerH1)





                const updateIcon = document.querySelectorAll('.updateIcon');

for (let icon of updateIcon) {
    icon.addEventListener('click', () => {

        fetch(`/${adminId}/findTeacher?teacherName=${encodeURIComponent(icon.id)}`).then((response) => {
            if (!response.ok) {
                throw new Error('There is an error while fetching');
            }
            return response.json();
        }).then(data => {
            const foundTeacher = data.foundTeacher;

            const updateFormForm = document.createElement('form');
            updateFormForm.action = `/${adminId}/${foundTeacher._id}/updateForm`;
            updateFormForm.method = 'POST';
            updateFormForm.enctype = 'multipart/form-data';

            const modalUpdate = document.createElement('div');
            modalUpdate.classList.add('modalUpdate');

            const modalBackground = document.createElement('div');
            modalBackground.classList.add('modalBackground');

            const modalUpdateForm = document.createElement('div');
            modalUpdateForm.classList.add('modalUpdateForm');
            updateFormForm.appendChild(modalUpdateForm);

            const modalUpdateFormP = document.createElement('p');
            modalUpdateFormP.innerHTML = `Update Information`;
            modalUpdateForm.appendChild(modalUpdateFormP);

            const updateInfoContainer = document.createElement('div');
            updateInfoContainer.classList.add('updateInfoContainer');
            modalUpdateForm.appendChild(updateInfoContainer);

            const inputsContainer = document.createElement('div');
            inputsContainer.classList.add('inputsContainer');
            updateInfoContainer.appendChild(inputsContainer);

            const Firstname = document.createElement('input');
            Firstname.type = 'text';
            Firstname.placeholder = 'Firstname';
            Firstname.name = 'firstname';
            Firstname.value = `${foundTeacher.firstname}`;
            inputsContainer.appendChild(Firstname);

            const Lastname = document.createElement('input');
            Lastname.type = 'text';
            Lastname.placeholder = 'Lastname';
            Lastname.name = 'lastname';
            Lastname.value = `${foundTeacher.lastname}`;
            inputsContainer.appendChild(Lastname);

            const department = document.createElement('select');
            department.name = 'department';
            department.id = 'updateDepartmentSelect';

            const selectDepartment = document.createElement('option');
            selectDepartment.innerHTML = "SELECT DEPARTMENT";
            department.appendChild(selectDepartment);

            const departments = ["CET", "CBA", "CEAA", "CHM", "CNHS", "CCJE"];
            departments.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep;
                option.innerHTML = dep;
                if (dep === foundTeacher.department) {
                    option.selected = true;
                }
                department.appendChild(option);
            });

            const addSubjectsContainer = document.createElement('div');
            addSubjectsContainer.classList.add('addSubjectsContainer');

            const toBeAddedSubjects = document.createElement('div');
            toBeAddedSubjects.classList.add('toBeAddedSubjects');

            const addedSubjects = document.createElement('div');
            addedSubjects.classList.add('addedSubjects');
            addSubjectsContainer.appendChild(addedSubjects);
            addSubjectsContainer.appendChild(toBeAddedSubjects);

            inputsContainer.appendChild(department);
            inputsContainer.appendChild(addSubjectsContainer);

            department.addEventListener('change', () => {
                fetchAndDisplaySubjects(department.value);
            });

            const fetchAndDisplaySubjects = (department) => {
                fetch(`/${adminId}/getSubjects?subjectIds=${JSON.stringify(foundTeacher.subjects)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching subjects');
                        }
                        return response.json();
                    })
                    .then(subjects => {
                        addedSubjects.innerHTML = ''; 
                        subjects.forEach(subject => {
                            addSubjectToAddedSubjects(subject);
                        });

                        return fetch(`/${adminId}/getAvailableSubjects?department=${encodeURIComponent(department)}`);
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching available subjects');
                        }
                        return response.json();
                    })
                    .then(available => {
                        console.log(available)
                        toBeAddedSubjects.innerHTML = ''; 
                        available.forEach(subject => {
                            if (!foundTeacher.subjects.includes(subject._id)) {
                                addSubjectToToBeAddedSubjects(subject);
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching subjects:', error));
            };

            fetchAndDisplaySubjects(foundTeacher.department);

            const updateButtonContainer = document.createElement('div');
            updateButtonContainer.classList.add('updateButtonContainer');
            modalUpdateForm.appendChild(updateButtonContainer);

            const updateButtonContainerButton = document.createElement('button');
            updateButtonContainerButton.innerHTML = "Save";
            updateButtonContainerButton.type = 'submit';
            updateButtonContainer.appendChild(updateButtonContainerButton);

            const exitBtnModalUpdate = document.createElement('div');
            exitBtnModalUpdate.classList.add('exitBtnModalUpdate');
            exitBtnModalUpdate.innerHTML = '+';
            exitBtnModalUpdate.onclick = () => {
                modalUpdate.remove();
            };

            modalUpdateForm.appendChild(exitBtnModalUpdate);

            modalUpdate.appendChild(modalBackground);
            modalUpdate.appendChild(updateFormForm);
            document.body.appendChild(modalUpdate);

            updateFormForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const updatedSubjects = [];
                addedSubjects.querySelectorAll('.eachSub').forEach(item => {
                    const subjectCode = item.firstChild.textContent.trim();
                    updatedSubjects.push(subjectCode);
                });

                const formData = new FormData(updateFormForm);
                formData.append('subjects', JSON.stringify(updatedSubjects));

         
                fetch(updateFormForm.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update the instructor');
                    }
                    return response.json();
                }).then(result => {
                    console.log('Instructor updated successfully:', result);
                    modalUpdate.remove();
                }).catch(error => console.error('Error updating instructor:', error));
            });

            function addSubjectToAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    addedSubjects.removeChild(eachSub);
                    addSubjectToToBeAddedSubjects(subject);
                });

                addedSubjects.appendChild(eachSub);
            }

            function addSubjectToToBeAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    toBeAddedSubjects.removeChild(eachSub);
                    addSubjectToAddedSubjects(subject);
                });

                toBeAddedSubjects.appendChild(eachSub);
            }
        }).catch(error => {
            console.error('Error fetching teacher:', error);
        });
    });
}



                const removeIcon = document.querySelectorAll('.removeIcon')

                for(let icon of removeIcon){
                    icon.addEventListener('click', ()=> {
                        const modalRemove = document.createElement('div')
                        modalRemove.classList.add('modalRemove')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')
                        modalRemove.appendChild(modalBackground)


                        const modalRemoveForm = document.createElement('div')
                        modalRemoveForm.classList.add('modalRemoveForm')
                        modalRemove.appendChild(modalRemoveForm)


                        const modalRemoveTextsContainer = document.createElement('div')
                        modalRemoveTextsContainer.classList.add('modalRemoveTextsContainer')
                        const modalRemoveTextsContainerP = document.createElement('p')
                        modalRemoveTextsContainerP.innerHTML = `Are you sure you are going to remove ${icon.id}`
                        modalRemoveTextsContainer.appendChild(modalRemoveTextsContainerP)
                        modalRemoveForm.appendChild(modalRemoveTextsContainer)


                        const modalRemoveButtonsContainer = document.createElement('div')
                        modalRemoveButtonsContainer.classList.add('modalRemoveButtonsContainer')
                        modalRemoveForm.appendChild(modalRemoveButtonsContainer)
                        const modalRemoveButtonsContainerNo = document.createElement('button')
                        modalRemoveButtonsContainerNo.innerHTML = 'No'
                        modalRemoveButtonsContainerNo.id = "confirmNo"

                        const modalRemoveButtonsContainerYes = document.createElement('button')
                        modalRemoveButtonsContainerYes.innerHTML = 'Yes'
                        modalRemoveButtonsContainerYes.id = "confirmYes"


                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerNo)
                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerYes)
                        

                        const exitBtnModalRemove = document.createElement('div')
                        exitBtnModalRemove.classList.add('exitBtnModalRemove')
                        exitBtnModalRemove.innerHTML = '+'
                        modalRemoveForm.appendChild(exitBtnModalRemove)
                        exitBtnModalRemove.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                

                        modalRemoveButtonsContainerNo.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                     
                        
                        modalRemove.classList.remove('modalHidden')
                        body.appendChild(modalRemove)


                        modalRemoveButtonsContainerYes.addEventListener('click', () => {
    const teacherFullName = icon.id; 
                            console.log(teacherFullName)
    fetch(`/${adminId}/removeInstructor`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName: teacherFullName }) 
    })
    .then(response => {
        if (response.ok) {
          
        } else {
          
            console.error('Failed to delete teacher');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
});



                    })
                }


                        const addTeacherButton = document.querySelector('.addTeacherContainer')

                        addTeacherButton.addEventListener('click', ()=> {

                        const formAdd = document.createElement('form')
                        formAdd.action ='/addForm'
                        formAdd.method ='POST'
                        formAdd.enctype = 'multipart/form-data'
                        const modalAddTeacher = document.createElement('div')
                        modalAddTeacher.classList.add('modalAddTeacher')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')


                        const modalAddTeacherForm = document.createElement('div')
                        modalAddTeacherForm.classList.add('modalAddTeacherForm')

                        const modalAddTeacherFormP = document.createElement('p')
                        modalAddTeacherFormP.innerHTML = `Add Teacher`
                        modalAddTeacherForm.appendChild(modalAddTeacherFormP)

                        const addTeacherInfoContainer = document.createElement('div')
                        addTeacherInfoContainer.classList.add('addTeacherInfoContainer')
                        modalAddTeacherForm.appendChild(addTeacherInfoContainer)

                       
                        
                        const inputsContainer = document.createElement('div')
                        inputsContainer.classList.add('inputsContainer')
                        addTeacherInfoContainer.appendChild(inputsContainer)

                        const Firstname = document.createElement('input')
                        Firstname.type = 'text'
                        Firstname.placeholder = 'Firstname'
                        Firstname.name = 'firstname'
                        Firstname.id = 'firstname'
                        inputsContainer.appendChild(Firstname)

                        const Lastname = document.createElement('input')
                        Lastname.type = 'text'
                        Lastname.placeholder = 'Lastname'
                        Lastname.name = 'lastname'
                        Lastname.id = 'lastname'
                        inputsContainer.appendChild(Lastname)
                        
                        const department = document.createElement('select')
                        department.name = 'department'
                        department.id = 'addFormDepartment'
                        department.classList.add('department')
                        const selectDepartment = document.createElement('option')

                        selectDepartment.innerHTML = "SELECT DEPARTMENT"
                        department.appendChild(selectDepartment)

                        const CET = document.createElement('option')
                        CET.value = "CET"
                        CET.innerHTML = "CET"
                        department.appendChild(CET)

                        const CBA = document.createElement('option')
                        CBA.value = "CBA"
                        CBA.innerHTML = "CBA"
                        department.appendChild(CBA)

                        const CEAA = document.createElement('option')
                        CEAA.value = "CEAA"
                        CEAA.innerHTML = "CEAA"
                        department.appendChild(CEAA)

                        const CHM = document.createElement('option')
                        CHM.value = "CHM"
                        CHM.innerHTML = "CHM"
                        department.appendChild(CHM)

                        const CNHS = document.createElement('option')
                        CNHS.value = "CNHS"
                        CNHS.innerHTML = "CNHS"
                        department.appendChild(CNHS)

                        const CCJE = document.createElement('option')
                        CCJE.value = "CCJE"
                        CCJE.innerHTML = "CCJE"
                        department.appendChild(CCJE)


                        

                        const addSubjectsContainer = document.createElement('div')
                        addSubjectsContainer.classList.add('addSubjectsContainer')



                        const addedSubjects = document.createElement('div')
                        addedSubjects.classList.add('addedSubjects')
                        addSubjectsContainer.appendChild(addedSubjects)

                        const toBeAddedSubjects = document.createElement('div')
                        toBeAddedSubjects.classList.add('toBeAddedSubjects')
                        addSubjectsContainer.appendChild(toBeAddedSubjects)

                   
                        
                        const addTeacherButtonContainer = document.createElement('div')
                        addTeacherButtonContainer.classList.add('addTeacherButtonContainer')
                        modalAddTeacherForm.appendChild(addTeacherButtonContainer)

                        const addTeacherButtonContainerButton = document.createElement('button')
                        addTeacherButtonContainerButton.innerHTML = "Add"
                        addTeacherButtonContainer.appendChild(addTeacherButtonContainerButton)

                        const exitBtnModalAddTeacher = document.createElement('div')
                        exitBtnModalAddTeacher.classList.add('exitBtnModalAddTeacher')
                        exitBtnModalAddTeacher.innerHTML = '+'
                        exitBtnModalAddTeacher.onclick = () => {
                            modalAddTeacher.remove()
                        }
                       
                        modalAddTeacherForm.appendChild(exitBtnModalAddTeacher)

                        inputsContainer.appendChild(department)
                        modalAddTeacher.appendChild(modalBackground)
                        modalAddTeacher.appendChild(modalAddTeacherForm)
                        inputsContainer.appendChild(addSubjectsContainer)

                        
                        body.appendChild(modalAddTeacher)
                        formAdd.appendChild(modalAddTeacherForm)
                        modalAddTeacher.appendChild(formAdd)
                    

                    const departmentElement = document.querySelector('.department');
departmentElement.addEventListener('change', () => {
    const toBeAddedSubjectsContainer = document.querySelector('.toBeAddedSubjects');
    toBeAddedSubjectsContainer.innerHTML = '';
    
    const queryString = `/${adminId}/subjectCodes?department=${encodeURIComponent(departmentElement.value)}`;
    fetch(queryString)
        .then((response) => {
            if (!response.ok) {
                throw new Error('The fetch network is not okay.');
            }
            return response.json();
        })
        .then((data) => {
            const toBeAddedSubjects = document.querySelector('.toBeAddedSubjects');
            const addedSubjects = document.querySelector('.addedSubjects');
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'subjectCodes';
            hiddenInput.value = '';
            hiddenInput.id = 'hiddenInput'
            formAdd.appendChild(hiddenInput);
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
                    exitButton.textContent = '+';
                    eachSub.appendChild(exitButton);

                    addedSubjects.appendChild(eachSub);
                    eachToBeAddedSub.remove(); 

                    updateHiddenInput(hiddenInput, subject.code, 'add');
                    console.log(hiddenInput)
                    exitButton.addEventListener('click', () => {
                        eachSub.remove();
                        toBeAddedSubjects.appendChild(eachToBeAddedSub);

                        updateHiddenInput(hiddenInput, subject.code, 'remove');
                    });
                });
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


 formAdd.addEventListener('submit', (event) => {
    event.preventDefault();
    const addedSubjectsElement = document.querySelectorAll('.eachSub');
    const firstnameInput = document.querySelector('#firstname')
    const lastnameInput = document.querySelector('#lastname')
    const depSelect = document.querySelector('#addFormDepartment')

    const addedSubs = [];
    
    addedSubjectsElement.forEach((subject) => {
        addedSubs.push(subject.firstChild.textContent.trim());
    });

    const queryString = `/${adminId}/addForm?firstname=${encodeURIComponent(firstnameInput.value)}&lastname=${encodeURIComponent(lastnameInput.value)}&department=${encodeURIComponent(depSelect.value)}&subjectCodes=${addedSubs}`
    fetch(queryString, {
        method: 'POST'
    }).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error in posting /addForm')
        }
        return response.json()
    }).then((data)=>{
        
    }).catch((error)=>{
        console.log(error.message)
    })

    
});
                                
                            
                        })
            })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            }); */
    }else if(filterContainerSelect.value === "CCJE"){

        instructorListContainer.innerHTML = ""
        fetch(`/${adminId}/ccjeDepartmentInstructors`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {

                const { allTeachers } = data;
                for (let teacher of allTeachers) {


                const eachTeacherContainer = document.createElement('div');
                eachTeacherContainer.classList.add('eachTeacherContainer');


                const teacherInfoContainer = document.createElement('div');
                teacherInfoContainer.classList.add('teacherInfoContainer');
                
                const spanName = document.createElement('span')
                spanName.id = 'fullname'
                spanName.innerHTML = `Name: ${teacher.firstname} ${teacher.lastname}` 
                const spanFirstname = document.createElement('span');

                spanFirstname.id = 'firstname';
                spanFirstname.innerHTML = `Firstname: ${teacher.firstname}`;

                const spanLastname = document.createElement('span');
                spanLastname.id = 'lastname';
                spanLastname.innerHTML = `Lastname: ${teacher.lastname}`;

                const spanSubjects = document.createElement('span');
                spanSubjects.id = 'subjects';
                spanSubjects.innerHTML = `Subjects: ${teacher.subjects.map(subject => subject.code).join(', ')}`;

                teacherInfoContainer.appendChild(spanName);
                teacherInfoContainer.appendChild(spanSubjects);
                    
                    

                    const teacherOptionsContainer = document.createElement('div')
                    teacherOptionsContainer.classList.add('teacherOptionsContainer')
                    const updateIcon = document.createElement('div')
                    updateIcon.classList.add('updateIcon')
                    const elementUpdateIconImg = document.createElement('img')
                    elementUpdateIconImg.src = '/images/updateIcon.svg'
                    updateIcon.id = `${teacher.fullname}`
                    updateIcon.appendChild(elementUpdateIconImg)




                    const removeIcon = document.createElement('div')
                    removeIcon.classList.add('removeIcon')
                    const elementRemoveIconImg = document.createElement('img')
                    elementRemoveIconImg.src = '/images/removeIcon.svg'
                    removeIcon.appendChild(elementRemoveIconImg)
                    removeIcon.id = `${teacher.fullname}`



                    teacherOptionsContainer.appendChild(updateIcon)
                    teacherOptionsContainer.appendChild(removeIcon)


                   


                    /* eachTeacherContainer.appendChild(teacherIconContainer) */
                    eachTeacherContainer.appendChild(teacherInfoContainer)
                    eachTeacherContainer.appendChild(teacherOptionsContainer)
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    instructorListContainer.appendChild(addTeacherContainer)

                    const addTeacherContainerH1 = document.createElement('h1')
                    addTeacherContainerH1.innerHTML = "+"
                    addTeacherContainer.appendChild(addTeacherContainerH1)





                const updateIcon = document.querySelectorAll('.updateIcon');

for (let icon of updateIcon) {
    icon.addEventListener('click', () => {

        fetch(`/${adminId}/findTeacher?teacherName=${encodeURIComponent(icon.id)}`).then((response) => {
            if (!response.ok) {
                throw new Error('There is an error while fetching');
            }
            return response.json();
        }).then(data => {
            const foundTeacher = data.foundTeacher;

            const updateFormForm = document.createElement('form');
            updateFormForm.action = `/${adminId}/${foundTeacher._id}/updateForm`;
            updateFormForm.method = 'POST';
            updateFormForm.enctype = 'multipart/form-data';

            const modalUpdate = document.createElement('div');
            modalUpdate.classList.add('modalUpdate');

            const modalBackground = document.createElement('div');
            modalBackground.classList.add('modalBackground');

            const modalUpdateForm = document.createElement('div');
            modalUpdateForm.classList.add('modalUpdateForm');
            updateFormForm.appendChild(modalUpdateForm);

            const modalUpdateFormP = document.createElement('p');
            modalUpdateFormP.innerHTML = `Update Information`;
            modalUpdateForm.appendChild(modalUpdateFormP);

            const updateInfoContainer = document.createElement('div');
            updateInfoContainer.classList.add('updateInfoContainer');
            modalUpdateForm.appendChild(updateInfoContainer);

            const inputsContainer = document.createElement('div');
            inputsContainer.classList.add('inputsContainer');
            updateInfoContainer.appendChild(inputsContainer);

            const Firstname = document.createElement('input');
            Firstname.type = 'text';
            Firstname.placeholder = 'Firstname';
            Firstname.name = 'firstname';
            Firstname.value = `${foundTeacher.firstname}`;
            inputsContainer.appendChild(Firstname);

            const Lastname = document.createElement('input');
            Lastname.type = 'text';
            Lastname.placeholder = 'Lastname';
            Lastname.name = 'lastname';
            Lastname.value = `${foundTeacher.lastname}`;
            inputsContainer.appendChild(Lastname);

            const department = document.createElement('select');
            department.name = 'department';
            department.id = 'updateDepartmentSelect';

            const selectDepartment = document.createElement('option');
            selectDepartment.innerHTML = "SELECT DEPARTMENT";
            department.appendChild(selectDepartment);

            const departments = ["CET", "CBA", "CEAA", "CHM", "CNHS", "CCJE"];
            departments.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep;
                option.innerHTML = dep;
                if (dep === foundTeacher.department) {
                    option.selected = true;
                }
                department.appendChild(option);
            });

            const addSubjectsContainer = document.createElement('div');
            addSubjectsContainer.classList.add('addSubjectsContainer');

            const toBeAddedSubjects = document.createElement('div');
            toBeAddedSubjects.classList.add('toBeAddedSubjects');

            const addedSubjects = document.createElement('div');
            addedSubjects.classList.add('addedSubjects');
            addSubjectsContainer.appendChild(addedSubjects);
            addSubjectsContainer.appendChild(toBeAddedSubjects);

            inputsContainer.appendChild(department);
            inputsContainer.appendChild(addSubjectsContainer);

            department.addEventListener('change', () => {
                fetchAndDisplaySubjects(department.value);
            });

            // Fetch and display subjects
            const fetchAndDisplaySubjects = (department) => {
                fetch(`/${adminId}/getTeacherSubjects?subjectIds=${JSON.stringify(foundTeacher.subjects)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching subjects');
                        }
                        return response.json();
                    })
                    .then(subjects => {
                        addedSubjects.innerHTML = ''; // Clear existing subjects
                        subjects.forEach(subject => {
                            addSubjectToAddedSubjects(subject);
                        });

                        return fetch(`/${adminId}/getAvailableSubjects?department=${encodeURIComponent(department)}`);
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching available subjects');
                        }
                        return response.json();
                    })
                    .then(available => {
                        toBeAddedSubjects.innerHTML = ''; // Clear toBeAddedSubjects
                        available.forEach(subject => {
                            if (!foundTeacher.subjects.includes(subject._id)) {
                                addSubjectToToBeAddedSubjects(subject);
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching subjects:', error));
            };

            // Initial fetch of subjects
            fetchAndDisplaySubjects(foundTeacher.department);

            const updateButtonContainer = document.createElement('div');
            updateButtonContainer.classList.add('updateButtonContainer');
            modalUpdateForm.appendChild(updateButtonContainer);

            const updateButtonContainerButton = document.createElement('button');
            updateButtonContainerButton.innerHTML = "Save";
            updateButtonContainerButton.type = 'submit';
            updateButtonContainer.appendChild(updateButtonContainerButton);

            const exitBtnModalUpdate = document.createElement('div');
            exitBtnModalUpdate.classList.add('exitBtnModalUpdate');
            exitBtnModalUpdate.innerHTML = '+';
            exitBtnModalUpdate.onclick = () => {
                modalUpdate.remove();
            };

            modalUpdateForm.appendChild(exitBtnModalUpdate);

            modalUpdate.appendChild(modalBackground);
            modalUpdate.appendChild(updateFormForm);
            document.body.appendChild(modalUpdate);

            // Collecting updated subjects upon form submission
            updateFormForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const updatedSubjects = [];
                addedSubjects.querySelectorAll('.eachSub').forEach(item => {
                    const subjectCode = item.firstChild.textContent.trim();
                    updatedSubjects.push(subjectCode);
                });

                // Add the updated subjects to the form data
                const formData = new FormData(updateFormForm);
                formData.append('subjects', JSON.stringify(updatedSubjects));

                // Send the form data using fetch
                fetch(updateFormForm.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update the instructor');
                    }
                    return response.json();
                }).then(result => {
                    modalUpdate.remove();
                }).catch(error => console.error('Error updating instructor:', error));
            });

            function addSubjectToAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    addedSubjects.removeChild(eachSub);
                    addSubjectToToBeAddedSubjects(subject);
                });

                addedSubjects.appendChild(eachSub);
            }

            function addSubjectToToBeAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    toBeAddedSubjects.removeChild(eachSub);
                    addSubjectToAddedSubjects(subject);
                });

                toBeAddedSubjects.appendChild(eachSub);
            }
        }).catch(error => {
            console.error('Error fetching teacher:', error);
        });
    });
}




                const removeIcon = document.querySelectorAll('.removeIcon')

                for(let icon of removeIcon){
                    icon.addEventListener('click', ()=> {
                        const modalRemove = document.createElement('div')
                        modalRemove.classList.add('modalRemove')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')
                        modalRemove.appendChild(modalBackground)


                        const modalRemoveForm = document.createElement('div')
                        modalRemoveForm.classList.add('modalRemoveForm')
                        modalRemove.appendChild(modalRemoveForm)


                        const modalRemoveTextsContainer = document.createElement('div')
                        modalRemoveTextsContainer.classList.add('modalRemoveTextsContainer')
                        const modalRemoveTextsContainerP = document.createElement('p')
                        modalRemoveTextsContainerP.innerHTML = `Are you sure you are going to remove ${icon.id}`
                        modalRemoveTextsContainer.appendChild(modalRemoveTextsContainerP)
                        modalRemoveForm.appendChild(modalRemoveTextsContainer)


                        const modalRemoveButtonsContainer = document.createElement('div')
                        modalRemoveButtonsContainer.classList.add('modalRemoveButtonsContainer')
                        modalRemoveForm.appendChild(modalRemoveButtonsContainer)
                        const modalRemoveButtonsContainerNo = document.createElement('button')
                        modalRemoveButtonsContainerNo.innerHTML = 'No'
                        modalRemoveButtonsContainerNo.id = "confirmNo"

                        const modalRemoveButtonsContainerYes = document.createElement('button')
                        modalRemoveButtonsContainerYes.innerHTML = 'Yes'
                        modalRemoveButtonsContainerYes.id = "confirmYes"


                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerNo)
                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerYes)
                        

                        const exitBtnModalRemove = document.createElement('div')
                        exitBtnModalRemove.classList.add('exitBtnModalRemove')
                        exitBtnModalRemove.innerHTML = '+'
                        modalRemoveForm.appendChild(exitBtnModalRemove)
                        exitBtnModalRemove.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                

                        modalRemoveButtonsContainerNo.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                     
                        
                        modalRemove.classList.remove('modalHidden')
                        body.appendChild(modalRemove)


                        modalRemoveButtonsContainerYes.addEventListener('click', () => {
    const teacherFullName = icon.id; // Assuming the id contains the full name
    fetch(`/${adminId}/removeInstructor`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName: teacherFullName }) // Sending the full name in the request body
    })
    .then(response => {
        if (response.ok) {
            // Successfully deleted
            // You can update your UI accordingly
        } else {
            // Handle error
            console.error('Failed to delete teacher');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
});



                    })
                }


                        const addTeacherButton = document.querySelector('.addTeacherContainer')

                        addTeacherButton.addEventListener('click', ()=> {

                        const formAdd = document.createElement('form')
                        formAdd.action ='/addForm'
                        formAdd.method ='POST'
                        formAdd.enctype = 'multipart/form-data'
                        const modalAddTeacher = document.createElement('div')
                        modalAddTeacher.classList.add('modalAddTeacher')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')


                        const modalAddTeacherForm = document.createElement('div')
                        modalAddTeacherForm.classList.add('modalAddTeacherForm')

                        const modalAddTeacherFormP = document.createElement('p')
                        modalAddTeacherFormP.innerHTML = `Add Teacher`
                        modalAddTeacherForm.appendChild(modalAddTeacherFormP)

                        const addTeacherInfoContainer = document.createElement('div')
                        addTeacherInfoContainer.classList.add('addTeacherInfoContainer')
                        modalAddTeacherForm.appendChild(addTeacherInfoContainer)

                       
                        
                        const inputsContainer = document.createElement('div')
                        inputsContainer.classList.add('inputsContainer')
                        addTeacherInfoContainer.appendChild(inputsContainer)

                        const Firstname = document.createElement('input')
                        Firstname.type = 'text'
                        Firstname.placeholder = 'Firstname'
                        Firstname.name = 'firstname'
                        Firstname.id = 'firstname'
                        inputsContainer.appendChild(Firstname)

                        const Lastname = document.createElement('input')
                        Lastname.type = 'text'
                        Lastname.placeholder = 'Lastname'
                        Lastname.name = 'lastname'
                        Lastname.id = 'lastname'
                        inputsContainer.appendChild(Lastname)
                        
                        const department = document.createElement('select')
                        department.name = 'department'
                        department.id = 'addFormDepartment'
                        department.classList.add('department')
                        const selectDepartment = document.createElement('option')

                        selectDepartment.innerHTML = "SELECT DEPARTMENT"
                        department.appendChild(selectDepartment)

                        const CET = document.createElement('option')
                        CET.value = "CET"
                        CET.innerHTML = "CET"
                        department.appendChild(CET)

                        const CBA = document.createElement('option')
                        CBA.value = "CBA"
                        CBA.innerHTML = "CBA"
                        department.appendChild(CBA)

                        const CEAA = document.createElement('option')
                        CEAA.value = "CEAA"
                        CEAA.innerHTML = "CEAA"
                        department.appendChild(CEAA)

                        const CHM = document.createElement('option')
                        CHM.value = "CHM"
                        CHM.innerHTML = "CHM"
                        department.appendChild(CHM)

                        const CNHS = document.createElement('option')
                        CNHS.value = "CNHS"
                        CNHS.innerHTML = "CNHS"
                        department.appendChild(CNHS)

                        const CCJE = document.createElement('option')
                        CCJE.value = "CCJE"
                        CCJE.innerHTML = "CCJE"
                        department.appendChild(CCJE)


                        

                        const addSubjectsContainer = document.createElement('div')
                        addSubjectsContainer.classList.add('addSubjectsContainer')



                        const addedSubjects = document.createElement('div')
                        addedSubjects.classList.add('addedSubjects')
                        addSubjectsContainer.appendChild(addedSubjects)

                        const toBeAddedSubjects = document.createElement('div')
                        toBeAddedSubjects.classList.add('toBeAddedSubjects')
                        addSubjectsContainer.appendChild(toBeAddedSubjects)

                   
                        
                        const addTeacherButtonContainer = document.createElement('div')
                        addTeacherButtonContainer.classList.add('addTeacherButtonContainer')
                        modalAddTeacherForm.appendChild(addTeacherButtonContainer)

                        const addTeacherButtonContainerButton = document.createElement('button')
                        addTeacherButtonContainerButton.innerHTML = "Add"
                        addTeacherButtonContainer.appendChild(addTeacherButtonContainerButton)

                        const exitBtnModalAddTeacher = document.createElement('div')
                        exitBtnModalAddTeacher.classList.add('exitBtnModalAddTeacher')
                        exitBtnModalAddTeacher.innerHTML = '+'
                        exitBtnModalAddTeacher.onclick = () => {
                            modalAddTeacher.remove()
                        }
                       
                        modalAddTeacherForm.appendChild(exitBtnModalAddTeacher)

                        inputsContainer.appendChild(department)
                        modalAddTeacher.appendChild(modalBackground)
                        modalAddTeacher.appendChild(modalAddTeacherForm)
                        inputsContainer.appendChild(addSubjectsContainer)

                        
                        body.appendChild(modalAddTeacher)
                        formAdd.appendChild(modalAddTeacherForm)
                        modalAddTeacher.appendChild(formAdd)
                    

                    const departmentElement = document.querySelector('.department');
departmentElement.addEventListener('change', () => {
    const toBeAddedSubjectsContainer = document.querySelector('.toBeAddedSubjects');
    toBeAddedSubjectsContainer.innerHTML = '';
    
    const queryString = `/${adminId}/subjectCodes?department=${encodeURIComponent(departmentElement.value)}`;
    fetch(queryString)
        .then((response) => {
            if (!response.ok) {
                throw new Error('The fetch network is not okay.');
            }
            return response.json();
        })
        .then((data) => {
            const toBeAddedSubjects = document.querySelector('.toBeAddedSubjects');
            const addedSubjects = document.querySelector('.addedSubjects');
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'subjectCodes';
            hiddenInput.value = '';
            hiddenInput.id = 'hiddenInput'
            formAdd.appendChild(hiddenInput);
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
                    exitButton.textContent = '+';
                    eachSub.appendChild(exitButton);

                    addedSubjects.appendChild(eachSub);
                    eachToBeAddedSub.remove(); 

                    updateHiddenInput(hiddenInput, subject.code, 'add');
                    exitButton.addEventListener('click', () => {
                        eachSub.remove();
                        toBeAddedSubjects.appendChild(eachToBeAddedSub);

                        updateHiddenInput(hiddenInput, subject.code, 'remove');
                    });
                });
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


 formAdd.addEventListener('submit', (event) => {
    event.preventDefault();
    const addedSubjectsElement = document.querySelectorAll('.eachSub');
    const firstnameInput = document.querySelector('#firstname')
    const lastnameInput = document.querySelector('#lastname')
    const depSelect = document.querySelector('#addFormDepartment')

    const addedSubs = [];
    
    addedSubjectsElement.forEach((subject) => {
        addedSubs.push(subject.firstChild.textContent.trim());
    });

    const queryString = `/${adminId}/addForm?firstname=${encodeURIComponent(firstnameInput.value)}&lastname=${encodeURIComponent(lastnameInput.value)}&department=${encodeURIComponent(depSelect.value)}&subjectCodes=${addedSubs}`
    fetch(queryString, {
        method: 'POST'
    }).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error in posting /addForm')
        }
        return response.json()
    }).then((data)=>{
        formAdd.reset()
        modalAddTeacher.remove()
    }).catch((error)=>{
        console.log(error.message)
    })

    
});
                                
                            
                        })
            }).catch((e)=>{
                 console.log(e.message)
            })
        /* instructorListContainer.innerHTML = ""

        fetch(`/${adminId}/ccjeDepartmentInstructors`)

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {

                const { allTeachers } = data;
                for (let teacher of allTeachers) {
                const eachTeacherContainer = document.createElement('div');
                eachTeacherContainer.classList.add('eachTeacherContainer');


                const teacherInfoContainer = document.createElement('div');
                teacherInfoContainer.classList.add('teacherInfoContainer');
                
                const spanName = document.createElement('span')
                spanName.id = 'fullname'
                spanName.innerHTML = `Name: ${teacher.firstname} ${teacher.lastname}` 
                const spanFirstname = document.createElement('span');

                spanFirstname.id = 'firstname';
                spanFirstname.innerHTML = `Firstname: ${teacher.firstname}`;

                const spanLastname = document.createElement('span');
                spanLastname.id = 'lastname';
                spanLastname.innerHTML = `Lastname: ${teacher.lastname}`;

                const spanSubjects = document.createElement('span');
                spanSubjects.id = 'subjects';
                spanSubjects.innerHTML = `Subjects: ${teacher.subjects.map(subject => subject.code).join(', ')}`;

                teacherInfoContainer.appendChild(spanName);
                teacherInfoContainer.appendChild(spanSubjects);
                    
                    

                    const teacherOptionsContainer = document.createElement('div')
                    teacherOptionsContainer.classList.add('teacherOptionsContainer')
                    const updateIcon = document.createElement('div')
                    updateIcon.classList.add('updateIcon')
                    const elementUpdateIconImg = document.createElement('img')
                    elementUpdateIconImg.src = '/images/updateIcon.svg'
                    updateIcon.id = `${teacher.fullname}`
                    updateIcon.appendChild(elementUpdateIconImg)




                    const removeIcon = document.createElement('div')
                    removeIcon.classList.add('removeIcon')
                    const elementRemoveIconImg = document.createElement('img')
                    elementRemoveIconImg.src = '/images/removeIcon.svg'
                    removeIcon.appendChild(elementRemoveIconImg)
                    removeIcon.id = `${teacher.fullname}`



                    teacherOptionsContainer.appendChild(updateIcon)
                    teacherOptionsContainer.appendChild(removeIcon)


                   


                    eachTeacherContainer.appendChild(teacherInfoContainer)
                    eachTeacherContainer.appendChild(teacherOptionsContainer)
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    instructorListContainer.appendChild(addTeacherContainer)

                    const addTeacherContainerH1 = document.createElement('h1')
                    addTeacherContainerH1.innerHTML = "+"
                    addTeacherContainer.appendChild(addTeacherContainerH1)





                const updateIcon = document.querySelectorAll('.updateIcon');

for (let icon of updateIcon) {
    icon.addEventListener('click', () => {

        fetch(`/${adminId}/findTeacher?teacherName=${encodeURIComponent(icon.id)}`).then((response) => {
            if (!response.ok) {
                throw new Error('There is an error while fetching');
            }
            return response.json();
        }).then(data => {
            const foundTeacher = data.foundTeacher;

            const updateFormForm = document.createElement('form');
            updateFormForm.action = `/${adminId}/${foundTeacher._id}/updateForm`;
            updateFormForm.method = 'POST';
            updateFormForm.enctype = 'multipart/form-data';

            const modalUpdate = document.createElement('div');
            modalUpdate.classList.add('modalUpdate');

            const modalBackground = document.createElement('div');
            modalBackground.classList.add('modalBackground');

            const modalUpdateForm = document.createElement('div');
            modalUpdateForm.classList.add('modalUpdateForm');
            updateFormForm.appendChild(modalUpdateForm);

            const modalUpdateFormP = document.createElement('p');
            modalUpdateFormP.innerHTML = `Update Information`;
            modalUpdateForm.appendChild(modalUpdateFormP);

            const updateInfoContainer = document.createElement('div');
            updateInfoContainer.classList.add('updateInfoContainer');
            modalUpdateForm.appendChild(updateInfoContainer);

            const inputsContainer = document.createElement('div');
            inputsContainer.classList.add('inputsContainer');
            updateInfoContainer.appendChild(inputsContainer);

            const Firstname = document.createElement('input');
            Firstname.type = 'text';
            Firstname.placeholder = 'Firstname';
            Firstname.name = 'firstname';
            Firstname.value = `${foundTeacher.firstname}`;
            inputsContainer.appendChild(Firstname);

            const Lastname = document.createElement('input');
            Lastname.type = 'text';
            Lastname.placeholder = 'Lastname';
            Lastname.name = 'lastname';
            Lastname.value = `${foundTeacher.lastname}`;
            inputsContainer.appendChild(Lastname);

            const department = document.createElement('select');
            department.name = 'department';
            department.id = 'updateDepartmentSelect';

            const selectDepartment = document.createElement('option');
            selectDepartment.innerHTML = "SELECT DEPARTMENT";
            department.appendChild(selectDepartment);

            const departments = ["CET", "CBA", "CEAA", "CHM", "CNHS", "CCJE"];
            departments.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep;
                option.innerHTML = dep;
                if (dep === foundTeacher.department) {
                    option.selected = true;
                }
                department.appendChild(option);
            });

            const addSubjectsContainer = document.createElement('div');
            addSubjectsContainer.classList.add('addSubjectsContainer');

            const toBeAddedSubjects = document.createElement('div');
            toBeAddedSubjects.classList.add('toBeAddedSubjects');

            const addedSubjects = document.createElement('div');
            addedSubjects.classList.add('addedSubjects');
            addSubjectsContainer.appendChild(addedSubjects);
            addSubjectsContainer.appendChild(toBeAddedSubjects);

            inputsContainer.appendChild(department);
            inputsContainer.appendChild(addSubjectsContainer);

            department.addEventListener('change', () => {
                console.log('meow');
                fetchAndDisplaySubjects(department.value);
            });

            const fetchAndDisplaySubjects = (department) => {
                fetch(`/${adminId}/getSubjects?subjectIds=${JSON.stringify(foundTeacher.subjects)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching subjects');
                        }
                        return response.json();
                    })
                    .then(subjects => {
                        addedSubjects.innerHTML = ''; 
                        subjects.forEach(subject => {
                            addSubjectToAddedSubjects(subject);
                        });

                        return fetch(`/${adminId}/getAvailableSubjects?department=${encodeURIComponent(department)}`);
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('There is an error while fetching available subjects');
                        }
                        return response.json();
                    })
                    .then(available => {
                        console.log(available)
                        toBeAddedSubjects.innerHTML = ''; 
                        available.forEach(subject => {
                            if (!foundTeacher.subjects.includes(subject._id)) {
                                addSubjectToToBeAddedSubjects(subject);
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching subjects:', error));
            };

            fetchAndDisplaySubjects(foundTeacher.department);

            const updateButtonContainer = document.createElement('div');
            updateButtonContainer.classList.add('updateButtonContainer');
            modalUpdateForm.appendChild(updateButtonContainer);

            const updateButtonContainerButton = document.createElement('button');
            updateButtonContainerButton.innerHTML = "Save";
            updateButtonContainerButton.type = 'submit';
            updateButtonContainer.appendChild(updateButtonContainerButton);

            const exitBtnModalUpdate = document.createElement('div');
            exitBtnModalUpdate.classList.add('exitBtnModalUpdate');
            exitBtnModalUpdate.innerHTML = '+';
            exitBtnModalUpdate.onclick = () => {
                modalUpdate.remove();
            };

            modalUpdateForm.appendChild(exitBtnModalUpdate);

            modalUpdate.appendChild(modalBackground);
            modalUpdate.appendChild(updateFormForm);
            document.body.appendChild(modalUpdate);

            updateFormForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const updatedSubjects = [];
                addedSubjects.querySelectorAll('.eachSub').forEach(item => {
                    const subjectCode = item.firstChild.textContent.trim();
                    updatedSubjects.push(subjectCode);
                });

                const formData = new FormData(updateFormForm);
                formData.append('subjects', JSON.stringify(updatedSubjects));

                fetch(updateFormForm.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update the instructor');
                    }
                    return response.json();
                }).then(result => {
                    console.log('Instructor updated successfully:', result);
                    modalUpdate.remove();
                }).catch(error => console.error('Error updating instructor:', error));
            });

            function addSubjectToAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    addedSubjects.removeChild(eachSub);
                    addSubjectToToBeAddedSubjects(subject);
                });

                addedSubjects.appendChild(eachSub);
            }

            function addSubjectToToBeAddedSubjects(subject) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');
                eachSub.textContent = subject.code;

                eachSub.addEventListener('click', () => {
                    toBeAddedSubjects.removeChild(eachSub);
                    addSubjectToAddedSubjects(subject);
                });

                toBeAddedSubjects.appendChild(eachSub);
            }
        }).catch(error => {
            console.error('Error fetching teacher:', error);
        });
    });
}




                const removeIcon = document.querySelectorAll('.removeIcon')

                for(let icon of removeIcon){
                    icon.addEventListener('click', ()=> {
                        const modalRemove = document.createElement('div')
                        modalRemove.classList.add('modalRemove')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')
                        modalRemove.appendChild(modalBackground)


                        const modalRemoveForm = document.createElement('div')
                        modalRemoveForm.classList.add('modalRemoveForm')
                        modalRemove.appendChild(modalRemoveForm)


                        const modalRemoveTextsContainer = document.createElement('div')
                        modalRemoveTextsContainer.classList.add('modalRemoveTextsContainer')
                        const modalRemoveTextsContainerP = document.createElement('p')
                        modalRemoveTextsContainerP.innerHTML = `Are you sure you are going to remove ${icon.id}`
                        modalRemoveTextsContainer.appendChild(modalRemoveTextsContainerP)
                        modalRemoveForm.appendChild(modalRemoveTextsContainer)


                        const modalRemoveButtonsContainer = document.createElement('div')
                        modalRemoveButtonsContainer.classList.add('modalRemoveButtonsContainer')
                        modalRemoveForm.appendChild(modalRemoveButtonsContainer)
                        const modalRemoveButtonsContainerNo = document.createElement('button')
                        modalRemoveButtonsContainerNo.innerHTML = 'No'
                        modalRemoveButtonsContainerNo.id = "confirmNo"

                        const modalRemoveButtonsContainerYes = document.createElement('button')
                        modalRemoveButtonsContainerYes.innerHTML = 'Yes'
                        modalRemoveButtonsContainerYes.id = "confirmYes"


                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerNo)
                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerYes)
                        

                        const exitBtnModalRemove = document.createElement('div')
                        exitBtnModalRemove.classList.add('exitBtnModalRemove')
                        exitBtnModalRemove.innerHTML = '+'
                        modalRemoveForm.appendChild(exitBtnModalRemove)
                        exitBtnModalRemove.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                

                        modalRemoveButtonsContainerNo.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                        }
                     
                        
                        modalRemove.classList.remove('modalHidden')
                        body.appendChild(modalRemove)


                        modalRemoveButtonsContainerYes.addEventListener('click', () => {
    const teacherFullName = icon.id; 
                            console.log(teacherFullName)
    fetch(`/${adminId}/removeInstructor`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName: teacherFullName }) 
    })
    .then(response => {
        if (response.ok) {
        } else {
            console.error('Failed to delete teacher');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
});



                    })
                }


                        const addTeacherButton = document.querySelector('.addTeacherContainer')

                        addTeacherButton.addEventListener('click', ()=> {

                        const formAdd = document.createElement('form')
                        formAdd.action ='/addForm'
                        formAdd.method ='POST'
                        formAdd.enctype = 'multipart/form-data'
                        const modalAddTeacher = document.createElement('div')
                        modalAddTeacher.classList.add('modalAddTeacher')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')


                        const modalAddTeacherForm = document.createElement('div')
                        modalAddTeacherForm.classList.add('modalAddTeacherForm')

                        const modalAddTeacherFormP = document.createElement('p')
                        modalAddTeacherFormP.innerHTML = `Add Teacher`
                        modalAddTeacherForm.appendChild(modalAddTeacherFormP)

                        const addTeacherInfoContainer = document.createElement('div')
                        addTeacherInfoContainer.classList.add('addTeacherInfoContainer')
                        modalAddTeacherForm.appendChild(addTeacherInfoContainer)

                       
                        
                        const inputsContainer = document.createElement('div')
                        inputsContainer.classList.add('inputsContainer')
                        addTeacherInfoContainer.appendChild(inputsContainer)

                        const Firstname = document.createElement('input')
                        Firstname.type = 'text'
                        Firstname.placeholder = 'Firstname'
                        Firstname.name = 'firstname'
                        Firstname.id = 'firstname'
                        inputsContainer.appendChild(Firstname)

                        const Lastname = document.createElement('input')
                        Lastname.type = 'text'
                        Lastname.placeholder = 'Lastname'
                        Lastname.name = 'lastname'
                        Lastname.id = 'lastname'
                        inputsContainer.appendChild(Lastname)
                        
                        const department = document.createElement('select')
                        department.name = 'department'
                        department.id = 'addFormDepartment'
                        department.classList.add('department')
                        const selectDepartment = document.createElement('option')

                        selectDepartment.innerHTML = "SELECT DEPARTMENT"
                        department.appendChild(selectDepartment)

                        const CET = document.createElement('option')
                        CET.value = "CET"
                        CET.innerHTML = "CET"
                        department.appendChild(CET)

                        const CBA = document.createElement('option')
                        CBA.value = "CBA"
                        CBA.innerHTML = "CBA"
                        department.appendChild(CBA)

                        const CEAA = document.createElement('option')
                        CEAA.value = "CEAA"
                        CEAA.innerHTML = "CEAA"
                        department.appendChild(CEAA)

                        const CHM = document.createElement('option')
                        CHM.value = "CHM"
                        CHM.innerHTML = "CHM"
                        department.appendChild(CHM)

                        const CNHS = document.createElement('option')
                        CNHS.value = "CNHS"
                        CNHS.innerHTML = "CNHS"
                        department.appendChild(CNHS)

                        const CCJE = document.createElement('option')
                        CCJE.value = "CCJE"
                        CCJE.innerHTML = "CCJE"
                        department.appendChild(CCJE)


                        

                        const addSubjectsContainer = document.createElement('div')
                        addSubjectsContainer.classList.add('addSubjectsContainer')



                        const addedSubjects = document.createElement('div')
                        addedSubjects.classList.add('addedSubjects')
                        addSubjectsContainer.appendChild(addedSubjects)

                        const toBeAddedSubjects = document.createElement('div')
                        toBeAddedSubjects.classList.add('toBeAddedSubjects')
                        addSubjectsContainer.appendChild(toBeAddedSubjects)

                   
                        
                        const addTeacherButtonContainer = document.createElement('div')
                        addTeacherButtonContainer.classList.add('addTeacherButtonContainer')
                        modalAddTeacherForm.appendChild(addTeacherButtonContainer)

                        const addTeacherButtonContainerButton = document.createElement('button')
                        addTeacherButtonContainerButton.innerHTML = "Add"
                        addTeacherButtonContainer.appendChild(addTeacherButtonContainerButton)

                        const exitBtnModalAddTeacher = document.createElement('div')
                        exitBtnModalAddTeacher.classList.add('exitBtnModalAddTeacher')
                        exitBtnModalAddTeacher.innerHTML = '+'
                        exitBtnModalAddTeacher.onclick = () => {
                            modalAddTeacher.remove()
                        }
                       
                        modalAddTeacherForm.appendChild(exitBtnModalAddTeacher)

                        inputsContainer.appendChild(department)
                        modalAddTeacher.appendChild(modalBackground)
                        modalAddTeacher.appendChild(modalAddTeacherForm)
                        inputsContainer.appendChild(addSubjectsContainer)

                        
                        body.appendChild(modalAddTeacher)
                        formAdd.appendChild(modalAddTeacherForm)
                        modalAddTeacher.appendChild(formAdd)
                    

                    const departmentElement = document.querySelector('.department');
departmentElement.addEventListener('change', () => {
    const toBeAddedSubjectsContainer = document.querySelector('.toBeAddedSubjects');
    toBeAddedSubjectsContainer.innerHTML = '';
    
    const queryString = `/${adminId}/subjectCodes?department=${encodeURIComponent(departmentElement.value)}`;
    fetch(queryString)
        .then((response) => {
            if (!response.ok) {
                throw new Error('The fetch network is not okay.');
            }
            return response.json();
        })
        .then((data) => {
            const toBeAddedSubjects = document.querySelector('.toBeAddedSubjects');
            const addedSubjects = document.querySelector('.addedSubjects');
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'subjectCodes';
            hiddenInput.value = '';
            hiddenInput.id = 'hiddenInput'
            formAdd.appendChild(hiddenInput);
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
                    exitButton.textContent = '+';
                    eachSub.appendChild(exitButton);

                    addedSubjects.appendChild(eachSub);
                    eachToBeAddedSub.remove(); 

                    updateHiddenInput(hiddenInput, subject.code, 'add');
                    console.log(hiddenInput)
                    exitButton.addEventListener('click', () => {
                        eachSub.remove();
                        toBeAddedSubjects.appendChild(eachToBeAddedSub);

                        updateHiddenInput(hiddenInput, subject.code, 'remove');
                    });
                });
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


 formAdd.addEventListener('submit', (event) => {
    event.preventDefault();
    const addedSubjectsElement = document.querySelectorAll('.eachSub');
    const firstnameInput = document.querySelector('#firstname')
    const lastnameInput = document.querySelector('#lastname')
    const depSelect = document.querySelector('#addFormDepartment')

    const addedSubs = [];
    
    addedSubjectsElement.forEach((subject) => {
        addedSubs.push(subject.firstChild.textContent.trim());
    });

    const queryString = `/${adminId}/addForm?firstname=${encodeURIComponent(firstnameInput.value)}&lastname=${encodeURIComponent(lastnameInput.value)}&department=${encodeURIComponent(depSelect.value)}&subjectCodes=${addedSubs}`
    fetch(queryString, {
        method: 'POST'
    }).then((response)=>{
        if(!response.ok){
            throw new Error('there is an error in posting /addForm')
        }
        return response.json()
    }).then((data)=>{
        
    }).catch((error)=>{
        console.log(error.message)
    })

    
});
                                
                            
                        })
            })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            }); */
            
    }
});

            





            /* const queryString = `?teacherName=${encodeURIComponent(option.innerHTML)}`
            fetch(`/adminInstructors${queryString}`).then((response)=> {
                if(!response.ok){
                    throw new Error('Network response was not okay.')
                }
                return response.json()
            }).then((data)=> {
                const {allTeachers} = data
                for(let teacher of allTeachers){
                    const eachTeacherContainer = document.createElement('div')
                    eachTeacherContainer.classList.add('eachTeacherContainer')


                    const teacherIconContainer = document.createElement('div')
                    teacherIconContainer.classList.add('teacherIconContainer')
                    const elementImgIconContainer = document.createElement('img')
                    elementImgIconContainer.src = `${teacher.imageURL}`
                    teacherIconContainer.appendChild(elementImgIconContainer)


                    const teacherInfoContainer = document.createElement('div')
                    teacherInfoContainer.classList.add('teacherInfoContainer')
                    const spanFirstname = document.createElement('span')
                    spanFirstname.id = 'firstname'
                    spanFirstname.innerHTML = `Firstname: ${teacher.firstname}`
                    const spanLastname = document.createElement('span')
                    spanLastname.id = 'lastname'
                    spanLastname.innerHTML = `Lastname: ${teacher.lastname}`
                    const spanAge = document.createElement('span')
                    spanAge.id = 'age'
                    spanAge.innerHTML = `Age: ${teacher.age}`
                    const spanAddress = document.createElement('span')
                    spanAddress.id = 'address'
                    spanAddress.innerHTML = `Address: ${teacher.address}`

                    teacherInfoContainer.appendChild(spanFirstname)
                    teacherInfoContainer.appendChild(spanLastname)
                    teacherInfoContainer.appendChild(spanAge)
                    teacherInfoContainer.appendChild(spanAddress)

                    
                    

                    const teacherOptionsContainer = document.createElement('div')
                    teacherOptionsContainer.classList.add('teacherOptionsContainer')
                    const updateIcon = document.createElement('div')
                    updateIcon.classList.add('updateIcon')
                    const elementUpdateIconImg = document.createElement('img')
                    elementUpdateIconImg.src = '/images/updateIcon.svg'
                    updateIcon.id = `${teacher.fullname}`
                    updateIcon.appendChild(elementUpdateIconImg)




                    const removeIcon = document.createElement('div')
                    removeIcon.classList.add('removeIcon')
                    const elementRemoveIconImg = document.createElement('img')
                    elementRemoveIconImg.src = '/images/removeIcon.svg'
                    removeIcon.appendChild(elementRemoveIconImg)
                    removeIcon.id = `${teacher.fullname}`



                    teacherOptionsContainer.appendChild(updateIcon)
                    teacherOptionsContainer.appendChild(removeIcon)


                   


                    eachTeacherContainer.appendChild(teacherIconContainer)
                    eachTeacherContainer.appendChild(teacherInfoContainer)
                    eachTeacherContainer.appendChild(teacherOptionsContainer)
                    
                    innerRightContainer.appendChild(eachTeacherContainer)
                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    addTeacherContainer.innerHTML = '+'
                    innerRightContainer.appendChild(addTeacherContainer)





                const updateIcon = document.querySelectorAll('.updateIcon')
                
                for(let icon of updateIcon){
                    icon.addEventListener('click', ()=> {
                        const modalUpdate = document.createElement('div')
                        modalUpdate.classList.add('modalUpdate')
                        modalUpdate.classList.add('modalHidden')

                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')

                        const modalUpdateForm = document.createElement('div')
                        modalUpdateForm.classList.add('modalUpdateForm')
                    
                        const modalUpdateFormP = document.createElement('p')
                        modalUpdateFormP.innerHTML = `Update Information for ${icon.id}`
                        modalUpdateForm.appendChild(modalUpdateFormP)


                        const exitBtnModalUpdate = document.createElement('div')
                        exitBtnModalUpdate.classList.add('exitBtnModalUpdate')
                        exitBtnModalUpdate.innerHTML = '+'
                        exitBtnModalUpdate.onclick = () => {
                            modalUpdate.classList.add('modalHidden')
                        }
                        modalUpdateForm.appendChild(exitBtnModalUpdate)


                        modalUpdate.appendChild(modalBackground)
                        modalUpdate.appendChild(modalUpdateForm)
                        modalUpdate.classList.remove('modalHidden')
                        body.appendChild(modalUpdate)

                    })
                }



                const removeIcon = document.querySelectorAll('.removeIcon')

                for(let icon of removeIcon){
                    icon.addEventListener('click', ()=> {
                        const modalRemove = document.createElement('div')
                        modalRemove.classList.add('modalRemove')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')
                        modalRemove.appendChild(modalBackground)


                        const modalRemoveForm = document.createElement('div')
                        modalRemoveForm.classList.add('modalRemoveForm')
                        modalRemove.appendChild(modalRemoveForm)


                        const modalRemoveTextsContainer = document.createElement('div')
                        modalRemoveTextsContainer.classList.add('modalRemoveTextsContainer')
                        const modalRemoveTextsContainerP = document.createElement('p')
                        modalRemoveTextsContainerP.innerHTML = `Are you sure you are going to remove ${icon.id}`
                        modalRemoveTextsContainer.appendChild(modalRemoveTextsContainerP)
                        modalRemoveForm.appendChild(modalRemoveTextsContainer)


                        const modalRemoveButtonsContainer = document.createElement('div')
                        modalRemoveButtonsContainer.classList.add('modalRemoveButtonsContainer')
                        modalRemoveForm.appendChild(modalRemoveButtonsContainer)
                        const modalRemoveButtonsContainerNo = document.createElement('button')
                        modalRemoveButtonsContainerNo.innerHTML = 'No'

                        const modalRemoveButtonsContainerYes = document.createElement('button')
                        modalRemoveButtonsContainerYes.innerHTML = 'Yes'

                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerNo)
                        modalRemoveButtonsContainer.appendChild(modalRemoveButtonsContainerYes)
                        

                        const exitBtnModalRemove = document.createElement('div')
                        exitBtnModalRemove.classList.add('exitBtnModalRemove')
                        exitBtnModalRemove.innerHTML = '+'
                        modalRemoveForm.appendChild(exitBtnModalRemove)
                        exitBtnModalRemove.onclick = () => {
                            modalRemove.classList.add('modalHidden')
                            console.log('meow')
                        }
                        
                        modalRemove.classList.remove('modalHidden')
                        console.log(modalRemove)
                        body.appendChild(modalRemove)
                    })
                }
                
            }).catch((e)=> {
                console.log('Error fetching data')
            })
 */
           
        }else if(option.innerHTML === 'Questions'){
            subjectBody.style.display = 'none';


           const questionUpperPart = document.createElement('div')
           questionUpperPart.classList.add('questionUpperPart')

           const questionFilterContainer = document.createElement('div')
           questionFilterContainer.classList.add('questionFilterContainer')

           const questionFilterContainerLabel = document.createElement('label')
           questionFilterContainerLabel.for = 'questions'
           questionFilterContainerLabel.innerHTML = 'Questions: '

           const questionFilterContainerSelect = document.createElement('select')
           questionFilterContainerSelect.name = 'questionCategory'
           questionFilterContainerSelect.id = 'questionCategory'

           const questionSelectOption1 = document.createElement('option')
           questionSelectOption1.value = ''
           questionSelectOption1.innerHTML = 'SELECT QUESTION CATEGORY'
           questionFilterContainerSelect.appendChild(questionSelectOption1)

            const questionSelectOption2 = document.createElement('option')
           questionSelectOption2.value = 'course overview and orientation'
           questionSelectOption2.innerHTML = 'COURSE OVERVIEW ORIENTATION'
           questionFilterContainerSelect.appendChild(questionSelectOption2)

            const questionSelectOption3 = document.createElement('option')
           questionSelectOption3.value = 'learning outcomes'
           questionSelectOption3.innerHTML = 'LEARNING OUTCOMES'
           questionFilterContainerSelect.appendChild(questionSelectOption3)

            const questionSelectOption4 = document.createElement('option')
           questionSelectOption4.value = 'assessment'
           questionSelectOption4.innerHTML = 'ASSESSMENT'
           questionFilterContainerSelect.appendChild(questionSelectOption4)

            const questionSelectOption5 = document.createElement('option')
           questionSelectOption5.value = 'instructional material/content'
           questionSelectOption5.innerHTML = 'INSTRUCTIONAL MATERIAL/CONTENT'
           questionFilterContainerSelect.appendChild(questionSelectOption5)

            const questionSelectOption6 = document.createElement('option')
           questionSelectOption6.value = 'teacher presence and support'
           questionSelectOption6.innerHTML = 'TEACHER PRESENCE AND SUPPORT'
           questionFilterContainerSelect.appendChild(questionSelectOption6)

            const questionSelectOption7 = document.createElement('option')
           questionSelectOption7.value = 'learning experiences and interaction'
           questionSelectOption7.innerHTML = 'LEARNING EXPERIENCES AND INTERACTION'
           questionFilterContainerSelect.appendChild(questionSelectOption7)

            const questionSelectOption8 = document.createElement('option')
           questionSelectOption8.value = 'technology and accessibility'
           questionSelectOption8.innerHTML = 'TECHNOLOGY AND ACCESSIBILITY'
           questionFilterContainerSelect.appendChild(questionSelectOption8)

           questionFilterContainer.appendChild(questionFilterContainerLabel)
           questionFilterContainer.appendChild(questionFilterContainerSelect)

           const QuestionlowerPart = document.createElement('div')
           QuestionlowerPart.classList.add('QuestionlowerPart')
            
           const innerQuestionLowerPart = document.createElement('div')
           innerQuestionLowerPart.classList.add('innerQuestionLowerPart')

           const questionAddBtn = document.createElement('div')
           questionAddBtn.classList.add('questionAddBtn')

           const questionAddBtnSpan = document.createElement('span')
           questionAddBtnSpan.innerHTML = '+'
           questionAddBtn.appendChild(questionAddBtnSpan)

            questionUpperPart.appendChild(questionFilterContainer)

            QuestionlowerPart.appendChild(innerQuestionLowerPart)

            innerRightContainer.appendChild(questionUpperPart)
            innerRightContainer.appendChild(QuestionlowerPart)
            innerRightContainer.appendChild(questionAddBtn)




const questionAddBtnElement = document.querySelector('.questionAddBtn')
questionAddBtnElement.addEventListener('click',()=>{
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
    AddQuestionForm.action = `/${adminId}/addQuestion`
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
            


const questionSelectElement = document.querySelector('#questionCategory');
const innerLowerPart = document.querySelector('.innerQuestionLowerPart');



function fetchAndRenderQuestions(category) {
    innerLowerPart.innerHTML = '';
    const queryString = `/${adminId}/getQuestions?questionCategory=${encodeURIComponent(category)}`;

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


        const allQuestions = document.querySelectorAll('.eachQuestion')

        allQuestions.forEach((question)=>{
            question.addEventListener('click',()=>{
                const questionText = question.firstChild.firstChild.innerHTML

                fetch(`/${adminId}/getQuestionInfo?question=${encodeURIComponent(questionText)}`).then((response)=>{
                    if(!response.ok){
                        throw new Error('There is an error fetching to update question.')
                    }
                    return response.json()
                }).then((data)=>{
                    const updateQuestionModal = document.querySelector('.updateQuestionModal')

                    updateQuestionModal.style.display = 'block'

                    const updateQuestionexitButtonContainer = document.querySelector('.updateQuestionexitButtonContainer')

                    updateQuestionexitButtonContainer.addEventListener('click',()=>{
                    updateQuestionModal.style.display = 'none'

                    })

                    const updateQuestionCategory = document.querySelector('#updateQuestionCategory')
                    updateQuestionCategory.value = data.questionCategory

                    const updateQuestionTextInput = document.querySelector('#updateQuestionTextInput')
                    updateQuestionTextInput.value = data.text

                    const updateQuestionForm = document.querySelector('#updateQuestionForm')
                    updateQuestionForm.addEventListener('submit',(event)=>{
                        event.preventDefault()

               
                    fetch(`/${adminId}/${data._id}/updateQuestion?questionCategory=${encodeURIComponent(updateQuestionCategory.value)}&questionText=${encodeURIComponent(updateQuestionTextInput.value)}`, {
                        method: 'PUT'
                    }).then((response)=>{
                        if(!response.ok){
                            throw new Error('There is an error trying to update question.')
                        }
                        return response.json()
                    }).then((data)=>{
                        updateQuestionForm.reset()
                        updateQuestionModal.style.display = 'none'

                    }).catch((e)=>{
                        console.log(e.message)
                    })

                    })
                    
                }).catch((e)=>{
                    console.log(e.message)
                })
            })
        })

    }).catch((e) => {
        console.log(e.message);
    });
}

function addRemoveQuestionEventListeners() {
    const questionButtonContainerElement = document.querySelectorAll('.questionButtonContainer');
    questionButtonContainerElement.forEach((element) => {
        element.addEventListener('click', (event) => {
            event.stopPropagation()
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
                const queryString = `/${adminId}/deleteQuestion?questionText=${encodeURIComponent(removeQuestionButtonYesElement.id)}&category=${encodeURIComponent(selectedCategory)}`;

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
                    window.location.href = `http://localhost:3100/${adminId}/admin?category=${encodeURIComponent(selectedCategory)}`;
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









           
        }else if(option.innerHTML === 'Students'){

            subjectBody.style.display = 'none';

            const filterOptionsContainer = document.createElement('div')
            filterOptionsContainer.classList.add('filterOptionsContainer')

            const innerFilterOptionContainer = document.createElement('div')
            innerFilterOptionContainer.classList.add('innerFilterOptionContainer')

            const departmentSelect = document.createElement('div')
            departmentSelect.classList.add('departmentSelect')

            const departmentLabel = document.createElement('label')
            departmentLabel.for = 'department'
            departmentLabel.innerHTML = 'Department: '

            const departmentSelectElement = document.createElement('select')
            departmentSelectElement.name = 'department'
            departmentSelectElement.id = 'department'

            const depOption = document.createElement('option')
            depOption.value = ''
            depOption.innerHTML = 'Select Department.'
            departmentSelectElement.appendChild(depOption)

             const depOption1 = document.createElement('option')
            depOption1.value = 'CET'
            depOption1.innerHTML = 'CET'
            departmentSelectElement.appendChild(depOption1)

             const depOption2 = document.createElement('option')
            depOption2.value = 'CBA'
            depOption2.innerHTML = 'CBA'
            departmentSelectElement.appendChild(depOption2)

             const depOption3 = document.createElement('option')
            depOption3.value = 'CEAA'
            depOption3.innerHTML = 'CEAA'
            departmentSelectElement.appendChild(depOption3)

             const depOption4 = document.createElement('option')
            depOption4.value = 'CHM'
            depOption4.innerHTML = 'CHM'
            departmentSelectElement.appendChild(depOption4)

            const depOption5 = document.createElement('option')
            depOption5.value = 'CNHS'
            depOption5.innerHTML = 'CNHS'
            departmentSelectElement.appendChild(depOption5)

            const depOption6 = document.createElement('option')
            depOption6.value = 'CCJE'
            depOption6.innerHTML = 'CCJE'
            departmentSelectElement.appendChild(depOption6)


            departmentSelect.appendChild(departmentLabel)
            departmentSelect.appendChild(departmentSelectElement)
            innerFilterOptionContainer.appendChild(departmentSelect)
            filterOptionsContainer.appendChild(innerFilterOptionContainer)
            innerRightContainer.appendChild(filterOptionsContainer)




            const yearSelect = document.createElement('div')
            yearSelect.classList.add('yearSelect')

            const yearSelectLabel = document.createElement('label')
            yearSelectLabel.for = 'year'
            yearSelectLabel.innerHTML = 'Year:'

            const yearSelectElement = document.createElement('select')
            yearSelectElement.name = 'year'
            yearSelectElement.id = 'year'

            const yearOption = document.createElement('option')
            yearOption.value = '1st'
            yearOption.innerHTML = '1st'
            yearSelectElement.appendChild(yearOption)

            const yearOption1 = document.createElement('option')
            yearOption1.value = '2nd'
            yearOption1.innerHTML = '2nd'
            yearSelectElement.appendChild(yearOption1)

            const yearOption2 = document.createElement('option')
            yearOption2.value = '3rd'
            yearOption2.innerHTML = '3rd'
            yearSelectElement.appendChild(yearOption2)

            const yearOption3 = document.createElement('option')
            yearOption3.value = '4th'
            yearOption3.innerHTML = '4th'
            yearSelectElement.appendChild(yearOption3)

            yearSelect.appendChild(yearSelectLabel)
            yearSelect.appendChild(yearSelectElement)

            innerFilterOptionContainer.appendChild(yearSelect)




            const programSelect = document.createElement('div')
            programSelect.classList.add('programSelect')

            const programSelectLabel = document.createElement('label')
            programSelectLabel.for= 'program'
            programSelectLabel.innerHTML = 'Program: '

            const programSelectElement = document.createElement('select')
            programSelectElement.name = 'program'
            programSelectElement.id = 'program'

            programSelect.appendChild(programSelectLabel)
            programSelect.appendChild(programSelectElement)

            innerFilterOptionContainer.appendChild(programSelect)




            const addStudentContainer = document.createElement('div')
            addStudentContainer.classList.add('addStudentContainer')

            const uploadFormElement = document.createElement('form')
            uploadFormElement.ref = 'uploadForm'
            uploadFormElement.id = 'uploadForm'
            uploadFormElement.action = `/${adminId}/uploadTest`
            uploadFormElement.method = 'POST'
            uploadFormElement.enctype = 'multipart/form-data'

            const studentFileButton = document.createElement('input')
            studentFileButton.type = 'submit'
            studentFileButton.value = 'Add Students' 
            studentFileButton.disabled = true
            studentFileButton.classList.add('uploadButton')

            const studentFile = document.createElement('input')
            studentFile.type = 'file'
            studentFile.name = 'studentFile'
            studentFile.classList.add('uploadFile')

            uploadFormElement.appendChild(studentFile)
            uploadFormElement.appendChild(studentFileButton)
            addStudentContainer.appendChild(uploadFormElement)

            filterOptionsContainer.appendChild(addStudentContainer)


            const studentListContainer = document.createElement('div')
            studentListContainer.classList.add('studentListContainer')

            const column = document.createElement('div')
            column.classList.add('Column')
          

            const colName = document.createElement('div')
            colName.classList.add('colName')
            const columnNameP = document.createElement('p')
            columnNameP.innerHTML = 'Name'
            colName.appendChild(columnNameP)
            column.appendChild(colName)

            const colDepartment = document.createElement('div')
            colDepartment.classList.add('colDepartment')
            const colDepartmentP = document.createElement('p')
            colDepartmentP.innerHTML = 'Department'
            colDepartment.appendChild(colDepartmentP)
            column.appendChild(colDepartment)


            const colYear = document.createElement('div')
            colYear.classList.add('colYear')
            const colYearP = document.createElement('p')
            colYearP.innerHTML = 'Year'
            colYear.appendChild(colYearP)
            column.appendChild(colYear)


            const colProgram = document.createElement('div')
            colProgram.classList.add('colProgram')
            const colProgramP = document.createElement('p')
            colProgramP.innerHTML = 'Program'
            colProgram.appendChild(colProgramP)
            column.appendChild(colProgram)

            const colBlankDiv = document.createElement('span')
            colBlankDiv.classList = 'colBlankDiv'
            column.appendChild(colBlankDiv)

            studentListContainer.appendChild(column)

            const innerstudentListContainerElement = document.createElement('div')
            innerstudentListContainerElement.classList.add('innerstudentListContainer')

            studentListContainer.appendChild(innerstudentListContainerElement)
            innerRightContainer.appendChild(studentListContainer)

            const deleteStudentsContainer = document.createElement('div')
            deleteStudentsContainer.classList.add('deleteStudentsContainer')

            const removeStudentsButton = document.createElement('button')
            removeStudentsButton.id = 'removeStudents'
            removeStudentsButton.innerHTML = 'Remove Students'
            removeStudentsButton.disabled = true

            const addIndividualStudentContainer = document.createElement('div')
            addIndividualStudentContainer.classList.add('addIndividualStudentContainer')

            const addIndividualStudentButton = document.createElement('button')
            addIndividualStudentButton.id = 'addIndividualStudentButton'
            addIndividualStudentButton.innerHTML = '+'
            addIndividualStudentContainer.appendChild(addIndividualStudentButton)

            deleteStudentsContainer.appendChild(removeStudentsButton)
            innerRightContainer.appendChild(deleteStudentsContainer)
            innerRightContainer.appendChild(addIndividualStudentContainer)



            addIndividualStudentButton.addEventListener('click',()=>{
                addIndividualStudentModal.style.display = 'block'


                const indivStudentForm = document.querySelector('#indivStudentForm')

                indivStudentForm.addEventListener('submit',(event)=>{
                    event.preventDefault()

                    const indivStudentID = document.querySelector('#indivStudentID')
                    const indivStudentName = document.querySelector('#indivStudentName')
                    const indivStudentEmail = document.querySelector('#indivStudentEmail')
                    const indivStudentDep = document.querySelector('#indivStudentDepartment')
                    const indivStudentProg = document.querySelector('#indivStudentProgram')
                    const indivStudentYear = document.querySelector('#indivStudentYear')
                    const studentAddedSubject = document.querySelectorAll('.studentAddedSubject')
                    

                    console.log(indivStudentID)
                  const subjects = [];
studentAddedSubject.forEach((subject) => {
  subjects.push(subject.firstChild.innerHTML);
});
const data = {
  studentID: Number(indivStudentID.value), // Ensure it is a number
  studentName: indivStudentName.value,
  studentEmail: indivStudentEmail.value,
  studentDepartment: indivStudentDep.value,
  studentProgram: indivStudentProg.value,
  studentYear: indivStudentYear.value,
  studentSubjects: subjects
};


 fetch(`/${adminId}/addIndividualStudent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('There is an error adding individual student');
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    // Clear all input fields and select elements
    document.querySelector('#indivStudentForm').reset();
    document.querySelector('.studentAddedSubs').innerHTML = ''
    // Hide the modal (assuming you are using Bootstrap)
    document.querySelector('.addIndividualStudentModal').style.display = 'none'
  })
  .catch((e) => {
    console.log(e.message);
  });

/* fetch(`/${adminId}/addIndividualStudent`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('There is an error adding individual student');
    }
    return response.json();
  })
  .then((data) => {
    indivStudentForm.reset()

    addIndividualStudentModal.style.display = 'none'

    // Handle successful response
  })
  .catch((e) => {
    console.log(e.message);
  }); */
                })


                const exitButton = document.querySelector('#addIndividualStudentExitButton')
                exitButton.addEventListener('click',()=>{
                    addIndividualStudentModal.style.display = 'none'
                })

                const indivStudentDepartment = document.querySelector('#indivStudentDepartment')
                indivStudentDepartment.addEventListener('change', ()=>{
                const indivStudentProgram = document.querySelector('#indivStudentProgram') 
                const indivStudentYear = document.querySelector('#indivStudentYear') 
                    if(indivStudentDepartment.value === 'CET'){
                        const cetPrograms = ['BSIT','BSCPE', 'BSCE','BSGE']
                        indivStudentProgram.innerHTML =''
                        cetPrograms.forEach(program=>{
                            let cetOption = document.createElement('option')
                            cetOption.value = program
                            cetOption.innerHTML = program
                            indivStudentProgram.appendChild(cetOption)
                        })

                        const programYear = ['1st','2nd','3rd']
                        indivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            indivStudentYear.appendChild(yearOption)

                        })

                    }else if(indivStudentDepartment.value === 'CBA'){
                        const cbaPrograms = ['BSAHRM', 'BSBAMM','BSA']
                        indivStudentProgram.innerHTML =''
                        cbaPrograms.forEach(program=>{
                            let cbaOption = document.createElement('option')
                            cbaOption.value = program
                            cbaOption.innerHTML = program
                            indivStudentProgram.appendChild(cbaOption)
                        })
                        const programYear = ['1st','2nd','3rd']
                        indivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            indivStudentYear.appendChild(yearOption)

                        })

                    }else if(indivStudentDepartment.value === 'CEAA'){
                        const ceaaPrograms = ['BEE', 'BSEDFIL','BSEDVRE', 'BSEDMATH', 'BAPS', 'BSEDENG','BSEDVE']
                        indivStudentProgram.innerHTML =''
                        ceaaPrograms.forEach(program=>{
                            let ceaaOption = document.createElement('option')
                            ceaaOption.value = program
                            ceaaOption.innerHTML = program
                            indivStudentProgram.appendChild(ceaaOption)
                        })

                        const programYear = ['1st','2nd','3rd']
                        indivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            indivStudentYear.appendChild(yearOption)

                        })


                    }else if(indivStudentDepartment.value === 'CHM'){
                        const chmPrograms = ['BSHM']
                        indivStudentProgram.innerHTML =''
                        chmPrograms.forEach(program=>{
                            let chmOption = document.createElement('option')
                            chmOption.value = program
                            chmOption.innerHTML = program
                            indivStudentProgram.appendChild(chmOption)
                        })

                        const programYear = ['1st','2nd','3rd']
                        indivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            indivStudentYear.appendChild(yearOption)

                        })


                    }else if(indivStudentDepartment.value === 'CNHS'){
                        const cnhsPrograms = ['BSN', 'BSBIO']
                        indivStudentProgram.innerHTML =''
                        cnhsPrograms.forEach(program=>{
                            let cnhsOption = document.createElement('option')
                            cnhsOption.value = program
                            cnhsOption.innerHTML = program
                            indivStudentProgram.appendChild(cnhsOption)
                        })

                        const programYear = ['1st','2nd','3rd', '4th']
                        indivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            indivStudentYear.appendChild(yearOption)

                        })


                    }else if(indivStudentDepartment.value === 'CCJE'){
                        const ccjePrograms = ['BSCRIM']
                        indivStudentProgram.innerHTML =''
                        ccjePrograms.forEach(program=>{
                            let ccjeOption = document.createElement('option')
                            ccjeOption.value = program
                            ccjeOption.innerHTML = program
                            indivStudentProgram.appendChild(ccjeOption)
                    })
                    const programYear = ['1st','2nd','3rd']
                        indivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            indivStudentYear.appendChild(yearOption)

                        })
                
                    }


                    fetch(`/${adminId}/getIndividualStudentSubject?department=${encodeURIComponent(indivStudentDepartment.value)}`).then((response)=>{
                         if(!response.ok){
                            throw new Error('There is an error getting all subjects depending on department')
                        }
                        return response.json()
                    }).then((data)=>{
                        const subjects = data.subjects
                        const studentToAddSubs = document.querySelector('.studentToAddSubs')
                        studentToAddSubs.innerHTML = ''
                        subjects.forEach((subject)=>{
                            const eachSub = document.createElement('div')
                            eachSub.classList.add('eachSub')

                            const eachSubSpan = document.createElement('span')
                            eachSubSpan.innerHTML = subject.code
                            eachSub.appendChild(eachSubSpan)


                           studentToAddSubs.appendChild(eachSub)

                           
                        })

                        const allEachSub = document.querySelectorAll('.eachSub')
                        const studentAddedSubs = document.querySelector('.studentAddedSubs')
                        allEachSub.forEach((sub)=>{
                            sub.addEventListener('click',()=>{
                                addToAddedSubject(sub)
                                /* const studentAddedSubject = document.createElement('div')
                                studentAddedSubject.classList.add('studentAddedSubject')

                                const studentAddedSubjectSpan = document.createElement('span')
                                studentAddedSubjectSpan.innerHTML = sub.firstChild.innerHTML
                                studentAddedSubject.appendChild(studentAddedSubjectSpan)

                                const exitButton = document.createElement('div')
                                exitButton.classList.add('exitButton')
                                exitButton.innerHTML = '+'
                                
                                exitButton.addEventListener('click',()=>{

                                    const parentElement =  exitButton.parentElement
                                    const eachSub = document.createElement('div')
                                    eachSub.classList.add('eachSub')

                                    const eachSubSpan = document.createElement('span')
                                    eachSubSpan.innerHTML = parentElement.firstChild.innerHTML
                                    eachSub.appendChild(eachSubSpan)

                                    studentToAddSubs.appendChild(eachSub)

                                    exitButton.parentElement.remove()
                                }) 


                                studentAddedSubject.appendChild(exitButton)

                                studentAddedSubs.appendChild(studentAddedSubject)

                                sub.remove() */

                            })
                        })

                        


                    }).catch((error)=>{
                        console.log(error.message)
                    })

                    
                })

            })


                                  const addToAddedSubject = (subject) => {
    const studentAddedSubs = document.querySelector('.studentAddedSubs');
    const studentToAddSubs = document.querySelector('.studentToAddSubs');

    const createstudentAddedSubject = document.createElement('div');
    createstudentAddedSubject.classList.add('studentAddedSubject');

    const createstudentAddedSubjectSpan = document.createElement('span');
    createstudentAddedSubjectSpan.innerHTML = subject.firstChild.innerHTML;
    createstudentAddedSubject.appendChild(createstudentAddedSubjectSpan);

    const createstudentAddedSubjectExitButton = document.createElement('div');
    createstudentAddedSubjectExitButton.classList.add('exitButton');
    createstudentAddedSubjectExitButton.innerHTML = '+';
    createstudentAddedSubject.appendChild(createstudentAddedSubjectExitButton);

    createstudentAddedSubjectExitButton.addEventListener('click', () => {
        const parentElement = createstudentAddedSubjectExitButton.parentElement;
        const eachSub = document.createElement('div');
        eachSub.classList.add('eachSub');

        const eachSubSpan = document.createElement('span');
        eachSubSpan.innerHTML = parentElement.firstChild.innerHTML;

        eachSub.appendChild(eachSubSpan);
        studentToAddSubs.appendChild(eachSub);

        eachSub.addEventListener('click', () => {
            addToAddedSubject(eachSub);
        });

        parentElement.remove();
    });

    studentAddedSubs.appendChild(createstudentAddedSubject);
    subject.remove();
};

// Adding event listeners to initial subjects
document.querySelectorAll('.studentToAddSubs .eachSub').forEach(subject => {
    subject.addEventListener('click', () => {
        addToAddedSubject(subject);
    });
});


            const departmentSelectElement2 = document.querySelector('#department')

            departmentSelectElement2.addEventListener('change',()=>{
            const programSelect = document.querySelector('#program')

            if(departmentSelectElement2.value === 'CET'){
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


    }else if(departmentSelectElement2.value === 'CBA'){
        programSelect.innerHTML = ''

        const option1 = document.createElement('option')
        option1.value = 'BSA'
        option1.innerHTML = 'BSA'
        programSelect.appendChild(option1)

         const option2 = document.createElement('option')
        option2.value = 'BSBA'
        option2.innerHTML = 'BSBA'
        programSelect.appendChild(option2)

    }else if(departmentSelectElement2.value === 'CCJE'){
        programSelect.innerHTML = ''

        const option1 = document.createElement('option')
        option1.value = 'BSCrim'
        option1.innerHTML = 'BSCrim'
        programSelect.appendChild(option1)

        
    }
    else if(departmentSelectElement2.value === 'CNHS'){
        programSelect.innerHTML = ''

        const option1 = document.createElement('option')
        option1.value = 'BSN'
        option1.innerHTML = 'BSN'
        programSelect.appendChild(option1)

        const option2 = document.createElement('option')
        option2.value = 'BSBio'
        option2.innerHTML = 'BSBio'
        programSelect.appendChild(option2)

    }else if(departmentSelectElement2.value === 'CHM'){
        programSelect.innerHTML = ''

        const option1 = document.createElement('option')
        option1.value = 'BSHM'
        option1.innerHTML = 'BSHM'
        programSelect.appendChild(option1)

        
    }
    else if(departmentSelectElement2.value === 'CEAA'){
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

const innerFilterOptionContainerSelect = document.querySelectorAll('.innerFilterOptionContainer select')

innerFilterOptionContainerSelect.forEach((select)=> {
    select.addEventListener('change', ()=> {

        const departmentSelect2 = document.querySelector('#department')
        const programSelect = document.querySelector('#program')
        const yearSelect= document.querySelector('#year')
        
        const queryString = `/${adminId}/studentList?year=${encodeURIComponent(yearSelect.value)}&department=${encodeURIComponent(departmentSelect2.value)}&program=${encodeURIComponent(programSelect.value)}`
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

                const eachStudentRemoveContainer = document.createElement('div')
                eachStudentRemoveContainer.classList.add('eachStudentRemoveContainer')

                const eachStudentremoveButton = document.createElement('button')
                eachStudentremoveButton.id = `${student.studentID}`
                eachStudentremoveButton.innerHTML = '-'
                eachStudentRemoveContainer.appendChild(eachStudentremoveButton)
                eachStudent.appendChild(eachStudentRemoveContainer)

                innerstudentListContainer.appendChild(eachStudent)
            });

            const allEachStudent = document.querySelectorAll('.eachStudent')
            const updateIndivStudentForm = document.querySelector('#updateIndivStudentForm')

            const updateIndividualStudentModal = document.querySelector('.updateIndividualStudentModal')
            allEachStudent.forEach((student)=>{
                student.addEventListener('click',()=>{
                    updateIndividualStudentModal.style.display = 'block'
                   document.querySelector('#updateIndividualStudentExitButton').addEventListener('click',()=>{
                        updateIndividualStudentModal.style.display = 'none'
                    })

                    updateIndivStudentForm.addEventListener('submit',(event)=>{
                        event.preventDefault()
                        console.log('meow')

                        const updateindivStudentID = document.querySelector('#updateindivStudentID')
                    const updateindivStudentName = document.querySelector('#updateindivStudentName')
                    const updateindivStudentEmail = document.querySelector('#updateindivStudentEmail')
                    const updateindivStudentDep = document.querySelector('#updateindivStudentDepartment')
                    const updateindivStudentProg = document.querySelector('#updateindivStudentProgram')
                    const updateindivStudentYear = document.querySelector('#updateindivStudentYear')
                    const studentAddedSubject = document.querySelectorAll('.studentAddedSubject')
                    

                  const subjects = [];
studentAddedSubject.forEach((subject) => {
  subjects.push(subject.firstChild.innerHTML);
});
const data = {
  studentID: Number(updateindivStudentID.value), // Ensure it is a number
  studentName: updateindivStudentName.value,
  studentEmail: updateindivStudentEmail.value,
  studentDepartment: updateindivStudentDep.value,
  studentProgram: updateindivStudentProg.value,
  studentYear: updateindivStudentYear.value,
  studentSubjects: subjects
};


 fetch(updateIndivStudentForm.action, {
    method: 'PUT',  // Change from POST to PUT
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)  // The data object should include the necessary information for updating the student
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('There is an error updating individual student');
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    // Clear all input fields and select elements
    document.querySelector('#updateIndivStudentForm').reset();  // Make sure to use the correct form ID
    document.querySelector('.updatestudentAddedSubs').innerHTML = '';  // Clear added subjects
    document.querySelector('.updatestudentToAddSubs').innerHTML = '';  // Clear subjects to add
    // Hide the modal
    document.querySelector('.updateIndividualStudentModal').style.display = 'none';
  })
  .catch((e) => {
    console.log(e.message);
  });

                    })

                    let studentID = student.lastChild.firstChild.id
                    fetch(`/${adminId}/getStudentInfo?studentName=${encodeURIComponent(student.firstChild.innerHTML)}&studentID=${encodeURIComponent(studentID)}`).then((response)=>{
                        if(!response.ok){
                            throw new Error('There is an error getting info of a Student.')
                        }
                        return response.json()
                    }).then((data)=>{

                        updateIndivStudentForm.action = `/${adminId}/${data._id}/updateIndividualStudent?_method=PUT`

                        const updateindivStudentID = document.querySelector('#updateindivStudentID')
                        const updateindivStudentName = document.querySelector('#updateindivStudentName')
                        const updateindivStudentEmail = document.querySelector('#updateindivStudentEmail')
                        const updateindivStudentDepartment = document.querySelector('#updateindivStudentDepartment')
                        const updateindivStudentProgram = document.querySelector('#updateindivStudentProgram')
                        const updateindivStudentYear = document.querySelector('#updateindivStudentYear')
                        const updatestudentAddedSubs = document.querySelector('.updatestudentAddedSubs')
                        const updatestudentToAddSubs = document.querySelector('.updatestudentToAddSubs')
                        updatestudentAddedSubs.innerHTML = ''
                        updatestudentToAddSubs.innerHTML = ''


                        updateindivStudentID.value = data.studentID
                        updateindivStudentName.value = data.name
                        updateindivStudentEmail.value = data.email
                        updateindivStudentDepartment.value =  data.department

                        if(updateindivStudentDepartment.value === 'CET'){
                        const cetPrograms = ['BSIT','BSCPE', 'BSCE','BSGE']
                        updateindivStudentProgram.innerHTML =''
                        cetPrograms.forEach(program=>{
                            let cetOption = document.createElement('option')
                            cetOption.value = program
                            cetOption.innerHTML = program
                            updateindivStudentProgram.appendChild(cetOption)
                        })

                        const programYear = ['1st','2nd','3rd']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })

                    }else if(updateindivStudentDepartment.value === 'CBA'){
                        const cbaPrograms = ['BSAHRM', 'BSBAMM','BSA']
                        updateindivStudentProgram.innerHTML =''
                        cbaPrograms.forEach(program=>{
                            let cbaOption = document.createElement('option')
                            cbaOption.value = program
                            cbaOption.innerHTML = program
                            updateindivStudentProgram.appendChild(cbaOption)
                        })
                        const programYear = ['1st','2nd','3rd']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })

                    }else if(updateindivStudentDepartment.value === 'CEAA'){
                        const ceaaPrograms = ['BEE', 'BSEDFIL','BSEDVRE', 'BSEDMATH', 'BAPS', 'BSEDENG','BSEDVE']
                        updateindivStudentProgram.innerHTML =''
                        ceaaPrograms.forEach(program=>{
                            let ceaaOption = document.createElement('option')
                            ceaaOption.value = program
                            ceaaOption.innerHTML = program
                            updateindivStudentProgram.appendChild(ceaaOption)
                        })

                        const programYear = ['1st','2nd','3rd']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })


                    }else if(updateindivStudentDepartment.value === 'CHM'){
                        const chmPrograms = ['BSHM']
                        updateindivStudentProgram.innerHTML =''
                        chmPrograms.forEach(program=>{
                            let chmOption = document.createElement('option')
                            chmOption.value = program
                            chmOption.innerHTML = program
                            updateindivStudentProgram.appendChild(chmOption)
                        })

                        const programYear = ['1st','2nd','3rd']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })


                    }else if(updateindivStudentDepartment.value === 'CNHS'){
                        const cnhsPrograms = ['BSN', 'BSBIO']
                        updateindivStudentProgram.innerHTML =''
                        cnhsPrograms.forEach(program=>{
                            let cnhsOption = document.createElement('option')
                            cnhsOption.value = program
                            cnhsOption.innerHTML = program
                            updateindivStudentProgram.appendChild(cnhsOption)
                        })

                        const programYear = ['1st','2nd','3rd', '4th']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })


                    }else if(updateindivStudentDepartment.value === 'CCJE'){
                        const ccjePrograms = ['BSCRIM']
                        updateindivStudentProgram.innerHTML =''
                        ccjePrograms.forEach(program=>{
                            let ccjeOption = document.createElement('option')
                            ccjeOption.value = program
                            ccjeOption.innerHTML = program
                            updateindivStudentProgram.appendChild(ccjeOption)
                    })
                    const programYear = ['1st','2nd','3rd']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })
                    }
                    updateindivStudentProgram.value = data.program
                    updateindivStudentYear.value = data.yearLevel
                    data.subjectsEnrolled.forEach((subject)=>{
                        const studentAddedSubject = document.createElement('div')
                        studentAddedSubject.classList.add('studentAddedSubject')

                        const studentAddedSubjectSpan = document.createElement('span')
                        studentAddedSubjectSpan.innerHTML = subject.code

                        const exitButton = document.createElement('div')
                        exitButton.classList.add('exitButton')
                        exitButton.innerHTML = '+'

                        exitButton.addEventListener('click', () => {
        const parentElement = exitButton.parentElement;
        const eachSub = document.createElement('div');
        eachSub.classList.add('eachSub');

        const eachSubSpan = document.createElement('span');
        eachSubSpan.innerHTML = parentElement.firstChild.innerHTML;

        eachSub.appendChild(eachSubSpan);
        updatestudentToAddSubs.appendChild(eachSub);

        eachSub.addEventListener('click', () => {
            updateAddToAddedSubject(eachSub);
        });

        parentElement.remove();
    });

                        studentAddedSubject.appendChild(studentAddedSubjectSpan)
                        studentAddedSubject.appendChild(exitButton)

                        updatestudentAddedSubs.appendChild(studentAddedSubject)

                    })

                    fetch(`/${adminId}/getAvailableSubjects?department=${encodeURIComponent(updateindivStudentDepartment.value)}`).then((response)=>{
                        if(!response.ok){
                            throw new Error('There is an error getting available subjects for updating students')
                        }
                        return response.json()
                    }).then((data) => {
        updatestudentToAddSubs.innerHTML = ''
    

        // Get all the subject codes from updatestudentAddedSubs
        const existingSubjects = Array.from(updatestudentAddedSubs.querySelectorAll('.studentAddedSubject span'))
            .map(span => span.innerHTML.trim());

        // Iterate over the new subjects
        data.forEach((subject) => {
            // Check if the subject code is not in the existing subjects list
            if (!existingSubjects.includes(subject.code.trim())) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');

                const eachSubSpan = document.createElement('span');
                eachSubSpan.innerHTML = subject.code;

                eachSub.appendChild(eachSubSpan);

                updatestudentToAddSubs.appendChild(eachSub);
            }
        });

         const allEachSub = document.querySelectorAll('.eachSub')
                        const studentAddedSubs = document.querySelector('.studentAddedSubs')
                        allEachSub.forEach((sub)=>{
                            sub.addEventListener('click',()=>{
                                updateAddToAddedSubject(sub)
                            })
                        })
                    }).catch((e)=>{
                        console.log(e.message)
                    })

                    updateindivStudentDepartment.addEventListener('change',()=>{
                        if(updateindivStudentDepartment.value === 'CET'){
                        const cetPrograms = ['BSIT','BSCPE', 'BSCE','BSGE']
                        updateindivStudentProgram.innerHTML =''
                        cetPrograms.forEach(program=>{
                            let cetOption = document.createElement('option')
                            cetOption.value = program
                            cetOption.innerHTML = program
                            updateindivStudentProgram.appendChild(cetOption)
                        })

                        const programYear = ['1st','2nd','3rd']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })

                    }else if(updateindivStudentDepartment.value === 'CBA'){
                        const cbaPrograms = ['BSAHRM', 'BSBAMM','BSA']
                        updateindivStudentProgram.innerHTML =''
                        cbaPrograms.forEach(program=>{
                            let cbaOption = document.createElement('option')
                            cbaOption.value = program
                            cbaOption.innerHTML = program
                            updateindivStudentProgram.appendChild(cbaOption)
                        })
                        const programYear = ['1st','2nd','3rd']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })

                    }else if(updateindivStudentDepartment.value === 'CEAA'){
                        const ceaaPrograms = ['BEE', 'BSEDFIL','BSEDVRE', 'BSEDMATH', 'BAPS', 'BSEDENG','BSEDVE']
                        updateindivStudentProgram.innerHTML =''
                        ceaaPrograms.forEach(program=>{
                            let ceaaOption = document.createElement('option')
                            ceaaOption.value = program
                            ceaaOption.innerHTML = program
                            updateindivStudentProgram.appendChild(ceaaOption)
                        })

                        const programYear = ['1st','2nd','3rd']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })


                    }else if(updateindivStudentDepartment.value === 'CHM'){
                        const chmPrograms = ['BSHM']
                        updateindivStudentProgram.innerHTML =''
                        chmPrograms.forEach(program=>{
                            let chmOption = document.createElement('option')
                            chmOption.value = program
                            chmOption.innerHTML = program
                            updateindivStudentProgram.appendChild(chmOption)
                        })

                        const programYear = ['1st','2nd','3rd']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })


                    }else if(updateindivStudentDepartment.value === 'CNHS'){
                        const cnhsPrograms = ['BSN', 'BSBIO']
                        updateindivStudentProgram.innerHTML =''
                        cnhsPrograms.forEach(program=>{
                            let cnhsOption = document.createElement('option')
                            cnhsOption.value = program
                            cnhsOption.innerHTML = program
                            updateindivStudentProgram.appendChild(cnhsOption)
                        })

                        const programYear = ['1st','2nd','3rd', '4th']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })


                    }else if(updateindivStudentDepartment.value === 'CCJE'){
                        const ccjePrograms = ['BSCRIM']
                        updateindivStudentProgram.innerHTML =''
                        ccjePrograms.forEach(program=>{
                            let ccjeOption = document.createElement('option')
                            ccjeOption.value = program
                            ccjeOption.innerHTML = program
                            updateindivStudentProgram.appendChild(ccjeOption)
                    })
                    const programYear = ['1st','2nd','3rd']
                        updateindivStudentYear.innerHTML = ''
                        programYear.forEach((year)=>{
                            const yearOption = document.createElement('option')
                            yearOption.value = year
                            yearOption.innerHTML = year
                            updateindivStudentYear.appendChild(yearOption)

                        })
                    }
                        fetch(`/${adminId}/getAvailableSubjects?department=${encodeURIComponent(updateindivStudentDepartment.value)}`).then((response)=>{
                        if(!response.ok){
                            throw new Error('There is an error getting available subjects for updating students')
                        }
                        return response.json()
                    }).then((data) => {
        updatestudentToAddSubs.innerHTML = ''

        // Get all the subject codes from updatestudentAddedSubs
        const existingSubjects = Array.from(updatestudentAddedSubs.querySelectorAll('.studentAddedSubject span'))
            .map(span => span.innerHTML.trim());

        // Iterate over the new subjects
        data.forEach((subject) => {
            // Check if the subject code is not in the existing subjects list
            if (!existingSubjects.includes(subject.code.trim())) {
                const eachSub = document.createElement('div');
                eachSub.classList.add('eachSub');

                const eachSubSpan = document.createElement('span');
                eachSubSpan.innerHTML = subject.code;

                eachSub.appendChild(eachSubSpan);

                updatestudentToAddSubs.appendChild(eachSub);
            }
        });

         const allEachSub = document.querySelectorAll('.eachSub')
                        const studentAddedSubs = document.querySelector('.studentAddedSubs')
                        allEachSub.forEach((sub)=>{
                            sub.addEventListener('click',()=>{
                                updateAddToAddedSubject(sub)
                            })
                        })
                    }).catch((e)=>{
                        console.log(e.message)
                    })
                    
                    })


                    }).catch((e)=>{ 
                        console.log(e.message)
                    })
                })
            })

    const updateAddToAddedSubject = (subject) => {
    const studentAddedSubs = document.querySelector('.updatestudentAddedSubs');
    const studentToAddSubs = document.querySelector('.updatestudentToAddSubs');

    const createstudentAddedSubject = document.createElement('div');
    createstudentAddedSubject.classList.add('studentAddedSubject');

    const createstudentAddedSubjectSpan = document.createElement('span');
    createstudentAddedSubjectSpan.innerHTML = subject.firstChild.innerHTML;
    createstudentAddedSubject.appendChild(createstudentAddedSubjectSpan);

    const createstudentAddedSubjectExitButton = document.createElement('div');
    createstudentAddedSubjectExitButton.classList.add('exitButton');
    createstudentAddedSubjectExitButton.innerHTML = '+';
    createstudentAddedSubject.appendChild(createstudentAddedSubjectExitButton);

    createstudentAddedSubjectExitButton.addEventListener('click', () => {
        const parentElement = createstudentAddedSubjectExitButton.parentElement;
        const eachSub = document.createElement('div');
        eachSub.classList.add('eachSub');

        const eachSubSpan = document.createElement('span');
        eachSubSpan.innerHTML = parentElement.firstChild.innerHTML;

        eachSub.appendChild(eachSubSpan);
        studentToAddSubs.appendChild(eachSub);

        eachSub.addEventListener('click', () => {
            updateAddToAddedSubject(eachSub);
        });

        parentElement.remove();
    });

    studentAddedSubs.appendChild(createstudentAddedSubject);
    subject.remove();
};


document.querySelectorAll('.studentAddedSubs .eachSub').forEach(subject => {
    subject.addEventListener('click', () => {
        updateAddToAddedSubject(subject);
    });
});

            const eachStudentRemoveContainer = document.querySelectorAll('.eachStudentRemoveContainer button')

            eachStudentRemoveContainer.forEach((button)=>{
                button.addEventListener('click', (event)=>{
                    event.stopPropagation()
                    const confirmStudentRemoveModal = document.querySelector('.confirmStudentRemoveModal')
                    confirmStudentRemoveModal.style.display = 'block'

                    const toBeRemovedStudent = document.querySelector('#toBeRemovedStudent')
                    

                    fetch(`/${adminId}/getConfirmDeleteStudent?studentID=${encodeURIComponent(button.id)}`).then((response)=>{
                        if(!response.ok){
                            throw new Error('There is an error getting student to be deleted.')
                        }
                        return response.json()
                    }).then((data)=>{
                        toBeRemovedStudent.innerHTML = `${data.foundStudent.name}`
                    }).catch((e)=>{
                        console.log(e.message)
                    })


                    const removeStudentExitButton = document.querySelector('#removeStudentExitButton')

                    removeStudentExitButton.addEventListener('click',()=>{
                    confirmStudentRemoveModal.style.display = 'none'  
                    })

                    const studentRemoveButtonNo = document.querySelector('#studentRemoveButtonNo')
                    studentRemoveButtonNo.addEventListener('click',()=>{
                        studentRemoveButtonNo.style.display = 'none'
                    })

                    const studentRemoveButtonYes = document.querySelector('#studentRemoveButtonYes')
                    studentRemoveButtonYes.addEventListener('click',()=>{

                        fetch(`/${adminId}/deleteIndividualStudent?studentID=${encodeURIComponent(button.id)}`,{
                        method: 'DELETE'
                    }).then((response)=>{
                        if(!response.ok){
                            throw new Error('there is an error deleting individual student.')
                        }
                        return response.json()
                    }).then((data)=>{

                    }).catch((e)=>{
                        console.log(e.message)
                    })

                    })

            
                })
            })

        }).catch((e)=> {
            console.log(`there is an error saying: ${e}`)
        })

    })
})

let departmentValue = ''
let programValue = ''
let yearValue = ''

innerFilterOptionContainerSelect.forEach((select)=>{
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
        const queryString = `/${adminId}/toBeDeleteStudents?department=${encodeURIComponent(departmentValue)}&program=${encodeURIComponent(programValue)}&year=${encodeURIComponent(yearValue)}`
            fetch(queryString, {
        method: 'DELETE', 
    }).then((response)=>{
                if(!response.ok){
                    throw new Error('error deleting students')
                }
            }).then((data)=>{
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
})


        }else if(option.innerHTML === 'Time Frames'){
            subjectBody.style.display = 'none';
          

           const timeFrameBody = document.createElement('div')
           timeFrameBody.classList.add('timeFrameBody')

           const timeFrameBodyForm = document.createElement('form')
           timeFrameBodyForm.method = 'POST'
           timeFrameBodyForm.id = 'timeFrameForm'
           timeFrameBodyForm.action = `/${adminId}/setTimeFrame`

           const startDate = document.createElement('div')
           startDate.classList.add('startDate')

           const startDateLabel = document.createElement('label')
           startDateLabel.for = 'startDate'
           startDateLabel.innerHTML = 'Set Start Date: '
           startDate.appendChild(startDateLabel)

           const startDateInput = document.createElement('input')
            startDateInput.type = 'date'
            startDateInput.id = 'startDate'
            startDateInput.name = 'startDate'
            startDateInput.required = true
            startDate.appendChild(startDateInput)
            timeFrameBodyForm.appendChild(startDate)

           const endDate = document.createElement('div')
           endDate.classList.add('endDate')

           const endDateLabel = document.createElement('label')
           endDateLabel.for ='endDate'
           endDateLabel.innerHTML = 'Set End Date: '
           endDate.appendChild(endDateLabel)

           const endDateInput = document.createElement('input')
            endDateInput.type = 'date'
            endDateInput.id = 'endDate'
            endDateInput.name = 'endDate'
            endDateInput.required = true
            endDate.appendChild(endDateInput)
            timeFrameBodyForm.appendChild(endDate)
            
            const startTime = document.createElement('div')
           startTime.classList.add('startTime')

           const startTimeLabel = document.createElement('label')
           startTimeLabel.for = 'startTime'
           startTimeLabel.innerHTML = 'Set Start Time: '
           startTime.appendChild(startTimeLabel)

           const startTimeInput = document.createElement('input')
            startTimeInput.type = 'time'
            startTimeInput.id = 'startTime'
            startTimeInput.name = 'startTime'
            startTimeInput.required = true
            startTime.appendChild(startTimeInput)
            timeFrameBodyForm.appendChild(startTime)

            const endTime = document.createElement('div')
           endTime.classList.add('endTime')

           const endTimeLabel = document.createElement('label')
           endTimeLabel.for = 'endTime'
           endTimeLabel.innerHTML = 'Set End Time: '
           endTime.appendChild(endTimeLabel)

           const endTimeInput = document.createElement('input')
            endTimeInput.type = 'time'
            endTimeInput.id = 'endTime'
            endTimeInput.name = 'endTime'
            endTimeInput.required = true
            endTime.appendChild(endTimeInput)
            timeFrameBodyForm.appendChild(endTime)

            const startAcadYear = document.createElement('div')
           startAcadYear.classList.add('startAcadYear')

           const startAcadYearLabel = document.createElement('label')
           startAcadYearLabel.for ='startAcadYear'
           startAcadYearLabel.innerHTML = 'Set Start of Academic Year: '
           startAcadYear.appendChild(startAcadYearLabel)

           const startAcadYearInput = document.createElement('input')
            startAcadYearInput.type = 'number'
            startAcadYearInput.id = 'startAcadYear'
            startAcadYearInput.name = 'startAcadYear'
            startAcadYearInput.required = true
            startAcadYearInput.min = '2023'
            startAcadYearInput.max = '2100'
            startAcadYear.appendChild(startAcadYearInput)
            timeFrameBodyForm.appendChild(startAcadYear)

            const endAcadYear = document.createElement('div')
           endAcadYear.classList.add('endAcadYear')

           const endAcadYearLabel = document.createElement('label')
           endAcadYearLabel.for = 'endAcadYearLabel'
           endAcadYearLabel.innerHTML = 'Set End Academic Year: '
           endAcadYear.appendChild(endAcadYearLabel)

           const endAcadYearInput = document.createElement('input')
            endAcadYearInput.type = 'number'
            endAcadYearInput.id = 'endAcadYear'
            endAcadYearInput.name = 'endAcadYear'
            endAcadYearInput.required = true
            endAcadYear.appendChild(endAcadYearInput)
            timeFrameBodyForm.appendChild(endAcadYear)

            const sem = document.createElement('div')
           sem.classList.add('sem')

           const semLabel = document.createElement('label')
           semLabel.for = 'sem'
           semLabel.innerHTML = 'Select which Semester: '
           sem.appendChild(semLabel)

           const semSelect = document.createElement('select')
           semSelect.name = 'sem'
           semSelect.id = 'sem'

           const semSelectOption1 = document.createElement('option')
           semSelectOption1.value = '1st'
           semSelectOption1.innerHTML = '1st'
           semSelect.appendChild(semSelectOption1)
           
           const semSelectOption2 = document.createElement('option')
           semSelectOption2.value = '2nd'
           semSelectOption2.innerHTML = '2nd'
           semSelect.appendChild(semSelectOption2)

           const semSelectOption3 = document.createElement('option')
           semSelectOption3.value = '3rd'
           semSelectOption3.innerHTML = '3rd'
           semSelect.appendChild(semSelectOption3)
           sem.appendChild(semSelect)
            timeFrameBodyForm.appendChild(sem)

           const timeFrameButtonContainer = document.createElement('div')
           timeFrameButtonContainer.classList.add('timeFrameButtonContainer')

           const timeFrameButtonContainerButtonYes = document.createElement('button')
           timeFrameButtonContainerButtonYes.type = 'submit'
           timeFrameButtonContainerButtonYes.innerHTML = 'Save'
           timeFrameButtonContainerButtonYes.id="timeFrameSave"

            const timeFrameCancelButton = document.createElement('button')
            timeFrameCancelButton.id = 'timeFrameCancel'
            timeFrameCancelButton.innerHTML = 'Cancel'
            timeFrameCancelButton.type = 'button'
            timeFrameCancelButton.disabled = true
            timeFrameButtonContainer.appendChild(timeFrameCancelButton)


            timeFrameButtonContainer.appendChild(timeFrameButtonContainerButtonYes)
            timeFrameBody.appendChild(timeFrameBodyForm)
            timeFrameBodyForm.appendChild(timeFrameButtonContainer)

            innerRightContainer.appendChild(timeFrameBody)

              
        fetch(`/${adminId}/getTimeFrame`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('there is an error getting Time Frame');
            }
            return response.json();
        })
        .then((data) => {
            const foundTimeFrame = data.foundTimeFrame;
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const startDateElement = document.querySelector('#startDate');
            startDateElement.value = foundTimeFrame ? formatDate(foundTimeFrame.startDate) : '';

            const endDateElement = document.querySelector('#endDate');
            endDateElement.value = foundTimeFrame ? formatDate(foundTimeFrame.endDate) : '';

            const startTimeElement = document.querySelector('#startTime');
            startTimeElement.value = foundTimeFrame ? foundTimeFrame.startTime : '';

            const endTimeElement = document.querySelector('#endTime');
            endTimeElement.value = foundTimeFrame ? foundTimeFrame.endTime : '';

            const startAcadYearElement = document.querySelector('#startAcadYear');
            startAcadYearElement.value = foundTimeFrame ? foundTimeFrame.acadYearStart : '';

            const endAcadYearElement = document.querySelector('#endAcadYear');
            endAcadYearElement.value = foundTimeFrame ? foundTimeFrame.acadYearEnd : '';

            const semElement = document.querySelector('#sem');
            semElement.value = foundTimeFrame ? foundTimeFrame.semester : '';

            // Enable or disable buttons based on foundTimeFrame
            const saveButton = document.querySelector('#timeFrameSave');
            const cancelButton = document.querySelector('#timeFrameCancel');

            if (foundTimeFrame) {
                saveButton.disabled = true;
                cancelButton.disabled = false;
            } else {
                saveButton.disabled = false;
                cancelButton.disabled = true;
            }
        })
        .catch((e) => {
            console.log(e);
        });




          
    document.getElementById('timeFrameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const queryString = new URLSearchParams(formData).toString();
    console.log(queryString)

    fetch(this.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: queryString
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to save time frame');
        }
        return response.json();
    }).then(data => {
        // Disable all inputs and save button
        document.querySelectorAll('#timeFrameForm input, #timeFrameForm select').forEach(el => el.disabled = true);
        document.getElementById('timeFrameSave').disabled = true;
        document.getElementById('timeFrameCancel').disabled = false;
    }).catch(error => {
        console.error('Error:', error);
    });
});



document.getElementById('timeFrameCancel').addEventListener('click', async function() {
    try {
        // Make the POST request to cancel the time frame
        const response = await fetch(`/${adminId}/cancelTimeFrame`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            // Re-enable all inputs and save button
            document.querySelectorAll('#timeFrameForm input, #timeFrameForm select').forEach(el => el.disabled = false);
            document.getElementById('timeFrameSave').disabled = false;
            document.getElementById('timeFrameCancel').disabled = true;

            // Clear all input and select values
            document.querySelectorAll('#timeFrameForm input, #timeFrameForm select').forEach(el => {
                if (el.type === 'checkbox' || el.type === 'radio') {
                    el.checked = false; // Clear checkboxes and radio buttons
                } else {
                    el.value = ''; // Clear other inputs and selects
                }
            });

            // Show success message
            console.log(result.message);
        } else {
            // Show error message
            console.log(result.message || 'Failed to deactivate time frame');
        }
    } catch (error) {
        console.error('Error while canceling time frame:', error);
        console.log('An error occurred while canceling the time frame');
    }
});

/* document.getElementById('timeFrameCancel').addEventListener('click', function() {
    // Re-enable all inputs and save button
    document.querySelectorAll('#timeFrameForm input, #timeFrameForm select').forEach(el => el.disabled = false);
    document.getElementById('timeFrameSave').disabled = false;
    document.getElementById('timeFrameCancel').disabled = true;

    // Clear all input and select values
    document.querySelectorAll('#timeFrameForm input, #timeFrameForm select').forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false; // Clear checkboxes and radio buttons
        } else {
            el.value = ''; // Clear other inputs and selects
        }
    });
}); */


/* document.getElementById('timeFrameCancel').addEventListener('click', function() {
    fetch(`/${adminId}/deleteTimeFrame`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete time frame');
        }
        // If the response status is 204, there is no content to parse
        if (response.status === 204) {
            return null;
        }
        return response.json();
    }).then(data => {
        // Re-enable all inputs and save button
        document.querySelectorAll('#timeFrameForm input, #timeFrameForm select').forEach(el => el.disabled = false);
        document.getElementById('timeFrameSave').disabled = false;
        document.getElementById('timeFrameCancel').disabled = true;
    }).catch(error => {
        console.error('Error:', error);
    });
}); */



/* 
            timeFrameSaveElement.addEventListener('click', ()=>{
                const startDateElement = document.querySelector('#startDate')
                const endDateElement = document.querySelector('#endDate')
                const startTimeElement = document.querySelector('#startTime')
                const endTimeElement = document.querySelector('#endTime')
                const startAcadYearElement = document.querySelector('#startAcadYear')
                const endAcadYearElement = document.querySelector('#endAcadYear')
                const semElement = document.querySelector('#sem')
                const queryString = `/${adminId}/setTimeFrame?startDate=${encodeURIComponent(startDateElement.value)}&endDate=${encodeURIComponent(endDateElement.value)}&startTime=${encodeURIComponent(startTimeElement.value)}endTime=${encodeURIComponent(endTimeElement.value)}&startAcad=${encodeURIComponent(startAcadYearElement.value)}&endAcad=${encodeURIComponent(endAcadYearElement.value)}&sem=${encodeURIComponent(semElement.value)}`
                fetch(queryString, {
                    method: 'POST'
                }).then((response)=>{
                    if(!response.ok){
                        throw new Error('there is an error posting timeframe')
                    }
                    return response.json()
                }).then((data)=>{
                    console.log(data)
                }).catch((e)=>{
                    console.log(e.message)
                })
            }) */



            /* const timeFrameCancel = document.querySelector('#timeFrameCancel');
            timeFrameCancel.addEventListener('click', () => {
                fetch(`/${adminId}/deleteTimeFrame`, {
                    method: 'DELETE'
                }).then((response) => {
                    if (!response.ok) {
                        throw new Error('There was an error deleting the time frame.');
                    }
                    return response.json(); 
                }).then((data) => {
                    console.log('Time frame deleted successfully:', data); 
                
                }).catch((error) => {
                    console.error('Error:', error.message); 
                });
            }); */
            
        }else if(option.innerHTML === 'Subjects'){
            
        
        subjectBody.style.display = 'block';
        innerRightContainer.appendChild(subjectBody)

        const subjectSelects = document.querySelectorAll('.subjectFilterContainer select')
        const subjectDep = document.querySelector('#subjectDep')
        const subjectYear = document.querySelector('#subjectYear')
        const subjectProgram = document.querySelector('#subjectProgram')

        subjectDep.addEventListener('change',()=>{
            if(subjectDep.value === 'CET'){
                 subjectProgram.innerHTML = ''   

                const cetOption1 = document.createElement('option')
                cetOption1.value = 'BSIT'
                cetOption1.innerHTML = 'BS IT'
                subjectProgram.appendChild(cetOption1)

                const cetOption2 = document.createElement('option')
                cetOption2.value = 'BSCE'
                cetOption2.innerHTML = 'BS CE'
                subjectProgram.appendChild(cetOption2)

                const cetOption3 = document.createElement('option')
                cetOption3.value = 'BSCPE'
                cetOption3.innerHTML = 'BS CPE'
                subjectProgram.appendChild(cetOption3)

                const cetOption4 = document.createElement('option')
                cetOption4.value = 'BSGE'
                cetOption4.innerHTML = 'BS GE'
                subjectProgram.appendChild(cetOption4)

               

            }else if(subjectDep.value === 'CBA'){

                subjectProgram.innerHTML = ''   


                const cbaOption1 = document.createElement('option')
                cbaOption1.value = 'BSAHRM'
                cbaOption1.innerHTML = 'BS AHRM'
                subjectProgram.appendChild(cbaOption1)
                
                const cbaOption2 = document.createElement('option')
                cbaOption2.value = 'BSBAHM'
                cbaOption2.innerHTML = 'BS BAMM'
                subjectProgram.appendChild(cbaOption2)
                
                const cbaOption3 = document.createElement('option')
                cbaOption3.value = 'BSA'
                cbaOption3.innerHTML = 'BS A'
                subjectProgram.appendChild(cbaOption3)

               
            }else if(subjectDep.value === 'CEAA'){

                subjectProgram.innerHTML = ''   


                const ceaaOption3 = document.createElement('option')
                ceaaOption3.value = 'BEE'
                ceaaOption3.innerHTML = 'B EE'
                subjectProgram.appendChild(ceaaOption3)

                const ceaaOption1 = document.createElement('option')
                ceaaOption1.value = 'BSEDFIL'
                ceaaOption1.innerHTML = 'BSED FILIPINO'
                subjectProgram.appendChild(ceaaOption1)
                
                const ceaaOption2 = document.createElement('option')
                ceaaOption2.value = 'BSEDVRE'
                ceaaOption2.innerHTML = 'BSED VRE'
                subjectProgram.appendChild(ceaaOption2)

                const ceaaOption4 = document.createElement('option')
                ceaaOption4.value = 'BSEDMATH'
                ceaaOption4.innerHTML = 'BSED MATHEMATICS'
                subjectProgram.appendChild(ceaaOption4)

                const ceaaOption5 = document.createElement('option')
                ceaaOption5.value = 'BAPS'
                ceaaOption5.innerHTML = 'BA PolSci'
                subjectProgram.appendChild(ceaaOption5)

                const ceaaOption6 = document.createElement('option')
                ceaaOption6.value = 'BSEDENG'
                ceaaOption6.innerHTML = 'BSED ENGLISH'
                subjectProgram.appendChild(ceaaOption6)

                const ceaaOption7 = document.createElement('option')
                ceaaOption7.value = 'BSEDVE'
                ceaaOption7.innerHTML = 'BSED VE'
                subjectProgram.appendChild(ceaaOption7)



            }else if(subjectDep.value === 'CHM'){

                subjectProgram.innerHTML = ''   



                 const chmOption1 = document.createElement('option')
                chmOption1.value = 'BSHM'
                chmOption1.innerHTML = 'BS HM'
                subjectProgram.appendChild(chmOption1)



            }else if(subjectDep.value === 'CNHS'){
                 subjectProgram.innerHTML = ''   



                const cnhsOption1 = document.createElement('option')
                cnhsOption1.value = 'BSBIO'
                cnhsOption1.innerHTML = 'BS BIO'
                subjectProgram.appendChild(cnhsOption1)

                const cnhsOption2 = document.createElement('option')
                cnhsOption2.value = 'BSN'
                cnhsOption2.innerHTML = 'BS N'
                subjectProgram.appendChild(cnhsOption2)

                
            }else if(subjectDep.value === 'CCJE'){
                subjectProgram.innerHTML = ''   
                
                const ccjeoption1 = document.createElement('option')
                ccjeoption1.value = 'BSCRIM'
                ccjeoption1.innerHTML = 'BS CRIM'
                subjectProgram.appendChild(ccjeoption1)

                
            }

        })
      
        subjectSelects.forEach(select => {
            select.addEventListener('change',()=>{
                const subjectDep = document.querySelector('#subjectDep')
                const subjectYear = document.querySelector('#subjectYear')
                const subjectProgram = document.querySelector('#subjectProgram')

                const queryString =`/${adminId}/getFilteredSubjects?subjectDep=${encodeURIComponent(subjectDep.value)}&subjectYear=${encodeURIComponent(subjectYear.value)}&subjectProgram=${encodeURIComponent(subjectProgram.value)}`
                fetch(queryString).then((response)=>{
                    if(!response.ok){
                        throw new Error('There is an error fetching filtered subjects')
                    }
                    return response.json()
                }).then((data)=>{
                    const {foundSubs} = data
                    const filteredSublist = document.querySelector('.filteredSublist')
                    filteredSublist.innerHTML=''
                    
                    
                    const addSubjectButton = document.createElement('div')
                    addSubjectButton.classList.add('addSubjectButton')

                    const addSubjectButtonh1 = document.createElement('h1')
                    addSubjectButtonh1.innerHTML = '+'
                    addSubjectButton.append(addSubjectButtonh1)
                    filteredSublist.appendChild(addSubjectButton)


                    foundSubs.forEach((subject)=>{
                        const eachFilteredSub = document.createElement('div')
                        eachFilteredSub.classList.add('eachFilteredSub')

                        const eachFilteredSubName = document.createElement('div')
                        eachFilteredSubName.classList.add('eachFilteredSubName')
                        eachFilteredSubName.innerHTML = `${subject.name}`
                        eachFilteredSub.appendChild(eachFilteredSubName)

                        const eachFilteredSubCode = document.createElement('div')
                        eachFilteredSubCode.classList.add('eachFilteredSubCode')
                        eachFilteredSubCode.innerHTML = `${subject.code}`
                        eachFilteredSub.appendChild(eachFilteredSubCode)

                        const eachFilteredSubYear = document.createElement('div')
                        eachFilteredSubYear.classList.add('eachFilteredSubYear')
                        eachFilteredSubYear.innerHTML = `${subject.year}`
                        eachFilteredSub.appendChild(eachFilteredSubYear)

                        const eachFilteredSubProgram = document.createElement('div')
                        eachFilteredSubProgram.classList.add('eachFilteredSubProgram')
                        eachFilteredSubProgram.innerHTML = `${subject.program}`
                        eachFilteredSub.appendChild(eachFilteredSubProgram)

                        const eachFilteredSubButtonContainer = document.createElement('div')
                        eachFilteredSubButtonContainer.classList.add('eachFilteredSubButtonContainer')
                        eachFilteredSubButtonContainer.id = 'eachFilteredSubButtonContainer'


                        const eachFilteredSubButtonRemove = document.createElement('div')
                        eachFilteredSubButtonRemove.classList.add('eachFilteredSubButtonRemove')
                        eachFilteredSubButtonRemove.innerHTML = '-'
                        eachFilteredSubButtonRemove.id = `${subject.code}`
                        eachFilteredSubButtonContainer.appendChild(eachFilteredSubButtonRemove)

                        eachFilteredSub.appendChild(eachFilteredSubButtonContainer)

                        filteredSublist.appendChild(eachFilteredSub)

                    })

                    const eachFilteredSub = document.querySelectorAll('.eachFilteredSub')
                    const updateIndividualSubjectModal = document.querySelector('.updateIndividualSubjectModal')
                    eachFilteredSub.forEach((subject)=>{
                        subject.addEventListener('click',()=>{
                            updateIndividualSubjectModal.style.display = 'block'

                            const updatesubModalExitButton = document.querySelector('#updatesubModalExitButton')
                            updatesubModalExitButton.addEventListener('click',()=>{
                                updateIndividualSubjectModal.style.display = 'none'
                                
                            })

                            fetch(`/:adminId/getSubjectInfo?subjectName=${encodeURIComponent(subject.firstChild.innerHTML)}`)
                            .then((response)=>{
                                if(!response.ok){
                                    throw new Error('There is an error getting info of the subject')
                                }
                                return response.json()
                            }).then((data)=>{
                                const subjectNameUpdate = document.querySelector('#subjectNameUpdate')
                                const subjectCodeUpdate = document.querySelector('#subjectCodeUpdate')
                                const subDepSelect = document.querySelector('#updateSubDepSelect')
                                const subProgSelect = document.querySelector('#updateSubProgSelectUpdate')
                                const subYearSelectUpdate = document.querySelector('#updateSubYearSelectUpdate')
                                subjectNameUpdate.value = data.name
                                subjectCodeUpdate.value = data.code
                                subDepSelect.value = data.department[0]
                                subYearSelectUpdate.value = data.year
                                if(subDepSelect.value === 'CET'){
                                const cetPrograms = ['BSIT','BSCPE', 'BSCE','BSGE']
                                subProgSelect.innerHTML =''
                                cetPrograms.forEach(program=>{
                                    let cetOption = document.createElement('option')
                                    cetOption.value = program
                                    cetOption.innerHTML = program
                                    subProgSelect.appendChild(cetOption)
                                })
                                
                            }else if(subDepSelect.value === 'CBA'){
                                const cbaPrograms = ['BSAHRM', 'BSBAMM','BSA']
                                subProgSelect.innerHTML =''
                                cbaPrograms.forEach(program=>{
                                    let cbaOption = document.createElement('option')
                                    cbaOption.value = program
                                    cbaOption.innerHTML = program
                                    subProgSelect.appendChild(cbaOption)
                                })
                            }else if(subDepSelect.value === 'CEAA'){
                                const ceaaPrograms = ['BEE', 'BSEDFIL','BSEDVRE', 'BSEDMATH', 'BAPS', 'BSEDENG','BSEDVE']
                                subProgSelect.innerHTML =''
                                ceaaPrograms.forEach(program=>{
                                    let ceaaOption = document.createElement('option')
                                    ceaaOption.value = program
                                    ceaaOption.innerHTML = program
                                    subProgSelect.appendChild(ceaaOption)
                                })
                            }else if(subDepSelect.value === 'CHM'){
                                const chmPrograms = ['BSHM']
                                subProgSelect.innerHTML =''
                                chmPrograms.forEach(program=>{
                                    let chmOption = document.createElement('option')
                                    chmOption.value = program
                                    chmOption.innerHTML = program
                                    subProgSelect.appendChild(chmOption)
                                })
                            }else if(subDepSelect.value === 'CNHS'){
                                const cnhsPrograms = ['BSN', 'BSBIO']
                                subProgSelect.innerHTML =''
                                cnhsPrograms.forEach(program=>{
                                    let cnhsOption = document.createElement('option')
                                    cnhsOption.value = program
                                    cnhsOption.innerHTML = program
                                    subProgSelect.appendChild(cnhsOption)
                                })
                            }else if(subDepSelect.value === 'CCJE'){
                                const ccjePrograms = ['BSCRIM']
                                subProgSelect.innerHTML =''
                                ccjePrograms.forEach(program=>{
                                    let ccjeOption = document.createElement('option')
                                    ccjeOption.value = program
                                    ccjeOption.innerHTML = program
                                    subProgSelect.appendChild(ccjeOption)
                                })}
                                

                                console.log(data)
                            }).catch((error)=>{
                                console.log(error.message)
                            })
                        })
                    })
                    const eachFilteredSubButtonRemove = document.querySelectorAll('.eachFilteredSubButtonRemove')
                    
                    eachFilteredSubButtonRemove.forEach((button)=>{
                        button.addEventListener('click', ()=>{
                            const confirmSubRemoveModal = document.querySelector('.confirmSubRemoveModal')
                            confirmSubRemoveModal.style.display = 'block'
                            
                            const removeSubExitButton = document.querySelector('#removeSubExitButton')
                            removeSubExitButton.addEventListener('click', ()=>{
                                confirmSubRemoveModal.style.display = 'none'

                            })
                            const subRemoveButtonNo = document.querySelector('#subRemoveButtonNo')
                            subRemoveButtonNo.addEventListener('click',()=>{
                                confirmSubRemoveModal.style.display = 'none'
                            })


                            const toBeRemovedSub = document.querySelector('#toBeRemovedSub')
                            toBeRemovedSub.innerHTML = button.id
                            


                            const subRemoveButtonYes = document.querySelector('#subRemoveButtonYes')

                            subRemoveButtonYes.addEventListener('click',()=>{
                                fetch(`/${adminId}/deleteIndividualSubject?subjectCode=${encodeURIComponent(button.id)}`, {
                                    method: 'DELETE'
                                }).then((response)=>{
                                    if(!response.ok){
                                        throw new Error('There is an error deleting individual subject')                                    
                                    }
                                    return response.json()

                                }).then((data)=>{

                                }).catch((e)=>{
                                    console.log(e.message)
                                })
                            })

                            
                        })
                    })

                        const subModalExitButton = document.querySelector('#subModalExitButton')

                    addSubjectButton.addEventListener('click',()=>{
                        addIndividualSubjectModal.style.display = 'block'
                        subModalExitButton.addEventListener('click',()=>{
                        addIndividualSubjectModal.style.display = 'none'  
                        })

                        const subDepSelect = document.querySelector('#subDepSelect')
                        subDepSelect.addEventListener('change', ()=>{
                            const subProgSelect =document.querySelector('#subProgSelect')

                            if(subDepSelect.value === 'CET'){
                                const cetPrograms = ['BSIT','BSCPE', 'BSCE','BSGE']
                                subProgSelect.innerHTML =''
                                cetPrograms.forEach(program=>{
                                    let cetOption = document.createElement('option')
                                    cetOption.value = program
                                    cetOption.innerHTML = program
                                    subProgSelect.appendChild(cetOption)
                                })
                            }else if(subDepSelect.value === 'CBA'){
                                const cbaPrograms = ['BSAHRM', 'BSBAMM','BSA']
                                subProgSelect.innerHTML =''
                                cbaPrograms.forEach(program=>{
                                    let cbaOption = document.createElement('option')
                                    cbaOption.value = program
                                    cbaOption.innerHTML = program
                                    subProgSelect.appendChild(cbaOption)
                                })
                            }else if(subDepSelect.value === 'CEAA'){
                                const ceaaPrograms = ['BEE', 'BSEDFIL','BSEDVRE', 'BSEDMATH', 'BAPS', 'BSEDENG','BSEDVE']
                                subProgSelect.innerHTML =''
                                ceaaPrograms.forEach(program=>{
                                    let ceaaOption = document.createElement('option')
                                    ceaaOption.value = program
                                    ceaaOption.innerHTML = program
                                    subProgSelect.appendChild(ceaaOption)
                                })
                            }else if(subDepSelect.value === 'CHM'){
                                const chmPrograms = ['BSHM']
                                subProgSelect.innerHTML =''
                                chmPrograms.forEach(program=>{
                                    let chmOption = document.createElement('option')
                                    chmOption.value = program
                                    chmOption.innerHTML = program
                                    subProgSelect.appendChild(chmOption)
                                })
                            }else if(subDepSelect.value === 'CNHS'){
                                const cnhsPrograms = ['BSN', 'BSBIO']
                                subProgSelect.innerHTML =''
                                cnhsPrograms.forEach(program=>{
                                    let cnhsOption = document.createElement('option')
                                    cnhsOption.value = program
                                    cnhsOption.innerHTML = program
                                    subProgSelect.appendChild(cnhsOption)
                                })
                            }else if(subDepSelect.value === 'CCJE'){
                                const ccjePrograms = ['BSCRIM']
                                subProgSelect.innerHTML =''
                                ccjePrograms.forEach(program=>{
                                    let ccjeOption = document.createElement('option')
                                    ccjeOption.value = program
                                    ccjeOption.innerHTML = program
                                    subProgSelect.appendChild(ccjeOption)
                                })
                            }
                        })


                    })


                }).catch((e)=>{
                    console.log(e.message)
                })
            })
        })

        
        }else{
            console.log('There is an error.')
        }

    })
}


function addSubjectToAddedSubjects(subject) {
    const hiddenInput = document.querySelector('#hiddenInput')
    const addedSubjectsElement = document.querySelector('.addedSubjects')

    const eachSub = document.createElement('div');
    eachSub.classList.add('eachSub');
    eachSub.textContent = subject.code;

    const exitButton = document.createElement('div');
    exitButton.classList.add('exitButton');
    exitButton.textContent = '+';
    eachSub.appendChild(exitButton);

    addedSubjectsElement.appendChild(eachSub);

    exitButton.addEventListener('click', () => {
        eachSub.remove();
        addSubjectToToBeAddedSubjects(subject);

        updateHiddenInput(hiddenInput, subject.code, 'remove');
    });
}
function addSubjectToToBeAddedSubjects(subject) {
    const hiddenInput = document.querySelector('#hiddenInput')
    const tobeAddedSubElement = document.querySelector('.toBeAddedSubjects')
    const eachToBeAddedSub = document.createElement('div');
    eachToBeAddedSub.classList.add('eachToBeAddedSub');
    eachToBeAddedSub.textContent = subject.code;

    tobeAddedSubElement.appendChild(eachToBeAddedSub);

    eachToBeAddedSub.addEventListener('click', () => {
        eachToBeAddedSub.remove();
        addSubjectToAddedSubjects(subject);

        updateHiddenInput(hiddenInput, subject.code, 'add');
    });
}
function updateHiddenInput(input, code, action) {
    let currentValues = input.value ? input.value.split(',') : [];
    if (action === 'add') {
        if (!currentValues.includes(code)) {
            currentValues.push(code);
        }
    } else if (action === 'remove') {
        currentValues = currentValues.filter(value => value !== code);
    }
    input.value = currentValues.join(',');
}






     //students//    //students//    //students//    //students//    //students//    //students//    //students//    //students//

     


function getAdminIdFromUrl() {
    const urlSegments = window.location.pathname.split('/');
    return urlSegments[1]; 
}


