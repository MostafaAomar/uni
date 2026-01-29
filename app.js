let quizData = [];
let currentSubject = null;
let currentIndex = 0;
let userAnswers = [];
let mode = ''; 

const screens = {
    setup: document.getElementById('setup-screen'),
    mode: document.getElementById('mode-screen'),
    quiz: document.getElementById('quiz-screen'),
    study: document.getElementById('study-screen'),
    result: document.getElementById('result-screen')
};

// 1. Initialize & Fetch
async function init() {
    const list = document.getElementById('subject-list');
    try {
        const response = await fetch('https://raw.githubusercontent.com/MostafaAomar/uni/main/data.json');
        if (!response.ok) throw new Error("Network error");
        
        quizData = await response.json();
        list.innerHTML = ""; 

        quizData.forEach((data, index) => {
            const btn = document.createElement('button');
            btn.innerText = data.subject;
            btn.className = 'subject-btn';
            btn.onclick = () => {
                currentSubject = quizData[index];
                document.getElementById('selected-subject-name').innerText = currentSubject.subject;
                showScreen('mode');
            };
            list.appendChild(btn);
        });
    } catch (error) {
        list.innerHTML = "Failed to load data. Check internet connection.";
        console.error(error);
    }
}

// 2. State Management
function setMode(chosenMode) {
    mode = chosenMode;
    currentIndex = 0;
    userAnswers = new Array(currentSubject.questions.length).fill(null);
    renderStep();
}

function renderStep() {
    updateProgressBar();
    if (mode === 'quiz') {
        showScreen('quiz');
        loadQuiz();
    } else {
        showScreen('study');
        loadStudy();
    }
}

function updateProgressBar() {
    const total = currentSubject.questions.length;
    // Calculate percentage (based on completed questions vs total)
    const percentage = ((currentIndex + 1) / total) * 100;
    
    if (mode === 'quiz') {
        document.getElementById('quiz-progress').style.width = percentage + "%";
    } else {
        document.getElementById('study-progress').style.width = percentage + "%";
    }
}

/** --- QUIZ LOGIC --- **/
function loadQuiz() {
    const qData = currentSubject.questions[currentIndex];
    const container = document.getElementById('options-container');
    const feedback = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('quiz-next-btn');

    document.getElementById('question-text').innerText = qData.q;
    document.getElementById('question-count').innerText = `Question ${currentIndex + 1} of ${currentSubject.questions.length}`;
    
    container.innerHTML = '';
    feedback.classList.add('hidden'); 

    qData.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        
        // Restore state if user goes back
        if (userAnswers[currentIndex] !== null) {
            applyFeedbackUI(btn, i, qData.correct);
        } else {
            btn.onclick = () => {
                userAnswers[currentIndex] = i;
                applyFeedbackUI(btn, i, qData.correct); // Show immediate feedback
                loadQuiz(); // Refresh UI to lock buttons
            };
        }
        container.appendChild(btn);
    });

    // Navigation state
    document.getElementById('quiz-prev-btn').disabled = currentIndex === 0;
    nextBtn.innerText = (currentIndex === currentSubject.questions.length - 1) ? "Finish" : "Next";
    nextBtn.disabled = (userAnswers[currentIndex] === null);
}

function applyFeedbackUI(btn, index, correctIndex) {
    const selected = userAnswers[currentIndex];
    const feedbackBox = document.getElementById('quiz-feedback');
    
    // Disable all siblings
    const allBtns = document.getElementById('options-container').children;
    Array.from(allBtns).forEach(b => b.classList.add('disabled'));

    // Apply colors
    if (index === correctIndex) btn.classList.add('correct');
    else if (index === selected) btn.classList.add('wrong');
    
    // If we are redrawing the correct button (even if not selected)
    if (index === correctIndex) btn.classList.add('correct');

    // Show text feedback
    feedbackBox.classList.remove('hidden');
    if (selected === correctIndex) {
        feedbackBox.innerHTML = "✅ <strong>Correct!</strong>";
        feedbackBox.className = "feedback-box feedback-success";
    } else {
        const correctText = currentSubject.questions[currentIndex].options[correctIndex];
        feedbackBox.innerHTML = `❌ <strong>Incorrect.</strong><br>Answer: ${correctText}`;
        feedbackBox.className = "feedback-box feedback-error";
    }
}

/** --- STUDY LOGIC --- **/
function loadStudy() {
    // Reset card to front
    document.getElementById('card-inner').classList.remove('is-flipped');
    
    const qData = currentSubject.questions[currentIndex];
    document.getElementById('study-question').innerText = qData.q;
    document.getElementById('study-answer').innerText = qData.options[qData.correct];
    
    // Disable 'Previous' on first card
    const prevBtn = document.querySelector('#study-screen .nav-btn'); // first button in study screen
    if(prevBtn) prevBtn.disabled = (currentIndex === 0);
}

function toggleFlip() {
    document.getElementById('card-inner').classList.toggle('is-flipped');
}

/** --- NAVIGATION --- **/
function nextQuestion() {
    if (currentIndex < currentSubject.questions.length - 1) {
        currentIndex++;
        renderStep();
    } else {
        if (mode === 'quiz') showResults();
        else showScreen('mode'); // Exit study mode on finish
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        renderStep();
    }
}

function showResults() {
    showScreen('result');
    const score = userAnswers.filter((ans, i) => ans === currentSubject.questions[i].correct).length;
    document.getElementById('final-result').innerText = `You scored ${score} / ${currentSubject.questions.length}`;
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[name].classList.remove('hidden');
}

init();