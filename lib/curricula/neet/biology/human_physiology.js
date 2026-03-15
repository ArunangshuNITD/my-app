export const neetBiologyHumanPhysTree = {
  nodes: [
    {
      id: "bio_u5_breathing",
      type: "custom",
      data: { label: "Breathing & Exchange of Gases", exam: "NEET", subject: "Biology", branch: "Human Physiology", description: "Respiratory volumes, transport of gases, and disorders like Asthma/Emphysema.", quizId: "quiz_bio_u5_001" },
      position: { x: 250, y: 0 }
    },
    {
      id: "bio_u5_circulation",
      type: "custom",
      data: { label: "Body Fluids & Circulation", exam: "NEET", subject: "Biology", branch: "Human Physiology", description: "Heart structure, cardiac cycle, ECG, and blood groups.", quizId: "quiz_bio_u5_002" },
      position: { x: 100, y: 150 }
    },
    {
      id: "bio_u5_excretion",
      type: "custom",
      data: { label: "Excretory Products", exam: "NEET", subject: "Biology", branch: "Human Physiology", description: "Kidney structure, urine formation (counter-current), and osmoregulation.", quizId: "quiz_bio_u5_003" },
      position: { x: 400, y: 150 }
    },
    {
      id: "bio_u5_locomotion",
      type: "custom",
      data: { label: "Locomotion & Movement", exam: "NEET", subject: "Biology", branch: "Human Physiology", description: "Sliding filament theory, skeletal system, and joints.", quizId: "quiz_bio_u5_004" },
      position: { x: 100, y: 300 }
    },
    {
      id: "bio_u5_neural",
      type: "custom",
      data: { label: "Neural Control & Coordination", exam: "NEET", subject: "Biology", branch: "Human Physiology", description: "Nerve impulse conduction, CNS/PNS structure, and reflex arcs.", quizId: "quiz_bio_u5_005" },
      position: { x: 400, y: 300 }
    },
    {
      id: "bio_u5_chemical",
      type: "custom",
      data: { label: "Chemical Coordination", exam: "NEET", subject: "Biology", branch: "Human Physiology", description: "Endocrine glands, mechanism of hormone action, and hypo/hyperactivity.", quizId: "quiz_bio_u5_006" },
      position: { x: 250, y: 450 }
    }
  ],
  edges: [
    { id: "e_breath_circ", source: "bio_u5_breathing", target: "bio_u5_circulation", animated: true },
    { id: "e_circ_excr", source: "bio_u5_circulation", target: "bio_u5_excretion", animated: true },
    { id: "e_excr_loco", source: "bio_u5_excretion", target: "bio_u5_locomotion", animated: true },
    { id: "e_loco_neural", source: "bio_u5_locomotion", target: "bio_u5_neural", animated: true },
    { id: "e_neural_chem", source: "bio_u5_neural", target: "bio_u5_chemical", animated: true }
  ]
};