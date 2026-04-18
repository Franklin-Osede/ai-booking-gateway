import fs from 'fs';

const filePath = './src/presentation/components/AIAssistantVoice.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Fix bot-res
content = content.replace(
  /fetchAudio\(greeting, "bot-res-" \+ Date.now\(\), \(\) => \{\n\s+setStepInfo\(\{ options: isEng \? \["Hair Transplant", "Hair Loss", "Not Sure"\] : \["Injerto Capilar", "Caída de cabello", "No estoy seguro\/a"\], stepId: 1 \}\);\n\s+\}, \{ overrideVoice: selectedVoice \}\);/g,
  'fetchAudio(greeting, "bot-res-" + Date.now(), () => {\n          setStepInfo({ options: isEng ? ["Hair Transplant", "Hair Loss", "Not Sure"] : ["Injerto Capilar", "Caída de cabello", "No estoy seguro/a"], stepId: 1 });\n       }, { overrideVoice: selectedVoice, intent: "GREETING" });'
);

// Fix bot-0
content = content.replace(
  /fetchAudio\(greeting, "bot-0", \(\) => \{\n\s+setStepInfo\(\{\n\s+options: scripts\?\.ask_service_options \? Object\.keys\(scripts\.ask_service_options\) : \(isEng \? \["Hair Transplant", "Hair Loss", "Not Sure"\] : \["Injerto Capilar", "Caída de cabello", "No estoy seguro\/a"\]\),\n\s+stepId: 1\n\s+\}\);\n\s+\}\);/g,
  'fetchAudio(greeting, "bot-0", () => {\n          setStepInfo({\n            options: scripts?.ask_service_options ? Object.keys(scripts.ask_service_options) : (isEng ? ["Hair Transplant", "Hair Loss", "Not Sure"] : ["Injerto Capilar", "Caída de cabello", "No estoy seguro/a"]),\n            stepId: 1\n          });\n        }, { intent: "GREETING" });'
);

// Fix bot-1
content = content.replace(
  /fetchAudio\(serviceQuestion, "bot-1", \(\) => \{\n\s+setStepInfo\(\{\n\s+options: scripts\?\.ask_service_options \? Object\.keys\(scripts\.ask_service_options\) : \(isEng \? \["Book Assessment", "See Doctors First"\] : \["Agendar valoración", "Ver equipo médico primero"\]\),\n\s+stepId: 2\n\s+\}\);\n\s+\}\);/g,
  'fetchAudio(serviceQuestion, "bot-1", () => {\n          setStepInfo({\n            options: scripts?.ask_service_options ? Object.keys(scripts.ask_service_options) : (isEng ? ["Book Assessment", "See Doctors First"] : ["Agendar valoración", "Ver equipo médico primero"]),\n            stepId: 2\n          });\n        }, { intent: "QUESTION" });'
);

// Fix bot-15
content = content.replace(
  /fetchAudio\(deepDivePrompt, "bot-15", \(\) => \{\n\s+setStepInfo\(\{\n\s+options: deepDiveChips,\n\s+stepId: 1\.5\n\s+\}\);\n\s+\}\);/g,
  'fetchAudio(deepDivePrompt, "bot-15", () => {\n           setStepInfo({\n             options: deepDiveChips,\n             stepId: 1.5\n           });\n        }, { intent: "QUESTION" });'
);

// Fix bot-2
content = content.replace(
  /fetchAudio\(docPitch, "bot-2", \(\) => \{\n\s+setStepInfo\(\{\n\s+options: chatScripts\?\.doctor_found_chips \|\| \(isEng \? \["Okay, let's select a date", "I want to think about it", "See more doctors"\] : \["De acuerdo, seleccionar fecha", "Quiero pensarlo más", "Ver más equipo"\]\),\n\s+stepId: 3\n\s+\}\);\n\s+\}, \{ isDoctorList: true, doctorListData: relevantDocs \}\);/g,
  `fetchAudio(docPitch, "bot-2", () => {\n           setStepInfo({\n              options: chatScripts?.doctor_found_chips || (isEng ? ["Okay, let's select a date", "I want to think about it", "See more doctors"] : ["De acuerdo, seleccionar fecha", "Quiero pensarlo más", "Ver más equipo"]),\n              stepId: 3\n           });\n        }, { isDoctorList: true, doctorListData: relevantDocs, intent: "QUESTION" });`
);

// Fix bot-bye
content = content.replace(
  /fetchAudio\(byeMsg, "bot-bye", \(\) => \{\n\s+setChatHistory\(prev => \[\.\.\.prev, \{ role: "assistant", content: byeMsg \}\]\);\n\s+\/\/ Terminal end state \(no options\)\n\s+setStepInfo\(\{ options: \[\], stepId: 99 \}\);\n\s+\}\);/g,
  'fetchAudio(byeMsg, "bot-bye", () => {\n             setChatHistory(prev => [...prev, { role: "assistant", content: byeMsg }]);\n             // Terminal end state (no options)\n             setStepInfo({ options: [], stepId: 99 });\n           }, { intent: "GREETING" });'
);

// Fix bot-bye 2
content = content.replace(
  /fetchAudio\(byeMsg, "bot-bye", \(\) => \{\n\s+setStepInfo\(\{ options: \[\], stepId: 0 \}\);\n\s+\}\);/g,
  'fetchAudio(byeMsg, "bot-bye", () => {\n             setStepInfo({ options: [], stepId: 0 });\n           }, { intent: "GREETING" });'
);

fs.writeFileSync(filePath, content);
