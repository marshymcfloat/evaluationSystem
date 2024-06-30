const options = document.querySelectorAll('#options')
const innerRightContainer = document.querySelector('.innerRightContainer')
const modalUpdate = document.querySelector('.modalUpdate')
const body = document.querySelector('body')
const adminId = getAdminIdFromUrl();

for(let option of options){
    option.addEventListener('click', ()=> {
        innerRightContainer.innerHTML ="" 

        if(option.innerHTML === 'Instructors'){

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

            filterContainer.appendChild(filterContainerSelect)


            const instructorListContainer = document.createElement('div')
            instructorListContainer.classList.add('instructorListContainer')



            innerRightContainer.appendChild(filterContainer)
            innerRightContainer.appendChild(instructorListContainer)


         filterContainerSelect.addEventListener('change', () => {
    if (filterContainerSelect.value === "CET") {
        instructorListContainer.innerHTML = ""
        fetch('/cetDepartmentInstructors')
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

                const teacherIconContainer = document.createElement('div');
                teacherIconContainer.classList.add('teacherIconContainer');
                const elementImgIconContainer = document.createElement('img');
                elementImgIconContainer.src = `${teacher.imageURL}`;
                teacherIconContainer.appendChild(elementImgIconContainer);

                const teacherInfoContainer = document.createElement('div');
                teacherInfoContainer.classList.add('teacherInfoContainer');

                const spanFirstname = document.createElement('span');
                spanFirstname.id = 'firstname';
                spanFirstname.innerHTML = `Firstname: ${teacher.firstname}`;

                const spanLastname = document.createElement('span');
                spanLastname.id = 'lastname';
                spanLastname.innerHTML = `Lastname: ${teacher.lastname}`;

                const spanSubjects = document.createElement('span');
                spanSubjects.id = 'subjects';
                spanSubjects.innerHTML = `Subjects: ${teacher.subjects.map(subject => subject.code).join(', ')}`;

                teacherInfoContainer.appendChild(spanFirstname);
                teacherInfoContainer.appendChild(spanLastname);
                teacherInfoContainer.appendChild(spanSubjects);

                eachTeacherContainer.appendChild(teacherIconContainer);
                eachTeacherContainer.appendChild(teacherInfoContainer);

                    
                    

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
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    instructorListContainer.appendChild(addTeacherContainer)

                    const addTeacherContainerH1 = document.createElement('h1')
                    addTeacherContainerH1.innerHTML = "+"
                    addTeacherContainer.appendChild(addTeacherContainerH1)





                const updateIcon = document.querySelectorAll('.updateIcon')
                
                 for(let icon of updateIcon){
                    icon.addEventListener('click', ()=> {

                        fetch(`/findTeacher?teacherName=${encodeURIComponent(icon.id)}`).then((response)=> {
                            if(!response.ok){
                                throw new Error('There is an error while fetching')
                            }
                            return response.json()
                        }).then(data => {
                    const foundTeacher = data.foundTeacher;

                    const updateFormForm = document.createElement('form');
                    updateFormForm.action = `/${foundTeacher._id}/updateForm?_method=PUT`;
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

                    const pictureContainer = document.createElement('div');
                    pictureContainer.classList.add('pictureContainer');
                    updateInfoContainer.appendChild(pictureContainer);

                    const picture = document.createElement('div');
                    picture.classList.add('picture');
                    pictureContainer.appendChild(picture);

                    const innerPicture = document.createElement('div');
                    innerPicture.classList.add('innerPicture');
                    picture.appendChild(innerPicture);

                    const innerPictureImg = document.createElement('img');
                    innerPictureImg.src = foundTeacher.imageURL;
                    innerPicture.appendChild(innerPictureImg);

                    const inputPicture = document.createElement('div');
                    inputPicture.classList.add('inputPicture');

                    const inputPictureInput = document.createElement('input');
                    inputPictureInput.type = 'file';
                    inputPictureInput.name = 'image';
                    inputPicture.appendChild(inputPictureInput);
                    pictureContainer.appendChild(inputPicture);

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
                    addSubjectsContainer.appendChild(toBeAddedSubjects);

                    const addedSubjects = document.createElement('div');
                    addedSubjects.classList.add('addedSubjects');
                    addSubjectsContainer.appendChild(addedSubjects);

                    inputsContainer.appendChild(department);
                    inputsContainer.appendChild(addSubjectsContainer);

                    // Fetch subjects details for the teacher
                    fetch(`/getSubjects?subjectIds=${JSON.stringify(foundTeacher.subjects)}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('There is an error while fetching subjects');
                            }
                            return response.json();
                        })
                        .then(subjects => {
                            const hiddenInput = document.createElement('input');
                            hiddenInput.type = 'hidden';
                            hiddenInput.name = 'subjectCodes';
                            hiddenInput.value = '';
                            updateFormForm.appendChild(hiddenInput);

                            // Populate existing subjects in addedSubjects
                            subjects.forEach(subject => {
                                const eachSub = document.createElement('div');
                                eachSub.classList.add('eachSub');
                                eachSub.textContent = subject.code;

                                const exitButton = document.createElement('div');
                                exitButton.classList.add('exitButton');
                                exitButton.textContent = '+';
                                eachSub.appendChild(exitButton);

                                addedSubjects.appendChild(eachSub);

                                exitButton.addEventListener('click', () => {
                                    eachSub.remove();
                                    const eachToBeAddedSub = document.createElement('div');
                                    eachToBeAddedSub.classList.add('eachToBeAddedSub');
                                    eachToBeAddedSub.textContent = subject.code;

                                    toBeAddedSubjects.appendChild(eachToBeAddedSub);

                                    updateHiddenInput(hiddenInput, subject.code, 'remove');

                                    eachToBeAddedSub.addEventListener('click', () => {
                                        eachToBeAddedSub.remove();
                                        const eachSub = document.createElement('div');
                                        eachSub.classList.add('eachSub');
                                        eachSub.textContent = subject.code;

                                        const exitButton = document.createElement('div');
                                        exitButton.classList.add('exitButton');
                                        exitButton.textContent = '+';
                                        eachSub.appendChild(exitButton);

                                        addedSubjects.appendChild(eachSub);

                                        updateHiddenInput(hiddenInput, subject.code, 'add');

                                        exitButton.addEventListener('click', () => {
                                            eachSub.remove();
                                            toBeAddedSubjects.appendChild(eachToBeAddedSub);

                                            updateHiddenInput(hiddenInput, subject.code, 'remove');
                                        });
                                    });
                                });

                                updateHiddenInput(hiddenInput, subject.code, 'add');
                            });

                            // Fetch available subjects in the CET department
                            return fetch(`/getAvailableSubjects?department=CET`);
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('There is an error while fetching available subjects');
                            }
                            return response.json();
                        })
                        .then(available => {
                            available.forEach(subject => {
                                if (!foundTeacher.subjects.includes(subject._id)) {
                                    const eachToBeAddedSub = document.createElement('div');
                                    eachToBeAddedSub.classList.add('eachToBeAddedSub');
                                    eachToBeAddedSub.textContent = subject.code;

                                    toBeAddedSubjects.appendChild(eachToBeAddedSub);

                                    eachToBeAddedSub.addEventListener('click', () => {
                                        eachToBeAddedSub.remove();
                                        const eachSub = document.createElement('div');
                                        eachSub.classList.add('eachSub');
                                        eachSub.textContent = subject.code;

                                        const exitButton = document.createElement('div');
                                        exitButton.classList.add('exitButton');
                                        exitButton.textContent = '+';
                                        eachSub.appendChild(exitButton);

                                        addedSubjects.appendChild(eachSub);

                                        updateHiddenInput(hiddenInput, subject.code, 'add');

                                        exitButton.addEventListener('click', () => {
                                            eachSub.remove();
                                            toBeAddedSubjects.appendChild(eachToBeAddedSub);

                                            updateHiddenInput(hiddenInput, subject.code, 'remove');
                                        });
                                    });
                                }
                            });
                        })
                        .catch(error => console.error('Error fetching subjects:', error));

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
                        modalUpdate.classList.add('modalHidden');
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
                            const subjectCode = item.textContent.trim().split(' ')[0];
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
                            modalUpdate.classList.add('modalHidden');
                        }).catch(error => console.error('Error updating instructor:', error));
                    });
                }).catch((e)=> {
                            console.log(e)
                        })
                        
                        
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

    fetch('/removeInstructor', {
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
                        modalAddTeacherFormP.innerHTML = `Update Information`
                        modalAddTeacherForm.appendChild(modalAddTeacherFormP)

                        const addTeacherInfoContainer = document.createElement('div')
                        addTeacherInfoContainer.classList.add('addTeacherInfoContainer')
                        modalAddTeacherForm.appendChild(addTeacherInfoContainer)

                        const pictureContainer = document.createElement('div')
                        pictureContainer.classList.add('pictureContainer')
                        addTeacherInfoContainer.appendChild(pictureContainer)

                        const picture = document.createElement('div')
                        picture.classList.add('picture')
                        pictureContainer.appendChild(picture)

                        const innerPicture = document.createElement('div')
                        innerPicture.classList.add('innerPicture')
                        picture.appendChild(innerPicture)


                       
                        const innerPictureImg = document.createElement('img')
                        innerPictureImg.src = '/images/userLogo.png'
                        innerPicture.appendChild(innerPictureImg)

                        const inputPicture = document.createElement('div')
                        inputPicture.classList.add('inputPicture')

                        const inputPictureInput = document.createElement('input')
                        inputPictureInput.type = 'file'
                        inputPictureInput.name ="image"

                        inputPicture.appendChild(inputPictureInput)
                        pictureContainer.appendChild(inputPicture)
                        
                        const inputsContainer = document.createElement('div')
                        inputsContainer.classList.add('inputsContainer')
                        addTeacherInfoContainer.appendChild(inputsContainer)

                        const Firstname = document.createElement('input')
                        Firstname.type = 'text'
                        Firstname.placeholder = 'Firstname'
                        Firstname.name = 'firstname'
                        inputsContainer.appendChild(Firstname)

                        const Lastname = document.createElement('input')
                        Lastname.type = 'text'
                        Lastname.placeholder = 'Lastname'
                        Lastname.name = 'lastname'
                        inputsContainer.appendChild(Lastname)
                        
                        const department = document.createElement('select')
                        department.name = 'department'
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
                            modalAddTeacher.classList.add('modalHidden')
                        }
                       
                        modalAddTeacherForm.appendChild(exitBtnModalAddTeacher)

                        inputsContainer.appendChild(department)
                        modalAddTeacher.appendChild(modalBackground)
                        modalAddTeacher.appendChild(modalAddTeacherForm)
                        inputsContainer.appendChild(addSubjectsContainer)

                        
                        body.appendChild(modalAddTeacher)
                        formAdd.appendChild(modalAddTeacherForm)
                        modalAddTeacher.appendChild(formAdd)
                    


                       const departmentElement = document.querySelector('.department')
                       departmentElement.addEventListener('change', ()=> {
                        if(departmentElement.value === 'CET'){
                           const queryString = `/subjectCodes?department=${encodeURIComponent(departmentElement.value)}`;
                            fetch(queryString).then((response)=> {
                                if(!response.ok){
                                    throw new Error('the fetch network is not okay.')
                                }
                                return response.json()
                            }).then((data) => {


                                
                            const toBeAddedSubjects = document.querySelector('.toBeAddedSubjects');
                            const addedSubjects = document.querySelector('.addedSubjects');
                            const hiddenInput = document.createElement('input');
                            hiddenInput.type = 'hidden';
                            hiddenInput.name = 'subjectCodes';
                            hiddenInput.value = '';
                            formAdd.appendChild(hiddenInput)
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
                                }
                            })
                        })
                    })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    } else if (filterContainerSelect.value === "CBA") {
        instructorListContainer.innerHTML = ""

        fetch('/cbaDepartmentInstructors')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {

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
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    addTeacherContainer.innerHTML = '+'
                    instructorListContainer.appendChild(addTeacherContainer)





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
                    })
                }
            })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }else if(filterContainerSelect.value === "CEAA"){
        instructorListContainer.innerHTML = ""

fetch('/ceaaDepartmentInstructors')

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {

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
                    updateIcon.id = `${teacher.firstname}`
                    updateIcon.appendChild(elementUpdateIconImg)




                    const removeIcon = document.createElement('div')
                    removeIcon.classList.add('removeIcon')
                    const elementRemoveIconImg = document.createElement('img')
                    elementRemoveIconImg.src = '/images/removeIcon.svg'
                    removeIcon.appendChild(elementRemoveIconImg)
                    removeIcon.id = `${teacher.firstname}`



                    teacherOptionsContainer.appendChild(updateIcon)
                    teacherOptionsContainer.appendChild(removeIcon)


                   


                    eachTeacherContainer.appendChild(teacherIconContainer)
                    eachTeacherContainer.appendChild(teacherInfoContainer)
                    eachTeacherContainer.appendChild(teacherOptionsContainer)
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    addTeacherContainer.innerHTML = '+'      
                    instructorListContainer.appendChild(addTeacherContainer)





                const updateIcon = document.querySelectorAll('.updateIcon')
                
                for(let icon of updateIcon){
                    icon.addEventListener('click', ()=> {

                        fetch(`/findTeacher?teacherName=${encodeURIComponent(icon.id)}`).then((response)=> {
                            if(!response.ok){
                                throw new Error('There is an error while fetching')
                            }
                            return response.json()
                        }).then((data)=> {
                            const modalUpdate = document.createElement('div')
                        modalUpdate.classList.add('modalUpdate')


                        const modalBackground = document.createElement('div')
                        modalBackground.classList.add('modalBackground')


                        const modalUpdateForm = document.createElement('div')
                        modalUpdateForm.classList.add('modalUpdateForm')

                        const modalUpdateFormP = document.createElement('p')
                        modalUpdateFormP.innerHTML = `Update Information`
                        modalUpdateForm.appendChild(modalUpdateFormP)

                        const updateInfoContainer = document.createElement('div')
                        updateInfoContainer.classList.add('updateInfoContainer')
                        modalUpdateForm.appendChild(updateInfoContainer)

                        const pictureContainer = document.createElement('div')
                        pictureContainer.classList.add('pictureContainer')
                        updateInfoContainer.appendChild(pictureContainer)

                        const picture = document.createElement('div')
                        picture.classList.add('picture')
                        pictureContainer.appendChild(picture)

                        const innerPicture = document.createElement('div')
                        innerPicture.classList.add('innerPicture')
                        picture.appendChild(innerPicture)


                       
                        const innerPictureImg = document.createElement('img')
                        innerPicture.appendChild(innerPictureImg)

                        const inputPicture = document.createElement('div')
                        inputPicture.classList.add('inputPicture')

                        const inputPictureInput = document.createElement('input')
                        inputPictureInput.type = 'file'
                        inputPicture.appendChild(inputPictureInput)
                        
                        const inputsContainer = document.createElement('div')
                        inputsContainer.classList.add('inputsContainer')
                        updateInfoContainer.appendChild(inputsContainer)

                        const Firstname = document.createElement('input')
                        Firstname.type = 'text'
                        Firstname.placeholder = 'Firstname'
                        Firstname.name = 'firstname'
                        Firstname.value = `${data.foundTeacher.firstname}`
                        inputsContainer.appendChild(Firstname)

                        const Lastname = document.createElement('input')
                        Lastname.type = 'text'
                        Lastname.placeholder = 'Lastname'
                        Lastname.name = 'lastname'
                        Lastname.value = `${data.foundTeacher.lastname}`
                        inputsContainer.appendChild(Lastname)
                        
                        const Age = document.createElement('input')
                        Age.type = 'text'
                        Age.placeholder = 'Age'
                        Age.name = 'age'
                        Age.value = `${data.foundTeacher.age}`
                        inputsContainer.appendChild(Age)

                        const Address = document.createElement('input')
                        Address.type = 'text'
                        Address.placeholder = 'Address'
                        Address.name = 'address'
                        Address.value = `${data.foundTeacher.address}`
                        inputsContainer.appendChild(Address)

                        const department = document.createElement('select')

                        const selectDepartment = document.createElement('option')
                        selectDepartment.innerHTML = "SELECT DEPARTMENT"
                        department.appendChild(selectDepartment)

                        const CET = document.createElement('option')
                        CET.value = "CET"
                        CET.innerHTML = "CET"
                        department.appendChild(CET)
                        
                        const updateButtonContainer = document.createElement('div')
                        updateButtonContainer.classList.add('updateButtonContainer')
                        modalUpdateForm.appendChild(updateButtonContainer)

                        const updateButtonContainerButton = document.createElement('button')
                        updateButtonContainerButton.innerHTML = "Save"
                        updateButtonContainer.appendChild(updateButtonContainerButton)

                        const exitBtnModalUpdate = document.createElement('div')
                        exitBtnModalUpdate.classList.add('exitBtnModalUpdate')
                        exitBtnModalUpdate.innerHTML = '+'
                        exitBtnModalUpdate.onclick = () => {
                            modalUpdate.classList.add('modalHidden')
                        }

                        modalUpdateForm.appendChild(exitBtnModalUpdate)


                        modalUpdate.appendChild(modalBackground)
                        modalUpdate.appendChild(modalUpdateForm)
                        body.appendChild(modalUpdate)


                        }).catch((e)=> {
                            console.log(e)
                        })
                        
                        
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
                    })
                }
            })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }else if(filterContainerSelect.value === "CHM"){
        instructorListContainer.innerHTML = ""

fetch('/chmDepartmentInstructors')

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {

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
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    addTeacherContainer.innerHTML = '+'
                    instructorListContainer.appendChild(addTeacherContainer)





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
                    })
                }
            })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }else if(filterContainerSelect.value === "CNHS"){
        instructorListContainer.innerHTML = ""

        fetch('/cnhsDepartmentInstructors')

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {

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
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    addTeacherContainer.innerHTML = '+'
                    instructorListContainer.appendChild(addTeacherContainer)





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
                    })
                }
            })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }else if(filterContainerSelect.value === "CCJE"){
        instructorListContainer.innerHTML = ""

        fetch('/ccjeDepartmentInstructors')

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {

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
                    
                    instructorListContainer.appendChild(eachTeacherContainer)


                }
                 const addTeacherContainer = document.createElement('div')
                    addTeacherContainer.classList.add('addTeacherContainer')
                    addTeacherContainer.innerHTML = '+'
                    instructorListContainer.appendChild(addTeacherContainer)





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
                    })
                }
            })

            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
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
            uploadFormElement.action = '/uploadTest'
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

            deleteStudentsContainer.appendChild(removeStudentsButton)
            innerRightContainer.appendChild(deleteStudentsContainer)





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
        const queryString = `/toBeDeleteStudents?department=${encodeURIComponent(departmentValue)}&program=${encodeURIComponent(programValue)}&year=${encodeURIComponent(yearValue)}`
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


        }else if(option.innerHTML === 'Time Frame'){
            
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




document.getElementById('timeFrameCancel').addEventListener('click', function() {
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
});



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
            
        }else{
            console.log('There is an error.')

        }

    })
}





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






     //students//    //students//    //students//    //students//    //students//    //students//    //students//    //students//

     


function getAdminIdFromUrl() {
    const urlSegments = window.location.pathname.split('/');
    return urlSegments[1]; 
}


