# Fourth-year literature question-bank review

Actionable review only: **no file under `work/uni-fixed` was modified**. Correct indices in the JSON companion are zero-based.

## Audit summary

| File | Questions | Exact groups | Exact conflicts | Strict groups | Strict conflicts | Near pairs |
|---|---:|---:|---:|---:|---:|---:|
| Fourth Year/america_2.json | 105 | 0 | 0 | 0 | 0 | 0 |
| Fourth Year/american_1.json | 310 | 11 | 0 | 11 | 0 | 0 |
| Fourth Year/Modern_Drama.json | 360 | 77 | 9 | 75 | 7 | 4 |
| Fourth Year/modern_prose.json | 139 | 1 | 0 | 1 | 0 | 0 |
| Fourth Year/poetry4.json | 198 | 1 | 1 | 0 | 0 | 0 |
| Fourth Year/world_lit.json | 134 | 4 | 0 | 3 | 0 | 0 |

Recommended result: **95 merge groups**, removing **127 repeated records**; **10 nonduplicate key corrections**; **8 targeted rewrites**; no standalone deletion beyond duplicate removal.

## Duplicate merge/delete actions

For every row, keep the keeper ID, delete every ID in Remove, and set/retain the stated verified answer. Rows mentioning an option replacement must be changed before assigning the index.

### american_1.json

| Keeper | Remove | Verified answer (index) | Prompt | Action note / evidence |
|---|---|---|---|---|
| `q_f68929f3c722efa0df49` | `q_1a999acae2341fc7ead8` | **freedom** (1) | The river best serves as a symbol of | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_fa1ddfe891506f338047` | `q_e4d363814635f214a77d` | **a permanent home** (3) | The river provides all the following except | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_690279576e70d8323024` | `q_79cdc96cb7f63de7aa5c` | **Pap Finn** (0) | Who demands Huck's money? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_48f62c2934857f849c86` | `q_14b8b9c5e176326accc2` | **race** (1) | Jim's friendship with Huck demonstrates that humanity has nothing to do with | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_7a5d305be0e751dbb081` | `q_8fca16a8db4190b733a1` | **Nobody really remembers** (2) | What are the Grangerfords and the Shepherdsons fighting about? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_846b128eeb72b2dc2664` | `q_4d4dd6301c18a121605c` | **con men** (0) | The Duke and the Dauphin are primarily | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_caa4bceb09bafadc840b` | `q_b88c48c4c735c7ebc386` | **White trash** (0) | Huck is a ....... character. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_881bf3782981e802fe08` | `q_2c7e5fa89829cc21f640` | **Regionalism** (2) | ....... focuses on characters, their dialects and values. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_aa58684631e927b81fd7` | `q_3b6133a56c37e6d72ef5` | **conscience** (3) | A person's conscience ain't got no sense and just goes for him anyway. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_d9dc6d7b11651b066b09` | `q_d5cc31c140d3157fc544` | **white** (1) | I knowed he was white inside, and I reckoned he'd say what he did say. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_ed38bb23356e35ee1fa1` | `q_f2d454573ed7a2e0331b` | **He is rejecting society's morality to help Jim.** (1) | What does Huck mean when he says, 'All right, then, I'll go to hell'? | Exact/strict duplicate; retain the keeper and its selected answer.  |

### Modern_Drama.json

| Keeper | Remove | Verified answer (index) | Prompt | Action note / evidence |
|---|---|---|---|---|
| `q_40056f5ca55ae8851dc9` | `q_e8178eb08fe1f6809ba7`<br>`q_648f58b67510e0cff73a` | **Rummy Mitchens** (3) | Who criticised the habit of confession in the play? | Replace option 3 with “Rummy Mitchens”. The three copies conflict and none supplies the verified answer. Rummy Mitchens criticises the practice of confession; replace the keeper’s option 3 before selecting it. [source](https://www.gutenberg.org/cache/epub/3790/pg3790-images.html) |
| `q_9a4d7c844cf3a89873e6` | `q_44621f20158159e1d3d9` | **Language** (0) | 6. Beckett shares with James Joyce his preoccupation with the limits of: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_69ca6e9a7fb53dcd4bdc` | `q_5938ad4d4f9828f5f91c` | **Involuntary memory and habitual reality** (1) | 7. The two forms of certainty according to Proust that Beckett introduced as valueless in his play are: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_42e95fa598232660343c` | `q_a84fcfeab8ee2a1b544f` | **1942** (0) | 8. Albert Camus published his essay 'The Myth of Sisyphus' on absurdism in: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_f1ea01408696b94b4cc8` | `q_fe584bd0d08e1144c41c` | **Intellectual tramps** (1) | 9. Beckett's theatrical trademark is: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_0aaf983f915894c54ed3` | `q_09fafde94034e99e9c57` | **The sky** (3) | 10. Pozzo describes what as 'pale and luminous'? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_c78a01629e8aacd4051e` | `q_c9cb8a2872741a15ad02` | **Death** (2) | 11. Pozzo commented on his blindness as being a form of: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_bc0eacb8c77f9c4e6ae3` | `q_eb3c93a2af4ee7e8547b` | **Certainty** (1) | 12. Sports and tennis in Lucky's monologue refer to man's attempt to compensate for the loss of all but one of the following: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_b14b466c6d61f2a2fd3c` | `q_e71df85ec1737cc12c2f` | **Waiting** (0) | 13. Vladimir suffers the most because of: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_2c72df877fbf9adfbde5` | `q_5c690c05aced06d9f05d` | **Codependent** (0) | 14. In Keller's 'A Strange Situation', the relationship between Pozzo and Lucky is mainly described as being: | The duplicate copies disagree; the paired tramps’ mutually sustaining yet dysfunctional relationship is the intended course concept.  |
| `q_0b1f8b8e03e521245e02` | `q_1b970021db78516055a2` | **Understand Godot** (2) | 15. Vladimir interrogates the boy because he wants to: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_fcbfc53c65e1637ca4b0` | `q_e7cae539d87fa81b3673` | **First Aid to Critics** (0) | 17. The first part of Shaw's preface was entitled: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_91a89ef385ad7f4d7187` | `q_ae8b3328e479882e09d1` | **A revolutionary writer** (0) | 18. In the last part of his preface Shaw said that he is: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_461ff77d8078e3d462d9` | `q_00b998756a011cfde0a4` | **Money** (1) | 19. In 'The Gospel of St. Andrew Undershaft' Shaw suggests that civilisation cannot flourish without: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_7a1ed832a0feebff1da5` | `q_a064c0aac210d6039301` | **Truth and power** (2) | 20. Cusins told Barbara that he decided to sell his soul to Undershaft for: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_53e7fe728e63e97a995b` | `q_6dd7ef0ef99e05cc8de0` | **A curse** (2) | 21. Shaw mentioned that when money is 'cheapened to worthlessness', it becomes: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_351973d4f26007d8c3a2` | `q_b99f618a5a64bafa96d4` | **Double standards** (1) | 22. Shaw suggests that refusing salvation to Bill but making it available to Budger is an act of: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_5bef20bd56cb443d4d5e` | `q_f13a0fae70e9ca87ad1d` | **Justification** (1) | 23. In talking about his workers' living conditions, Undershaft says that 'cleanliness' needs no: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_35ca4dace3bf7b006cf4` | `q_c7de09ab80000dfa1545` | **True** (1) | 24. In talking about war, Undershaft said that it didn't matter if things were wrong if they were: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_2bb19215bfceb4d7f4e4` | `q_7d060175fe75a5e85744` | **The capitalists** (3) | 25. Snobby Price said that he was ready to take whatever was made available to him like: | Both stored keys are wrong. Price says that, within the law, he does as the capitalists do and takes whatever he can lay his hands on. [source](https://www.gutenberg.org/cache/epub/3790/pg3790-images.html) |
| `q_2d7309584d664fc8e12a` | `q_ca2cf2080f207a0403e7` | **Anxiety** (0) | 28. Undershaft said that democracy wouldn't go hand in hand with: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_3ac047ac49f6525ccc4f` | `q_dc181d9143aa1ead4961` | **Eugene Scribe** (0) | 29. Who laid the foundations of the well-made play? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_92410d68e5b0363b4da6` | `q_b97a34b5dfec39393477` | **A discussion** (2) | 30. A Realist play replaces the logical ending of the well-made play by: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_dfd3844b1a051821de7a` | `q_42e6e26743cb06c476f9` | **The realist play** (1) | 31. The well-made play is a prototype of the: | Ibsen is conventionally identified as a central founder of modern realist drama. [source](https://campuspress.yale.edu/modernismlab/henrik-ibsen/) |
| `q_7ae5005ffcb5d9c42231` | `q_b141ea78209edbb8a395` | **Norwegian** (3) | 32. Henrik Ibsen was: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_dcfdc2497d0743df72b7` | `q_1fa381255800650effe6` | **The stage** (2) | 36. According to Bernard Shaw, what is the best instrument for moral propaganda? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_ec30a52dfe33a62e2624` | `q_ac181d4adc29165c7a4d` | **All of the above** (3) | 40. Plays of the 'theatre of the absurd' usually lack: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_c2bb2ba4f8ffcdbfa921` | `q_55631578e63c2675a80a` | **There is no one fixed value for anything** (3) | 54. Cusins said: 'One man's meat is another man's poison' referring to the fact that: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_e2b109f6bd23b45dd2e1` | `q_4ae528ae20ae1bebbf7c` | **True** (0) | 1. Samuel Beckette is a modernist playwright. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_059c2ce597f951409553` | `q_57dc09d0147d0349fcc3` | **True** (0) | 2. Waiting for Godot is classified as an absurdist play. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_03be1595dfd968c20857` | `q_cbc09ff8e329897eca6c` | **False** (1) | 3. The characters in Waiting for Godot are portrayed as intelligent and wise. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_b2e76ee61cad1f5d31b2` | `q_c0e3eb4770cd11a8e54f` | **True** (0) | 4. Vladimir's hat symbolises imprisonment of thought. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_ad86384f9d3a668fd57b` | `q_794c40540dd5305263e7` | **False** (1) | 5. Vladimir woke Estragon up from his nap because he was afraid of the dark. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_32e9e48bba08eb69749e` | `q_17180407a7c96100260c` | **True** (0) | 6. Estragon expressed his feeling of being unhappy in Act I. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_085d664ca67e92d3b361` | `q_7e9684d30cd766a22a49` | **False** (1) | 7. Pozzo needs human companions because he is blind. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_d23b823743da555b1913` | `q_35bd43d70b3f166a19a5` | **False** (1) | 8. Vladimir's song is optimistic. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_9ce6507eb93ed1e97c26` | `q_ad6e1a8ed06094f87146` | **False** (1) | 9. The boy knows all the answers to Vladimir's questions. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_7256e0094629c7f2c89c` | `q_9645fc0fcd176fa1c233` | **False** (1) | 10. Vladimir screamed 'it's a scandal' when Pozzo gave Estragon the bones. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_7a7d23674c387b31cce6` | `q_052afe9b615bbc43bd95` | **True** (0) | 11. Pozzo tries to play the victim in his relationship with Lucky. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_d90d7d1ba9244b87c37a` | `q_2d1f1077466940f85cd8` | **True** (0) | 12. Estragon refers to Pozzo and Lucky as Abel and Caine in Act II. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_4351b4b5fc1dd441f4cc` | `q_3c5ff388d2fe13c5cab8` | **False** (1) | 13. Vladimir and Estragon are waiting for Godot because they are certain he will come. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_f4ab696f6c57eb084c28` | `q_7b1020f2d1df2f5513aa`<br>`q_5b3b28b47bc0472322f0` | **His morality** (1) | 14. What about his father, Andrew, bewilders Stephen? | The repeated item asks what Undershaft tests against Barbara’s moral idealism; retain the verified keyed answer. [source](https://www.gutenberg.org/cache/epub/3790/pg3790-images.html) |
| `q_dca78a0f67c4bb888855` | `q_f630130435eaba5138ba`<br>`q_96fe84cb78c5ef3adacd` | **Mog** (3) | 15. What is the name of Bill Walker's girl? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_c53cdc0912f74dc68c6a` | `q_37740d43723e5b8e68a0`<br>`q_e7fba5fb86a6f1bb12a8` | **Horace Bodger** (2) | 16. Who is Lord Saxmundham? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_c569080649e1cab743b8` | `q_d06535541ff25cfb4f74`<br>`q_d1d1369c3c8386dfcd48` | **Stevenage** (3) | 17. What is Lady Britomart's maiden name? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_6699074d04fe9698341b` | `q_0a28105ef7b85f8736e5`<br>`q_e86092e03a62526423ad` | **Money and gunpowder** (1) | 18. What does Undershaft identify as necessary to salvation? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_4f4e8d8715d9dd07da0f` | `q_390a75158b2834caecf0`<br>`q_ac1d1ac5ca599ea7fddb` | **Liquor** (1) | 19. What does Horace Bodger produce? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_453a2b4276a303ccb3ab` | `q_4974127e5589cb7add9b`<br>`q_155e17e6d75aaf691401` | **Killing** (3) | 20. What does Undershaft consider the 'final test' of conviction? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_4bdca42d5a407eb25c63` | `q_ef095331ca3a1baea29c`<br>`q_3ea0f30a039850e18c13` | **Australia** (2) | 21. Where do Cusins's parents reside? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_356300eba122bfc7505b` | `q_89de15efc69c35ac67cc`<br>`q_edc9a3b9f2a7b29a9413` | **Philosopher** (2) | 22. What profession does Undershaft suggest to Stephen? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_9c3b3b1e744fc30e9c89` | `q_cff4be8a2a5714cfe962`<br>`q_1b14444a86de3983a31c` | **The trombone** (3) | 23. What instrument does Undershaft play? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_db3d74b774eabd83a3b9` | `q_9deae432a883ac8bc22a`<br>`q_09bd5921b7c2ac63902d` | **Romola** (1) | 24. What is Rummy short for? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_c85e8304d881c0ed6ad4` | `q_eed99a69a1e0d83563f5`<br>`q_3e5abfcd1170c3b54661` | **Family finances** (1) | 25. Lady Britomart speaks to Stephen about what concern? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_23674bafd067394df9f6` | `q_0e5278a696f66029998f`<br>`q_bc119d0e4b4bedbe49fb` | **Desire for foundling successor** (3) | 26. Why did Undershaft disinherit Stephen? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_07a602af97100c8219ff` | `q_71cf524686774749f9f1`<br>`q_5b98004bf9b940172601` | **His soul needs saving** (0) | 27. What causes Barbara to look forward to her father's visit? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_3b754bc99d6080becad6` | `q_7084e4a6be91397318e6`<br>`q_dc536945f972788eb44f` | **Unashamed** (3) | 28. What is Andrew Undershaft's motto? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_07847e6696afeea9aa1c` | `q_70e97c28a6cdf387aa05`<br>`q_566b0edbc4ac4f8d2949` | **Future prospects** (3) | 29. In Waiting for Godot, if radishes and turnips represent harsh realities, then carrots represent: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_b98add6d07ed2f28124e` | `q_7bee87e7388bafd8c5c5`<br>`q_3a306b404f81c61f752c` | **Vladimir's thoughts** (0) | 30. Vladimir: 'Where are all these corpses from?' Corpses are: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_d2028dc0e184c39d4fef` | `q_26c6c77f86d2826588cb`<br>`q_a1e6a59e1c01bc90786a` | **Repetition and silence** (3) | 31. Samuel Beckett used [...] to emphasise failed communication: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_7e128c091c4302b06695` | `q_da6b75c92b80649e0ef8`<br>`q_ca9c1035707a31c7fa99` | **Christ** (1) | 32. Who has Estragon all his life compared himself to? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_823b8b1e6c5e9c067015` | `q_0598de1f3a14c386e4d8`<br>`q_96cbd5396dbb3f9174e0` | **All of the above** (3) | 33. Pozzo's speech describing the succession of day and night could be interpreted as referring to: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_e9ea01a241c58e05fe59` | `q_459f02d6ac6188cd98bf`<br>`q_73b3569c4195a359c3cc` | **Bladder problems** (1) | 34. Vladimir has: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_680b3c5a0333ef895b49` | `q_9bca2e1bd3b6fbca23b3`<br>`q_8cdcb02bd36f42708084` | **Popular** (0) | 35. Beckett's play is: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_1a85790bb144a9019ece` | `q_4fc194a8daf3a2ae5820`<br>`q_7695c30152cf412c1b0e` | **A novelist** (1) | 36. Beckett is: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_d1f165b243eb3fd6bdbe` | `q_4a1d8b141b7cd616a5af` | **Too small** (0) | In Act I, Estragon’s own boots were: | Set prompt to “In Act I, Estragon’s own boots were:”. Merge only the other Act-I copy. Do not merge the Act-II replacement-boots item: the two scenes deliberately have opposite answers. [source](https://coldreads.org/wp-content/uploads/2015/09/waiting-for-godot.pdf) |
| `q_ad93717933ea60fab3d9` | `q_a65fc5ee031d6521a181`<br>`q_7d4b06b7d5e49d090daa` | **A desperate life** (1) | 38. Estragon's nightmares reflect: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_faa3978caa3954f13642` | `q_ce3ac173296252a404f2`<br>`q_cced0b39d3744a09d71c` | **To put down his bags** (0) | 39. Lucky refuses: | The copies conflict; the keeper’s selected answer was checked against the item context and retained.  |
| `q_6d835506045b5485834b` | `q_a84eea0069eb12db3de4`<br>`q_44d280ed928ff9c7995e` | **A dog** (1) | 40. Vladimir sings a song about: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_6e0575c909293a8d0594` | `q_5ba9d33f3accc7b24d47`<br>`q_b2cf34ec696a1134d8c3` | **Torn from** (1) | 42. Keller suggests that in life, 'one is given to a sense of tranquillity, only to be... the world in a sudden, violent rupture': | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_dfaca25c401d3b18c003` | `q_cfb3af21d10372bbe0c5`<br>`q_964bc485a26af2f49aa6` | **Lucky** (3) | 43. An absent mother is represented by all but one of the following characters according to Keller: | In Keller’s reading, Pozzo, Godot, and Vladimir represent aspects of the absent mother, while Lucky occupies the dependent-child position; the exception is Lucky. [source](https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/20/71/52/48/2020715248/2020715248.pdf) |
| `q_637ca5d357f56c02770a` | `q_003bfd0878ba785b4c45`<br>`q_06cb99d56ee72d019e1e` | **Pozzo's lack of internal goodness** (0) | 44. According to Keller, Pozzo's 'greedy, envious devouring of Lucky' is one example of: | Keller describes Pozzo’s internal world as lacking enduring goodness; the copies can be merged with this answer. [source](https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/20/71/52/48/2020715248/2020715248.pdf) |
| `q_0e555f56fca3b83cd931` | `q_d4ec0d720f1948c7badb`<br>`q_304d51fde5eda36820fe` | **A mother's failure to contain early anxieties** (2) | 45. Vladimir refuses to hear Estragon's nightmares. According to Keller, this exemplifies: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_0548ef7c4dc57145a195` | `q_668d33ed129a53f60905` | **False** (1) | 46. Keller's article suggests that Pozzo, as a mother, provides Lucky's emotional needs. | Both copies are mis-keyed. Keller treats Pozzo as supplying basic physical needs while failing emotionally; therefore the claim that he provides no physical care is false. [source](https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/20/71/52/48/2020715248/2020715248.pdf) |
| `q_91f554047e9bff1693d5` | `q_2c9c3463b6244a62e93a` | **False** (1) | 47. Keller uses the term 'the primary object' to refer to the co-dependent relationship. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_95ef355a1e801841c327` | `q_08fbbef8474776d7f57e` | **True** (0) | 48. Each person has a personal god which Keller refers to as the core internal object. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_f854f8a91b9612519380` | `q_f1c086291c607b05cc94` | **False** (1) | 49. The boy's existence in the play reduces the sense of abandonment felt by Vladimir. | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_e6284b18d681345b8b00` | `q_5de5554d2d25425e7781` | **False** (1) | 50. Vladimir's relief after he experienced separation from Estragon was signalled by his ability to sleep comfortably. | Both copies are mis-keyed. Keller signals Vladimir’s relief through singing, not sleep. [source](https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/20/71/52/48/2020715248/2020715248.pdf) |
| `q_04c2775846a855510275` | `q_37be1bedc337290b17a9` | **Both a & b** (2) | 27. Who warned Cusins that Barbara might find out that he is not a true believer in the Salvation Army? | Near duplicate differing only by the omitted word “that”. Lady Britomart and Undershaft both warn Cusins, so the existing combined answer is correct. [source](https://www.gutenberg.org/cache/epub/3790/pg3790-images.html) |
| `q_03bf4141a99c4abab98e` | `q_352285eea663461acaf0`<br>`q_6a916b86eab3b7568717` | **Arbitrary containment** (2) | 41. In Lucky's monologue, according to Keller, the mother's ______ generates 'the calm which even though intermittent is better than nothing': | Replace option 2 with “Arbitrary containment”. These are variants of one Keller quotation. His exact concept is the mother’s “arbitrary containment”; neither “protection” nor “presence” is precise enough. [source](https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/20/71/52/48/2020715248/2020715248.pdf) |

### modern_prose.json

| Keeper | Remove | Verified answer (index) | Prompt | Action note / evidence |
|---|---|---|---|---|
| `q_75be484438a3326b4f33` | `q_83e07e54e63aa495353c` | **Because the sea represents the vastness and unpredictability of life** (1) | Why does Cam feel that the sea is more important than the shore? | Exact/strict duplicate; retain the keeper and its selected answer.  |

### world_lit.json

| Keeper | Remove | Verified answer (index) | Prompt | Action note / evidence |
|---|---|---|---|---|
| `q_d4b2ff3e742de3f06baa` | `q_97388a9dac965840e141` | **He was wearing Achilles' armor** (0) | Which of the following applies to Patroclus around his time of death? | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_e252adbe59d86c448540` | `q_e25c6c8ac286e0e31ee5` | **Scylla** (3) | Which of the following is a creature that Odysseus encounters: | Replace option 3 with “Scylla”. Cerberus belongs to the Underworld myths but is not an encounter in Homer’s Odyssey. Replace option 3 with Scylla, whom Odysseus encounters in Book 12. [source](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0218%3Abook%3D12) |
| `q_2b7eee5280f702ab2d40` | `q_970c11152f1ae064eacf` | **One-eyed creatures** (1) | Which of the following is characteristic of the cyclopes: | Exact/strict duplicate; retain the keeper and its selected answer.  |
| `q_c32e8ac073cb30cee450` | `q_7c557176f74d75960650` | **Priam/Asking for Hector's body** (1) | In the following "Remember your own father, great godlike Achilles-as old as I am, past the threshold of deadly old age" the speaker is and the occasion is | Exact/strict duplicate; retain the keeper and its selected answer.  |

## Visually similar but distinct — KEEP separate

| File | IDs | Correct answers | Decision |
|---|---|---|---|
| Fourth Year/Modern_Drama.json | `q_4e3d44d80593c6f0d443`<br>`q_6fdfbbb4f532ce4f409d` | A rejection of conventional reality / A strong emphasis on the importance of individual freedom | KEEP BOTH: the second stem contains NOT and tests the opposite polarity; they are visually similar but logically distinct.  |
| Fourth Year/Modern_Drama.json | `q_d1f165b243eb3fd6bdbe`<br>`q_464f488857ae054a3c6f` | Too small (Act I) / Too big (Act II replacement boots) | KEEP BOTH after the Act labels are inserted; the apparent answer conflict describes two different pairs of boots in two acts. [source](https://coldreads.org/wp-content/uploads/2015/09/waiting-for-godot.pdf) |
| Fourth Year/poetry4.json | `q_efb4fa760342d8336efe`<br>`q_f796ed7d4ffe7a7132e8` | Alienation and disillusionment / Fragmented structure and stream of consciousness | KEEP BOTH after rewriting the prompts: one tests theme/mood and the other tests formal/narrative technique. [source](https://lemoorecollege.edu/oer/documents/Voices-Unbound-1721923851.pdf) [source](https://www.ucpress.edu/books/stream-of-consciousness-in-the-modern-novel) |

## Nonduplicate correct-index corrections

| File | ID | Change | Question | Reason / source |
|---|---|---|---|---|
| Fourth Year/Modern_Drama.json | `q_777ffc42250bdfd062ee` | All of the above (3) → **A Day’s Ride** (2) | 43. Shaw cited Charles Lever's novel entitled: | Shaw names Charles Lever’s novel A Day’s Ride: A Life’s Romance; “A Day’s Romance” is not the title, so “All of the above” cannot be correct. [source](https://www.gutenberg.org/cache/epub/3789/pg3789-images.html) |
| Fourth Year/Modern_Drama.json | `q_2827f417a23326c00c9b` | True (0) → **False** (1) | 86. After graduating from Trinity College in Dublin in 1928, Samuel Beckett travelled to Paris to teach English. | Beckett graduated from Trinity in 1927 and went to Paris in 1928; the statement incorrectly makes the graduation year 1928. [source](https://www.tcd.ie/trinitywriters/draft/writers/samuel-beckett/) |
| Fourth Year/Modern_Drama.json | `q_0f576f0d008ffc6cb78f` | False (1) → **True** (0) | 102. Major Barbara took place over the course of three days. | Act I occurs on a January night, Act II the next morning, and Act III on the following day after lunch: three calendar days. [source](https://www.gutenberg.org/cache/epub/3790/pg3790-images.html) |
| Fourth Year/Modern_Drama.json | `q_717505951801127f222f` | True (0) → **False** (1) | 118. The Fabian society which Shaw joined adopted a dogmatic approach to reforming English. | Fabian reform is gradual, practical, empirical, and pluralist rather than dogmatic. [source](https://fabians.org.uk/about-us/) [source](https://fabians.org.uk/about-us/our-history/) |
| Fourth Year/Modern_Drama.json | `q_256e10e5b532a0533a7d` | True (0) → **False** (1) | 120. Shaw wrote Progress and Poverty in 1882. | Progress and Poverty was written by Henry George and published in 1879; Shaw encountered George’s ideas, but did not author the book. [source](https://www.loc.gov/item/04003837/) [source](https://www.digitalhistory.uh.edu/disp_textbook.cfm?bioid=9&smtID=5) |
| Fourth Year/Modern_Drama.json | `q_4efa939e93413e40d7ca` | True (0) → **False** (1) | 121. Widowers' Houses was banned from the theatre for sexual profanity. | Widowers’ Houses was produced in 1892. Mrs Warren’s Profession—not Widowers’ Houses—was the Shaw play banned/censored over its sexual subject matter. [source](https://www.shawfest.com/about/) [source](https://www.shakespearetheatre.org/watch-listen/notes-on-a-scandal/) |
| Fourth Year/Modern_Drama.json | `q_56405f9e20bf5985d636` | Six sections (2) → **Seven sections** (0) | 154. Shaw's Preface to Major Barbara consists of: | The Project Gutenberg preface text has seven titled divisions, not six. [source](https://www.gutenberg.org/cache/epub/3789/pg3789-images.html) |
| Fourth Year/Modern_Drama.json | `q_81ed0417782eaeabed41` | Pitied her (0) → **Gloated** (1) | 162. When Barbara became disappointed with the Salvation Army, Bill Walker: | Bill Walker taunts/sneers at Barbara after the Salvation Army accepts the money; “gloated” matches the scene, whereas “pitied her” does not. [source](https://www.gutenberg.org/cache/epub/3790/pg3790-images.html) |
| Fourth Year/modern_prose.json | `q_d65866bea9baefccc0f6` | False (1) → **True** (0) | 36. The narrative time a certain event takes in the story is called "story time". | Story time is the duration/order of events in the story world; the item’s own feedback already states this and contradicts its stored key. [source](https://uni-tuebingen.de/en/233933) |
| Fourth Year/world_lit.json | `q_1edfb2cf759e13b5e057` | True (0) → **False** (1) | The epic poem ends with Odysseus and Penelope being reunited and living happily ever after. | The poem ends after the reunion and restoration of peace, but Tiresias has already foretold further travel; “living happily ever after” overstates the ending. [source](https://www.cambridge.org/core/journals/new-surveys-in-the-classics/article/iii-the-odyssey1/A76FD52966DBD2DD97FA2B6553F8014F) |

## Rewrites required for ambiguous or factually broken items

| File | IDs | New verified answer (index) | Required change | Reason / source |
|---|---|---|---|---|
| Fourth Year/Modern_Drama.json | `q_357eab203baaac3781da` | **A carrot** (2) | Question: “After accidentally giving Estragon a turnip in Act I, what does Vladimir finally give him to eat?” | The original asks what Vladimir gives in Act I, but he gives both a turnip and a carrot. Make the sequence explicit. [source](https://coldreads.org/wp-content/uploads/2015/09/waiting-for-godot.pdf) |
| Fourth Year/Modern_Drama.json | `q_464f488857ae054a3c6f` | **Too big** (1) | Question: “In Act II, the replacement boots Estragon puts on were:” | This is not a duplicate of the Act-I boots fact. Identify the scene so the opposite answers remain valid. [source](https://coldreads.org/wp-content/uploads/2015/09/waiting-for-godot.pdf) |
| Fourth Year/modern_prose.json | `q_3e36c45f9b6ebdb1326f` | **Narrating once what happened several times** (2) | Question: “In Genette’s frequency scheme, what is iterative narration?” Options: 0=Narrating once what happened once; 1=Narrating several times what happened once; 2=Narrating once what happened several times; 3=Narrating events before their chronological position | The existing example (“same thought across different scenes”) does not define Genette’s iterative frequency. Replace it with the canonical definition. [source](https://www-archiv.fdm.uni-hamburg.de/lhn/node/106.html) |
| Fourth Year/poetry4.json | `q_efb4fa760342d8336efe` | **Alienation and disillusionment** (1) | Question: “Which of the following best describes a recurrent theme or mood in Modernist literature?” Option 1: “Alienation and disillusionment” | The exact prompt collides with a second valid Modernism item, and “Attention” is a typo. Specialise this copy to theme/mood. [source](https://lemoorecollege.edu/oer/documents/Voices-Unbound-1721923851.pdf) |
| Fourth Year/poetry4.json | `q_f796ed7d4ffe7a7132e8` | **Fragmented structure and stream of consciousness** (2) | Question: “Which of the following is a characteristic Modernist formal or narrative technique?” | Keep this valid fact but distinguish it from the theme/mood item by asking specifically about form and narrative technique. [source](https://lemoorecollege.edu/oer/documents/Voices-Unbound-1721923851.pdf) [source](https://www.ucpress.edu/books/stream-of-consciousness-in-the-modern-novel) |
| Fourth Year/poetry4.json | `q_5ae881e1aea42dc08f86` | **concentration** (2) | Question: “Ezra Pound’s two-line poem “In a Station of the Metro” most directly illustrates which Imagist principle through its extreme brevity?” | The poem is by Ezra Pound, not William Carlos Williams; the current “none” key merely compensates for the bad attribution. Ask a single, unambiguous two-line-form question. [source](https://www.poetryfoundation.org/poetrymagazine/poems/12675/in-a-station-of-the-metro) |
| Fourth Year/world_lit.json | `q_e252adbe59d86c448540`<br>`q_e25c6c8ac286e0e31ee5` | **Scylla** (3) | Option 3: “Scylla” | Apply this as part of the duplicate merge: replace Cerberus with Scylla before retaining the keeper. [source](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0218%3Abook%3D12) |
| Fourth Year/america_2.json | `q_2b593ace7adc9787ebd0` | **whole / complete** (1) | Question: “In Donne’s phrase “No man is an island, intire of itself,” the archaic word “intire” means:” Option 1: “whole / complete” | In Donne’s phrase “No man is an island, intire of itself,” archaic “intire” is an adjective meaning whole/complete; the noun “entirety” is grammatically wrong. [source](https://www.poetryfoundation.org/poems/44127/no-man-is-an-island) |

## Manual review — do not auto-correct

| File | IDs | Current answer | Why it needs course-source review |
|---|---|---|---|
| Fourth Year/world_lit.json | `q_889b330fe78787704465` | T | Do not auto-flip. The gods undeniably act externally, but whether they also represent internal impulses is a scholarly “double motivation/causation” interpretation. The categorical wording should be aligned to the course source or rewritten with attribution. [source](https://scholar.lib.vt.edu/ejournals/ElAnt/V5N3/enemy.html) |

## File-level conclusion

- `america_2.json`: no audit duplicate; one archaic-word option/prompt rewrite.
- `american_1.json`: all 11 exact duplicate groups are safe merges; no additional high-confidence key error found in the full index scan.
- `Modern_Drama.json`: merge the exact/near groups listed above, preserve the three explicitly distinct cases, and apply the verified key repairs.
- `modern_prose.json`: merge one exact duplicate, flip the story-time item, and replace the noncanonical iterative-narration question.
- `poetry4.json`: do not delete the same-prompt Modernism pair; both facts are valid after specialising the stems. Correct Pound attribution.
- `world_lit.json`: merge four exact groups, replace Cerberus with Scylla, correct the “happily ever after” item, and leave the gods/internal-forces item for attributed course review.
