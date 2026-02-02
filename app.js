/* ==========================================
   1. المتغيرات وإدارة الحالة (State Management)
   ========================================== */
let quizData = [];
let currentSubject = null;
let currentIndex = 0;
let userAnswers = [];
let mode = ''; 
let currentSpeed = 0.8;

// تعريف الشاشات لتسهيل التنقل
const screens = {
    setup: document.getElementById('setup-screen'),
    mode: document.getElementById('mode-screen'),
    quiz: document.getElementById('quiz-screen'),
    study: document.getElementById('study-screen'),
    result: document.getElementById('result-screen')
};

/* ==========================================
   2. إدارة التنقل (Navigation)
   ========================================== */
function showScreen(name) {
    Object.values(screens).forEach(screen => {
        if(screen) screen.classList.add('hidden');
    });
    if (screens[name]) {
        screens[name].classList.remove('hidden');
        window.scrollTo(0, 0); // العودة لأعلى الصفحة عند تغيير الشاشة
    }
}

// حفظ الحالة كاملة (لحفظ التقدم في حال إغلاق المتصفح)
function saveDetailedProgress() {
    if (!currentSubject) return;
    
    // الحالة العامة
    const lastState = {
        subjectName: currentSubject.subject,
        mode: mode,
        currentIndex: currentIndex
    };
    localStorage.setItem('app_last_position', JSON.stringify(lastState));

    // حالة المادة الخاصة (إجابات المستخدم)
    const subjectProgressKey = `progress_${currentSubject.subject}_${mode}`;
    const progressData = {
        index: currentIndex,
        answers: userAnswers
    };
    localStorage.setItem(subjectProgressKey, JSON.stringify(progressData));
}

/* ==========================================
   3. التحميل والتهيئة (Initialization)
   ========================================== */
async function init() {
    const storedRepo = localStorage.getItem('user_repo_url');
    const loadingDiv = document.querySelector('.loader');

    if (storedRepo) {
        if(loadingDiv) loadingDiv.classList.remove('hidden');
        await fetchRepoAndAddSubjects(storedRepo);
        if(loadingDiv) loadingDiv.classList.add('hidden');

        // محاولة استعادة آخر جلسة
        const savedPos = localStorage.getItem('app_last_position');
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                const foundSub = quizData.find(s => s.subject === pos.subjectName);
                if (foundSub) {
                    currentSubject = foundSub;
                    mode = pos.mode;
                    currentIndex = pos.currentIndex;
                    
                    // استعادة الإجابات السابقة
                    const subProgKey = `progress_${currentSubject.subject}_${mode}`;
                    const savedProg = localStorage.getItem(subProgKey);
                    if (savedProg) {
                        userAnswers = JSON.parse(savedProg).answers || [];
                    }
                    
                    renderStep();
                    return;
                }
            } catch (e) {
                console.log("Error restoring session", e);
            }
        }
    } else {
        // إذا لم يكن هناك رابط، أظهر حقل الإدخال
        document.getElementById('repo-input-area').classList.remove('hidden');
    }
    showScreen('setup');
}

// دالة لحفظ الرابط من حقل الإدخال
function saveRepoUrl() {
    const input = document.getElementById('repo-url-input');
    const url = input.value.trim();
    if (url) {
        localStorage.setItem('user_repo_url', url);
        location.reload(); // إعادة تحميل لتشغيل init من جديد
    } else {
        alert("يرجى إدخال رابط صحيح!");
    }
}

async function fetchRepoAndAddSubjects(repoUrl) {
    let cleanUrl = repoUrl.replace('https://github.com/', '');
    if (cleanUrl.endsWith('.git')) cleanUrl = cleanUrl.slice(0, -4); // تنظيف الرابط
    
    const parts = cleanUrl.split('/');
    if (parts.length < 2) return;

    const owner = parts[0];
    const repo = parts[1];
    const api = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;

    try {
        const resp = await fetch(api);
        if (!resp.ok) throw new Error("Repo not found");
        const tree = await resp.json();
        const jsonFiles = tree.tree.filter(t => t.path.endsWith('.json'));

        quizData = []; 
        for (const file of jsonFiles) {
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`;
            const r = await fetch(rawUrl);
            const content = await r.json();
            const data = Array.isArray(content) ? content[0] : content;
            
            if (data && data.questions) {
                quizData.push({
                    subject: data.subject || file.path.replace('.json', ''),
                    lang: data.lang || 'en',
                    questions: data.questions
                });
            }
        }
        renderSubjectList();
        document.getElementById('repo-input-area').classList.add('hidden'); // إخفاء الحقل عند النجاح
    } catch (e) { 
        console.error("Load Error:", e);
        document.getElementById('repo-input-area').classList.remove('hidden'); // إظهار الحقل عند الخطأ
        alert("تعذر تحميل البيانات، تأكد من صحة الرابط أو اتصال الإنترنت.");
        localStorage.removeItem('user_repo_url'); // حذف الرابط الخاطئ
    }
}
// دالة مساعدة لحساب نسبة التقدم للمادة بناءً على الذاكرة
function getSubjectProgress(subjectName, totalQuestions) {
    if (!totalQuestions || totalQuestions === 0) return 0;

    const modes = ['study', 'quiz'];
    let maxProgress = 0;

    modes.forEach(m => {
        const key = `progress_${subjectName}_${m}`;
        const savedData = localStorage.getItem(key);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // نأخذ الفهرس الحالي ونضيف له 1 ليعبر عن عدد الأسئلة التي مر عليها المستخدم
                const reached = (parsed.index || 0) + 1;
                if (reached > maxProgress) {
                    maxProgress = reached;
                }
            } catch (e) { console.error(e); }
        }
    });

    // حساب النسبة بدقة
    let percentage = (maxProgress / totalQuestions) * 100;
    
    // إذا وصل المستخدم لآخر سؤال، نعتبرها 100%
    if (maxProgress >= totalQuestions) percentage = 100;

    return Math.min(100, Math.max(0, percentage));
}
// الدالة المحدثة لعرض قائمة المواد مع خط التقدم
function renderSubjectList() {
    const list = document.getElementById('subject-list');
    list.innerHTML = "";
    
    if(quizData.length === 0) {
        list.innerHTML = "<p style='text-align:center; color:#666;'>لا توجد مواد متاحة.</p>";
        return;
    }

    quizData.forEach((data, index) => {
        const btn = document.createElement('div');
        btn.className = 'subject-btn';
        
        // حساب النسبة المئوية لهذه المادة
        const progressPercent = getSubjectProgress(data.subject, data.questions.length);

        // بناء محتوى الزر (الاسم + السهم + خط التقدم)
      // بناء محتوى الزر (الاسم + السهم + خط التقدم)
btn.innerHTML = `
    <span style="z-index:2; position:relative;">${data.subject}</span>
    <div class="subject-progress-line" style="width: ${progressPercent}%"></div>
`;
        
        // إضافة حدث النقر
        btn.onclick = () => {
            currentSubject = quizData[index];
            document.getElementById('selected-subject-name').innerText = currentSubject.subject;
            showScreen('mode');
        };
        
        list.appendChild(btn);
    });
}

/* ==========================================
   4. المنطق الأساسي (Study & Quiz Logic)
   ========================================== */

// تجهيز الشاشة بناءً على السؤال الحالي
function renderStep() {
    if (!currentSubject) return;

    // ضبط اللغة
    const lang = currentSubject.lang || 'en';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    updateProgress();
    displayNotes();
    saveDetailedProgress();

    if (mode === 'quiz') {
        showScreen('quiz');
        renderQuizQuestion();
    } else {
        showScreen('study');
        renderStudyCard();
    }
}

function renderStudyCard() {
    const qData = currentSubject.questions[currentIndex];
    document.getElementById('study-question').innerText = qData.q;
    document.getElementById('study-answer').innerText = qData.options[qData.correct];
    document.getElementById('study-count').innerText = `${currentIndex + 1} / ${currentSubject.questions.length}`;
    document.getElementById('card-inner').classList.remove('is-flipped'); // إعادة البطاقة لوجهها
}

// دالة الكويز المدمجة (المصححة)
function renderQuizQuestion() {
    const qData = currentSubject.questions[currentIndex];
    
    // النصوص
    document.getElementById('question-text').innerText = qData.q;
    document.getElementById('quiz-count-display').innerText = `${currentIndex + 1} / ${currentSubject.questions.length}`;
    
    const container = document.getElementById('options-container');
    const feedbackBox = document.getElementById('quiz-feedback');
    const noteRow = document.getElementById('quiz-note-input-row');
    
    container.innerHTML = '';
    feedbackBox.classList.add('hidden');
    
    // إظهار حقل الملاحظات في الكويز
    if(noteRow) noteRow.classList.remove('hidden');

    qData.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;

        // التحقق من الإجابة المحفوظة
        if (userAnswers[currentIndex] !== undefined && userAnswers[currentIndex] !== null) {
            applyFeedbackStyles(btn, i, qData.correct);
            btn.disabled = true;
            if (userAnswers[currentIndex] === i) {
                // نظهر رسالة الشرح فقط إذا كانت هي التي تم اختيارها
                // أو يمكن إظهارها دائماً بعد الحل
            }
        } else {
            btn.onclick = () => handleAnswer(i, btn, qData);
        }
        container.appendChild(btn);
    });

    // إذا كان تم الحل مسبقاً، نظهر رسالة الشرح
    if (userAnswers[currentIndex] !== undefined && userAnswers[currentIndex] !== null) {
        showFeedbackMessage(qData, userAnswers[currentIndex]);
    }
}

function handleAnswer(selectedIndex, clickedBtn, qData) {
    userAnswers[currentIndex] = selectedIndex;
    saveDetailedProgress();

    // تعطيل وتلوين الأزرار
    const container = document.getElementById('options-container');
    const buttons = container.querySelectorAll('.option-btn');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        applyFeedbackStyles(btn, index, qData.correct);
    });

    showFeedbackMessage(qData, selectedIndex);
}

function applyFeedbackStyles(btn, index, correctIndex) {
    const selectedIndex = userAnswers[currentIndex];
    
    // الإجابة الصحيحة دائماً خضراء
    if (index === correctIndex) {
        btn.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
        btn.style.borderColor = "#10b981";
        btn.style.color = "#6ee7b7";
    }
    // الإجابة الخاطئة المختارة حمراء
    else if (index === selectedIndex && selectedIndex !== correctIndex) {
        btn.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
        btn.style.borderColor = "#ef4444";
        btn.style.color = "#fca5a5";
    }
}

function showFeedbackMessage(qData, selectedIndex) {
    const feedbackBox = document.getElementById('quiz-feedback');
    const isCorrect = selectedIndex === qData.correct;
    const isAr = (currentSubject.lang || 'ar') === 'ar';

    feedbackBox.classList.remove('hidden');
    feedbackBox.className = isCorrect ? "feedback-toast feedback-success" : "feedback-toast feedback-error";
    
    const title = isCorrect ? (isAr ? "✅ ممتاز!" : "✅ Correct!") : (isAr ? "❌ خطأ" : "❌ Incorrect");
    const explanation = qData.feedback || (isCorrect ? "" : (isAr ? `الإجابة الصحيحة هي: ${qData.options[qData.correct]}` : `Correct answer: ${qData.options[qData.correct]}`));
    
    feedbackBox.innerHTML = `<strong>${title}</strong><br><span>${explanation}</span>`;
}

/* ==========================================
   5. أدوات مساعدة (Progress, Voice, Notes)
   ========================================== */
function updateProgress() {
    const pct = ((currentIndex + 1) / currentSubject.questions.length) * 100;
    const barId = (mode === 'quiz') ? 'quiz-progress-bar' : 'study-progress-bar';
    const bar = document.getElementById(barId);
    if (bar) bar.style.width = pct + "%";
}

function syncSpeed(val) {
    currentSpeed = val;
    // تحديث كل السلايدرات في الصفحة لتكون متزامنة
    document.querySelectorAll('.slider').forEach(el => el.value = val);
}

function speakCurrent() {
    if (!window.speechSynthesis || !currentSubject) return;
    window.speechSynthesis.cancel(); 
    const qData = currentSubject.questions[currentIndex];
    
    // نطق السؤال
    const utter = new SpeechSynthesisUtterance(qData.q);
    utter.lang = currentSubject.lang || 'en';
    utter.rate = parseFloat(currentSpeed);
    window.speechSynthesis.speak(utter);

    // إذا كان وضع الدراسة وتم قلب البطاقة، انطق الإجابة أيضاً
    if (mode === 'study') {
        const inner = document.getElementById('card-inner');
        if (inner.classList.contains('is-flipped')) {
            const utterAns = new SpeechSynthesisUtterance(qData.options[qData.correct]);
            utterAns.lang = currentSubject.lang || 'en';
            utterAns.rate = parseFloat(currentSpeed);
            window.speechSynthesis.speak(utterAns);
        }
    }
}

function saveUserNote() {
    const isQuiz = mode === 'quiz';
    const inputId = isQuiz ? 'quiz-note-input' : 'note-input';
    const input = document.getElementById(inputId);
    
    if (input && input.value.trim()) {
        const key = `note_${currentSubject.subject}_${currentIndex}`;
        localStorage.setItem(key, input.value.trim());
        input.value = "";
        displayNotes();
    }
}

function displayNotes() {
    const key = `note_${currentSubject.subject}_${currentIndex}`;
    const saved = localStorage.getItem(key);
    
    // عرض الملاحظة في المكان المناسب
    const displayId = (mode === 'quiz') ? 'quiz-note-display' : 'user-note-display';
    const box = document.getElementById(displayId);
    
    if (box) {
        if (saved) {
            box.innerText = `📝 ${saved}`;
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    }
}

/* ==========================================
   6. التحكم في التدفق (Next/Prev/Flip)
   ========================================== */
function toggleFlip() {
    const inner = document.getElementById('card-inner');
    inner.classList.toggle('is-flipped');
    // إذا قلبت البطاقة للإجابة، انطقها تلقائياً إذا رغبت (اختياري)
}

function nextQuestion() {
    if (currentIndex < currentSubject.questions.length - 1) {
        currentIndex++;
        renderStep();
    } else {
        showResults(); // وصلنا للنهاية
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
    const statsBox = document.getElementById('final-stats');
    
    if (mode === 'quiz') {
        // حساب النتيجة
        let score = 0;
        userAnswers.forEach((ans, idx) => {
            if (ans === currentSubject.questions[idx].correct) score++;
        });
        const pct = Math.round((score / currentSubject.questions.length) * 100);
        
        statsBox.innerHTML = `
            <div style="font-size:3rem; font-weight:800; color:${pct >= 50 ? '#10b981' : '#ef4444'}">${pct}%</div>
            <p>أجبت على ${score} من أصل ${currentSubject.questions.length} بشكل صحيح</p>
        `;
    } else {
        statsBox.innerHTML = `<p>أتممت مراجعة جميع البطاقات بنجاح!</p>`;
    }
}

function setMode(m) {
    mode = m;
    // محاولة استعادة التقدم الخاص بهذا الوضع
    const subProgKey = `progress_${currentSubject.subject}_${mode}`;
    const savedProg = localStorage.getItem(subProgKey);
    
    if (savedProg) {
        const prog = JSON.parse(savedProg);
        currentIndex = prog.index || 0;
        userAnswers = prog.answers || [];
    } else {
        currentIndex = 0;
        userAnswers = [];
    }
    renderStep();
}

function goBackToSubjects() {
    saveDetailedProgress(); // حفظ قبل الخروج
    currentSubject = null;
    showScreen('setup');
}

function restartSubject() {
    if(confirm("هل تريد إعادة هذه المادة من البداية؟")) {
        // تصفير التقدم لهذه المادة فقط
        currentIndex = 0;
        userAnswers = [];
        const subjectProgressKey = `progress_${currentSubject.subject}_${mode}`;
        localStorage.removeItem(subjectProgressKey);
        renderStep();
    }
}

function fullReset() {
    if(confirm("⚠️ تحذير: سيتم حذف رابط المستودع وكافة الملاحظات والتقدم. هل أنت متأكد؟")) {
        localStorage.clear();
        location.reload();
    }
}

// بدء التطبيق عند تحميل الصفحة
window.onload = init;