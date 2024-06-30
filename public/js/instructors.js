
const teacherNames = document.querySelectorAll('.teacherName');
const infoName = document.querySelector('.nameInfo');
const instructorImage  = document.querySelector('#instructorImage')
const list = document.querySelector('#questionsOrderedList')

let selectedTeacherId = null;
let selectedTeacherName = null;
for (let teacher of teacherNames) {
    teacher.addEventListener('click', function () {
        const name = teacher.innerText;
        selectedTeacherId = teacher.getAttribute('id'); // Get the teacher ID
        selectedTeacherName = name; // Set the teacher's name
        
        fetch(`/instructors?name=${encodeURIComponent(name)}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
        infoName.classList.add('infoName')
        infoName.innerHTML = `${data.name} `
        instructorImage.src = data.imageURL;
        fetch(`/questions`,{
            method: "GET"
        }).then(response => {
            if(!response.ok){
                throw new Error('question network is not okay')
            }
            return response.json()
        }).then(data => {
            
            for (info of data) {
    const questionList = document.createElement('li');
    questionList.innerText = info.text;
    questionList.classList.add('question');
    list.appendChild(questionList);

    const radioContainer = document.createElement('div');
    radioContainer.classList.add('radioContainer');

    if (info.noMessage === true) {

        for (let i = 1; i <= 5; i++) {
            const radioButton = document.createElement('input');
            const div = document.createElement('div'); // Create div for each iteration
            const label = document.createElement('label');
            div.classList.add('radiolabel')

            radioButton.setAttribute('type', 'radio');
            radioButton.setAttribute('name', info._id);
            radioButton.setAttribute('value', `${i}`);
            radioButton.setAttribute('id', `${i}`);

            label.innerText = `${i}`;

            // Append label and radio button to div
            div.appendChild(label);
            div.appendChild(radioButton);

            // Append div to radioContainer
            radioContainer.appendChild(div);

            // Add a line break after each radio button for better separation
            radioContainer.appendChild(document.createElement('br'));
        }
        // Append radioContainer to questionList
        questionList.appendChild(radioContainer);
    
                }else{
                    const textArea = document.createElement('textarea')
                    textArea.classList.add('textArea')
                    questionList.appendChild(textArea)

                }
            
            }

        })
        list.innerHTML = ""

            
        })
        .catch(error => {
            // Handle errors
            console.error('There was a problem with the fetch operation:', error);
        });
    });

}

document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Check if a teacher is selected
    if (selectedTeacherId) {
        // Perform form submission with teacher name included
        const form = event.target;
        const formData = new FormData(form);

        // Append selected teacher's name to form data
        formData.append('teacherName', selectedTeacherName); // Assuming teacherName is available

        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        fetch(form.action, {
            method: form.method,
            body: formData
        })
        .then(response => {
        }) 
        .catch(error => {
            // Handle errors
        });
    } else {
        // If no teacher is selected, show an error message or handle it as needed
        console.error('No teacher selected');
    }
});
