/* ==========================================
   1. المتغيرات وإدارة الحالة (State Management)
   ========================================== */
let quizData = [];
let currentSubject = null;
let currentIndex = 0;
let userAnswers = [];
let mode = ''; 
let currentSpeed = 0.8;

const screens = {
    setup: document.getElementById('setup-screen'),
    mode: document.getElementById('mode-screen'),
    quiz: document.getElementById('quiz-screen'),
    study: document.getElementById('study-screen'),
    result: document.getElementById('result-screen')
};

/* ==========================================
   2. إدارة التنقل وحفظ التقدم
   ========================================== */
function showScreen(name) {
    Object.values(screens).forEach(screen => {
        if(screen) screen.classList.add('hidden');
    });
    if (screens[name]) {
        screens[name].classList.remove('hidden');
        window.scrollTo(0, 0); 
    }
}

function saveDetailedProgress() {
    if (!currentSubject) return;
    const lastState = { subjectName: currentSubject.subject, mode: mode, currentIndex: currentIndex };
    localStorage.setItem('app_last_position', JSON.stringify(lastState));

    const subjectProgressKey = `progress_${currentSubject.subject}_${mode}`;
    const progressData = { index: currentIndex, answers: userAnswers };
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

        const savedPos = localStorage.getItem('app_last_position');
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                const foundSub = quizData.find(s => s.subject === pos.subjectName);
                if (foundSub) {
                    currentSubject = foundSub;
                    mode = pos.mode;
                    currentIndex = pos.currentIndex;
                    
                    const subProgKey = `progress_${currentSubject.subject}_${mode}`;
                    const savedProg = localStorage.getItem(subProgKey);
                    if (savedProg) userAnswers = JSON.parse(savedProg).answers || [];
                    
                    renderStep();
                    return;
                }
            } catch (e) { console.log("Error restoring session", e); }
        }
    } else {
        document.getElementById('repo-input-area').classList.remove('hidden');
    }
    showScreen('setup');
}

function saveRepoUrl() {
    const input = document.getElementById('repo-url-input');
    const url = input.value.trim();
    if (url) {
        localStorage.setItem('user_repo_url', url);
        location.reload(); 
    } else {
        alert("يرجى إدخال رابط صحيح!");
    }
}

async function fetchRepoAndAddSubjects(repoUrl) {
    let cleanUrl = repoUrl.replace('https://github.com/', '');
    if (cleanUrl.endsWith('.git')) cleanUrl = cleanUrl.slice(0, -4); 
    
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
        document.getElementById('repo-input-area').classList.add('hidden'); 
    } catch (e) { 
        console.error("Load Error:", e);
        document.getElementById('repo-input-area').classList.remove('hidden'); 
        alert("تعذر تحميل البيانات، تأكد من صحة الرابط أو اتصال الإنترنت.");
        localStorage.removeItem('user_repo_url'); 
    }
}

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
                const reached = (parsed.index || 0) + 1;
                if (reached > maxProgress) maxProgress = reached;
            } catch (e) { console.error(e); }
        }
    });

    let percentage = (maxProgress / totalQuestions) * 100;
    if (maxProgress >= totalQuestions) percentage = 100;
    return Math.min(100, Math.max(0, percentage));
}

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
        const progressPercent = getSubjectProgress(data.subject, data.questions.length);
        btn.innerHTML = `
            <span style="z-index:2; position:relative;">${data.subject}</span>
            <div class="subject-progress-line" style="width: ${progressPercent}%"></div>
        `;
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
function renderStep() {
    if (!currentSubject) return;

    const lang = currentSubject.lang || 'en';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    updateProgress();
    displayNotes();
    saveDetailedProgress();

    // إخفاء نتائج التحليل الصوتي السابقة عند الانتقال لسؤال جديد
    document.getElementById('study-displayArea').innerHTML = "";
    document.getElementById('quiz-displayArea').innerHTML = "";

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
    document.getElementById('card-inner').classList.remove('is-flipped'); 
}

function renderQuizQuestion() {
    const qData = currentSubject.questions[currentIndex];
    document.getElementById('question-text').innerText = qData.q;
    document.getElementById('quiz-count-display').innerText = `${currentIndex + 1} / ${currentSubject.questions.length}`;
    
    const container = document.getElementById('options-container');
    const feedbackBox = document.getElementById('quiz-feedback');
    container.innerHTML = '';
    feedbackBox.classList.add('hidden');
    
    qData.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;

        if (userAnswers[currentIndex] !== undefined && userAnswers[currentIndex] !== null) {
            applyFeedbackStyles(btn, i, qData.correct);
            btn.disabled = true;
        } else {
            btn.onclick = () => handleAnswer(i, btn, qData);
        }
        container.appendChild(btn);
    });

    if (userAnswers[currentIndex] !== undefined && userAnswers[currentIndex] !== null) {
        showFeedbackMessage(qData, userAnswers[currentIndex]);
    }
}

function handleAnswer(selectedIndex, clickedBtn, qData) {
    userAnswers[currentIndex] = selectedIndex;
    saveDetailedProgress();
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
    if (index === correctIndex) {
        btn.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
        btn.style.borderColor = "#10b981";
        btn.style.color = "#6ee7b7";
    } else if (index === selectedIndex && selectedIndex !== correctIndex) {
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
   5. أدوات مساعدة ونطق وأزرار الصوت
   ========================================== */
function updateProgress() {
    const pct = ((currentIndex + 1) / currentSubject.questions.length) * 100;
    const barId = (mode === 'quiz') ? 'quiz-progress-bar' : 'study-progress-bar';
    const bar = document.getElementById(barId);
    if (bar) bar.style.width = pct + "%";
}

function syncSpeed(val) {
    currentSpeed = val;
    document.querySelectorAll('.slider').forEach(el => el.value = val);
}

function speakCurrent() {
    if (!window.speechSynthesis || !currentSubject) return;
    window.speechSynthesis.cancel(); 
    const qData = currentSubject.questions[currentIndex];
    
    const utter = new SpeechSynthesisUtterance(qData.q);
    utter.lang = currentSubject.lang || 'en';
    utter.rate = parseFloat(currentSpeed);
    window.speechSynthesis.speak(utter);

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
   6. دمج مختبر الصوتيات وتحليل الجملة (من test.html)
   ========================================== */
function playGoogleTTS(text, lang = 'en') {
    // نطق الجملة كاملة ككتلة واحدة
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const audio = new Audio(url);
    audio.play();
}
/* ==========================================
   تطوير نطق الجمل المتصلة والمعالجة الصوتية
   ========================================== */

// دالة النطق العالمية للجملة كاملة
function playFullSentence(text) {
    if (!text) return;
    // تنظيف النص من الرموز التي قد تعيق النطق
    const cleanText = text.replace(/["']/g, "");
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=en&client=tw-ob`;
    const audio = new Audio(url);
    audio.rate = parseFloat(currentSpeed || 0.8);
    audio.play().catch(e => console.error("Playback error:", e));
}
// دالة محسنة لجلب ومعالجة رموز الجملة كاملة
async function getFullSentenceIPA(text) {
    const words = text.split(/\s+/);
    let fullIPA = "/ ";
    
    for (let word of words) {
        const cleanWord = word.replace(/[^\w]/g, '');
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
            const data = await response.json();
            // جلب الرمز الصوتي وتنظيفه من المائلات
            let phonetic = data[0].phonetic || (data[0].phonetics.find(p => p.text)?.text) || cleanWord;
            fullIPA += phonetic.replace(/\//g, '') + " ";
        } catch (e) {
            fullIPA += cleanWord + " ";
        }
    }
    return fullIPA + " /";
}
function playSentence(text) {
    // تنظيف النص من أي رموز قد تعيق المحرك الصوتي
    const cleanText = text.replace(/["']/g, "");
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=en&client=tw-ob`;
    const audio = new Audio(url);
    audio.play().catch(err => console.error("Error playing audio:", err));
}

async function analyzeCurrentQuestion(currentMode) {
    const qData = currentSubject.questions[currentIndex];
    const text = qData.q;
    const displayAreaId = currentMode === 'quiz' ? 'quiz-displayArea' : 'study-displayArea';
    const displayArea = document.getElementById(displayAreaId);
    
    if(!displayArea) return;

    displayArea.innerHTML = '<div style="text-align:center; padding:20px; color:var(--primary);">جاري معالجة النطق المتصل...</div>';
    
    // نطق الجملة فوراً عند التحميل
    playFullSentence(text);

    const words = text.split(/\s+/);
    let ipaParts = [];

    // جلب الرموز الصوتية وتحسين مظهرها
    for(let word of words) {
        const clean = word.replace(/[^\w]/g, '');
        if(clean) {
            try {
                const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${clean}`);
                const data = await resp.json();
                let phonetic = data[0]?.phonetic || (data[0]?.phonetics?.find(p => p.text)?.text) || clean;
                // إزالة المائلات الزائدة لتنسيق الجملة
                ipaParts.push(phonetic.replace(/\//g, ''));
            } catch (e) {
                ipaParts.push(clean);
            }
        }
    }

    // دمج الرموز في جملة واحدة محاطة بمائلين فقط كما في القواميس الاحترافية
    const fullIpa = `/${ipaParts.join(" ")}/`;

    // العرض النهائي (تصميم البطاقة الواحدة)
    displayArea.innerHTML = `
        <div class="word-pill" style="display: block; text-align: left; direction: ltr;">
            <div style="margin-bottom: 15px;">
                <span style="font-size: 0.7rem; color: var(--accent); font-weight: 800; text-transform: uppercase;">Full Sentence Flow</span>
                <h3 style="margin: 5px 0; line-height: 1.4; color: #fff;">${text}</h3>
                <div class="ipa" style="color: #6366f1; font-size: 1.1rem; margin-top: 10px; background: rgba(99,102,241,0.1); padding: 8px; border-radius: 8px; border-left: 3px solid var(--primary);">
                    ${fullIpa}
                </div>
            </div>
            <button class="nav-btn next" style="width: 100%; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 10px;" 
                onclick="playFullSentence(\`${text.replace(/`/g, "\\`")}\`)">
                <span>🔊 استمع للجملة كاملة</span>
            </button>
        </div>
    `;
}
/* ==========================================
   7. التحكم في التدفق
   ========================================== */
function toggleFlip() {
    const inner = document.getElementById('card-inner');
    inner.classList.toggle('is-flipped');
}

function nextQuestion() {
    if (currentIndex < currentSubject.questions.length - 1) {
        currentIndex++;
        renderStep();
    } else {
        showResults(); 
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
    saveDetailedProgress(); 
    currentSubject = null;
    showScreen('setup');
}

function restartSubject() {
    if(confirm("هل تريد إعادة هذه المادة من البداية؟")) {
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

// بدء التطبيق
window.onload = init;

/* ==========================================
   8. القاموس المدمج - (English-English Dictionary)
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const dictionaryOutput = document.getElementById('dictionaryOutput');

    const localDictionaryPath = 'https://raw.githubusercontent.com/MostafaAomar/school_project/refs/heads/main/data/subdata/myOwnDic.json'; 
    const apiEndpoint = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

    let dictionaryData = []; 
    let isDictionaryLoaded = false;
    let isLoadingDictionary = false;

    async function loadLocalDictionary() {
        if (isDictionaryLoaded || isLoadingDictionary) return; 
        isLoadingDictionary = true;
        console.log(`Attempting to load local dictionary from: ${localDictionaryPath}`); 

        try {
            const response = await fetch(localDictionaryPath);
            if (!response.ok) {
                console.error(`HTTP error loading local dictionary! Status: ${response.status}`);
                throw new Error(`Failed to load local dictionary.json`);
            }
            dictionaryData = await response.json();
            if (!Array.isArray(dictionaryData)) {
                 throw new Error("Invalid local dictionary format.");
            }
            isDictionaryLoaded = true;
            console.log(`Local dictionary loaded successfully.`);
             if (wordInput && wordInput.value.trim()) {
                handleWordSearch();
            }
        } catch (error) {
            console.error('Error loading or parsing local dictionary.json:', error);
             if (dictionaryOutput) {
                 dictionaryOutput.innerHTML = `<p class="text-danger">خطأ في تحميل القاموس المحلي. قد لا تعمل عمليات البحث المحلية.</p>`;
             }
        } finally {
            isLoadingDictionary = false;
        }
    }

    function searchLocalDictionary(word) {
        if (!isDictionaryLoaded || dictionaryData.length === 0) return undefined; 
        const searchTerm = word.trim().toLowerCase();
        return dictionaryData.find(entry => entry.word.toLowerCase() === searchTerm);
    }

    async function searchApiDictionary(word) {
        const searchTerm = word.trim();
        if (!searchTerm) return null;

        dictionaryOutput.innerHTML = '<p class="text-muted" style="text-align:center;">لم يتم العثور عليه محليًا، جار البحث عبر الإنترنت...</p>';

        try {
            const response = await fetch(`${apiEndpoint}${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`API error! status: ${response.status}`);
            }
            const data = await response.json();
            return (data && data.length > 0) ? data[0] : null;
        } catch (error) {
            console.error('Error fetching definition from API:', error);
             if (dictionaryOutput) {
                  dictionaryOutput.innerHTML = `<p class="text-danger" style="text-align:center;">حدث خطأ أثناء البحث عبر الإنترنت.</p>`;
             }
            return null; 
        }
    }

     function displayDefinition(entryData, searchTerm) {
         if (!dictionaryOutput) return; 

         if (!entryData) {
            dictionaryOutput.innerHTML = `<p class="text-warning" style="text-align:center;">لم يتم العثور على تعريف للكلمة "${escapeHTML(searchTerm)}".</p>`;
            return;
        }

        const word = entryData.word;
        const phoneticText = entryData.phonetics?.find(p => p.text)?.text;
        const audioUrl = entryData.phonetics?.find(p => p.audio)?.audio;

        let html = `<h4 class="mb-2" style="text-align:left; direction:ltr;">${escapeHTML(word)} ${phoneticText ? `<span class="text-muted fs-6">${escapeHTML(phoneticText)}</span>` : ''}</h4>`;

        if (audioUrl) {
            html += `
                <div class="audio mb-3">
                    <audio controls src="${escapeHTML(audioUrl)}">متصفحك لا يدعم الصوت.</audio>
                </div>
            `;
        } else {
             const alternateAudio = entryData.phonetics?.find(p => p.audio)?.audio;
              if (alternateAudio) {
                 html += `
                 <div class="audio mb-3">
                     <audio controls src="${escapeHTML(alternateAudio)}">متصفحك لا يدعم الصوت.</audio>
                 </div>`;
              }
        }

        if (entryData.meanings && Array.isArray(entryData.meanings)) {
            entryData.meanings.forEach(meaning => {
                html += `<div class="definition mb-3 border-bottom pb-2" style="text-align:left; direction:ltr;">`;
                html += `<h5 style="color:var(--success);"><em>${escapeHTML(meaning.partOfSpeech)}</em></h5>`;

                if (meaning.definitions && Array.isArray(meaning.definitions)) {
                    meaning.definitions.forEach((def, index) => {
                        html += `<p class="mb-1"><strong>${index + 1}.</strong> ${escapeHTML(def.definition)}</p>`;
                        if (def.example) {
                            html += `<p class="ms-3 text-muted fst-italic" style="border-left:2px solid var(--primary); padding-left:10px;">"${escapeHTML(def.example)}"</p>`;
                        }
                        if (def.synonyms && def.synonyms.length > 0) {
                            html += `<p class="ms-3 small"><strong>Synonyms:</strong> ${escapeHTML(def.synonyms.join(', '))}</p>`;
                        }
                    });
                }
                html += `</div>`;
            });
        } else {
             html += `<p class="text-muted">لا توجد معاني مفصلة متوفرة.</p>`;
        }
        dictionaryOutput.innerHTML = html;
    }

    async function handleWordSearch() {
        if (!wordInput || !dictionaryOutput) return; 
        const word = wordInput.value.trim();

        if (word.length < 1) { 
            dictionaryOutput.innerHTML = '<p class="text-muted" style="text-align:center;">أدخل كلمة للبحث.</p>';
            return;
        }

        if (!isDictionaryLoaded && !isLoadingDictionary) {
             dictionaryOutput.innerHTML = '<p class="text-muted" style="text-align:center;">جارٍ تحميل القاموس المحلي أولاً...</p>';
            await loadLocalDictionary(); 
        } else if (isLoadingDictionary) {
             dictionaryOutput.innerHTML = '<p class="text-muted" style="text-align:center;">القاموس المحلي قيد التحميل، يرجى الانتظار...</p>';
             return; 
         }

        const localResult = searchLocalDictionary(word);

        if (localResult) {
            displayDefinition(localResult, word);
        } else {
            const apiResult = await searchApiDictionary(word); 
            displayDefinition(apiResult, word); 
        }
    }

    if (wordInput && dictionaryOutput) {
        loadLocalDictionary();
        wordInput.addEventListener('input', debounce(handleWordSearch, 350)); 
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});