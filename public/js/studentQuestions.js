 document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('evaluation-form');
            const submitBtn = document.getElementById('submit-btn');
            const radioGroups = {};
            const reviewModal = document.getElementById('review-modal');
            const reviewAnswers = document.getElementById('review-answers');
            const cancelBtn = document.getElementById('cancel-btn');
            const confirmBtn = document.getElementById('confirm-btn');

            // Collect all radio inputs and group them by question ID
            const radioInputs = form.querySelectorAll('input[type="radio"]');
            radioInputs.forEach(input => {
                const name = input.name;
                if (!radioGroups[name]) {
                    radioGroups[name] = [];
                }
                radioGroups[name].push(input);
                // Add event listener to each radio button
                input.addEventListener('change', () => {
                    checkAllQuestionsAnswered();
                });
            });

            function checkAllQuestionsAnswered() {
                let allAnswered = true;
                for (const name in radioGroups) {
                    const group = radioGroups[name];
                    const answered = group.some(input => input.checked);
                    if (!answered) {
                        allAnswered = false;
                        break;
                    }
                }
                submitBtn.disabled = !allAnswered;
            }

            function collectAnswers() {
                reviewAnswers.innerHTML = ''; // Clear previous answers
                for (const name in radioGroups) {
                    const group = radioGroups[name];
                    const answered = group.find(input => input.checked);
                    const questionText = group[0].closest('.questionsContainer').querySelector('.questionText span').innerText;
                    const answerText = answered ? answered.value : 'Not answered';
                    const answerItem = document.createElement('div');
                    answerItem.innerHTML = `<strong>${questionText}</strong>: ${answerText}`;
                    reviewAnswers.appendChild(answerItem);
                }
            }

            // Show the review modal
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                collectAnswers();
                reviewModal.style.display = 'block';
            });

            // Cancel button event listener
            cancelBtn.addEventListener('click', () => {
                reviewModal.style.display = 'none';
            });

            // Confirm button event listener
            confirmBtn.addEventListener('click', () => {
                form.submit();
            });

            checkAllQuestionsAnswered(); // Initial check
        });