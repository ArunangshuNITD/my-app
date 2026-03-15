export const neetBiologyStructuralOrgTree = {
  nodes: [
    {
      id: "bio_u2_plant_morph",
      type: "custom",
      data: { 
        label: "Plant Morphology", 
        exam: "NEET",
        subject: "Biology",
        branch: "Structural Organization", 
        description: "Root, Stem, Leaf, Inflorescence (Cymose/Racemose), Flower, Fruit, and Seed.",
        quizId: "quiz_bio_u2_001", 
      },
      position: { x: 200, y: 0 } 
    },
    {
      id: "bio_u2_plant_anatomy",
      type: "custom",
      data: { 
        label: "Plant Anatomy & Families", 
        exam: "NEET",
        subject: "Biology",
        branch: "Structural Organization", 
        description: "Tissues and specific families: Malvaceae, Cruciferae, Leguminosae, Compositae, Gramineae.",
        quizId: "quiz_bio_u2_002", 
      },
      position: { x: 200, y: 150 } 
    },
    {
      id: "bio_u2_animal_tissues",
      type: "custom",
      data: { 
        label: "Animal Tissues", 
        exam: "NEET",
        subject: "Biology",
        branch: "Structural Organization", 
        description: "Epithelial, Connective, Muscular, and Neural tissues.",
        quizId: "quiz_bio_u2_003", 
      },
      position: { x: 400, y: 150 } 
    },
    {
      id: "bio_u2_animal_systems",
      type: "custom",
      data: { 
        label: "Frog Systems", 
        exam: "NEET",
        subject: "Biology",
        branch: "Structural Organization", 
        description: "Digestive, Circulatory, Respiratory, Nervous, and Reproductive systems.",
        quizId: "quiz_bio_u2_004", 
      },
      position: { x: 300, y: 300 } 
    }
  ],
  edges: [
    { id: "e_morph_anat", source: "bio_u2_plant_morph", target: "bio_u2_plant_anatomy", animated: true },
    { id: "e_anat_tissue", source: "bio_u2_plant_anatomy", target: "bio_u2_animal_tissues", animated: true },
    { id: "e_tissue_frog", source: "bio_u2_animal_tissues", target: "bio_u2_animal_systems", animated: true }
  ]
};