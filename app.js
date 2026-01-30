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

        // إنشاء شبكة المواد مع شاشات تقدم لكل مادة
        quizData.forEach((data, index) => {
            const row = document.createElement('div');
            row.className = 'subject-row';
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'space-between';
            row.style.marginBottom = '8px';

            const btn = document.createElement('button');
            btn.innerText = data.subject;
            btn.className = 'subject-btn';
            btn.style.flex = '1';
            btn.style.textAlign = 'right';

            const prog = document.createElement('div');
            prog.id = `subject-progress-${index}`;
            prog.className = 'subject-progress-wrap';
            prog.innerHTML = `
                <div class="subject-progress-line"><div class="subject-progress-fill" style="width:0%"></div></div>
                <div class="subject-pct-text"></div>
            `;

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

            row.appendChild(btn);
            row.appendChild(prog);
            list.appendChild(row);
        });

        // بعد إنشاء القائمة، عرض تقدم كل مادة إن وُجد
        updateAllSubjectProgress();
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

    // If there's saved progress for this subject+mode, offer to load it
    try {
        const key = storageKey();
        const raw = localStorage.getItem(key);
        if (raw) {
            const want = confirm((currentSubject.lang || 'ar') === 'ar' ? 'تم العثور على تقدم محفوظ. هل ترغب بتحميله؟' : 'Saved progress found. Load it?');
            if (want) {
                loadProgress();
                return;
            }
        }
    } catch (e) {
        console.warn('load check failed', e);
    }

    renderStep();
}

// Helper: storage key per subject + mode
function storageKey() {
    const subj = currentSubject ? currentSubject.subject : 'unknown';
    return `study_progress::${subj}::${mode}`;
}

// Compute saved progress percentage for a subject (by index in quizData)
function computeProgressForSubject(idx) {
    try {
        const subjName = quizData[idx].subject;
        const total = quizData[idx].questions.length || 0;
        if (!total) return 0;

        const keyStudy = `study_progress::${subjName}::study`;
        const keyQuiz = `study_progress::${subjName}::quiz`;

        let best = 0;

        const rawStudy = localStorage.getItem(keyStudy);
        if (rawStudy) {
            try {
                const o = JSON.parse(rawStudy);
                const idxSaved = typeof o.index === 'number' ? o.index : 0;
                const pct = Math.round(((idxSaved + 1) / total) * 100);
                if (pct > best) best = pct;
            } catch (e) { /* ignore parse */ }
        }

        const rawQuiz = localStorage.getItem(keyQuiz);
        if (rawQuiz) {
            try {
                const o = JSON.parse(rawQuiz);
                const answers = Array.isArray(o.userAnswers) ? o.userAnswers : [];
                const answered = answers.filter(a => a !== null && a !== undefined).length;
                const pct = Math.round((answered / total) * 100);
                if (pct > best) best = pct;
            } catch (e) { /* ignore parse */ }
        }

        return Math.min(100, Math.max(0, best));
    } catch (e) {
        return 0;
    }
}

// Update all progress spans in the subject list
function updateAllSubjectProgress() {
    const list = document.getElementById('subject-list');
    if (!list) return;
    // children are rows we created earlier
    Array.from(list.children).forEach((row, idx) => {
        const wrap = row.querySelector(`#subject-progress-${idx}`);
        if (!wrap) return;
        const pct = computeProgressForSubject(idx);
        const fill = wrap.querySelector('.subject-progress-fill');
        const txt = wrap.querySelector('.subject-pct-text');
        if (fill) fill.style.width = pct + '%';
        if (txt) txt.innerText = pct > 0 ? pct + '%' : '';
    });
}

// Show a short status message near the save buttons
function showSaveStatus(msg) {
    const els = document.querySelectorAll('#save-status');
    if (!els || els.length === 0) return;
    els.forEach(el => el.innerText = msg);
    setTimeout(() => { els.forEach(el => { if (el.innerText === msg) el.innerText = ''; }); }, 3000);
}

// --- Translation & Speech helpers ---
function speakText(text, lang) {
    if (!window.speechSynthesis) return alert('Speech Synthesis not supported in this browser');
    const utter = new SpeechSynthesisUtterance(text);
    // prefer target lang, else subject lang, else en
    utter.lang = lang || (currentSubject && currentSubject.lang) || 'en';
    // try to pick a voice that matches lang
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang && v.lang.startsWith(utter.lang));
    if (match) utter.voice = match;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
}

async function translateText(text, target, source) {
    // Try a public LibreTranslate instance that usually supports CORS
    const payload = { q: text, source: source || 'auto', target: target, format: 'text' };
    // Try a local proxy first (run server.js) to avoid CORS, then public endpoints
    const endpoints = [
        'http://127.0.0.1:3000/translate',
        'http://localhost:3000/translate',
        'https://translate.argosopentech.com/translate',
        'https://libretranslate.de/translate',
        'https://libretranslate.com/translate'
    ];

    for (const url of endpoints) {
        try {
            const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!resp.ok) throw new Error(`Bad response ${resp.status}`);
            const j = await resp.json();
            if (j && j.translatedText) return j.translatedText;
        } catch (e) {
            // try next endpoint
            console.warn('translate endpoint failed', url, e);
            continue;
        }
    }

    // If we reach here, all endpoints failed (likely CORS). Throw and let caller show inline guidance.
    throw new Error('All translate endpoints failed (CORS or network)');
}

function speakCurrent(isStudy) {
    const qData = currentSubject.questions[currentIndex];
    if (!qData) return;
    const text = qData.q;
    // If there's an active manual translation textarea, speak that; otherwise speak the original.
    const ta = document.getElementById('manual-translate-input');
    if (ta && ta.value.trim()) {
        const manual = ta.value.trim();
        const detect = detectLangFromText(manual);
        speakText(manual, detect);
    } else {
        speakText(text, currentSubject.lang || 'ar');
    }
}

async function translateCurrent(isStudy) {
    // Show a transient manual translation editor for the current question.
    const qData = currentSubject.questions[currentIndex];
    if (!qData) return;
    const boxId = isStudy ? 'translation-box-study' : 'translation-box';
    const box = document.getElementById(boxId);
    if (!box) return;
    box.classList.remove('hidden');
    box.innerHTML = `
        <div style="text-align:right">
            <label style="font-weight:600">${(currentSubject.lang||'ar')==='ar' ? 'أدخل ترجمتك هنا للسؤال الحالي' : 'Enter your translation for this question'}</label>
            <textarea id="manual-translate-input" class="manual-translate" placeholder="${(currentSubject.lang||'ar')==='ar' ? 'أدخل الترجمة هنا...' : 'Type translation here...'}"></textarea>
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
                <button class="mini-btn" onclick="applyManualTranslation(${isStudy})">✔️ تطبيق</button>
                <button class="mini-btn" onclick="speakCurrent(${isStudy})">🔊 نطق</button>
            </div>
        </div>
    `;
}

function applyManualTranslation(isStudy) {
    const ta = document.getElementById('manual-translate-input');
    if (!ta) return;
    const val = ta.value.trim();
    const boxId = isStudy ? 'translation-box-study' : 'translation-box';
    const box = document.getElementById(boxId);
    if (!box) return;
    if (!val) {
        box.innerHTML = '';
        box.classList.add('hidden');
        return;
    }
    box.innerHTML = `<strong>${(currentSubject.lang||'ar')==='ar' ? 'الترجمة:' : 'Translation:'}</strong><div style="margin-top:6px">${escapeHtml(val)}</div>`;
}

function detectLangFromText(s) {
    if (!s) return '';
    // crude detection: Arabic Unicode range
    if (/[\u0600-\u06FF]/.test(s)) return 'ar';
    return 'en';
}

function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Manual translation storage: key format translation::subject::index::lang
function manualTranslationKey(subject, index, lang) {
    return `translation::${subject}::${index}::${lang}`;
}

function saveManualTranslation(subject, index, lang, text, isAuto=false) {
    const key = manualTranslationKey(subject, index, lang);
    const payload = { text: text, auto: !!isAuto, ts: Date.now() };
    try { localStorage.setItem(key, JSON.stringify(payload)); updateAllSubjectProgress(); } catch(e){console.warn('save manual translation failed', e)}
}

function loadManualTranslation(subject, index, lang) {
    const key = manualTranslationKey(subject, index, lang);
    try { const raw = localStorage.getItem(key); if (!raw) return null; return JSON.parse(raw).text; } catch(e){return null}
}

// Called from the inline Save button
function saveManualFromBox(subject, index, lang, isStudy) {
    const ta = document.getElementById('manual-translate-input');
    if (!ta) return;
    const val = ta.value.trim();
    if (!val) return alert((currentSubject.lang||'ar')==='ar' ? 'لا يوجد نص للحفظ' : 'No text to save');
    saveManualTranslation(subject, index, lang, val, false);
    const boxId = isStudy ? 'translation-box-study' : 'translation-box';
    const box = document.getElementById(boxId);
    if (box) box.innerHTML = `<strong>Translation (${lang}):</strong> <div style="margin-top:6px">${escapeHtml(val)}</div>`;
    showSaveStatus((currentSubject.lang||'ar')==='ar' ? 'تم حفظ الترجمة محلياً' : 'Translation saved locally');
}

function speakManualFromBox(isStudy, lang) {
    const ta = document.getElementById('manual-translate-input');
    if (!ta) return;
    const val = ta.value.trim();
    if (!val) return alert((currentSubject.lang||'ar')==='ar' ? 'لا يوجد نص للنطق' : 'No text to speak');
    speakText(val, lang);
}

// Save current progress to localStorage
function saveProgress() {
    if (!currentSubject) return alert('اختر مادة أولاً');
    const key = storageKey();
    const payload = {
        index: currentIndex,
        userAnswers: userAnswers,
        mode: mode
    };
    try {
        localStorage.setItem(key, JSON.stringify(payload));
        showSaveStatus((currentSubject.lang || 'ar') === 'ar' ? 'تم الحفظ' : 'Saved');
        updateAllSubjectProgress();
    } catch (e) {
        console.error('Save failed', e);
        alert((currentSubject.lang || 'ar') === 'ar' ? 'فشل الحفظ' : 'Save failed');
    }
}

// Load saved progress (if exists)
function loadProgress() {
    if (!currentSubject) return alert('اختر مادة أولاً');
    const key = storageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return alert((currentSubject.lang || 'ar') === 'ar' ? 'لا يوجد تقدم محفوظ لهذه المادة' : 'No saved progress for this subject');
    try {
        const obj = JSON.parse(raw);
        // Ensure answers array matches current length
        const len = currentSubject.questions.length;
        if (!obj.userAnswers || !Array.isArray(obj.userAnswers)) obj.userAnswers = new Array(len).fill(null);
        if (obj.userAnswers.length !== len) {
            // pad or trim
            obj.userAnswers = obj.userAnswers.slice(0, len);
            while (obj.userAnswers.length < len) obj.userAnswers.push(null);
        }
        userAnswers = obj.userAnswers;
        currentIndex = Math.min(Math.max(0, obj.index || 0), len - 1);
        mode = obj.mode || mode;
        renderStep();
        showSaveStatus((currentSubject.lang || 'ar') === 'ar' ? 'تم تحميل التقدم' : 'Progress loaded');
        updateAllSubjectProgress();
    } catch (e) {
        console.error('Load failed', e);
        alert((currentSubject.lang || 'ar') === 'ar' ? 'فشل تحميل التقدم' : 'Load failed');
    }
}

// Clear saved progress (if confirmClear true, ask user)
function clearProgress(confirmClear) {
    if (!currentSubject) return alert('اختر مادة أولاً');
    if (confirmClear) {
        const ok = confirm((currentSubject.lang || 'ar') === 'ar' ? 'هل تريد مسح التقدم المحفوظ؟' : 'Clear saved progress?');
        if (!ok) return;
    }
    const key = storageKey();
    localStorage.removeItem(key);
    userAnswers = new Array(currentSubject.questions.length).fill(null);
    currentIndex = 0;
    renderStep();
    showSaveStatus((currentSubject.lang || 'ar') === 'ar' ? 'تم مسح التقدم' : 'Progress cleared');
    updateAllSubjectProgress();
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
    // clear any previous translation input/display for this question
    const tbox = document.getElementById('translation-box');
    if (tbox) { tbox.innerHTML = ''; tbox.classList.add('hidden'); }

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
    // clear translation box for study view
    const tbox = document.getElementById('translation-box-study');
    if (tbox) { tbox.innerHTML = ''; tbox.classList.add('hidden'); }
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