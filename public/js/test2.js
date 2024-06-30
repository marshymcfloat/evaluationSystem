const studentsContainer = document.querySelector('.students-container');
const students = document.querySelectorAll('.student');
const selectionBox = document.getElementById('selectionBox');

let startX, startY, endX, endY;
let isSelecting = false;

studentsContainer.addEventListener('mousedown', (e) => {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = '0';
    selectionBox.style.height = '0';
    selectionBox.style.display = 'block';
});

document.addEventListener('mousemove', (e) => {
    if (!isSelecting) return;
    endX = e.clientX;
    endY = e.clientY;

    selectionBox.style.width = `${Math.abs(endX - startX)}px`;
    selectionBox.style.height = `${Math.abs(endY - startY)}px`;
    selectionBox.style.left = `${Math.min(startX, endX)}px`;
    selectionBox.style.top = `${Math.min(startY, endY)}px`;

    students.forEach(student => {
        const rect = student.getBoundingClientRect();
        if (rect.left < endX && rect.right > startX && rect.top < endY && rect.bottom > startY) {
            student.classList.add('selected');
        } else {
            student.classList.remove('selected');
        }
    });
});

document.addEventListener('mouseup', (e) => {
    isSelecting = false;
    selectionBox.style.display = 'none';
});

document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('student')) {
        students.forEach(student => student.classList.remove('selected'));
    }
});
