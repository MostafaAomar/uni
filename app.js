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

async function init() {
    const list = document.getElementById('subject-list');
    try {
        // الحل لمشكلة عدم التحديث: إضافة timestamp
        const url = 'https://raw.githubusercontent.com/MostafaAomar/uni/main/data.json?t=' + new Date().getTime();
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network error");
        
        quizData = await response.json();
        list.innerHTML = ""; 

        // إنشاء أزرار المواد
        quizData.forEach((data, index) => {
            const btn = document.createElement('button');
            btn.innerText = data.subject;
            btn.className = 'subject-btn';
            
            // عند الضغط على المادة
            btn.onclick = () => {
                currentSubject = quizData[index];
                
                // --- الكود السحري لتغيير اللغة والاتجاه ---
                const lang = currentSubject.lang || 'ar'; // الافتراضي عربي
                const dir = lang === 'ar' ? 'rtl' : 'ltr';
                
                // تطبيق الاتجاه على الحاوية الرئيسية
                document.documentElement.setAttribute('lang', lang);
                document.documentElement.setAttribute('dir', dir);
                document.getElementById('app-container').setAttribute('dir', dir);
                
                // تحديث العنوان
                document.getElementById('selected-subject-name').innerText = currentSubject.subject;
                showScreen('mode');
            };
            list.appendChild(btn);
        });
    } catch (error) {
        list.innerHTML = "فشل تحميل البيانات. قد يكون هناك خطأ في ملف JSON أو الاتصال.";
        console.error(error);
    }
}

// ... (باقي الدوال setMode, renderStep, updateProgressBar كما هي في الكود السابق) ...

function loadQuiz() {
    const qData = currentSubject.questions[currentIndex];
    const container = document.getElementById('options-container');
    const feedback = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('quiz-next-btn');

    // النصوص الثابتة حسب اللغة
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
    // تغيير نص الزر حسب اللغة
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
    if (index === correctIndex) btn.classList.add('correct');

    feedbackBox.classList.remove('hidden');
    
    const customFeedback = qData.feedback ? `<br><small style="color:#555; display:block; margin-top:5px">${qData.feedback}</small>` : '';

    // نصوص الفيدباك حسب اللغة
    if (selected === correctIndex) {
        const txtCorrect = isAr ? 'إجابة صحيحة!' : 'Correct Answer!';
        feedbackBox.innerHTML = `✅ <strong>${txtCorrect}</strong>${customFeedback}`;
        feedbackBox.className = "feedback-box feedback-success";
    } else {
        const correctText = qData.options[correctIndex];
        const txtWrong = isAr ? 'إجابة خاطئة.' : 'Wrong Answer.';
        const txtTheCorrect = isAr ? 'الصحيح هو:' : 'Correct is:';
        
        feedbackBox.innerHTML = `❌ <strong>${txtWrong}</strong><br>${txtTheCorrect} ${correctText}${customFeedback}`;
        feedbackBox.className = "feedback-box feedback-error";
    }
}

function loadStudy() {
    document.getElementById('card-inner').classList.remove('is-flipped');
    const qData = currentSubject.questions[currentIndex];
    document.getElementById('study-question').innerText = qData.q;
    document.getElementById('study-answer').innerText = qData.options[qData.correct];
    
    const prevBtn = document.querySelector('#study-screen .nav-btn');
    if(prevBtn) prevBtn.disabled = (currentIndex === 0);
}

// ... (باقي دوال التنقل toggleFlip, nextQuestion, prevQuestion, showScreen كما هي) ...

// يجب تحديث showResults لتدعم اللغتين أيضاً
function showResults() {
    showScreen('result');
    const score = userAnswers.filter((ans, i) => ans === currentSubject.questions[i].correct).length;
    const isAr = (currentSubject.lang || 'ar') === 'ar';
    
    const txtResult = isAr 
        ? `نتيجتك هي ${score} من ${currentSubject.questions.length}`
        : `Your score is ${score} of ${currentSubject.questions.length}`;
        
    document.getElementById('final-result').innerText = txtResult;
    document.getElementById('result-title').innerText = isAr ? 'اكتمل الاختبار! 🎉' : 'Quiz Completed! 🎉';
}

init();