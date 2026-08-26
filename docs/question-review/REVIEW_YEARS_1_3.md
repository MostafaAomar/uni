# مراجعة أسئلة السنوات الأولى والثانية والثالثة

> النطاق: ملفات `First Year` و`Second Year` وجميع ملفات `Third Year` داخل `work/uni-fixed`. هذا تقرير مراجعة وخطة إجراءات فقط؛ لم تُعدَّل ملفات بنك الأسئلة أو كود المشروع.

## النتيجة التنفيذية

- فحص التدقيق وجد **221 مجموعة صياغة متطابقة** في النطاق. بعد مراجعة الصياغات القريبة وفصل الحالات المعتمدة على الخيارات، أصبحت الخطة **231 مجموعة دمج** تُزيل **365 نسخة**.
- إضافة **11 تصحيح إجابة/خيارات** و**8 إعادة صياغة** دون حذف سؤال صالح مستقل.
- `correctIndex` في ملف الإجراءات يبدأ من الصفر. الجدول الشامل أدناه يذكر نص الإجابة أيضاً حتى لا يعتمد المراجع على الرقم وحده.

| file | merge groups | removed IDs | corrections | rewrites |
|---|---:|---:|---:|---:|
| First Year/Comprehension_1.json | 10 | 10 | 1 | 0 |
| First Year/Introduction_to_Drama.json | 25 | 29 | 0 | 0 |
| Second Year/history.json | 0 | 0 | 3 | 0 |
| Second Year/poetry_2.json | 9 | 9 | 1 | 3 |
| Third Year/criticism_1.json | 52 | 97 | 1 | 0 |
| Third Year/french.json | 15 | 15 | 2 | 3 |
| Third Year/linguistics_1.json | 8 | 9 | 1 | 0 |
| Third Year/play_third_year.json | 55 | 81 | 1 | 1 |
| Third Year/romantic_poetry_3.json | 57 | 115 | 1 | 1 |

## MERGE/DELETE — الجدول الشامل القابل للتطبيق

كل صف يعني: إبقاء `keeper`، نقل المعرّفات القديمة إليه عند التطبيق، ثم حذف `merge_ids`. الإجابة هي إجابة السؤال المحفوظ بعد التصحيح.

| file | keep_id | merge_ids (remove) | correct answer | correctIndex |
|---|---|---|---|---:|
| First Year/Comprehension_1.json | `q_0bd01ecf233ac6125f3a` | `q_35190b7bf40af1530e48` | rural | 0 |
| First Year/Comprehension_1.json | `q_0cf4ac5a7f79cf247c7e` | `q_a892380483664912660d` | use again | 1 |
| First Year/Comprehension_1.json | `q_864f285946137d955006` | `q_71ebb42efa49abe9e398` | guard | 1 |
| First Year/Comprehension_1.json | `q_e9a82b70536867ddd649` | `q_990f79f6f642bb6d7808` | empty | 0 |
| First Year/Comprehension_1.json | `q_68c9f9d7b622b58451c0` | `q_f55e46e76793685bae5a` | completely gone | 3 |
| First Year/Comprehension_1.json | `q_29c713148b328f8d6025` | `q_c4a55168e670190ffe83` | keep in good condition | 0 |
| First Year/Comprehension_1.json | `q_4e24ca29bce4e3995f31` | `q_c697e5afec0d52e80e12` | inspect | 3 |
| First Year/Comprehension_1.json | `q_ad9fbc6438af2991e204` | `q_d3c17c6cf3e6871f8a2f` | fragile | 0 |
| First Year/Comprehension_1.json | `q_5332f89bcd4bfca48af8` | `q_868ff4a1158a1bdd595d` | shaped easily | 3 |
| First Year/Comprehension_1.json | `q_5f5ce1b4a50d983d46f1` | `q_75ddde0f53982d4d82f6` | break into pieces | 2 |
| First Year/Introduction_to_Drama.json | `q_fb702fb569f10dabbafe` | `q_9e72d25cbcaa18c1472b` | social reform | 2 |
| First Year/Introduction_to_Drama.json | `q_7160fccf6c8fc967f4f0` | `q_6534463c9469aab631bf`<br>`q_c4dcf6dc7f57c1035965` | plot | 1 |
| First Year/Introduction_to_Drama.json | `q_864424d19f7f3ef65ea1` | `q_afadb50b3314a59455c0` | inconsistency | 2 |
| First Year/Introduction_to_Drama.json | `q_fb53825e6b594b94f44d` | `q_9157fd6905c179812a05` | Humor | 2 |
| First Year/Introduction_to_Drama.json | `q_642f25c5e6c884c024d7` | `q_82bf7bb0b2a200d985dc` | normal | 0 |
| First Year/Introduction_to_Drama.json | `q_27ecf566552c78c3a454` | `q_75943cd7c5917c62316a`<br>`q_a8ffe51be2edb442a20d` | experience | 3 |
| First Year/Introduction_to_Drama.json | `q_7657cba445d60532f387` | `q_658d50dc3d9c775fe1c7` | you | 2 |
| First Year/Introduction_to_Drama.json | `q_ee1fae14cf66732fbde9` | `q_044b01281828be5469ed` | one-act | 1 |
| First Year/Introduction_to_Drama.json | `q_1fe1bcecfb03fcc99abf` | `q_108cdc67d8348fec296c`<br>`q_d1a1ebf4d05981bc0cde` | protagonist's mind | 1 |
| First Year/Introduction_to_Drama.json | `q_2c2b11e22aa9d0a7afc1` | `q_18e6ff0a6087ad2f1a65` | derision | 1 |
| First Year/Introduction_to_Drama.json | `q_bdb3eb3da191f094431e` | `q_ea3fb50c75e5d57c2e2d`<br>`q_3f439ef78f538f097619` | comedy | 1 |
| First Year/Introduction_to_Drama.json | `q_325778bd8dd5de866f1f` | `q_26b9be336b190e117721` | Mr. Scratch | 0 |
| First Year/Introduction_to_Drama.json | `q_7abbef4bb2c7686c8d21` | `q_982700b24b8bcca05c16` | can | 0 |
| First Year/Introduction_to_Drama.json | `q_e6ed36f0f637153a90ab` | `q_e9156a8c8740c21816a5` | normal | 0 |
| First Year/Introduction_to_Drama.json | `q_4ba0c32b7ca60b11d3fb` | `q_a2c01aa63a0d58ca462f` | Lomov | 2 |
| First Year/Introduction_to_Drama.json | `q_710e910b6b2acb1bd252` | `q_d463ed8eca6239b15317` | Natalia | 3 |
| First Year/Introduction_to_Drama.json | `q_1138f49193aec7dc93e3` | `q_0e5c3a11d3aa51711a71` | melodrama | 1 |
| First Year/Introduction_to_Drama.json | `q_09fd0c6e86a18752b653` | `q_6def7a7ae15b94df4afc` | tragedy | 3 |
| First Year/Introduction_to_Drama.json | `q_b055dbc77d5c262edbe2` | `q_fc40bfd156596d9395d2` | derision | 0 |
| First Year/Introduction_to_Drama.json | `q_12e1369289c77c6bd21f` | `q_a59dbf58ab2f9f4cdc8c` | bread | 1 |
| First Year/Introduction_to_Drama.json | `q_102e4b01600b9f455c2f` | `q_400855ce8e447ef222b7` | no tragic | 3 |
| First Year/Introduction_to_Drama.json | `q_0f1fc5a9ffdccfd7df5a` | `q_fafc99866ecf52305279` | Mary | 2 |
| First Year/Introduction_to_Drama.json | `q_f378bb2113a27d624452` | `q_323127a497247cfb4f4e` | ours | 0 |
| First Year/Introduction_to_Drama.json | `q_e08e84cd05b08e166900` | `q_eb02fa91941293535792` | Perry | 2 |
| Second Year/poetry_2.json | `q_6ce11389167a54372919` | `q_722cad054337e1903a5c` | Conceits | 1 |
| Second Year/poetry_2.json | `q_7381f0331f663f82cc24` | `q_15866b1b8c1d03796d8d` | The Earl of Surry | 1 |
| Second Year/poetry_2.json | `q_39ec9d7d1e0f4fceb4c5` | `q_4ed8b88bb772a8f86ebc` | Re-birth | 1 |
| Second Year/poetry_2.json | `q_dfec27531fc800477dbf` | `q_39d82e7d763995ed2179` | Italy in the 14th c. | 0 |
| Second Year/poetry_2.json | `q_2e8d77eaef0be74ef1c8` | `q_a3cf1b933702d0ec5271` | King Charles I | 3 |
| Second Year/poetry_2.json | `q_0ebc060e41b9c8a051eb` | `q_68bb886e843f7a9e7f78` | All of the above | 3 |
| Second Year/poetry_2.json | `q_7e5b3b8726593a4ee357` | `q_43b75a72fb943f2182da` | Refrain | 0 |
| Second Year/poetry_2.json | `q_bba880c1874844a73a45` | `q_fadcd0b47e7c411378b4` | Henry VIII | 2 |
| Third Year/criticism_1.json | `q_b32ae8162d4fe142c636` | `q_966c11a10d8a6c5d137e`<br>`q_57fc4487cf0a785cba92`<br>`q_593f5edae1948852b614`<br>`q_19bb7e0ebe19dcf6a560`<br>`q_a8629014468c1b382eb6` | Structuralists | 0 |
| Third Year/criticism_1.json | `q_d9b15cec9fc97007f13d` | `q_2e0971ae1ef30ea43f64`<br>`q_b570b04bad4d35178894`<br>`q_ef0073c28f034ba42e4b`<br>`q_90bd4bf67feb33ef2d96`<br>`q_782a22a8fe1ebd362467` | the Essential Form of Goodness | 3 |
| Third Year/criticism_1.json | `q_780eb281272b71c54f50` | `q_5cd31773438ec6b42fc2`<br>`q_d32f1e2754e943c07d19`<br>`q_8f86ee47050a673e9a92` | actions | 1 |
| Third Year/criticism_1.json | `q_3cf0b907e17252150ca2` | `q_d43758614f38d431bd18`<br>`q_17ea03ec103189a95321`<br>`q_02727622a806f3d32792` | superior, universality | 0 |
| Third Year/criticism_1.json | `q_3113ef4baa394490de9f` | `q_14c4fd46fbb6c44188bf` | discordant | 1 |
| Third Year/criticism_1.json | `q_82dc469f79c85f77bbc0` | `q_729c8e9cfedef558d370`<br>`q_65dddb2bb2dd151ba397`<br>`q_d7884514455e8ae2bd62` | impossibility, possibility | 1 |
| Third Year/criticism_1.json | `q_d6eb3854370c77a66270` | `q_b83a0320d06f91ee53a6`<br>`q_b3383e6897f3d5841c2a`<br>`q_e3a451c880c94e0761f5` | Zola | 2 |
| Third Year/criticism_1.json | `q_3623cfbd56f85cb28a90` | `q_fbdf9f86d2e4457b2eb7` | A & B | 2 |
| Third Year/criticism_1.json | `q_2b66c88d5b8ed8cdbca6` | `q_b519541e9cffaf5a635a` | Dennis | 3 |
| Third Year/criticism_1.json | `q_58425b56e64ebedb5f4d` | `q_1b9f6fbed6310dd87102`<br>`q_c335aa2f2c01f34a561a` | Logocentric | 0 |
| Third Year/criticism_1.json | `q_22673dfc89b15bea0169` | `q_f9a0721b92ee4237be1d`<br>`q_e5ae51d8f354508ff042`<br>`q_dbcad8afe30b2f3f5e16` | A. Aristotle's | 0 |
| Third Year/criticism_1.json | `q_af7c2dc57c4e63886c7e` | `q_b23494717f228c5e676f` | D. Reader-response critics | 3 |
| Third Year/criticism_1.json | `q_0f96c9da6c5c0df584ee` | `q_8c83430a56216f313e3a` | A. Coleridge | 0 |
| Third Year/criticism_1.json | `q_ee485d8a93a2074bf0e6` | `q_20759d2ec1e075726d5f` | B. Shelley | 1 |
| Third Year/criticism_1.json | `q_3b2c73f432ca8172153e` | `q_4ccdeb0a400b641b1be9` | C. both a and b | 2 |
| Third Year/criticism_1.json | `q_af2418bc2f3c2bb8bafb` | `q_5d495e1c99208c4082c0`<br>`q_8ab0bf0be3e044083cb3` | D. both b and c | 3 |
| Third Year/criticism_1.json | `q_d1a7b12d903e8e423f8e` | `q_9c86cc443a58e6ef9f18`<br>`q_255583e44aeab37072f4` | A. Coleridge | 0 |
| Third Year/criticism_1.json | `q_0101da363e8bc547d474` | `q_10c81c9815b851dee70d`<br>`q_fd8079679e926309d429` | C. thought | 2 |
| Third Year/criticism_1.json | `q_3c943a98babd4ff0b5c5` | `q_6baf01ba2ab6f66c372f`<br>`q_59fdbc84283859a9f7e0` | C. both a and b | 2 |
| Third Year/criticism_1.json | `q_c4b7aa7f4c9b7ceaab90` | `q_b3a4dd7beebbd001c082`<br>`q_839d54e604752d7cafc2` | A. true | 0 |
| Third Year/criticism_1.json | `q_569eba1f86dd9cba23a3` | `q_be21f91c2d99ee46f2c5`<br>`q_c3d93ef915882ae10c01` | A. determinism | 0 |
| Third Year/criticism_1.json | `q_09d1d720a0995b136221` | `q_d2435641bd30608a2083`<br>`q_d6ce6f23dbfd49ff23e9` | A. True | 0 |
| Third Year/criticism_1.json | `q_5652ffeafed91f8882f4` | `q_4fab1e1cd7fcf69d62ac`<br>`q_5f60188696dd50a77276` | B. Longinus | 1 |
| Third Year/criticism_1.json | `q_b3fde4a492f000fdec64` | `q_c7820a12d65bf58fcc5d` | A. literature | 0 |
| Third Year/criticism_1.json | `q_445b3a2141e65a925548` | `q_1bc9f66e3f2f943f6660`<br>`q_e62ca4b4cd8756aa6ab8`<br>`q_5d555a0ff7c457d57d2d` | A. True | 0 |
| Third Year/criticism_1.json | `q_56031ca485c296ea2fd3` | `q_5d400e789a990478233f`<br>`q_eb6492c9923af9c95606` | B. False | 1 |
| Third Year/criticism_1.json | `q_26546b82787167eb867e` | `q_75ed55e6b8a7af91e74f`<br>`q_1db61df92fc799e1812e` | B. New Historicism | 1 |
| Third Year/criticism_1.json | `q_3e08183b1ace74f2fdec` | `q_02e0287140d3c2fd20c7`<br>`q_0a084b3587993688b05f` | A. Intertextualists | 0 |
| Third Year/criticism_1.json | `q_88f1bd8bc4fdbbefa99f` | `q_c5762c32ea535fd647de` | B. differences | 1 |
| Third Year/criticism_1.json | `q_d83fe0435a78a6769897` | `q_7a57952a80a58f451bf8`<br>`q_9323cfcc706b1db19183`<br>`q_bd0197058956e4e9f8a1` | D. imitations | 3 |
| Third Year/criticism_1.json | `q_e2fee532c78530147cbb` | `q_38ff7e2a200fa5e55c8a`<br>`q_3ed127166130ac2841e7` | D. a and b | 3 |
| Third Year/criticism_1.json | `q_157985a612b2e54dd4c0` | `q_21eed09d8c4b0c5d9dfe`<br>`q_26ae92e73f97564357d1` | A. True | 0 |
| Third Year/criticism_1.json | `q_c259795e65010f752bd2` | `q_d4bf038d9008fc6c00de`<br>`q_656ca51367708c6489b0` | A. True | 0 |
| Third Year/criticism_1.json | `q_7c50086d68352f640c9a` | `q_04014cbc601ab0724f94`<br>`q_1b7649aba1e1de04893d` | D. Longinus | 3 |
| Third Year/criticism_1.json | `q_59e9c25476587c96089c` | `q_caa67237def6b208511b` | D. both a and b | 3 |
| Third Year/criticism_1.json | `q_048c0fcf52025fca5945` | `q_4a62c628eb4bfbc4eef2` | B. false | 1 |
| Third Year/criticism_1.json | `q_a4b27bad05d3b17a2151` | `q_40d66f0cfd612c372c1c` | A. Formalists | 0 |
| Third Year/criticism_1.json | `q_d12c89c086fa1c3c2a6d` | `q_be1f247169d7d8d89ede`<br>`q_9bcb2c805c289221bbef` | C. Coleridge | 2 |
| Third Year/criticism_1.json | `q_c1485f5415ecb4ee9ffe` | `q_ca8b7227e8ee9833707b`<br>`q_82163ded22dcb49e719b` | D. Selden's | 3 |
| Third Year/criticism_1.json | `q_f27a64bffba99938ef0a` | `q_e00ad833761e9540a660`<br>`q_30d0f7f2471d5d30a982` | cognitive | 3 |
| Third Year/criticism_1.json | `q_4a274ecd3a9f45825795` | `q_a716d043c94bbdab1fa9` | Reader-response | 0 |
| Third Year/criticism_1.json | `q_3cd4884a01be3da1cd44` | `q_787c9da60a7f987992f4`<br>`q_5c50aacfc66c3effc7e1` | German | 3 |
| Third Year/criticism_1.json | `q_7b21d2f1e6a4ab88a354` | `q_6b085f016a23087948fb` | Derrida | 0 |
| Third Year/criticism_1.json | `q_1e40923ec2bb6520a9f9` | `q_45a4a1ce861cb7135baa` | Romantic | 2 |
| Third Year/criticism_1.json | `q_75c6ceb92bb5b77706e0` | `q_2ada735374a07944080a`<br>`q_69f054c1c9a132705e2f` | logocentric | 3 |
| Third Year/criticism_1.json | `q_16cdb933d68c04da4ed3` | `q_8bc74b74e4ee15ebe170` | Reader-response critics | 3 |
| Third Year/criticism_1.json | `q_1a5fac62ff998f2ec666` | `q_7e7175c0163ca5fb2a07`<br>`q_ccd855f78272c82ade8d`<br>`q_1fa0e628744b1efd2568` | Plato | 1 |
| Third Year/criticism_1.json | `q_cbc7e58f58461a7c951c` | `q_9137da409826dd9f66c2` | Aristotle's | 3 |
| Third Year/french.json | `q_9d1bfc0569bcad643b2e` | `q_95dfce0b0f6a149de2b1` | vient | 1 |
| Third Year/french.json | `q_1633d852a7f06687f48b` | `q_a9e7b60a732c920e067a` | au bureau | 2 |
| Third Year/french.json | `q_e3fc3355a29fb7c6f6a0` | `q_1f7f33ed13e7ddfe3580` | condiment | 1 |
| Third Year/french.json | `q_3c5b8dbdc1f2f3920a74` | `q_a8a8c1a6a4de41be7e68` | échouer | 0 |
| Third Year/french.json | `q_f829046ea149158bea97` | `q_02fbf1cf37e98ae80c3e` | du | 1 |
| Third Year/french.json | `q_8dd45b2fec03898059ae` | `q_172b6f68cb25ba7a7834` | pourrais | 3 |
| Third Year/french.json | `q_cff476d7625224931bde` | `q_9867f5618d3e23285d4f` | rivière | 1 |
| Third Year/french.json | `q_4b26f9fe2ed3473b6ee4` | `q_06d947466b88c3198afd` | bibliothèque | 3 |
| Third Year/french.json | `q_5c72ba32aeb3ef35665b` | `q_aeaff9d38bfb05700d2b` | une | 3 |
| Third Year/french.json | `q_5d2716a8b28d735f4cb1` | `q_734c7a680251692fe5a2` | une | 1 |
| Third Year/french.json | `q_db00e0324f48e55a109b` | `q_be650726f17a1cefa038` | Quelle | 1 |
| Third Year/french.json | `q_59037d7a4eb4d77b69f1` | `q_a2e50bf7e000c737e576` | l'auteur | 1 |
| Third Year/french.json | `q_7a1a0cf9f410589b7cee` | `q_8068af8c4496263c10aa` | jolie | 1 |
| Third Year/linguistics_1.json | `q_b367d3f3b1b505db577d` | `q_e1b3048fbb22be394707`<br>`q_329612dc2d3b46260a27` | sociolinguists | 3 |
| Third Year/linguistics_1.json | `q_8ba6c3ded9f5337de572` | `q_1aa54eef270ac7d8912f` | Short, simple sentences, high pitch, and exaggerated intonation | 1 |
| Third Year/linguistics_1.json | `q_fc6bfdd399b098955b40` | `q_1f1d4c4d85bd6c86c4c9` | Broca's and Wernicke's areas | 0 |
| Third Year/linguistics_1.json | `q_35de57f536c0a3e75e68` | `q_47d4958d62952e1916c9` | Convergence | 2 |
| Third Year/linguistics_1.json | `q_5f5280b26895cddde751` | `q_d03c09f39a60997b02f3` | Intuitive analysis of instances of the language heard in context | 0 |
| Third Year/linguistics_1.json | `q_1812d683bfc0eb4bae5c` | `q_6ef28e804cba250aa66a` | An accurate phonological outline of the word | 1 |
| Third Year/linguistics_1.json | `q_75ef44b58ae6c284675b` | `q_e594a2913cb080a951d5` | crying, cooing, babbling, gestures | 2 |
| Third Year/linguistics_1.json | `q_827b542985e09e67a62f` | `q_24f73c668afa294ffb47` | Linguistics | 2 |
| Third Year/play_third_year.json | `q_86a0c03437d7a49ee945` | `q_914e277d293cfa5f0029` | True | 0 |
| Third Year/play_third_year.json | `q_adde6726c03c1f6b39eb` | `q_0025b89f6168ff4952bf`<br>`q_0332a79c0966ac05eda2`<br>`q_ac27a7dd9844c23f1900` | True | 0 |
| Third Year/play_third_year.json | `q_11f6b76532a0250327ef` | `q_1742d427d3bf63479360`<br>`q_80e6db46b1fd3bb52584` | False | 1 |
| Third Year/play_third_year.json | `q_62b5624ecba651f1c9db` | `q_2240cbcb5d234a9e0ec7`<br>`q_71bab7eda7a05210cae3` | Ventidius | 2 |
| Third Year/play_third_year.json | `q_824897867cd84b5ac5fe` | `q_3f8f7f432bdba937f3f0`<br>`q_cf86c9fc8ffc90093b2e` | Dollabella | 3 |
| Third Year/play_third_year.json | `q_6c23a43e91cdd8cd2315` | `q_e8e8b9030b2a8e9acdf3`<br>`q_5e0f8dfe10dceef7fa1f` | Millamant | 2 |
| Third Year/play_third_year.json | `q_28e2b920249d749b85f7` | `q_b7f3cff40fc27c6248b6` | to please | 0 |
| Third Year/play_third_year.json | `q_113da75fad1d5127872b` | `q_96ba56b26e26c1606cd4`<br>`q_58d331cd979b162bd6f7`<br>`q_2f292c34e9a421df5876` | drama | 0 |
| Third Year/play_third_year.json | `q_7fae0c5101e5a82a9bbb` | `q_ce45c0eee845c2132a81`<br>`q_a78a0e9c2f3d751dd5e8` | fail | 1 |
| Third Year/play_third_year.json | `q_9470140a001da9231142` | `q_4ee7b6edaf99eaa3acd6`<br>`q_bcca5a27ea4ecc2da257` | starts | 2 |
| Third Year/play_third_year.json | `q_5e80eb718ea1459606e1` | `q_3ee95ca94cbe28301d4f` | was | 0 |
| Third Year/play_third_year.json | `q_dd5d128aa3afb269ed49` | `q_0c9deccbccc6b50479bc`<br>`q_7f98302a088fb67c14d8` | imitate | 0 |
| Third Year/play_third_year.json | `q_a4c7a46b3631def94e9e` | `q_03f53b842c9096300f03`<br>`q_1e79aefaefc5ae78d967` | I loved Antony | 1 |
| Third Year/play_third_year.json | `q_f9d911d0774b75918e70` | `q_362a5a974c86cebd1f6b`<br>`q_29658c78ec03dc9d0b53` | D. A&B | 3 |
| Third Year/play_third_year.json | `q_cfa4c9f3d4cbb771eec0` | `q_ff31a8578441d9f05615` | False | 1 |
| Third Year/play_third_year.json | `q_61efc471d9be79beafec` | `q_c8e639193b1f95b5de12`<br>`q_1fb996194820b61173c9` | False | 1 |
| Third Year/play_third_year.json | `q_f1caa9e6127f1bd1ad6b` | `q_d03f85c8104aef2ce88d`<br>`q_44dfd97430db0b10d1dc`<br>`q_1cef58d0b21e6924c342` | False | 1 |
| Third Year/play_third_year.json | `q_bc00943c5f591d5fd5b7` | `q_53daaf4da57d6954c679` | True | 0 |
| Third Year/play_third_year.json | `q_dd59ab13966cc36602bf` | `q_47996679232c5d044fd2` | True | 0 |
| Third Year/play_third_year.json | `q_70c1485c9b5d8ba20a53` | `q_aa0f9a41bb6e2693c847` | False | 1 |
| Third Year/play_third_year.json | `q_5cc9be1b447dfb245b57` | `q_3dd118ecbab8f35b7fd8` | a reason | 2 |
| Third Year/play_third_year.json | `q_d81ac17c6d3aee498e18` | `q_fd68f40a33960ca07bc7` | to show her duty | 0 |
| Third Year/play_third_year.json | `q_86cc94f88edc3eaf76aa` | `q_040b4fbae93bd7ec51d9`<br>`q_1dd80a3eeb83c6d27c72` | Octavia | 2 |
| Third Year/play_third_year.json | `q_88eb0098eee669c24ffe` | `q_ae798d9b2f09f49f0717`<br>`q_e7c0711d2467ceddcd05` | ridiculous | 1 |
| Third Year/play_third_year.json | `q_307ab8bd95d30edf0d6d` | `q_6b7b66fdc1cbc7b757fb`<br>`q_d03f603f081d7bba0174` | natural | 0 |
| Third Year/play_third_year.json | `q_ce99203064edb4e7d6e9` | `q_e2fa8ca552be6e6c59b4` | refute | 2 |
| Third Year/play_third_year.json | `q_8646e95c3f1b68162e8d` | `q_86370d048f50cd0b3162` | greatness | 3 |
| Third Year/play_third_year.json | `q_6c9001d878382c2c9d82` | `q_622d532f0a69cd1840b8`<br>`q_1c3276ad39ee21385d54` | a ridicule | 1 |
| Third Year/play_third_year.json | `q_afe6de7838ecb8d467cf` | `q_0168968dea9feb0ccf42` | Mrs. Marwood | 0 |
| Third Year/play_third_year.json | `q_77f6e6e30e2f50f6b63d` | `q_eec6e5370c1c988fa14e`<br>`q_0c0444763943cf3f8c9e` | freedom | 2 |
| Third Year/play_third_year.json | `q_4dff54207d45204ae04d` | `q_d62cdf77a6751142e912`<br>`q_6738a84aabb62868908e` | Sir Wilfull | 2 |
| Third Year/play_third_year.json | `q_dc0ceb00a1c89d8d140e` | `q_910db4163e461b72c97d` | False | 1 |
| Third Year/play_third_year.json | `q_18ee0e44f4690fd2761f` | `q_993734fa7d002146362d`<br>`q_4babb3ea207561cb8bc9` | prestige | 2 |
| Third Year/play_third_year.json | `q_0518ba05ce2415a1f250` | `q_9b22c24a3d8a25208353` | but I betrayed you not | 0 |
| Third Year/play_third_year.json | `q_ed457290d0f40e063f40` | `q_5af43da9fb3e5a2feeac` | a reaction against | 2 |
| Third Year/play_third_year.json | `q_49fad544874e1552a8a3` | `q_f2f15ed80e8e5794b64d` | natural | 3 |
| Third Year/play_third_year.json | `q_d02613739cb4f3532d3c` | `q_8d5debd9b52e524aa099` | friend | 1 |
| Third Year/play_third_year.json | `q_5337e7986ccd72e1f02f` | `q_ca72e02481a4a6938034` | jealous | 2 |
| Third Year/play_third_year.json | `q_4e85767debeb410c9d9a` | `q_c682b6f57a5102a69149`<br>`q_547b5cf21c6e0586dce3` | B & C | 3 |
| Third Year/play_third_year.json | `q_e19d158f6fe5f7517980` | `q_f1257290b2215aec56d6` | Mirabell | 1 |
| Third Year/play_third_year.json | `q_9d9eccab6c9c4ebd1c1a` | `q_87532522b316e11fe9a3` | a cautious | 0 |
| Third Year/play_third_year.json | `q_ad5f8521b4272e708a80` | `q_3f79c784613c7a603250` | reason | 1 |
| Third Year/play_third_year.json | `q_3dceb39af5e5a104f8ac` | `q_9e7b1b1378dcfebede7e`<br>`q_92714c221f343e884717` | approbation | 0 |
| Third Year/play_third_year.json | `q_71a9c72ebf57c32ae034` | `q_16751bf1bc5457837514` | barbarous | 1 |
| Third Year/play_third_year.json | `q_719b1fec445b754c3ccc` | `q_b18f16d3ac3cc478995f` | jealousy | 0 |
| Third Year/play_third_year.json | `q_0b0cc7ae692dc2103d65` | `q_2060d4d88f64afa085f0` | vicious | 1 |
| Third Year/play_third_year.json | `q_7da9a26b26ed3ac31abf` | `q_f60c42bd08b748f26412` | 1700 | 2 |
| Third Year/play_third_year.json | `q_6f37cd9534a233a18367` | `q_078422977624ef41284e` | essential | 0 |
| Third Year/play_third_year.json | `q_1ef5bf50b1ad4a7c7f92` | `q_be0ce763400e8d8d4ff1` | manipulate each other | 0 |
| Third Year/play_third_year.json | `q_a4c308e489e4e96a6648` | `q_679e65cdcac093b21dcf` | False | 1 |
| Third Year/play_third_year.json | `q_4530081425fb4c5186e0` | `q_6b3b80a17b4e98c78a1c`<br>`q_c1342b4137832a895da6` | False | 1 |
| Third Year/play_third_year.json | `q_a9e92f86bdbad905a200` | `q_a4697e673aa60f002f4a` | Fainall | 1 |
| Third Year/play_third_year.json | `q_3f6843b57a55e26ee0c6` | `q_552c6518095b464232be` | general | 0 |
| Third Year/romantic_poetry_3.json | `q_79a39b4e606546f6ed61` | `q_0ff4acb16517b4cd5a37`<br>`q_225d4541b7d895632c02`<br>`q_3142e0c7a6504ec56c1a`<br>`q_7243dc0c6001406dc9f4`<br>`q_8221b367ccfa70b51241` | Literary | 2 |
| Third Year/romantic_poetry_3.json | `q_5880e058ede20283033c` | `q_18cf29458c177f384062`<br>`q_425bc4b4f0552c6adcf3`<br>`q_bf2db1206af9840be66e`<br>`q_cb036e8fe91ebf82cd03` | emotions | 2 |
| Third Year/romantic_poetry_3.json | `q_c994d95cb0ac58dad431` | `q_c817f21c9975cf1c3d85`<br>`q_316f5646bb8c5c6745b3`<br>`q_35b0be6a8d1823a1ce78`<br>`q_322de0bd63d2e4f29658`<br>`q_53101a74021a16059f58` | originality | 2 |
| Third Year/romantic_poetry_3.json | `q_8fb1b0c45f7a0ef1d456` | `q_67e2326dab570e8e3bc0`<br>`q_7caf3f1c4cbc9f06235a` | nationalism | 2 |
| Third Year/romantic_poetry_3.json | `q_890605086dbad82422f7` | `q_04f208238e3f50361b84`<br>`q_a8ea8e441c6c68a1721f` | preceded | 0 |
| Third Year/romantic_poetry_3.json | `q_68b12646f2c32abdfe1b` | `q_008fabdba1eb1b20731d`<br>`q_56e9fceb61c65bc7cede` | Sturm und Drang | 0 |
| Third Year/romantic_poetry_3.json | `q_57a64d1135666af949f3` | `q_f967f43b468598b85867`<br>`q_25756c2f49585982eef2`<br>`q_c3a1d5775bf9314f2154`<br>`q_e5c9da0959f0ab7fa6da`<br>`q_2ac978c5dfcb0c5b47c7` | the scientific Revolution | 2 |
| Third Year/romantic_poetry_3.json | `q_ffc5a670bba3f0ddf495` | `q_829fd831ce073cc7fb1c`<br>`q_3d5ea5791a9ab91c4291`<br>`q_071615f59a3cac5aae92`<br>`q_def6c291e70c7ca8743c` | three | 0 |
| Third Year/romantic_poetry_3.json | `q_9d1950f7eebac918ffa9` | `q_d6ec493a02195c483d44`<br>`q_07b9899b9fd275e6546b` | blank verse | 2 |
| Third Year/romantic_poetry_3.json | `q_4c338916e2703d737406` | `q_517dba2ab67b56676940`<br>`q_32a530c2c86deff5925b` | four cantos | 1 |
| Third Year/romantic_poetry_3.json | `q_0413bd1af0cf5fbd41f9` | `q_df767531b4002231c404`<br>`q_bab0129e98150ee25ca2` | change as a noble truth | 3 |
| Third Year/romantic_poetry_3.json | `q_e4da7e9a5dd32bfd6667` | `q_c7bea2f6d5d222df23c8`<br>`q_7478cade482f053a4ce5` | kings | 0 |
| Third Year/romantic_poetry_3.json | `q_faf5fc57070785f37e34` | `q_3edacbf811a35d95752e`<br>`q_6797c15d0e1c944cd8be` | the spirit of inspiration | 2 |
| Third Year/romantic_poetry_3.json | `q_0844ec6cb7d53e50f031` | `q_22c3918c4b5282058fc0`<br>`q_a547660bd22d9b61bf5e` | forest | 2 |
| Third Year/romantic_poetry_3.json | `q_1d6cf3a31b735578674e` | `q_b23a1e3d4b5cb0f3a3cc`<br>`q_eb3cefaab1ae49ebab03` | a merciless destroyer and creator | 1 |
| Third Year/romantic_poetry_3.json | `q_e4a0354d692aca418450` | `q_8bad6e02ddd2e08aeb15`<br>`q_3eb4cfaa01aafe091529` | A stormy ocean | 3 |
| Third Year/romantic_poetry_3.json | `q_b3d53fe5b1ac30f9d03d` | `q_9a1163e9bdfa6afa6489`<br>`q_601d09541d73319c2c51` | Absolute | 2 |
| Third Year/romantic_poetry_3.json | `q_7d7ced7cdc3db1131c57` | `q_4cb45088e95450879264`<br>`q_48b1f08e1bfb0970af6c`<br>`q_69091fe162b3a9c908cb` | Wordsworth | 3 |
| Third Year/romantic_poetry_3.json | `q_47deb946f16e15db9d93` | `q_b4a0e4faf3238f5aae47`<br>`q_6c306e119aa71560c0b6` | Blake | 1 |
| Third Year/romantic_poetry_3.json | `q_9a85b5b4d3768db52af4` | `q_02422f8c9830ef4e7b67`<br>`q_2de26346a5727f887df0`<br>`q_356c9ece5fd22032ec27` | Imagination | 0 |
| Third Year/romantic_poetry_3.json | `q_4254225fd441fc303287` | `q_648c1792be04263a58db`<br>`q_94f5216302cdc4274529`<br>`q_f94c71b64741526d4133` | To a Skylark | 2 |
| Third Year/romantic_poetry_3.json | `q_81974b7d81dfe28a333c` | `q_abfbf535d03b40a42f9f`<br>`q_c3b3a1898b1273e63136` | Hymn to Intellectual Beauty | 3 |
| Third Year/romantic_poetry_3.json | `q_a88ff3fd4255e98a19ad` | `q_1b502f80951ec35792fe`<br>`q_61f0979b65c8530a3914`<br>`q_de74580e94235ff26bbd` | human nature | 1 |
| Third Year/romantic_poetry_3.json | `q_55032b50d6c271ca82b2` | `q_0a0cf9e8a8b5d66aa550`<br>`q_990b09b270d0e41c61b9` | Blake | 3 |
| Third Year/romantic_poetry_3.json | `q_94e8a6bcb9b39422143d` | `q_46c7e20ea0dbcbfd22b0`<br>`q_b3b9f3bb9b3defb01bbe` | Ozymandias | 0 |
| Third Year/romantic_poetry_3.json | `q_074ecf07c720245a8c76` | `q_7f98c36dd25dea978e75`<br>`q_1eea6a33072c3ba2684d` | True | 0 |
| Third Year/romantic_poetry_3.json | `q_3117ddb2d51429ed0edc` | `q_0639806575ef42720fbd`<br>`q_552057e7c334c1af0170` | True | 0 |
| Third Year/romantic_poetry_3.json | `q_d66f439153a038f407e8` | `q_d44d7bd8ec774cd30d08`<br>`q_ba3d5865ded7dab7c314` | True | 0 |
| Third Year/romantic_poetry_3.json | `q_d1498e8593755479241b` | `q_8064ae1cd6b190c92114`<br>`q_324f40f0a38b66780dd5` | False | 1 |
| Third Year/romantic_poetry_3.json | `q_944341ba88995aebb669` | `q_c524d61cb2def00f0fac`<br>`q_d52b6d25a81a7f3bbcad` | False | 1 |
| Third Year/romantic_poetry_3.json | `q_4bfb78196d708ecabfea` | `q_bb840b1ee450694f2e64`<br>`q_972eae26b5037c915bac` | False | 1 |
| Third Year/romantic_poetry_3.json | `q_54999097f679225490d5` | `q_930ff26fb84ba0a70b57`<br>`q_f7bbe565dcaeeef9fa20` | True | 0 |
| Third Year/romantic_poetry_3.json | `q_999e100221669da41c4e` | `q_bf8f9e68fd6caf222280`<br>`q_67a4f4f9968c17f082cf` | False | 1 |
| Third Year/romantic_poetry_3.json | `q_353941bf3a39471f7aac` | `q_a433c7671ba6aa495ac9`<br>`q_92c2d5406d386b378af0`<br>`q_d27f247b83738007ba5e` | False | 1 |
| Third Year/romantic_poetry_3.json | `q_6d0204581e64a62c779d` | `q_ad487957741afb53f4a8`<br>`q_2badd310eae4f3f3c51a` | False | 1 |
| Third Year/romantic_poetry_3.json | `q_50bcf2975e90d3ba4f2b` | `q_bfc5326fc4d95294090c`<br>`q_9762d4c7ff552e3f7684` | True | 0 |
| Third Year/romantic_poetry_3.json | `q_8345c480d1cfe91e37c9` | `q_3ecdfa561287e2becca3`<br>`q_61a989a937ed82a87c44` | False | 1 |
| Third Year/romantic_poetry_3.json | `q_04fd76b138a34b99ddce` | `q_55bfae83988a0194dfc6`<br>`q_86e92c8da76097b625ef` | objectivity | 1 |
| Third Year/romantic_poetry_3.json | `q_60c02665b62745588b79` | `q_b2a96ac598df91e0e203` | Francis Bacon | 0 |
| Third Year/romantic_poetry_3.json | `q_a8713791a4d69a730ee6` | `q_92b9a4d260059ea15408` | Not necessarily either | 2 |
| Third Year/romantic_poetry_3.json | `q_313dcda4a33c2a64777a` | `q_a0ee68f5885fde344967` | Urbanism | 2 |
| Third Year/romantic_poetry_3.json | `q_8427f62d9c92ecd069f4` | `q_f4035ecaaac4c22b301f`<br>`q_8ff3aa85e96cb038d0a3` | The Great Famine | 0 |
| Third Year/romantic_poetry_3.json | `q_cf40a7d35420ecdbddad` | `q_0ec20d6f4cd3de6929b8`<br>`q_7e3ccb405b344117f7aa` | Age of Enlightenment | 2 |
| Third Year/romantic_poetry_3.json | `q_d457d423db02060221a4` | `q_2e02df0bcaf5309624b5` | Shelley | 3 |
| Third Year/romantic_poetry_3.json | `q_93e47520d565b8081237` | `q_b83792641e2197723047` | Blake | 1 |
| Third Year/romantic_poetry_3.json | `q_f59fe3fe945af7be720e` | `q_a329c69751cca677ed72` | Coleridge | 2 |
| Third Year/romantic_poetry_3.json | `q_1bdd5f5cfd1e901b823f` | `q_e1e541b689bab9f268ed` | Shelley | 3 |
| Third Year/romantic_poetry_3.json | `q_716314c8ba61d22f4ecc` | `q_fdba67db0042b2fd86be` | Wordsworth | 0 |
| Third Year/romantic_poetry_3.json | `q_3dd715cfbca0993a79d0` | `q_005cbc80600862f90e35` | Shelley | 3 |
| Third Year/romantic_poetry_3.json | `q_4c3de2411bf491d6a7fd` | `q_76863bdb1df872fe9955` | Shelley | 3 |
| Third Year/romantic_poetry_3.json | `q_97cb6919d5a88b2cc748` | `q_f6fe0d8a00973b4d2d7b` | Coleridge | 2 |
| Third Year/romantic_poetry_3.json | `q_cea2b6ac6963730057ef` | `q_27eef9b79dada1006c4a` | Blake | 1 |
| Third Year/romantic_poetry_3.json | `q_dbacaf66385858d60adf` | `q_e3ecd58b3e09a7180c28` | Wordsworth | 0 |
| Third Year/romantic_poetry_3.json | `q_d06058c6d50250db427e` | `q_eaf590aeca68422ecfae` | rationalism | 2 |
| Third Year/romantic_poetry_3.json | `q_6248bab63912a749a8c4` | `q_15f5c772749099e9decf` | an ode | 0 |
| Third Year/romantic_poetry_3.json | `q_b93086e03613da5446b2` | `q_2fe6c294d105a00b8c13` | melancholic | 1 |
| Third Year/romantic_poetry_3.json | `q_b0df603487b76384b58a` | `q_691b2acb8d8a23a86173` | Serious | 2 |
| First Year/Introduction_to_Drama.json | `q_9b06c06a6f593e833846` | `q_b12426e6cac01b89dcfe` | aesthetic beauty | 0 |
| Second Year/poetry_2.json | `q_a2a43adbcd54846dd9e7` | `q_c4ea0a326a223d587722` | A powerless, temporary state | 2 |
| Third Year/criticism_1.json | `q_90622f9ab2a59421e3dd` | `q_793ee88ffbc89ef24684` | scientific | 2 |
| Third Year/criticism_1.json | `q_e287cb4ff727314e82ee` | `q_47ec8fb52604d9b80bea` | spectacle | 1 |
| Third Year/criticism_1.json | `q_419887bd41374bac8293` | `q_1d167ecb3100bb5ce599` | Aristotle's | 3 |
| Third Year/criticism_1.json | `q_31e82bd5ac39febf9b86` | `q_1e40923ec2bb6520a9f9` | Romantic | 2 |
| Third Year/french.json | `q_4c22cf2a520b2d600bc0` | `q_7b4b797d1fa4bd6353e8` | elle | 3 |
| Third Year/french.json | `q_15c46ce5607bc0d7ced9` | `q_49fa892977f430fc17d9` | elles | 3 |
| Third Year/play_third_year.json | `q_653c9901b63e7a293f31` | `q_adde6726c03c1f6b39eb` | herself | 0 |
| Third Year/play_third_year.json | `q_2906a7d3c5a82da7d263` | `q_dc0ceb00a1c89d8d140e` | actors | 1 |

## تعارضات الإجابة التي حُسمت يدوياً

| file / keeper | IDs retired | القرار الصحيح | المبرر/المصدر |
|---|---|---|---|
| Third Year/criticism_1.json / `q_82dc469f79c85f77bbc0` | `q_729c8e9cfedef558d370`, `q_65dddb2bb2dd151ba397`, `q_d7884514455e8ae2bd62` | impossibility, possibility | أرسطو يفضّل المستحيل المحتمل على الممكن غير المقنع. [Aristotle, Poetics — MIT Classics](https://classics.mit.edu/Aristotle/poetics.3.3.html) |
| Third Year/criticism_1.json / `q_3623cfbd56f85cb28a90` | `q_fbdf9f86d2e4457b2eb7` | demigods **and** writers of genius (`A & B`) | الخياران المركبان متكافئان دلالياً بعد اختلاف ترتيب الخيارات. [Longinus, On the Sublime, primary text](https://www.attalus.org/translate/longinus2.html) |
| Third Year/romantic_poetry_3.json / `q_c994d95cb0ac58dad431` | `q_c817f21c9975cf1c3d85`, `q_316f5646bb8c5c6745b3`, `q_35b0be6a8d1823a1ce78`, `q_322de0bd63d2e4f29658`, `q_53101a74021a16059f58` | originality | مفردة `freedom` كانت مفتاحاً شاذاً؛ المقصود بموضوعية الرومانسية هو أصالة الذات الفردية. |
| Third Year/romantic_poetry_3.json / `q_ffc5a670bba3f0ddf495` | `q_829fd831ce073cc7fb1c`, `q_3d5ea5791a9ab91c4291`, `q_071615f59a3cac5aae92`, `q_def6c291e70c7ca8743c` | three | قوانين الإصلاح البرلماني الثلاثة: 1832 و1867 و1884. [UK Parliament research briefing](https://commonslibrary.parliament.uk/research-briefings/rp13-14/) |
| Third Year/romantic_poetry_3.json / `q_e4da7e9a5dd32bfd6667` | `q_c7bea2f6d5d222df23c8`, `q_7478cade482f053a4ce5` | kings | `distress` موجودة في القصيدة؛ `kings` ليست فيها. [Wordsworth, primary text — Project Gutenberg](https://www.gutenberg.org/files/47143/47143-h/47143-h.htm) |
| Third Year/romantic_poetry_3.json / `q_0844ec6cb7d53e50f031` | `q_22c3918c4b5282058fc0`, `q_a547660bd22d9b61bf5e` | forest | النص يذكر الظل العابر بين أزهار الغابة. [Shelley, Hymn to Intellectual Beauty](https://www.poetryfoundation.org/poems/45123/hymn-to-intellectual-beauty) |
| Third Year/romantic_poetry_3.json / `q_47deb946f16e15db9d93` | `q_b4a0e4faf3238f5aae47`, `q_6c306e119aa71560c0b6` | Blake | أُعيدت صياغة السؤال: بليك نسخ آثار Westminster Abbey أثناء تدريبه في النقش؛ لم يكن السؤال الأصلي عن مهنة ترميم كنائس حرفياً. [The Metropolitan Museum of Art](https://www.metmuseum.org/exhibitions/listings/2001/william-blake) |
| Third Year/romantic_poetry_3.json / `q_4254225fd441fc303287` | `q_648c1792be04263a58db`, `q_94f5216302cdc4274529`, `q_f94c71b64741526d4133` | To a Skylark | احتُفظ بمجموعة خيارات واحدة واضحة؛ القصيدة Ode وليست sonnet. [Poetry Foundation](https://www.poetryfoundation.org/poems/45146/to-a-skylark) |
| Third Year/romantic_poetry_3.json / `q_55032b50d6c271ca82b2` | `q_0a0cf9e8a8b5d66aa550`, `q_990b09b270d0e41c61b9` | Blake | بليك هو الشاعر الرؤيوي في هذا السياق. [Poetry Foundation — William Blake](https://www.poetryfoundation.org/poets/william-blake) |
| Third Year/romantic_poetry_3.json / `q_3117ddb2d51429ed0edc` | `q_0639806575ef42720fbd`, `q_552057e7c334c1af0170` | True | لقب Shelley المدرسي كان “Mad Shelley”، ووُصف Blake بالجنون في تلقي معاصريه؛ أبقيت العبارة كما في المقرر. [Eton College Collections](https://collections.etoncollege.com/rebel-with-many-causes-percy-bysshe-shelley/) |
| Third Year/romantic_poetry_3.json / `q_4bfb78196d708ecabfea` | `q_bb840b1ee450694f2e64`, `q_972eae26b5037c915bac` | False | خاتمة القصيدة تجعل الشجرة تنمو في الدماغ البشري، لا بوصفها خلق الآلهة. [Blake, primary text — Project Gutenberg](https://www.gutenberg.org/files/1934/1934-h/1934-h.htm) |
| Third Year/romantic_poetry_3.json / `q_6d0204581e64a62c779d` | `q_ad487957741afb53f4a8`, `q_2badd310eae4f3f3c51a` | False | أعيدت الصياغة لتمييز relief etching عن intaglio engraving العادي. [The Met — William Blake](https://www.metmuseum.org/exhibitions/listings/2001/william-blake) |
| Third Year/romantic_poetry_3.json / `q_d06058c6d50250db427e` | `q_eaf590aeca68422ecfae` | rationalism | الخيار الأوضح والأقل أثراً في الرومانسية، بينما supernatural وspirituality من سماتها المحورية. |
| Third Year/romantic_poetry_3.json / `q_cf40a7d35420ecdbddad` | `q_0ec20d6f4cd3de6929b8`, `q_7e3ccb405b344117f7aa` | Age of Enlightenment | Methodism/Evangelical Revival حركتان من القرن الثامن عشر، لا العصر الفيكتوري. [The Methodist Church — History](https://www.methodist.org.uk/about/history/) |
| Third Year/play_third_year.json / `q_3dceb39af5e5a104f8ac` | `q_9e7b1b1378dcfebede7e`, `q_92714c221f343e884717` | approbation | `approval` و`approbation` متكافئتان هنا؛ احتُفظ بتهجئة خيار keeper. |
| Third Year/play_third_year.json / `q_1ef5bf50b1ad4a7c7f92` | `q_be0ce763400e8d8d4ff1` | manipulate each other | التصحيح المتعارض الآخر لا يوافق ديناميكية الشخصيات في السؤال. |

## CORRECTIONS — أخطاء مستقلة عن التكرار

| file | id | correct answer | new prompt/options | rationale / source |
|---|---|---|---|---|
| First Year/Comprehension_1.json | `q_319721eb44d30098ddd8` | adjourn (index 1) | q: Which verb means ‘to suspend a legal case or hearing until a later time’? | To adjourn is to suspend proceedings until a later time, not to dismiss a case permanently. [Cambridge Dictionary — adjourn](https://dictionary.cambridge.org/us/dictionary/english/adjourn) |
| Second Year/history.json | `q_687d1d99c44f994923a3` | True (index 0) | — | Beowulf was composed in Anglo-Saxon England. [Tolkien Estate — Understanding Beowulf](https://www.tolkienestate.com/scholarship/leo-carruthers-understanding-beowulf/) |
| Second Year/history.json | `q_4926e2854a544e94def0` | William Tyndale (index 0) | — | Tyndale translated from Hebrew and Greek; Coverdale relied substantially on earlier translations. [Cambridge University Press excerpt on Tyndale/Coverdale](https://assets.cambridge.org/97805217/68276/excerpt/9780521768276_excerpt.pdf) |
| Second Year/history.json | `q_23a36f0feadbd0be3395` | False (index 1) | — | The biblical Apocrypha normally denotes deuterocanonical/Old Testament books, not 'suspect books of the New Testament'. [Library of Congress glossary — Apocrypha](https://www.loc.gov/exhibits/scrolls/glos.html) |
| Second Year/poetry_2.json | `q_2e60271ec7a7e68314d4` | young shepherds or country youths (index 2) | options: Servants / Attendants / young shepherds or country youths / Wives | In pastoral usage, swains are young shepherds or rustic country youths. [Merriam-Webster — swain](https://www.merriam-webster.com/dictionary/swain) |
| Third Year/criticism_1.json | `q_f004adf2a7541b751fba` | the text/form of the poem (index 1) | options: the poet's life / the text/form of the poem / the reader / all | Formalism/New Criticism studies the literary text's form and internal relations rather than biography or reader response. [LibreTexts — Formalism/New Criticism](https://human.libretexts.org/Courses/Western_Technical_College/American_Literature_1865-Present_%28Bodelson%29/04%3A_Critical_Theory/4.01%3A_Formalism_New_Criticism) |
| Third Year/french.json | `q_7ef62f012d7221a3e984` | vieille (index 1) | options: vieux / vieille / vieilles / vieillie | Maison is feminine singular, so the adjective is vieille. French agreement/spelling correction |
| Third Year/french.json | `q_b893272bac2e4e450d2a` | vingt-cinq (index 1) | options: vingt / vingt-cinq / treize / quinze | Correct spelling: vingt-cinq. French spelling correction |
| Third Year/linguistics_1.json | `q_d78c18475c6d85f4a211` | 2 months (index 0) | options: 2 months / 4 months / 9 months / 12 months | Cooing typically begins around the second month of life. [OpenStax — language in infants](https://openstax.org/books/lifespan-development/pages/3-5-language-in-infants-and-toddlers) |
| Third Year/play_third_year.json | `q_b90a2b0961754c604f5c` | Marwood (index 0) | — | The original text reads, ‘O Marwood, Marwood, art thou false?’ [Congreve, The Way of the World — primary text](https://www.gutenberg.org/cache/epub/1292/pg1292-images.html) |
| Third Year/romantic_poetry_3.json | `q_2f8f16d9b34b19f1fb90` | Samuel Taylor Coleridge (index 1) | options: Wordsworth / Samuel Taylor Coleridge / Byron / Shelley | The lines are from Coleridge's ‘Kubla Khan’; the original options omitted him. [Coleridge, Kubla Khan — primary text](https://www.poetryfoundation.org/poems/43991/kubla-khan) |

## REWRITES — أسئلة صحيحة الفكرة لكن صياغتها مضللة أو عامة

| file | id | new q | source/note |
|---|---|---|---|
| Second Year/poetry_2.json | `q_2d2094f0e61dad7299d7` | ‘One Day I Wrote Her Name’ is a sonnet written by...... | [Spenser, Amoretti LXXV — Poetry Foundation](https://www.poetryfoundation.org/poems/45189/amoretti-lxxv-one-day-i-wrote-her-name) |
| Second Year/poetry_2.json | `q_ec4f4ac5ad9a19897401` | The term ‘Renaissance’ ultimately derives from the Latin ‘renasci’. This word means: | [Merriam-Webster — Renaissance](https://www.merriam-webster.com/dictionary/renaissance) |
| Second Year/poetry_2.json | `q_7c825e6e59f9c851ab60` | Who is credited with introducing the sonnet to France? | [Larousse — Mellin de Saint-Gelais](https://www.larousse.fr/encyclopedie/litterature/Mellin_de_Saint-Gelais/176746) |
| Third Year/french.json | `q_7303a68d12ed8d47eb0a` | 47. Carine est née .......... Roumanie. | صياغة/تهجئة توضيحية؛ الإجابة لم تتغير. |
| Third Year/french.json | `q_57c61f5d1834ce4e566a` | 41. Trouvez l’intrus (bijoux) : | صياغة/تهجئة توضيحية؛ الإجابة لم تتغير. |
| Third Year/french.json | `q_6dd54878591e3bc93e10` | 41. Trouvez l’intrus (fruits) : | صياغة/تهجئة توضيحية؛ الإجابة لم تتغير. |
| Third Year/romantic_poetry_3.json | `q_47deb946f16e15db9d93` | Which Romantic poet, while apprenticed as an engraver, copied medieval monuments in Westminster Abbey? | [The Metropolitan Museum of Art — Blake](https://www.metmuseum.org/exhibitions/listings/2001/william-blake) |
| Third Year/play_third_year.json | `q_a4df584d7cbc5f7bd448` | Congreve’s play Love for Love (1695) [ _____ ]. | [Congreve primary text / publication context](https://www.gutenberg.org/cache/epub/1244/pg1244-images.html) |

## KEEP — تشابه شكلي فقط، وليس سؤالاً واحداً

| file | IDs kept | القرار |
|---|---|---|
| Third Year/french.json | `q_57c61f5d1834ce4e566a`, `q_6dd54878591e3bc93e10` | كلاهما كان بعنوان عام `Trouvez l'intrus`، لكن الأول عن bijoux والثاني عن fruits ولكل منهما خيارات وإجابة مختلفة. احتُفظ بهما مع عنوانين سياقيين مختلفين، وبذلك لن يعود prompt مكرراً. |
| Third Year/criticism_1.json | `q_90622f9ab2a59421e3dd`, `q_419887bd41374bac8293` | الأول يطلب نوع الحساب (`scientific`) والثاني يسأل صاحب Poetics (`Aristotle`). أُزيلت نسخهما المعادة، لكن السؤالين نفسيهما مستقلان. |
| Third Year/criticism_1.json | `q_1a5fac62ff998f2ec666`, `q_f6839099cf4955422` | الأول يسأل من هو الناقد (`Plato`)؛ الثاني يطلب الفعل/الموقف (`police`). لا دمج بين هدفين تعليميين مختلفين. |
| Third Year/criticism_1.json | `q_419887bd41374bac8293`, `q_82b68722ec4629b7f6c3` | الأول عن المؤلف، والثاني عن موضوع المحاكاة/التراجيديا؛ التشابه في الكلمات المحيطة فقط. |
| Third Year/romantic_poetry_3.json | `q_b93086e03613da5446b2`, `q_b0df603487b76384b58a` | كان prompt عاماً متطابقاً، لكنه يعود إلى قصيدتين وسلّمي خيارات مختلفين. قُسِّم إلى سؤال Byron بإجابة `melancholic` وسؤال Shelley بإجابة `Serious`، مع حذف نسخة واحدة من كل سؤال. |

## ملاحظات تطبيقية

- ملف `work/review-years-1-3-actions.json` هو المصدر الآلي الكامل: `mergeGroups`, `corrections`, `rewrites`, `removals`.
- تم تمرير الملف في وضع التحقق فقط عبر `scripts/apply-reviewed-question-fixes.mjs` وكانت النتيجة: `Validated: 231 merge groups (365 removed), 11 corrections, 8 rewrites, 0 invalid removals across 9 files.`
- لم يُستخدم `--apply`؛ لذلك لم تتغير ملفات `work/uni-fixed`.
- عند التطبيق الفعلي، يحتفظ الـkeeper بمعرّفات النسخ المحذوفة في `legacyIds`/`legacyPrimaryIds`، وهو مهم لاستمرار التقدم المحفوظ للمستخدمين.
