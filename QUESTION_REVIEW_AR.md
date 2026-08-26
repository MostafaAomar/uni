# تقرير مراجعة بنك الأسئلة

## النتيجة النهائية

| البند | قبل المراجعة | بعد المراجعة |
|---|---:|---:|
| سجلات الأسئلة | 4068 | 3293 |
| النسخ المكررة المدمجة | — | 765 |
| الأسئلة غير الصالحة المتقاعدة | — | 10 |
| مجموعات نص السؤال المكرر | 532 | 0 |
| المجموعات الصارمة المكررة | 440 | 0 |
| المجموعات المتطابقة ذات الإجابات المتعارضة | 26 | 0 |
| أسئلة ذات خيارات مكررة فعلياً | 10 أولية | 0 |
| فهارس إجابة غير صالحة | 0 | 0 |

نُفذت 539 مجموعة دمج مراجَعة، و86 عملية تصحيح أو إعادة صياغة صريحة. لا تعني إزالة 775 سجلاً ضياع التقدم: معرّفات النسخ الـ765 المدمجة أضيفت إلى السؤال الباقي، أما الأسئلة العشرة المتقاعدة فسُجلت مع أسبابها في `retired-question-ids.json`.

## طريقة اكتشاف التكرار

1. طُبِّع نص السؤال بإزالة رقم السؤال الأولي، والفروق غير الدلالية في علامات الترقيم والمسافات وحالة الأحرف.
2. قورن نص السؤال وحده لاكتشاف النسخ التي غُيّرت خياراتها.
3. بُنيت بصمة صارمة من النص مع مجموعة الخيارات بعد إزالة حروف A/B/C/D الشكلية.
4. قورنت الإجابات المختارة داخل كل مجموعة، ولم تُدمج الحالات المتعارضة بالأغلبية الآلية.
5. روجعت الحالات القريبة دلالياً، والأسئلة ذات الخيارات المكررة، والتعارض بين الشرح ومفتاح الإجابة.
6. اختُبر كل ملف بعد التعديل للتأكد من فريدة النصوص والخيارات، وصحة `correct`، وثبات المعرّفات.

## أمثلة على التصحيحات الموثقة

- قوانين الإصلاح البرلماني الأساسية في بريطانيا في القرن التاسع عشر هي قوانين 1832 و1867/68 و1884، ولذلك صُححت الإجابة إلى **ثلاثة**. المصدر: [House of Commons Library](https://commonslibrary.parliament.uk/research-briefings/rp13-14/).
- عبارة أرسطو تفضّل المستحيل المحتمل على الممكن غير المقنع، ولذلك حُسم ترتيب الفراغين. المصدر: [Aristotle, Poetics — Project Gutenberg](https://www.gutenberg.org/files/1974/1974-h/1974-h.htm).
- في قصيدة Shelley يبحث المتكلم عن الأشباح في الغابة المضاءة بالنجوم، لا في الموضع الذي اختارته بعض النسخ الخاطئة. المصدر: [Poetry Foundation](https://www.poetryfoundation.org/poems/45123/hymn-to-intellectual-beauty).
- صُححت أسئلة `The Eumenides` المتعلقة بصوت Athena الحاسم، وعبارتها عن الزواج، والتحول من الثأر إلى القضاء المدني. المصادر: [MIT Classics](https://classics.mit.edu/Aeschylus/eumendides.html) و[University of Wisconsin Press](https://uwpress.wisc.edu/Books/T/The-Oresteia).
- صُححت أسئلة `Major Barbara` و`Waiting for Godot` التي كانت تنسب أقوالاً أو أفعالاً إلى شخصيات خاطئة، مع فصل مشهد الحذاء في الفصل الأول عن الفصل الثاني. المصادر مفصلة في تقرير أدب السنة الرابعة، ومنها [Project Gutenberg](https://www.gutenberg.org/cache/epub/3790/pg3790-images.html) و[Trinity College Dublin — Samuel Beckett](https://www.tcd.ie/trinitywriters/draft/writers/samuel-beckett/).
- صُححت مفاهيم CLT والطريقة الاستقرائية والعقد الذي ظهر فيه CLT. المصادر: [Cambridge — Communicative Language Teaching Today](https://www.cambridge.org/elt/passages2e/teacher/downloads/articles/Richards_Communicative_Language_Teaching_Today.pdf) و[TeachingEnglish — Inductive approach](https://www.teachingenglish.org.uk/en/article/inductive-approach).
- استُبدل Cerberus بـ Scylla في سؤال المخلوق الذي يقابله Odysseus. المصدر: [Perseus — Odyssey, Book 12](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0218%3Abook%3D12).

## الحالات المتشابهة التي أُبقيت عمداً

بقي زوجان فقط يتجاوزان عتبة التشابه الآلي، وهما ليسا نسختين من السؤال نفسه:

- سؤال ينفي نسبة تعريف القصيدة إلى Aristotle، يقابله سؤال يثبت نسبته إلى Coleridge.
- سؤال عن سمة في عالم مسرح Beckett، يقابله سؤال `NOT` يطلب الاستثناء.

كما روجعت ثمانية تنبيهات آلية أخيرة بين الشرح والإجابة؛ كانت إجابات مركبة مثل `All` أو `A & B`، أو أسئلة صح/خطأ يذكر شرحها العبارة المنفية، وليست مفاتيح خاطئة.

## انتقال تقدم الطالب

- يحل كل معرّف تاريخي لسؤال مدمج إلى المعرّف الحالي.
- إذا كانت للمستخدم إجابتان محفوظتان لنسختين اندمجتا، يحتفظ التطبيق بالإجابة الأحدث حسب `updatedAt`.
- أثبت الاختبار التحويل التالي: 4068 سؤالاً تاريخياً = 3293 سؤالاً حالياً + 765 سؤالاً مدمجاً + 10 أسئلة متقاعدة.
- جرد المعرّفات التاريخية موجود في `docs/question-review/historical-question-inventory.json`.

## التقارير التفصيلية

- `docs/question-review/REVIEW_YEARS_1_3.md`
- `docs/question-review/REVIEW_FOURTH_LITERATURE.md`
- `docs/question-review/REVIEW_FOURTH_THEORY.md`
- ملفات القرارات الآلية الكاملة موجودة داخل `docs/question-review/actions/`.

## إعادة تشغيل الفحص

```text
node scripts/audit-question-bank.mjs
node tests/question-bank-quality.mjs
node tests/question-id-migration.mjs
node tests/smoke-runtime.mjs
```

مراجعة المصادر تقلل الأخطاء الموضوعية، لكنها لا تلغي دور مدرس المادة في الأسئلة التي تعتمد على تفسير مقرر بعينه أو نموذج إجابة جامعي خاص.
