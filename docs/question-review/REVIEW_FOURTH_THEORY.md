# Fourth-year theory question review

## Scope and rule used

Read-only review of the four files below. No file under `work/uni-fixed` was changed. Exact-prompt, strict-option, and near-prompt findings came from `scripts/audit-question-bank.mjs`; conflicts were decided from primary texts, university editions, publishers, or official teaching/testing references rather than majority vote.

- `Fourth Year/Comparative_1.json`
- `Fourth Year/comparative_2.json`
- `Fourth Year/criticism_2.json`
- `Fourth Year/Teaching_Methodologies.json`

The machine-readable companion, `work/review-fourth-theory-actions.json`, contains the same actions plus every strict-group and near-pair ID emitted by the audit.

## Audit summary

| File | Questions | Exact groups | Exact conflicts | Strict groups | Strict conflicts | Near pairs |
|---|---:|---:|---:|---:|---:|---:|
| Fourth Year/Comparative_1.json | 275 | 45 | 1 | 2 | 0 | 0 |
| Fourth Year/comparative_2.json | 452 | 44 | 15 | 35 | 5 | 2 |
| Fourth Year/criticism_2.json | 210 | 38 | 3 | 31 | 2 | 4 |
| Fourth Year/Teaching_Methodologies.json | 326 | 90 | 20 | 73 | 5 | 4 |

Action result: **212 merge groups**, removing **272 duplicate records**; **9 direct answer corrections**; **16 rewrite groups**; **7 invalid-question removal groups**. Strict groups are option-normalized subsets of the prompt duplicates, so they are handled by the merge rows below rather than deleted a second time.

## Direct answer corrections (nonduplicate keepers)

| File | ID | Old answer | Verified answer | Reason / sources |
|---|---|---|---|---|
| Fourth Year/Comparative_1.json | `q_30d6e4f6f6aaae694f0b` | True | **False** (index 1) | Intertextual relations may be transformed or obscured, but a text does not become a completely closed system once it has absorbed another text. [1](https://www.cambridge.org/core/books/cambridge-companion-to-the-greek-and-roman-novel/intertextuality/9C00145A047BFBCCE84EDB5C5A1B9ABF) |
| Fourth Year/comparative_2.json | `q_d74b92e4ec4b46b3396b` | A) True | **False** (index 1) | The Oresteia explicitly stages the movement from blood vengeance to civic law and democratic adjudication, so it is neither apolitical nor amoral. [1](https://uwpress.wisc.edu/Books/T/The-Oresteia) |
| Fourth Year/comparative_2.json | `q_2be1cf0fb056892af918` | A) The wrath of Athena | **The anger of the Furies** (index 2) | After matricide Orestes fears his mother’s curse and the pursuing Furies, not Athena. [1](https://www.law.berkeley.edu/wp-content/uploads/2025/05/toa.pdf) |
| Fourth Year/comparative_2.json | `q_de4a537a838663a0fe2c` | A) She honors men in all things, including marriage | **She honors the male in all things except marriage** (index 2) | Athena explicitly says she honors the male in all things save wedlock. [1](https://classics.mit.edu/Aeschylus/eumendides.html) |
| Fourth Year/comparative_2.json | `q_069ea9f2222c0b4305dd` | A) They symbolize royal honor and status | **They symbolize the king's arrogance and pride** (index 3) | Agamemnon himself identifies walking on the costly purple as arrogance; the cloth is Clytemnestra’s hubris trap. [1](https://sourcebooks.web.fordham.edu/ancient/aeschylus-agamemno.asp) |
| Fourth Year/criticism_2.json | `q_45afe836c4b635061ecb` | sign | **signified** (index 1) | For Saussure, the signifier is the sound-image/form and the signified is the concept; the sign is their combination. [1](https://cup.columbia.edu/book/course-in-general-linguistics/9780231157261/) |
| Fourth Year/criticism_2.json | `q_a89080e49d0d987fa773` | True | **False** (index 1) | Genetic criticism studies the genesis/compositional process of the work, not the “origin of the author.” [1](https://www.pennpress.org/9780812237771/genetic-criticism/) |
| Fourth Year/criticism_2.json | `q_416d8f05aba38e6c5812` | A and C | **More distant from us** (index 1) | This question duplicates the bank’s correctly keyed fuller item q_05568c692963f97052b4; option “A and C” does not even include the required distance answer. [1](https://books.google.com/books/about/Contexts_for_Criticism.html?id=hVSkQgAACAAJ) |
| Fourth Year/Teaching_Methodologies.json | `q_5b1b8a6a7959963d4ad0` | None of the above | **1970s** (index 1) | Communicative Language Teaching was proposed/developed as an approach in the 1970s, not first in the 1980s. [1](https://www.cambridge.org/elt/passages2e/teacher/downloads/articles/Richards_Communicative_Language_Teaching_Today.pdf) |

## KEEP separate despite visual similarity

- **Fourth Year/comparative_2.json · E1** — IDs: `q_be97ca4a5ad751428afe`, `q_8cc00198e0a9ed4f7044`, `q_4882c2902ea64674771b`. Same generic stem, but each depends on a different preceding quotation; rewrite stems, do not merge facts.
- **Fourth Year/comparative_2.json · E14-partition** — IDs: `q_d076e5e2804a189c80d4`. Different option set and a different tested proposition (Sartre is not polytheist).
- **Fourth Year/comparative_2.json · E16-partition** — IDs: `q_0d94b38fc4e195cfed19`. Different option set; tests polytheism in the Oresteia, not the Aeschylus/Sartre school contrast.
- **Fourth Year/comparative_2.json · E19/E42-partition** — IDs: `q_8c480940518d50a5db46`, `q_53e347d57c754a044676`. These refer to the distinct “Someone else will come” quotation and must stay separate from the “Silence, dogs!” quotation after stems are made self-contained.
- **Fourth Year/criticism_2.json · N3** — IDs: `q_5f2a3a2bc4d0c7f857b3`, `q_2c4fe01ca990a3fd89af`. Near-identical quotations deliberately test different attribution: Aristotle=False, Coleridge=True.

## Rewrite before use

| File | IDs | Verified answer / replacement | Why | Sources |
|---|---|---|---|---|
| Fourth Year/comparative_2.json | `q_be97ca4a5ad751428afe`, `q_8cc00198e0a9ed4f7044`, `q_4882c2902ea64674771b` | Agamemnon / Agamemnon / The Flies | The identical generic stem “Quotation taken from?” points to three different preceding quotations. Keep all three facts, but embed the quotation in each stem; do not merge them. |  |
| Fourth Year/comparative_2.json | `q_69f1df6ace6ac56bc8c0`, `q_1a5ba28a9d8b3b4790ba` | Sartrean existentialism rejects all morality. → False ; In The Flies, Electra approaches Jupiter’s statue to mock it with rubbish rather than to perform a sincere libation. → True | Two options are false: Sartre does not reject every possible morality, and Electra brings rubbish/a parody offering rather than ordinary libations. Replace the EXCEPT item with two direct true/false questions. | [1](https://sphinxlibrary.com/Calibre/Jean-Paul%20Sartre/No%20Exit%20and%20Three%20Other%20Plays%20%281329%29/No%20Exit%20and%20Three%20Other%20Plays%20-%20Jean-Paul%20Sartre.pdf) [2](https://plato.stanford.edu/entries/existentialism/) |
| Fourth Year/comparative_2.json | `q_8c480940518d50a5db46`, `q_53e347d57c754a044676` | The Flies / Orestes | These generic stems belong to the distinct “Someone else will come, to set me free” quotation. Embed that quotation; keep separate from the “Silence, dogs!” items. |  |
| Fourth Year/comparative_2.json | `q_89891f412e0a44feaa57`, `q_753e81e833fd950cd988` | A play (modern drama) in three acts | The primary edition identifies The Flies as a play in three acts; “tragicomedy” is not securely established by the supplied choices. Rewrite genre as “a play/drama in three acts.” | [1](https://sphinxlibrary.com/Calibre/Jean-Paul%20Sartre/No%20Exit%20and%20Three%20Other%20Plays%20%281329%29/No%20Exit%20and%20Three%20Other%20Plays%20-%20Jean-Paul%20Sartre.pdf) |
| Fourth Year/comparative_2.json | `q_a29ecf42c121771b7a47` | The Tutor (if the intended contrast is rationalism versus Orestes’s existential commitment) | Athena is not a character in The Flies. If the intended answer is the rationalist Tutor, add Tutor to the options; otherwise remove the item. | [1](https://sphinxlibrary.com/Calibre/Jean-Paul%20Sartre/No%20Exit%20and%20Three%20Other%20Plays%20%281329%29/No%20Exit%20and%20Three%20Other%20Plays%20-%20Jean-Paul%20Sartre.pdf) |
| Fourth Year/comparative_2.json | `q_70eead94901b1f4a9095` | She establishes a jury, casts the decisive vote for Orestes, and reconciles the Furies | Athena institutes the jury, casts the tie-breaking/final vote, and later reconciles the Furies. The current wording “leaves the final vote to Athens” is incomplete. | [1](https://classics.mit.edu/Aeschylus/eumendides.html) [2](https://uwpress.wisc.edu/Books/T/The-Oresteia) |
| Fourth Year/comparative_2.json | `q_af3974fed9cc1868eaf2` | Athena’s female attendants/citizens with torches and offerings | No option matches the final procession: Athena is accompanied by female attendants/citizens carrying robes, torches, and offerings—not a herald plus the ten jurors. | [1](https://www.law.berkeley.edu/wp-content/uploads/2025/05/toa.pdf) |
| Fourth Year/comparative_2.json | `q_15b7ba88fe34c23f2df8` | Clytemnestra (according to the item’s own feedback) | The stem/options are structurally broken and the stored index selects Orestes while the feedback names Clytemnestra. Rewrite cleanly if this course-specific interpretive claim is retained. |  |
| Fourth Year/comparative_2.json | `q_36978b2cf23d90b329a7` | The nature of justice | “Overarching theme” is too broad for a single-answer item. Rewrite to ask about the trilogy’s movement from blood vengeance to civic adjudication. | [1](https://uwpress.wisc.edu/Books/T/The-Oresteia) |
| Fourth Year/criticism_2.json | `q_6ea2abaec1ffa5a72d5e`, `q_49dee4a14567440a0837` | judgement | After merging, replace “In simple words” with a precise stem about criticism as judging/evaluating; “understanding” is otherwise also defensible. |  |
| Fourth Year/Teaching_Methodologies.json | `q_2c2416e1e63eee0c22b8` | Inductive method | Say explicitly that learners infer the grammar rule from the examples. The current phrase “teacher introduces ... rules” sounds deductive. | [1](https://www.teachingenglish.org.uk/en/article/inductive-approach) |
| Fourth Year/Teaching_Methodologies.json | `q_6d97f1f4e71d6cf55de2` | Audio-Lingual Method | Replace “None” with Audio-Lingual Method; imitation and habit-forming drills are core audiolingual features. | [1](https://api.ziyonet.uz/uploads/books/49959/5de6105b1fd90.pdf) |
| Fourth Year/Teaching_Methodologies.json | `q_8da04e635f0d2775789a` | Teaching | Replace “None of the above” with Teaching; ELT expands to English Language Teaching. |  |
| Fourth Year/Teaching_Methodologies.json | `q_83ec4809feb7ca2a72fd` | Meaningful communication / communicative competence | CLT does not inherently designate one of the four skills as always “most emphasized.” Ask instead what it prioritizes. | [1](https://www.cambridge.org/elt/passages2e/teacher/downloads/articles/Richards_Communicative_Language_Teaching_Today.pdf) [2](https://www.teachingenglish.org.uk/professional-development/teachers/teaching-knowledge-database/c/communicative-approach?page=1) |
| Fourth Year/Teaching_Methodologies.json | `q_8e5797dd7bc62b386965` | Organizing learners into pairs or groups for classroom work | No option defines grouping. Add an option describing organizing learners into pairs/small groups for an activity. | [1](https://africa.teachingenglish.org.uk/skills/tips/understanding-different-ways-of-forming-groups) |
| Fourth Year/Teaching_Methodologies.json | `q_169215e23c9ddd5dba2b` | Authentic material | “Easiest for CLT learning” is not a meaningful criterion and “All” includes distractors that are not central CLT resources. Rewrite to ask which material is typically central. | [1](https://www.teachingenglish.org.uk/professional-development/teachers/teaching-knowledge-database/c/communicative-approach?page=1) |

## Remove invalid questions (not merely duplicate copies)

| File | IDs to remove | Reason | Sources |
|---|---|---|---|
| Fourth Year/Comparative_1.json | `q_f29be9f0f6badf3ccab1`, `q_1aeb1b8f317a56deb2ca` | These nonduplicate items make opposite claims about the same vaguely worded “confinement ... to the boundary of language.” Remove both unless the course source is quoted in a rewritten stem. |  |
| Fourth Year/comparative_2.json | `q_29074c78ce0f5d31336c`, `q_b5e3cc09b60b4c81d962`, `q_25ee2ec6964db73bb949` | Exact duplicate E15 is a sweeping, academically indefensible claim that characters in “most Greek tragedies” never decide, are submissive, and are superstitious. No single keeper is reliable. |  |
| Fourth Year/comparative_2.json | `q_4ffdc32dd069fdf74c4b` | The NOT-true item is ambiguous: Sartre is often called a father/leader of existentialism, while gods are literally present in the play despite its atheistic argument. Rewrite from a primary-text fact or remove. | [1](https://sphinxlibrary.com/Calibre/Jean-Paul%20Sartre/No%20Exit%20and%20Three%20Other%20Plays%20%281329%29/No%20Exit%20and%20Three%20Other%20Plays%20-%20Jean-Paul%20Sartre.pdf) [2](https://plato.stanford.edu/entries/existentialism/) |
| Fourth Year/comparative_2.json | `q_75addff4bad505d3d8aa` | There is no defensible single country in which both existentialism and nihilism “originated”; the option itself contains an editorial dispute. Remove. | [1](https://plato.stanford.edu/entries/existentialism/) |
| Fourth Year/comparative_2.json | `q_ca22bea39831e8a0675b` | “Definitely ahead of his time on feminist issues” is an unbounded evaluative claim, not a stable single-answer fact. Replace with a text-specific question or remove. |  |
| Fourth Year/criticism_2.json | `q_b1f042532b3266996f90` | The fill-blank asserts the same disputed proposition that exact group E23 correctly retains as False. None of its alternatives supplies a securely documented criticism of Old Historicism; remove rather than key “simple literary works.” | [1](https://books.google.com/books/about/Contexts_for_Criticism.html?id=hVSkQgAACAAJ) |
| Fourth Year/Teaching_Methodologies.json | `q_eb3698f3dee793fd9680` | No option is correct: Grammar-Translation is not most consistent with Task-Based Learning, TPR, Audio-Lingualism, or the Oral Approach. | [1](https://www.teachingenglish.org.uk/comment/203884) |

## Complete merge/delete actions

Every row is directly executable: retain the keeper, delete all IDs in “Remove,” and set/retain the stated verified answer. The audit label identifies exact (`E`), strict-derived/partitioned, near (`N`), or manual semantic consolidation.

| # | File / audit group | Keeper | Remove | Correct answer | Decision note / sources |
|---:|---|---|---|---|---|
| 1 | Fourth Year/Comparative_1.json · E1 | `q_2a14188c3a89844c7a67` | `q_7ae2e54724bab25f2d7a` | **C) Recognizing differences is essential to identifying similarities** (index 2) |  |
| 2 | Fourth Year/Comparative_1.json · E2 | `q_a346bf40017fd5f66ce5` | `q_a488662d098888468e65` | **C) Mutually dependent analytical approaches** (index 2) |  |
| 3 | Fourth Year/Comparative_1.json · E3 | `q_44c091254f49bb16d350` | `q_80f9eb26bebff5a518dd` | **C) Deliberate distancing from a single national or cultural canon** (index 2) |  |
| 4 | Fourth Year/Comparative_1.json · E4 | `q_6a851c9de73c4a7d0850` | `q_c0f29b762628c5f7a546` | **B) Engage more fully with transnational texts and tropes** (index 1) |  |
| 5 | Fourth Year/Comparative_1.json · E5 | `q_8224ad896aaaf180a34f` | `q_ca1b30653f70c81ef3d8` | **A) A defining feature of the comparatist's identity** (index 0) |  |
| 6 | Fourth Year/Comparative_1.json · E6 | `q_687b292bc3012ab878ed` | `q_fcf9b091c73965cfd612` | **C) It must constantly renew its sense of mission and justification** (index 2) |  |
| 7 | Fourth Year/Comparative_1.json · E7 | `q_2e93bc62f89fd3d4bae6` | `q_56ae4cb21b131ad995b9` | **B) Its position between established disciplines** (index 1) |  |
| 8 | Fourth Year/Comparative_1.json · E8 | `q_2eb9fca6ddb4b1ff3d5c` | `q_8fab3583d9b6e3104d77` | **D) Are innovative but not defined by perpetual disciplinary crisis** (index 3) |  |
| 9 | Fourth Year/Comparative_1.json · E9 | `q_36173edd9ae29071b7cb` | `q_13aa7ac6948d589b66f0` | **C) Interdisciplinary and boundary-crossing nature** (index 2) |  |
| 10 | Fourth Year/Comparative_1.json · E10 | `q_97ca8354a68e73d8df75` | `q_516e6e48fd52ffb8bcaa` | **C) Detailed analysis of language, style, and textual minutiae** (index 2) |  |
| 11 | Fourth Year/Comparative_1.json · E11 | `q_d90a253c428a4df168d9` | `q_06a976514f7053fddc85` | **B) Observation of large-scale patterns across texts or traditions** (index 1) |  |
| 12 | Fourth Year/Comparative_1.json · E12 | `q_147d7bd84eff81239a32` | `q_cbd532c1307f647abab8` | **A) It occurs both naturally and methodologically** (index 0) |  |
| 13 | Fourth Year/Comparative_1.json · E13 | `q_6726d5d3894aab7c0d94` | `q_bf551dd52b4be788a706` | **C) Conceptual and cultural differences embedded in language** (index 2) |  |
| 14 | Fourth Year/Comparative_1.json · E14 | `q_ce869f3e92e332cc65d8` | `q_0d06583984415f6c2564` | **C) The act of comparison is already completed** (index 2) |  |
| 15 | Fourth Year/Comparative_1.json · E15 | `q_6685b9e028e68fd0b579` | `q_2e6d2cafc22da0e44429` | **B) Uncertainty over whether comparison lies in the texts or the method** (index 1) |  |
| 16 | Fourth Year/Comparative_1.json · E16 | `q_22dc4b4c911372e382af` | `q_a706c011801ef9b6c5d5` | **B) A mode of enquiry rather than a rigid practical practice** (index 1) |  |
| 17 | Fourth Year/Comparative_1.json · E17 | `q_10239d1ed94c5ecda4f0` | `q_d2f672f9edcabbe10741` | **C) The discipline continually redefines its own purpose and identity** (index 2) |  |
| 18 | Fourth Year/Comparative_1.json · E18 | `q_a01c4cc8f8aedb62deb2` | `q_0b7c1f11ba5b21abc0a5` | **B) Modernity and Europe** (index 1) |  |
| 19 | Fourth Year/Comparative_1.json · E19 | `q_aa0a3a6732bd6f281097` | `q_6a3aab6be278d443900b` | **C) Accurately reflects how the discipline historically developed** (index 2) |  |
| 20 | Fourth Year/Comparative_1.json · E20 | `q_818121be75db503f8c10` | `q_cb03a32818b78961ec73` | **A) How economic and global forces shape literary comparison and production** (index 0) |  |
| 21 | Fourth Year/Comparative_1.json · E21 | `q_79cce3261ea90b8574c2` | `q_ecf5a2e13eb2e9aef92f` | **C) Write as much for an international as for a national audience** (index 2) |  |
| 22 | Fourth Year/Comparative_1.json · E22 | `q_82ff079cd881f5c46cf4` | `q_4f6329bf8ceeb55949c8` | **D) Affecting which texts are selected for comparison** (index 3) |  |
| 23 | Fourth Year/Comparative_1.json · E23 | `q_2c661930a30e6a596536` | `q_64e7419c1106eca7f938` | **C) The reader's opinions in shaping meaning** (index 2) |  |
| 24 | Fourth Year/Comparative_1.json · E24 | `q_b4976953b06807ac6c6f` | `q_9a1cf1b73a653db801c8` | **A) Literary texts cannot be fully understood on their own** (index 0) |  |
| 25 | Fourth Year/Comparative_1.json · E25 | `q_aa6df0115bf00a41c39a` | `q_9c244ef971edccf3105a` | **C) Take place within inherited patterns, forms, and shared traditions** (index 2) |  |
| 26 | Fourth Year/Comparative_1.json · E26 | `q_571ac959018bd6851a93` | `q_53a1dd89f0947c5233aa` | **D) Understanding depends on relationships and context** (index 3) |  |
| 27 | Fourth Year/Comparative_1.json · E27 | `q_498a50a9100c4f465eaa` | `q_f1cf901cd668da7f6420` | **C) Acts of interpretation tell us about the interpreter as well as the text** (index 2) |  |
| 28 | Fourth Year/Comparative_1.json · E28 | `q_0e71c3d3a105efd2e0ef` | `q_d9d01a0b710586d50d0b` | **C) To look at literature comparatively is to discover more about other literatures and one's own** (index 2) |  |
| 29 | Fourth Year/Comparative_1.json · E29 | `q_0592e762b73b6d26c335` | `q_c46abf975990fdc158e5` | **A) The necessity of comparative literature as a separate discipline** (index 0) |  |
| 30 | Fourth Year/Comparative_1.json · E30 | `q_3341d7e594c58b0bcd3e` | `q_353ff4bc3786eff11ae8` | **A) A need to justify the discipline's distinct purpose and methodology** (index 0) |  |
| 31 | Fourth Year/Comparative_1.json · E31 | `q_ff6942ab735913940b9d` | `q_351b160586c3d67b0490` | **D) A fundamental human instinct** (index 3) |  |
| 32 | Fourth Year/Comparative_1.json · E32 | `q_bd4e194c63a6424fef67` | `q_246d39eccf120c5f2300` | **D) Understand themselves in relation to others** (index 3) |  |
| 33 | Fourth Year/Comparative_1.json · E33 | `q_7373f53ec5ab6f2ea330` | `q_33b57c827ae635456eb7` | **C) Recognition of diversity and multiplicity** (index 2) |  |
| 34 | Fourth Year/Comparative_1.json · E34 | `q_2f9fdadaba057aa31363` | `q_ff14b513817119a9c1da` | **D) Undermined by cultural and ideological bias** (index 3) |  |
| 35 | Fourth Year/Comparative_1.json · E35 | `q_3497febe01708e7b687c` | `q_2784efa6bfce9c48bacd` | **A) Definitions and methods vary according to the comparatist** (index 0) |  |
| 36 | Fourth Year/Comparative_1.json · E36 | `q_792d972fc346d311be91` | `q_b87113fb981d185a7fdf` | **C) Methods reflect collective choices and values** (index 2) |  |
| 37 | Fourth Year/Comparative_1.json · E37 | `q_d2e4007fed7a69deb061` | `q_42e319e047d7f222ef46` | **C) Methodological flexibility and openness** (index 2) |  |
| 38 | Fourth Year/Comparative_1.json · E38 | `q_2761bb6002b472ef67f6` | `q_0cd63594a8926de6f919` | **C) Curiosity, open-mindedness and intellectual ambition** (index 2) |  |
| 39 | Fourth Year/Comparative_1.json · E39 | `q_d0c36e2103fe1c47bcec` | `q_4080d276d1aebac209be` | **D) Its very essence, enabling fresh connections** (index 3) |  |
| 40 | Fourth Year/Comparative_1.json · E40 | `q_06fdaa47b3aa6a2ee0d9` | `q_ca3ce049ac8cc9a14bfd` | **D) Creating dynamic relationships between diverse texts and traditions** (index 3) |  |
| 41 | Fourth Year/Comparative_1.json · E41 | `q_5f9cc3b585776be71fc0` | `q_0be5108e11d0b2be3f7b` | **Comparatists** (index 0) |  |
| 42 | Fourth Year/Comparative_1.json · E42 | `q_fa9c80dc89487a174802` | `q_70a87d20ec197f6799b2` | **A and B** (index 3) |  |
| 43 | Fourth Year/Comparative_1.json · E43 | `q_79feacf0ae3087317d6e` | `q_d8f0c42566b37f77e5a2` | **Actual contact between writers** (index 1) |  |
| 44 | Fourth Year/Comparative_1.json · E44 | `q_bad64d823d9ad06249e4` | `q_01dbb452e93ea7382cf2` | **Writer influenced by a countryman believing it is foreign** (index 1) | Audit answer conflict resolved as shown. |
| 45 | Fourth Year/Comparative_1.json · E45 | `q_9cdd2b5caa48c7af163c` | `q_56b585ace078a80a78da` | **First half of the 20th century** (index 1) |  |
| 46 | Fourth Year/comparative_2.json · E2 | `q_1be17ab5283043003133` | `q_adc0465c2a9e3de80389` | **D) All of the above** (index 3) | Audit answer conflict resolved as shown. |
| 47 | Fourth Year/comparative_2.json · E3 | `q_a2a8cc7ad59b718b793c` | `q_0bb30866fffc0ad0f9c6` | **B. The Chorus** (index 1) |  |
| 48 | Fourth Year/comparative_2.json · E4 | `q_bb6237f34ac3085a42de` | `q_cee4f7925a99aca20415`, `q_d7a3f080ea908d724a4e` | **D. He is on duty on the roof of the palace, waiting for a signal announcing the fall of Troy** (index 3) |  |
| 49 | Fourth Year/comparative_2.json · E5 | `q_a156bcb6808d3091b57e` | `q_fc6faf79115fac625ab7` | **C. He is a god of flies and death** (index 2) | Audit answer conflict resolved as shown. [1](https://sphinxlibrary.com/Calibre/Jean-Paul%20Sartre/No%20Exit%20and%20Three%20Other%20Plays%20%281329%29/No%20Exit%20and%20Three%20Other%20Plays%20-%20Jean-Paul%20Sartre.pdf) |
| 50 | Fourth Year/comparative_2.json · E6 | `q_c4e7c0701f2640d7dacb` | `q_cfed2def695cb4d3a4e4` | **D. Her sacrificial murder by Agamemnon sets the events of the play in motion** (index 3) |  |
| 51 | Fourth Year/comparative_2.json · E7 | `q_6f5dbef68505987c8c34` | `q_8c5015bbf1e3f3f1487a` | **B. Ugly and monstrous** (index 1) |  |
| 52 | Fourth Year/comparative_2.json · E8 | `q_495689b640795a2fcaf9` | `q_da94a38ddc2bb1aff345`, `q_68016097554ce5b020e8` | **c) Helen** (index 2) |  |
| 53 | Fourth Year/comparative_2.json · E9 | `q_3bf370f9040ecd05b6aa` | `q_f5b3f0d922037c321863` | **c) Apollo** (index 2) |  |
| 54 | Fourth Year/comparative_2.json · E10 | `q_a32cf6265a023dd27089` | `q_1d07470096cb18d6ff55` | **c) matricide** (index 2) |  |
| 55 | Fourth Year/comparative_2.json · E11 | `q_c002ce28f1c59446eb21` | `q_973e3104c834fc698ee2`, `q_e64f5c80bd55e1089181` | **b) Athena** (index 1) | Audit answer conflict resolved as shown. [1](https://classics.mit.edu/Aeschylus/eumendides.html) |
| 56 | Fourth Year/comparative_2.json · E12 | `q_d43e9dd09046be782a89` | `q_a3fbbdbb2ad5eaf25c53`, `q_28af2083bd0ed4e36c31` | **a) 1943, Paris** (index 0) |  |
| 57 | Fourth Year/comparative_2.json · E13 | `q_2804a550e2fa9245b065` | `q_5d637bec290f0136ab46` | **c) Jupiter** (index 2) | Audit answer conflict resolved as shown. [1](https://sphinxlibrary.com/Calibre/Jean-Paul%20Sartre/No%20Exit%20and%20Three%20Other%20Plays%20%281329%29/No%20Exit%20and%20Three%20Other%20Plays%20-%20Jean-Paul%20Sartre.pdf) |
| 58 | Fourth Year/comparative_2.json · E17 | `q_3c5f4490f9c19b682fe3` | `q_00c114bcf17de4a6d746` | **b) The elder men of Argos** (index 1) |  |
| 59 | Fourth Year/comparative_2.json · E18 | `q_4cb2dafb09ff8931083b` | `q_3db2cbd07f46da33575d` | **b) Agamemnon** (index 1) |  |
| 60 | Fourth Year/comparative_2.json · E21 | `q_bca019b1825bb6a67c29` | `q_bc06d925e15a07f103a6` | **B- Clytemnestra** (index 1) |  |
| 61 | Fourth Year/comparative_2.json · E22 | `q_4abeef6ff171c3cbf8c2` | `q_333481f85450cbaa5a64` | **C- people of Argos** (index 2) |  |
| 62 | Fourth Year/comparative_2.json · E23 | `q_152352a04a09fc6af6bc` | `q_2f661331dd972109980e` | **b. He wrote 90 plays, and 7 of them have survived.** (index 1) |  |
| 63 | Fourth Year/comparative_2.json · E24 | `q_5aa12cc2ca0208fd4233` | `q_6a7f3ec2d1ae5289412e` | **a. To obtain a favorable wind to carry the Greek fleet to Troy** (index 0) |  |
| 64 | Fourth Year/comparative_2.json · E25 | `q_641895692e68fb8c4b52` | `q_67a6e1242ccad92bc2ce` | **c. A Trojan Princess and Agamemnon's concubine** (index 2) |  |
| 65 | Fourth Year/comparative_2.json · E26 | `q_5b2bdeafc1affe56c318` | `q_bf3b31eb82e3cf0d61a2` | **a. Slave women from the palace** (index 0) |  |
| 66 | Fourth Year/comparative_2.json · E27 | `q_0715add62cec9baa7510` | `q_925b9d1dbbf03517e228` | **b. The god of light, civilization, and learning** (index 1) |  |
| 67 | Fourth Year/comparative_2.json · E28 | `q_90f2321b03967b3868dc` | `q_2b4bb4923ed35b560220` | **C) Jupiter** (index 2) | Audit answer conflict resolved as shown. |
| 68 | Fourth Year/comparative_2.json · E29 | `q_0c1e37e4334e79f49d68` | `q_e5eb91264c43079def06` | **a) A second actor** (index 0) |  |
| 69 | Fourth Year/comparative_2.json · E30 | `q_47d94644c5038de1dda4` | `q_ffd7f821a59b6c599570` | **d) Hatred** (index 3) | Audit answer conflict resolved as shown. [1](https://sphinxlibrary.com/Calibre/Jean-Paul%20Sartre/No%20Exit%20and%20Three%20Other%20Plays%20%281329%29/No%20Exit%20and%20Three%20Other%20Plays%20-%20Jean-Paul%20Sartre.pdf) |
| 70 | Fourth Year/comparative_2.json · E31 | `q_184bc130ca18c25b60a2` | `q_a3f5049e21b5f6a543d2` | **c) His sister's love** (index 2) |  |
| 71 | Fourth Year/comparative_2.json · E32 | `q_cdc1a699b7d152a17f1f` | `q_96317271e9197668f46e` | **d) Human freedom** (index 3) |  |
| 72 | Fourth Year/comparative_2.json · E33 | `q_1dddf89051f084d7adba` | `q_197615b2f452a67f0912` | **a) Underwear** (index 0) | Audit answer conflict resolved as shown. [1](https://sphinxlibrary.com/Calibre/Jean-Paul%20Sartre/No%20Exit%20and%20Three%20Other%20Plays%20%281329%29/No%20Exit%20and%20Three%20Other%20Plays%20-%20Jean-Paul%20Sartre.pdf) |
| 73 | Fourth Year/comparative_2.json · E34 | `q_fda4b28f6dba571b15f2` | `q_af3f98268f62ddfbaf29` | **d) All of the above** (index 3) |  |
| 74 | Fourth Year/comparative_2.json · E35 | `q_1aaeb2f9c6d878a3e618` | `q_493c337f6c0288d4f412` | **c) Seven** (index 2) |  |
| 75 | Fourth Year/comparative_2.json · E36 | `q_1a2d77348947ae4ea055` | `q_8c47fa69be3210c9966b` | **a) The palace at Argos** (index 0) |  |
| 76 | Fourth Year/comparative_2.json · E37 | `q_51512b7ba5dd385af912` | `q_1a8b1a9c37a28b7b987b` | **b) Apollo** (index 1) | Audit answer conflict resolved as shown. [1](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0022%3Atext%3DLibrary%3Abook%3D3%3Achapter%3D12) |
| 77 | Fourth Year/comparative_2.json · E38 | `q_f3682a0f0181dd0e26fe` | `q_b57bcdab4780fca36068` | **c) Cousin** (index 2) |  |
| 78 | Fourth Year/comparative_2.json · E39 | `q_59098903e39722cf9bfc` | `q_60f495da543f499a8a8d` | **b) To explain what was happening so the audience would understand.** (index 1) |  |
| 79 | Fourth Year/comparative_2.json · E41 | `q_d153e1cd16f33dfce6f3` | `q_304621cf3d83cef92198` | **a) Aegisthus** (index 0) |  |
| 80 | Fourth Year/comparative_2.json · E43 | `q_5004ee5c9b6f7ff7f978` | `q_e1895557cab682a5079c` | **B) Electra** (index 1) |  |
| 81 | Fourth Year/comparative_2.json · E44 | `q_15591fd0d3d19db9e3ba` | `q_8f44926eb1bc9e362ecd` | **a) the Furies** (index 0) |  |
| 82 | Fourth Year/criticism_2.json · E1 | `q_9c76f11586b92ead151d` | `q_f94fc15a318be8f5cfc3` | **Rosenblatt** (index 3) |  |
| 83 | Fourth Year/criticism_2.json · E2 | `q_e3aceb49b985616c30b6` | `q_588caa1c98c540dceb8e` | **perceiver's** (index 1) | Audit answer conflict resolved as shown. |
| 84 | Fourth Year/criticism_2.json · E3 | `q_794a67136d38fb8d198b` | `q_6ed236153f0267f20e7d` | **Holland** (index 0) |  |
| 85 | Fourth Year/criticism_2.json · E4 | `q_831246fcda5fd4d02812` | `q_8431fbb591e02c1e5596` | **gaps** (index 2) |  |
| 86 | Fourth Year/criticism_2.json · E5 | `q_196379f5362f550885fa` | `q_07335ef04db1981dd267` | **transactional** (index 1) |  |
| 87 | Fourth Year/criticism_2.json · E6 | `q_ce862ab4551d3dcfdcaa` | `q_646fb17389b32ade55d3` | **the text** (index 0) |  |
| 88 | Fourth Year/criticism_2.json · E7 | `q_aa0ec997ef4a0677cf15` | `q_f55750fecfbcbf7f55b8` | **actual** (index 2) |  |
| 89 | Fourth Year/criticism_2.json · E8 | `q_0fbb871e40b363deb7d1` | `q_3970beb14fa319c0e7d1` | **antihistorical** (index 1) |  |
| 90 | Fourth Year/criticism_2.json · E9 | `q_940a20a8ab3f0f57b569` | `q_83a4c03be93c597dfce2` | **power relations** (index 0) |  |
| 91 | Fourth Year/criticism_2.json · E10 | `q_764a8810866756556c4a` | `q_17f80b4bbc0bd927a649` | **Eagleton** (index 1) |  |
| 92 | Fourth Year/criticism_2.json · E11 | `q_b6230869c0fdf08d5cb3` | `q_4d50bdd2f0a3afe0f486` | **transgressive** (index 1) |  |
| 93 | Fourth Year/criticism_2.json · E12 | `q_56f4047f62083e2dda83` | `q_6cc8539c13d5b17959d7` | **The pastness of the past** (index 2) |  |
| 94 | Fourth Year/criticism_2.json · E13 | `q_5d72997ee892c1abeaf2` | `q_f90b399df0ed33dc7f75`, `q_30296426a04c8a8a62d9` | **True** (index 0) |  |
| 95 | Fourth Year/criticism_2.json · E14 | `q_7798ef85b3d946160806` | `q_5fbc739e18226b5f0d51` | **Psychological** (index 2) |  |
| 96 | Fourth Year/criticism_2.json · E15 | `q_69962cb0c018e9fe3221` | `q_022fda636b8c89021093`, `q_6de3fabb541f7d199bbb` | **False** (index 1) |  |
| 97 | Fourth Year/criticism_2.json · E16 | `q_8a5ec7a8d967d0c66182` | `q_9b5a9be5a22f0f1dc860` | **Formalists** (index 0) |  |
| 98 | Fourth Year/criticism_2.json · E17 | `q_d32862fc9208bd3369fe` | `q_32acf44cce7a10fb6ac9`, `q_4ca00967fb5738e21154` | **Formalists** (index 0) |  |
| 99 | Fourth Year/criticism_2.json · E18 | `q_2c4fe01ca990a3fd89af` | `q_82701373c49caac84170` | **True** (index 0) |  |
| 100 | Fourth Year/criticism_2.json · E19 | `q_a5ab3a746cb3038422c9` | `q_3ab4adfceb6ab62f837b` | **Formalists** (index 0) |  |
| 101 | Fourth Year/criticism_2.json · E20 | `q_8cfa331a6ef8224d4cda` | `q_05c27f134c609e99e5b3` | **Formalists** (index 0) |  |
| 102 | Fourth Year/criticism_2.json · E21 | `q_542d499f365b618ea872` | `q_19561c2a2438b5b555a3` | **Intertextualists** (index 2) |  |
| 103 | Fourth Year/criticism_2.json · E22 | `q_dc5742282a5bc347d158` | `q_1c0f669e4880745d8e30` | **Chronological** (index 0) |  |
| 104 | Fourth Year/criticism_2.json · E23 | `q_71905017655788e4fb6d` | `q_faaf530106b18927b70f` | **False** (index 1) | The bank itself correctly assigns the “ignores simple works” criticism to Formalists; keeping False resolves the exact-prompt contradiction. Audit answer conflict resolved as shown. [1](https://books.google.com/books/about/Contexts_for_Criticism.html?id=hVSkQgAACAAJ) |
| 105 | Fourth Year/criticism_2.json · E24 | `q_1421fc951029f7e4a968` | `q_6c26aab08ab82485141c` | **Richards** (index 1) |  |
| 106 | Fourth Year/criticism_2.json · E25 | `q_1ffb4b8141eadedbb21c` | `q_f2df20d852206573ebe0`, `q_193c49e4fe9c550fa8df` | **Himself** (index 1) |  |
| 107 | Fourth Year/criticism_2.json · E26 | `q_2a22e7b9edcbc48ba3d4` | `q_2894fcba4098c1121282` | **True** (index 0) |  |
| 108 | Fourth Year/criticism_2.json · E27 | `q_62f28acdd0f0f1f6034d` | `q_21aff43b6dac1fa51629` | **Formal** (index 1) |  |
| 109 | Fourth Year/criticism_2.json · E28 | `q_6ea2abaec1ffa5a72d5e` | `q_49dee4a14567440a0837` | **judgement** (index 1) | Keep the judgement answer, but rewrite the stem to ask about criticism as judging/evaluation; “in simple words” is otherwise too broad. Audit answer conflict resolved as shown. |
| 110 | Fourth Year/criticism_2.json · E29 | `q_e34af29668d2469f82fd` | `q_13e012e8eff143f3086c` | **Hirsch** (index 0) |  |
| 111 | Fourth Year/criticism_2.json · E30 | `q_68db666da784eaedaa5c` | `q_e732d4a6c458f31ae950` | **New historicism** (index 0) |  |
| 112 | Fourth Year/criticism_2.json · E31 | `q_e38b737ae01f12f6f0eb` | `q_639f86ab754ca8dda430`, `q_ca83c54bfb0cc24f84e1` | **Speaker's** (index 2) |  |
| 113 | Fourth Year/criticism_2.json · E32 | `q_99d7c580c7fb95a4f642` | `q_07646e0cf4bc4c6070de` | **Language** (index 2) |  |
| 114 | Fourth Year/criticism_2.json · E33 | `q_54ac9a1f4cdecc608743` | `q_5cd9e48a2cf8969490be` | **Greenblatt** (index 2) |  |
| 115 | Fourth Year/criticism_2.json · E34 | `q_b3350082f833e8b3df1c` | `q_73070b1f46da100a0c88` | **Ontological** (index 2) |  |
| 116 | Fourth Year/criticism_2.json · E35 | `q_a28ab3e7059f448aed45` | `q_b4dffdd15c4db70a437a` | **False** (index 1) |  |
| 117 | Fourth Year/criticism_2.json · E36 | `q_3ab56da08b4034b4a5b4` | `q_2068e5a14e5369b083ac` | **Synchronic** (index 1) |  |
| 118 | Fourth Year/criticism_2.json · E37 | `q_674760678fa664a6ea4c` | `q_39c36d758027f0a25c49` | **Fowler** (index 1) |  |
| 119 | Fourth Year/criticism_2.json · E38 | `q_5ac37dfc2701cc13063a` | `q_03c138914af2679828db` | **Watson** (index 0) |  |
| 120 | Fourth Year/Teaching_Methodologies.json · E1 | `q_c909c1e239b5245b9fc3` | `26`, `q_f3a0777b2b5f22d003c9` | **English for Specific Purposes** (index 1) |  |
| 121 | Fourth Year/Teaching_Methodologies.json · E2 | `q_ce3582f2ec057943c70d` | `q_470014ae53b477e928fe`, `q_60ab0b944b28aa0a7bd7` | **B) To make suggestions and help students improve** (index 1) |  |
| 122 | Fourth Year/Teaching_Methodologies.json · E3 | `q_0cacf0228d965bc583ff` | `q_dd0b5b668eb4a2f5804b`, `q_23eaf28ae96de199c1c5` | **D) both B & C** (index 3) |  |
| 123 | Fourth Year/Teaching_Methodologies.json · E6 | `q_012cab502720593323a2` | `q_64dd971c1e8ad780eea6` | **B) Using mime** (index 1) | Audit answer conflict resolved as shown. [1](https://api.ziyonet.uz/uploads/books/49959/5de6105b1fd90.pdf) |
| 124 | Fourth Year/Teaching_Methodologies.json · E7 | `q_b06be9594eccec8d7275` | `q_5f750fba529a6671326b`, `q_7a97b90d72345cfe6972`, `q_c39d43ec24527437b902` | **Showing the size of an object** (index 2) | Audit answer conflict resolved as shown. [1](https://api.ziyonet.uz/uploads/books/49959/5de6105b1fd90.pdf) |
| 125 | Fourth Year/Teaching_Methodologies.json · E8 | `q_3343a77c5b672371723d` | `q_6ba834728f29c4f55403`, `q_400f883ebc5ae2c04bc8` | **C) To help students develop their vocabulary** (index 2) | Audit answer conflict resolved as shown. [1](https://api.ziyonet.uz/uploads/books/49959/5de6105b1fd90.pdf) |
| 126 | Fourth Year/Teaching_Methodologies.json · E9 | `q_88de6dfe69576ff4ae78` | `q_42088e76d66f796f0219` | **B) Excitement** (index 1) |  |
| 127 | Fourth Year/Teaching_Methodologies.json · E10 | `q_cf54538c5d509ed101b1` | `q_8bb6d2bb67575e15b8e9`, `q_438cb992df74195b175d` | **C) A state of emotional exhaustion and lack of motivation** (index 2) | Audit answer conflict resolved as shown. |
| 128 | Fourth Year/Teaching_Methodologies.json · E11 | `q_8df189c2b125cfc409f3` | `q_4b500bcb61b1218d947d`, `q_9e2e35cf7b4c8ecd277f` | **D) Mexico** (index 3) |  |
| 129 | Fourth Year/Teaching_Methodologies.json · E12 | `q_85a29a12539363d4f530` | `q_af918ea9b03dd83e8dc0`, `q_ce84a06210135b3fe304` | **B) Based on grammar, vocabulary, and language skills** (index 1) | Audit answer conflict resolved as shown. |
| 130 | Fourth Year/Teaching_Methodologies.json · E13 | `q_ac7595131453885886b2` | `q_6b5646f70025c2af8bc5`, `q_9dd845e9792441f9f656` | **D) The native language should not be used in the classroom.** (index 3) |  |
| 131 | Fourth Year/Teaching_Methodologies.json · E14 | `q_8953c945cd27a8183e2c` | `q_07c450be07c0db6c28a4`, `q_dfc8652a4782a9ef9114` | **D) Meaning over form** (index 3) |  |
| 132 | Fourth Year/Teaching_Methodologies.json · E15 | `q_2c2416e1e63eee0c22b8` | `q_ad18d5495b5366be6b5d`, `q_fccc10ae936902b58d6d` | **Inductive method** (index 0) | Examples lead to induction only when learners infer the rule; rewrite the scenario to say this explicitly. Audit answer conflict resolved as shown. [1](https://www.teachingenglish.org.uk/en/article/inductive-approach) |
| 133 | Fourth Year/Teaching_Methodologies.json · E17 | `q_e9dff339ed09df27f07c` | `q_e38959ad80794cd7434e`, `q_bd8a5d0275e4e4111637` | **C) Link language with real-world tasks** (index 2) |  |
| 134 | Fourth Year/Teaching_Methodologies.json · E18 | `q_a60398311d17061d63bc` | `q_fca82ae01d71458a81a7`, `q_d01bfebdabb7b01d10e6` | **C) Speaking English students can understand** (index 2) |  |
| 135 | Fourth Year/Teaching_Methodologies.json · E19 | `q_249959b07eefca7acc63` | `q_f9bfc8b4b6527d0c6785` | **B) Works one-on-one with a student** (index 1) |  |
| 136 | Fourth Year/Teaching_Methodologies.json · E20 | `q_712d0d4f65ccb31d46e4` | `q_391da703c929ec56025f` | **D) Past** (index 3) |  |
| 137 | Fourth Year/Teaching_Methodologies.json · E21 | `q_85fb9e3e5dd7107c2f5a` | `q_6a1773f59e14ab06d345`, `q_a1bcd052d1dc599839fd` | **C) Common European Framework of Reference** (index 2) |  |
| 138 | Fourth Year/Teaching_Methodologies.json · E22 | `q_8a8848ed74155df9ef9a` | `q_99f9b38495bf55042722` | **A) making the test instructions clear** (index 0) |  |
| 139 | Fourth Year/Teaching_Methodologies.json · E27 | `q_c8883a929aa2b3ce633b` | `q_0a27c8b358c4a56b1e0c` | **A) measure a student's progress over time** (index 0) |  |
| 140 | Fourth Year/Teaching_Methodologies.json · E28 | `q_46bce9be0d0ac1bb58f5` | `q_989219c447608dcd77e4`, `q_6b1ac73467a8adff1fa5` | **D) Both A & C** (index 3) | Audit answer conflict resolved as shown. |
| 141 | Fourth Year/Teaching_Methodologies.json · E30 | `q_21bbd3aa633ea57b8600` | `q_74cb00f35ae317b4dcbd` | **C) foreign** (index 2) |  |
| 142 | Fourth Year/Teaching_Methodologies.json · E31 | `q_b15acfa709703cc511f0` | `q_6c3321347848cbd8a93f`, `q_04fe9c41a9f42528f20e` | **C) English for academic purposes** (index 2) |  |
| 143 | Fourth Year/Teaching_Methodologies.json · E32 | `q_f531308d0c22a4f60ba4` | `q_1a16220fba59f874e322` | **A) imitation** (index 0) | Audit answer conflict resolved as shown. [1](https://api.ziyonet.uz/uploads/books/49959/5de6105b1fd90.pdf) |
| 144 | Fourth Year/Teaching_Methodologies.json · E33 | `q_24299cbe7eea58f5d9da` | `q_2cfacd30aebb182fcf22` | **B) reading and writing** (index 1) |  |
| 145 | Fourth Year/Teaching_Methodologies.json · E35 | `q_76ecfd87d47fde3f0dbb` | `q_605d13eff4fc3f31482d`, `q_5429058c899e5778f92b` | **B) meaningful interaction** (index 1) |  |
| 146 | Fourth Year/Teaching_Methodologies.json · E36 | `q_4f721fdf7afae78f3c4b` | `q_c1e5bc7101071b69be31` | **A) CLT** (index 0) |  |
| 147 | Fourth Year/Teaching_Methodologies.json · E37 | `q_35f77f6aab8435f69c73` | `q_8f6d432b4066f00a042c` | **A) TPR** (index 0) |  |
| 148 | Fourth Year/Teaching_Methodologies.json · E38 | `q_fd8f46c7b57fbe224699` | `q_db1b54c163835df7dbf3` | **B) CLT** (index 1) |  |
| 149 | Fourth Year/Teaching_Methodologies.json · E39 | `q_4fc27279bb62a030ea1a` | `q_8540ce5785cf0587c688` | **D) Communicative Language Teaching** (index 3) |  |
| 150 | Fourth Year/Teaching_Methodologies.json · E40 | `q_f10cbb3305ba75cbf5b5` | `q_e37b3c0cc7470ee2fc04` | **D) TPR** (index 3) |  |
| 151 | Fourth Year/Teaching_Methodologies.json · E43 | `q_d1d08641dfb1b7f08c28` | `q_821310cac1672ee60dd4` | **C) technique** (index 2) |  |
| 152 | Fourth Year/Teaching_Methodologies.json · E44 | `q_c98da38e09ee9c4ee951` | `q_416c1fdea55a241e27ca` | **C) intrinsic motivation** (index 2) |  |
| 153 | Fourth Year/Teaching_Methodologies.json · E45 | `q_2141f07e1ff41a185fea` | `q_d53c0ae68a4d12aa53ea` | **C) Playing video games with your best friend because you enjoy spending time together** (index 2) |  |
| 154 | Fourth Year/Teaching_Methodologies.json · E46 | `q_94e9ed8a9c1d23c0501d` | `q_cf3d8683923388f33738`, `q_a031f8cc447d479e2ef9`, `q_82a8126bf72ac2c28018` | **Technique** (index 0) | Audit answer conflict resolved as shown. [1](https://webhome.auburn.edu/~nunnath/engl6240/method.html) |
| 155 | Fourth Year/Teaching_Methodologies.json · E48 | `q_5cb959b43a03620170dd` | `q_578b2313cbe0aefe9de6` | **C) rapport** (index 2) |  |
| 156 | Fourth Year/Teaching_Methodologies.json · E49 | `q_e4de699c86ac42cf5c22` | `q_b7cb3f982bdadb2a16d7` | **A) True** (index 0) |  |
| 157 | Fourth Year/Teaching_Methodologies.json · E50 | `q_0876035c4c1f055066ff` | `q_953347aa17c6e4aa0d15` | **B) False** (index 1) |  |
| 158 | Fourth Year/Teaching_Methodologies.json · E51 | `q_858460ccdb63df790165` | `q_458d0eabb4dc7b41a792` | **B) False** (index 1) |  |
| 159 | Fourth Year/Teaching_Methodologies.json · E52 | `q_65f6515678b503dd2442` | `q_bf563cd22c442acaa916` | **C) English Language Teaching** (index 2) |  |
| 160 | Fourth Year/Teaching_Methodologies.json · E53 | `q_c61d57d25551a414044a` | `q_c768a56d38cc8d432a7a` | **D) Talking** (index 3) |  |
| 161 | Fourth Year/Teaching_Methodologies.json · E54 | `q_a0d510331d9eda95e2d3` | `q_1d1b8b276133810c5b3e` | **B) practice** (index 1) |  |
| 162 | Fourth Year/Teaching_Methodologies.json · E55 | `q_759f5810d456b42d08ec` | `q_5e602858ced560b95933` | **A) The relationship between teachers and students** (index 0) |  |
| 163 | Fourth Year/Teaching_Methodologies.json · E56 | `q_df3351b35f3cd944595b` | `q_ea438881f2188ade753e` | **B) Language teaching should give importance to writing rather than speaking** (index 1) |  |
| 164 | Fourth Year/Teaching_Methodologies.json · E57 | `q_bdb49f470ea83dc3307a` | `q_ef5e75a6be8089e0dd63` | **C) Interactive** (index 2) |  |
| 165 | Fourth Year/Teaching_Methodologies.json · E58 | `q_53e85414d48ac34520d6` | `q_b6b87acc27e4e406166b` | **C) autonomy** (index 2) |  |
| 166 | Fourth Year/Teaching_Methodologies.json · E59 | `q_48d4ed79e31fa5337df4` | `q_2772e0a3f47e827fc491` | **C. Deciding what kind of English to teach and how** (index 2) |  |
| 167 | Fourth Year/Teaching_Methodologies.json · E60 | `q_5f66cb70990cb99f32b8` | `q_3841701fcc1c95911d80` | **C. The national language and mother tongue** (index 2) |  |
| 168 | Fourth Year/Teaching_Methodologies.json · E61 | `q_7e3a6341c47bd28e295d` | `q_34efb231200a2751e00e` | **D. Expanding circle** (index 3) |  |
| 169 | Fourth Year/Teaching_Methodologies.json · E62 | `q_10f53dd7a2d86502d137` | `q_0abe3795a32fa4d02eb2` | **D. A shared communication language among non-native speakers** (index 3) |  |
| 170 | Fourth Year/Teaching_Methodologies.json · E63 | `q_c4ca4f7b0b7961680332` | `q_03e1e19badebbf7a446a` | **C. In an English-speaking country** (index 2) |  |
| 171 | Fourth Year/Teaching_Methodologies.json · E64 | `q_9b30a73f3feea205beb8` | `q_b71374fb6a42564bf104` | **C. Grammar and vocabulary** (index 2) |  |
| 172 | Fourth Year/Teaching_Methodologies.json · E65 | `q_2f0b739e1dca1b8b7bed` | `q_19c9a4e00c8cce4cbfb8` | **A. Identify learners' goals** (index 0) |  |
| 173 | Fourth Year/Teaching_Methodologies.json · E66 | `q_bf5be03fd551c3cb094d` | `q_397cebde63046a5463c6` | **C. ESP** (index 2) |  |
| 174 | Fourth Year/Teaching_Methodologies.json · E67 | `q_6ac585d4b7fe517a2a52` | `q_3e4b47bfcc70350b800e` | **B. Writing emails** (index 1) |  |
| 175 | Fourth Year/Teaching_Methodologies.json · E68 | `q_b1963ca0b19e8ea67cdb` | `q_5c538e67e3fad73a3dc2` | **C. The teacher as an expert person** (index 2) | Audit answer conflict resolved as shown. |
| 176 | Fourth Year/Teaching_Methodologies.json · E69 | `q_b39a5abad852cea325fd` | `q_28d3cd3dc36b66b71b41` | **A. Facilitate rather than giving instructions** (index 0) |  |
| 177 | Fourth Year/Teaching_Methodologies.json · E70 | `q_2d5c6f9e28ba4e60e52e` | `q_f401d78d7457d05acc30` | **D. Prompters** (index 3) |  |
| 178 | Fourth Year/Teaching_Methodologies.json · E71 | `q_b61344d4c5575aecd9e5` | `q_e112c0162174bc6afdfe` | **B. Giving clear language examples for students to imitate** (index 1) |  |
| 179 | Fourth Year/Teaching_Methodologies.json · E72 | `q_ad3113489245b913e3f1` | `q_775016f6c9e73104236b` | **Mime** (index 2) | Audit answer conflict resolved as shown. [1](https://api.ziyonet.uz/uploads/books/49959/5de6105b1fd90.pdf) |
| 180 | Fourth Year/Teaching_Methodologies.json · E73 | `q_11b1cdd3ac738ad92784` | `q_c8dbc593d516357b640f` | **Choral repetition** (index 2) | Audit answer conflict resolved as shown. [1](https://api.ziyonet.uz/uploads/books/49959/5de6105b1fd90.pdf) |
| 181 | Fourth Year/Teaching_Methodologies.json · E74 | `q_b3441907f350e0c46702` | `q_8ae10aee9d6720129c83` | **B. Measure how students have progressed through a course** (index 1) |  |
| 182 | Fourth Year/Teaching_Methodologies.json · E75 | `q_8c0a0032bc0406da2fa6` | `q_03feca5b8960ab3e5e57` | **D. Both B&C** (index 3) |  |
| 183 | Fourth Year/Teaching_Methodologies.json · E76 | `q_94efc382456527a0b625` | `q_fe2bc891adc7b769f84e` | **A. It involves physical movement and activity** (index 0) |  |
| 184 | Fourth Year/Teaching_Methodologies.json · E78 | `q_49b4e4546adf66d8bf49` | `q_bd36b83390bd953509d5` | **Authentic material** (index 0) | Audit answer conflict resolved as shown. [1](https://www.teachingenglish.org.uk/professional-development/teachers/teaching-knowledge-database/c/communicative-approach?page=1) |
| 185 | Fourth Year/Teaching_Methodologies.json · E79 | `q_3dbf54035c468691059b` | `q_dd1000596b18edc4fe13` | **B. Task-Based Learning** (index 1) |  |
| 186 | Fourth Year/Teaching_Methodologies.json · E80 | `q_72f48cf1eac88cb1c7e1` | `q_4b83123943763123ad1f`, `q_f49d5f760c3e0e789189`, `q_9548d9c344fd3d6e449b` | **A. May neglect accuracy for fluency** (index 0) | Audit answer conflict resolved as shown. |
| 187 | Fourth Year/Teaching_Methodologies.json · E81 | `q_4662cb6e9df8168c969b` | `q_2a89e47fd9cf50283d0f` | **B. Audio lingual method** (index 1) |  |
| 188 | Fourth Year/Teaching_Methodologies.json · E82 | `q_5af52c769a5869dd4f3d` | `q_f315f80c31233e821203` | **Reading and writing** (index 2) |  |
| 189 | Fourth Year/comparative_2.json · E14-partition-Marathon | `q_2cf7863600a0e8fbee7e` | `q_652d9f51436ec011664a`, `q_46f662ad4c34fb02a8e6` | **The battle of Marathon was between the Greeks and the Trojans** (index 2) | This is the false statement: Marathon was fought by Greeks against Persia, not Troy. |
| 190 | Fourth Year/comparative_2.json · E16-partition-schools | `q_89b3d99c55adea2f9635` | `q_4f9482a8aef034d70cf9` | **While in Aeschylus we have paganism, in Sartre we have Existentialism** (index 2) |  |
| 191 | Fourth Year/comparative_2.json · E19-partition-Agamemnon-quotation | `q_976d49aa492f741f25e7` | `q_38010f7061d00c6ccaef`, `q_30be56151b2ac4bc70c0` | **Agamemnon** (index 0) |  |
| 192 | Fourth Year/comparative_2.json · E19-partition-Flies-silence-quotation | `q_1cfcb2dfa1b5d6e84365` | `q_d3a75b96eef61563b9a5` | **The Flies** (index 3) |  |
| 193 | Fourth Year/comparative_2.json · E20-plus-semantic-duplicates | `q_0521ccdaf38b86d9f6b0` | `q_46dbe98bffdceb36fd02`, `q_ccc519d17adac01abbbd`, `q_75311688f45aa6aa1ffc` | **Sent the flies to Argos** (index 2) | [1](https://sphinxlibrary.com/Calibre/Jean-Paul%20Sartre/No%20Exit%20and%20Three%20Other%20Plays%20%281329%29/No%20Exit%20and%20Three%20Other%20Plays%20-%20Jean-Paul%20Sartre.pdf) |
| 194 | Fourth Year/comparative_2.json · E40-plus-N1 | `q_b7cb3fe75f2441eabbc3` | `q_cb3a6d306f20844c9f63`, `q_0bf15fdc54cdc17f5157` | **The Chorus** (index 2) |  |
| 195 | Fourth Year/comparative_2.json · E42-partition-silence-addressee | `q_dc0bcca33b30a2d9589e` | `q_0b219a75b0ae35e0e8b8` | **The people of Argos** (index 0) |  |
| 196 | Fourth Year/comparative_2.json · N2-semantic | `q_cbc9f5367980af5635d8` | `q_3df89264124b94972921` | **Thyestes** (index 1) |  |
| 197 | Fourth Year/comparative_2.json · manual-semantic-Her-land | `q_b46c1fdbaefd272dd1e9` | `q_1977e276bd44a531ddbb` | **Sparta** (index 2) | [1](https://sourcebooks.web.fordham.edu/ancient/aeschylus-agamemno.asp) |
| 198 | Fourth Year/criticism_2.json · N1 | `q_e65cea7a21b0c847bebe` | `q_ccbfc838bf585a8be5fa` | **creators** (index 2) |  |
| 199 | Fourth Year/criticism_2.json · N2 | `q_a085168d8c5b864c3d08` | `q_65e5b6da928e20a6ceb3` | **historical** (index 2) |  |
| 200 | Fourth Year/criticism_2.json · N4 | `q_10b8c4ede992f74e572e` | `q_0e280fe4d67ddb1facf3` | **Denotation** (index 0) |  |
| 201 | Fourth Year/Teaching_Methodologies.json · E16-plus-near-scenario | `q_7ca45f1bb263501d37c6` | `q_1788e0dd0bca3d721c88`, `q_5bcf0068258bdcce3969`, `q_91399bb501ca25330c85` | **CLT** (index 0) | [1](https://www.cambridge.org/elt/passages2e/teacher/downloads/articles/Richards_Communicative_Language_Teaching_Today.pdf) [2](https://www.teachingenglish.org.uk/professional-development/teachers/teaching-knowledge-database/c/communicative-approach?page=1) |
| 202 | Fourth Year/Teaching_Methodologies.json · E4+E41+E88 | `q_50f43d821c22a12f3e04` | `q_84b76e589206a7c48f5c`, `q_e696c800e524bbc2ea67`, `q_58871fe47931750fb377`, `q_45535106df283c12ed24`, `q_cde041a915b7011ded46` | **Tutor** (index 0) |  |
| 203 | Fourth Year/Teaching_Methodologies.json · E5+E89 | `q_25c6f2a9534979e3abd3` | `q_c2bf7741fd275350806b`, `q_8b0f557ae803f52763fa`, `q_a1776c375ef8c7b95f11` | **Comprehensible** (index 3) |  |
| 204 | Fourth Year/Teaching_Methodologies.json · E23+E83+N2 | `q_2d55792c33d8a3fffbde` | `q_812fa9e7241caa74850f`, `q_3fd8a226d4e449bb140d`, `q_36da4912d22fb9fc5520` | **Validity** (index 1) |  |
| 205 | Fourth Year/Teaching_Methodologies.json · E24-plus-semantic | `q_dc9977f7e9ac355b8236` | `q_19e66125bef25053ecfd`, `q_ca44f510f0b3a3c93ff0` | **Construct validity** (index 0) | [1](https://www.es.ets.org/content/dam/ets-org/pdfs/about/standards-quality-fairness.pdf) |
| 206 | Fourth Year/Teaching_Methodologies.json · E25+E84 | `q_5ae2618f007335dcd13a` | `q_7d5ed8a720b0f5267020`, `q_d7ad76311b71bf3af360`, `q_3ca3dd0f821ce7bb8b4a` | **Determine which class or level a student should be in** (index 1) |  |
| 207 | Fourth Year/Teaching_Methodologies.json · E26+E85 | `q_0aa8cfb61d4ec283777a` | `q_40807af9a6c739f57037`, `q_2254289632af189d59b4`, `q_4aba6b8415d40465c4a8` | **Achievement test** (index 2) |  |
| 208 | Fourth Year/Teaching_Methodologies.json · E29+E87 | `q_4b1757342ad3df102fb6` | `q_e6eb56a2128fce368830`, `q_e420a81a2fe80e268a79`, `q_5c9d0d74824283950490`, `q_7fd786c353e6293b8d6c` | **Controller** (index 1) | [1](https://api.ziyonet.uz/uploads/books/49959/5de6105b1fd90.pdf) |
| 209 | Fourth Year/Teaching_Methodologies.json · E34+N3 | `q_db3627b7b2f0c4f9c749` | `q_3957a99c0782b0137d92`, `q_d632f2143e862d716313` | **Direct Method** (index 1) | [1](https://www.teachingenglish.org.uk/comment/203884) |
| 210 | Fourth Year/Teaching_Methodologies.json · E42+N1 | `q_2ece247ceeb8b8511c29` | `q_583921266fd16dce5897`, `q_3c77f9585ca9f645460a` | **Their teacher** (index 0) |  |
| 211 | Fourth Year/Teaching_Methodologies.json · E47+E86+N4 | `q_2fbed126574bf9402a90` | `q_fa49af2b8241002be8cf`, `q_8559dc5aa137d94a1794`, `q_4ca41fa3f5d2baa1199b` | **Approach** (index 2) |  |
| 212 | Fourth Year/Teaching_Methodologies.json · E77+E90 | `q_6079592926410a4fa1e3` | `q_9f7eabe9ee5a7af65914`, `q_3584da764a0c3b21412c`, `q_dbda501a20c8ae48585c` | **Role play** (index 2) | [1](https://www.teachingenglish.org.uk/professional-development/teachers/teaching-knowledge-database/c/communicative-approach?page=1) |

## High-confidence source set

- Primary/literary texts: [Sartre, *The Flies*](https://sphinxlibrary.com/Calibre/Jean-Paul%20Sartre/No%20Exit%20and%20Three%20Other%20Plays%20%281329%29/No%20Exit%20and%20Three%20Other%20Plays%20-%20Jean-Paul%20Sartre.pdf); [MIT, *Eumenides*](https://classics.mit.edu/Aeschylus/eumendides.html); [Berkeley Law, *The Oresteia*](https://www.law.berkeley.edu/wp-content/uploads/2025/05/toa.pdf); [Fordham, *Agamemnon*](https://sourcebooks.web.fordham.edu/ancient/aeschylus-agamemno.asp); [Perseus, Apollodorus](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0022%3Atext%3DLibrary%3Abook%3D3%3Achapter%3D12).
- Literary/theory references: [University of Wisconsin Press, *The Oresteia*](https://uwpress.wisc.edu/Books/T/The-Oresteia); [Stanford Encyclopedia of Philosophy, Existentialism](https://plato.stanford.edu/entries/existentialism/); [Cambridge, Intertextuality](https://www.cambridge.org/core/books/cambridge-companion-to-the-greek-and-roman-novel/intertextuality/9C00145A047BFBCCE84EDB5C5A1B9ABF); [Penn Press, Genetic Criticism](https://www.pennpress.org/9780812237771/genetic-criticism/); [Columbia UP, Saussure](https://cup.columbia.edu/book/course-in-general-linguistics/9780231157261/).
- Teaching/testing references: [Cambridge, CLT Today](https://www.cambridge.org/elt/passages2e/teacher/downloads/articles/Richards_Communicative_Language_Teaching_Today.pdf); [British Council, Communicative Approach](https://www.teachingenglish.org.uk/professional-development/teachers/teaching-knowledge-database/c/communicative-approach?page=1); [British Council, Inductive Approach](https://www.teachingenglish.org.uk/en/article/inductive-approach); [British Council, Grouping](https://africa.teachingenglish.org.uk/skills/tips/understanding-different-ways-of-forming-groups); [ETS Standards](https://www.es.ets.org/content/dam/ets-org/pdfs/about/standards-quality-fairness.pdf); [Harmer teaching-aid chapter](https://api.ziyonet.uz/uploads/books/49959/5de6105b1fd90.pdf).

