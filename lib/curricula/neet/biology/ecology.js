export const neetBiologyEcologyTree = {
  nodes: [
    {
      id: "bio_eco_population",
      type: "custom",
      data: { 
        label: "Organisms & Populations", 
        exam: "NEET",
        subject: "Biology",
        branch: "Ecology", 
        description: "Mutualism, Competition, Population growth, and Attributes.",
        quizId: "quiz_bio_eco_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "bio_eco_ecosystem",
      type: "custom",
      data: { 
        label: "Ecosystem", 
        exam: "NEET",
        subject: "Biology",
        branch: "Ecology", 
        description: "Energy flow, Ecological Pyramids, and Decomposition.",
        quizId: "quiz_bio_eco_002", 
      },
      position: { x: 100, y: 150 } 
    },
    {
      id: "bio_eco_biodiversity",
      type: "custom",
      data: { 
        label: "Biodiversity & Conservation", 
        exam: "NEET",
        subject: "Biology",
        branch: "Ecology", 
        description: "Hotspots, Red Data Book, and Biosphere reserves.",
        quizId: "quiz_bio_eco_003", 
      },
      position: { x: 400, y: 150 } 
    }
  ],
  edges: [
    { id: "e_pop_eco", source: "bio_eco_population", target: "bio_eco_ecosystem", animated: true },
    { id: "e_pop_bio", source: "bio_eco_population", target: "bio_eco_biodiversity", animated: true }
  ]
};