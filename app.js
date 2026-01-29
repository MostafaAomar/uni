// 1. المتغيرات العامة
let quizData = [];
let currentSubject = null;
let currentIndex = 0;
let userAnswers = [];
let mode = ''; 

// 2. تعريف الشاشات
const screens = {
    setup: document.getElementById('setup-screen'),
    mode: document.getElementById('mode-screen'),
    quiz: document.getElementById('quiz-screen'),
    study: document.getElementById('study-screen'),
    result: document.getElementById('result-screen')
};

// 3. دالة التبديل بين الشاشات
function showScreen(name) {
    Object.keys(screens).forEach(key => {
        if (screens[key]) {
            screens[key].classList.add('hidden');
        }
    });
    if (screens[name]) {
        screens[name].classList.remove('hidden');
    } else {
        console.error(`الشاشة "${name}" غير موجودة!`);
    }
}

// 4. دالة التشغيل الأولية وجلب البيانات
async function init() {
    const list = document.getElementById('subject-list');
    try {
        // إضافة Timestamp لحل مشكلة التحديث (Cache)
        const url = 'https://raw.githubusercontent.com/MostafaAomar/uni/main/data.json?t=' + new Date().getTime();
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("فشل في الاتصال بالسيرفر");
        
        quizData = await response.json();
        list.innerHTML = ""; 

        // إنشاء شبكة المواد
        quizData.forEach((data, index) => {
            const btn = document.createElement('button');
            btn.innerText = data.subject;
            btn.className = 'subject-btn';
            
            btn.onclick = () => {
                currentSubject = quizData[index];
                
                // تحديد اللغة والاتجاه بناءً على المادة
                const lang = currentSubject.lang || 'ar';
                const dir = lang === 'ar' ? 'rtl' : 'ltr';
                
                document.documentElement.setAttribute('lang', lang);
                document.documentElement.setAttribute('dir', dir);
                document.getElementById('app-container').setAttribute('dir', dir);
                
                document.getElementById('selected-subject-name').innerText = currentSubject.subject;
                showScreen('mode');
            };
            list.appendChild(btn);
        });
    } catch (error) {
        list.innerHTML = "خطأ في تحميل البيانات. تأكد من اتصالك بالإنترنت وصحة ملف JSON.";
        console.error("Fetch error:", error);
    }
}

// 5. ضبط وضع التشغيل (اختبار أو دراسة)
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

// 6. تحديث شريط التقدم
function updateProgressBar() {
    const total = currentSubject.questions.length;
    const percentage = ((currentIndex + 1) / total) * 100;
    
    const barId = mode === 'quiz' ? 'quiz-progress' : 'study-progress';
    const bar = document.getElementById(barId);
    if (bar) bar.style.width = percentage + "%";
}

// 7. منطق وضع الاختبار (Quiz)
function loadQuiz() {
    const qData = currentSubject.questions[currentIndex];
    const container = document.getElementById('options-container');
    const feedback = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('quiz-next-btn');

    const isAr = (currentSubject.lang || 'ar') === 'ar';
    const txtQuestion = isAr ? 'سؤال' : 'Question';
    const txtOf = isAr ? 'من' : 'of';
    const txtNext = isAr ? 'التالي' : 'Next';
    const txtFinish = isAr ? 'إنهاء' : 'Finish';

    document.getElementById('question-text').innerText = qData.q;
    document.getElementById('question-count').innerText = `${txtQuestion} ${currentIndex + 1} ${txtOf} ${currentSubject.questions.length}`;
    
    container.innerHTML = '';
    feedback.classList.add('hidden'); 

    qData.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'option-btn';
        
        if (userAnswers[currentIndex] !== null) {
            applyFeedbackUI(btn, i, qData.correct);
        } else {
            btn.onclick = () => {
                userAnswers[currentIndex] = i;
                applyFeedbackUI(btn, i, qData.correct); 
                loadQuiz(); 
            };
        }
        container.appendChild(btn);
    });

    document.getElementById('quiz-prev-btn').disabled = currentIndex === 0;
    nextBtn.innerText = (currentIndex === currentSubject.questions.length - 1) ? txtFinish : txtNext;
    nextBtn.disabled = (userAnswers[currentIndex] === null);
}

function applyFeedbackUI(btn, index, correctIndex) {
    const selected = userAnswers[currentIndex];
    const feedbackBox = document.getElementById('quiz-feedback');
    const qData = currentSubject.questions[currentIndex];
    const isAr = (currentSubject.lang || 'ar') === 'ar';

    const allBtns = document.getElementById('options-container').children;
    Array.from(allBtns).forEach(b => b.classList.add('disabled'));

    if (index === correctIndex) btn.classList.add('correct');
    else if (index === selected) btn.classList.add('wrong');

    feedbackBox.classList.remove('hidden');
    const customText = qData.feedback ? `<br><small style="color:#555; display:block; margin-top:5px">${qData.feedback}</small>` : '';

    if (selected === correctIndex) {
        const txtCorrect = isAr ? 'إجابة صحيحة!' : 'Correct!';
        feedbackBox.innerHTML = `✅ <strong>${txtCorrect}</strong>${customText}`;
        feedbackBox.className = "feedback-box feedback-success";
    } else {
        const correctValue = qData.options[correctIndex];
        const txtWrong = isAr ? 'إجابة خاطئة.' : 'Incorrect.';
        const txtTheCorrect = isAr ? 'الإجابة الصحيحة هي:' : 'The correct answer is:';
        
        feedbackBox.innerHTML = `❌ <strong>${txtWrong}</strong><br>${txtTheCorrect} ${correctValue}${customText}`;
        feedbackBox.className = "feedback-box feedback-error";
    }
}

// 8. منطق وضع الدراسة (Study)
function loadStudy() {
    document.getElementById('card-inner').classList.remove('is-flipped');
    const qData = currentSubject.questions[currentIndex];
    document.getElementById('study-question').innerText = qData.q;
    document.getElementById('study-answer').innerText = qData.options[qData.correct];
    
    const prevBtns = document.querySelectorAll('.nav-btn');
    prevBtns.forEach(btn => {
        if(btn.innerText === 'Previous' || btn.innerText === 'سابق' || btn.innerText === 'Back') {
            btn.disabled = (currentIndex === 0);
        }
    });
}

function toggleFlip() {
    document.getElementById('card-inner').classList.toggle('is-flipped');
}

// 9. التنقل بين الأسئلة
function nextQuestion() {
    if (currentIndex < currentSubject.questions.length - 1) {
        currentIndex++;
        renderStep();
    } else {
        if (mode === 'quiz') showResults();
        else showScreen('mode');
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        renderStep();
    }
}

// 10. عرض النتائج النهائية
function showResults() {
    showScreen('result');
    const score = userAnswers.filter((ans, i) => ans === currentSubject.questions[i].correct).length;
    const isAr = (currentSubject.lang || 'ar') === 'ar';
    
    const txtResult = isAr 
        ? `حصلت على ${score} من أصل ${currentSubject.questions.length}`
        : `You scored ${score} out of ${currentSubject.questions.length}`;
        
    document.getElementById('final-result').innerText = txtResult;
    document.getElementById('result-title').innerText = isAr ? 'اكتمل الاختبار! 🎉' : 'Quiz Completed! 🎉';
}

// تشغيل التطبيق
init();