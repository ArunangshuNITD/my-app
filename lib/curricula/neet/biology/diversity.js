export const neetBiologyDiversityTree = {
  nodes: [
    {
      id: "bio_d1_living",
      type: "custom",
      data: { 
        label: "What is Living?", 
        exam: "NEET",
        subject: "Biology",
        branch: "Diversity", 
        description: "Characteristics of living organisms, Biodiversity, and Taxonomical aids.",
        quizId: "quiz_bio_d1_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "bio_d1_taxonomy",
      type: "custom",
      data: { 
        label: "Taxonomy & Systematics", 
        exam: "NEET",
        subject: "Biology",
        branch: "Diversity", 
        description: "Binomial nomenclature, taxonomic hierarchy, and concept of species.",
        quizId: "quiz_bio_d1_002", 
      },
      position: { x: 250, y: 150 } 
    },
    {
      id: "bio_d1_5kingdom",
      type: "custom",
      data: { 
        label: "Five Kingdom Classification", 
        exam: "NEET",
        subject: "Biology",
        branch: "Diversity", 
        description: "Salient features of Monera, Protista, Fungi, Lichens, Viruses, and Viroids.",
        quizId: "quiz_bio_d1_003", 
      },
      position: { x: 250, y: 300 } 
    },
    {
      id: "bio_d1_plants",
      type: "custom",
      data: { 
        label: "Plant Kingdom", 
        exam: "NEET",
        subject: "Biology",
        branch: "Diversity", 
        description: "Algae, Bryophytes, Pteridophytes, Gymnosperms (salient features & examples).",
        quizId: "quiz_bio_d1_004", 
      },
      position: { x: 100, y: 450 } 
    },
    {
      id: "bio_d1_animals",
      type: "custom",
      data: { 
        label: "Animal Kingdom", 
        exam: "NEET",
        subject: "Biology",
        branch: "Diversity", 
        description: "Non-chordates (Phyla level) and Chordates (Classes level) with key features.",
        quizId: "quiz_bio_d1_005", 
      },
      position: { x: 400, y: 450 } 
    }
  ],
  edges: [
    { id: "e1", source: "bio_d1_living", target: "bio_d1_taxonomy", animated: true },
    { id: "e2", source: "bio_d1_taxonomy", target: "bio_d1_5kingdom", animated: true },
    { id: "e3", source: "bio_d1_5kingdom", target: "bio_d1_plants", animated: true },
    { id: "e4", source: "bio_d1_5kingdom", target: "bio_d1_animals", animated: true }
  ]
};