export const neetBiologyPlantPhysTree = {
  nodes: [
    {
      id: "bio_u4_photosynthesis",
      type: "custom",
      data: { 
        label: "Photosynthesis", 
        exam: "NEET",
        subject: "Biology",
        branch: "Plant Physiology", 
        description: "Light reactions, C3/C4 pathways, Photophosphorylation, and Chemiosmosis.",
        quizId: "quiz_bio_u4_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "bio_u4_respiration",
      type: "custom",
      data: { 
        label: "Respiration", 
        exam: "NEET",
        subject: "Biology",
        branch: "Plant Physiology", 
        description: "Glycolysis, TCA cycle, ETC, Amphibolic pathways, and Respiratory Quotient.",
        quizId: "quiz_bio_u4_002", 
      },
      position: { x: 100, y: 150 } 
    },
    {
      id: "bio_u4_growth",
      type: "custom",
      data: { 
        label: "Growth & Development", 
        exam: "NEET",
        subject: "Biology",
        branch: "Plant Physiology", 
        description: "Germination, Growth regulators (Auxins, Gibberellins, etc.), and Differentiation.",
        quizId: "quiz_bio_u4_003", 
      },
      position: { x: 400, y: 150 } 
    }
  ],
  edges: [
    { id: "e_photo_resp", source: "bio_u4_photosynthesis", target: "bio_u4_respiration", animated: true },
    { id: "e_resp_growth", source: "bio_u4_respiration", target: "bio_u4_growth", animated: true }
  ]
};