export const neetBiologyCellTree = {
  nodes: [
    {
      id: "bio_u3_cell_basics",
      type: "custom",
      data: { 
        label: "Cell: The Unit of Life", 
        exam: "NEET",
        subject: "Biology",
        branch: "Cell Biology", 
        description: "Cell theory, Prokaryotic vs Eukaryotic structures, and Plant/Animal cell comparison.",
        quizId: "quiz_bio_u3_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "bio_u3_endomembrane",
      type: "custom",
      data: { 
        label: "Organelles & Endomembrane System", 
        exam: "NEET",
        subject: "Biology",
        branch: "Cell Biology", 
        description: "ER, Golgi, Lysosomes, Vacuoles, Mitochondria, Ribosomes, and Plastids.",
        quizId: "quiz_bio_u3_002", 
      },
      position: { x: 100, y: 150 } 
    },
    {
      id: "bio_u3_biomolecules",
      type: "custom",
      data: { 
        label: "Biomolecules & Enzymes", 
        exam: "NEET",
        subject: "Biology",
        branch: "Biochemistry", 
        description: "Structure of proteins, carbs, lipids, nucleic acids, and enzyme kinetics.",
        quizId: "quiz_bio_u3_003", 
      },
      position: { x: 400, y: 150 } 
    },
    {
      id: "bio_u3_division",
      type: "custom",
      data: { 
        label: "Cell Cycle & Division", 
        exam: "NEET",
        subject: "Biology",
        branch: "Cell Biology", 
        description: "Mitosis, Meiosis, and their biological significance.",
        quizId: "quiz_bio_u3_004", 
      },
      position: { x: 250, y: 300 } 
    }
  ],
  edges: [
    { id: "e_cell_endo", source: "bio_u3_cell_basics", target: "bio_u3_endomembrane", animated: true },
    { id: "e_cell_bio", source: "bio_u3_cell_basics", target: "bio_u3_biomolecules", animated: true },
    { id: "e_endo_div", source: "bio_u3_endomembrane", target: "bio_u3_division", animated: true }
  ]
};