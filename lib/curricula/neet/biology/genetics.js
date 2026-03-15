export const neetBiologyGeneticsTree = {
  nodes: [
    {
      id: "bio_gen_mendel",
      type: "custom",
      data: { 
        label: "Heredity & Variation", 
        exam: "NEET",
        subject: "Biology",
        branch: "Genetics", 
        description: "Mendelian inheritance, chromosomal disorders, and sex determination.",
        quizId: "quiz_bio_gen_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "bio_gen_molecular",
      type: "custom",
      data: { 
        label: "Molecular Basis of Inheritance", 
        exam: "NEET",
        subject: "Biology",
        branch: "Genetics", 
        description: "DNA structure, Replication, Lac Operon, and DNA Fingerprinting.",
        quizId: "quiz_bio_gen_002", 
      },
      position: { x: 100, y: 150 } 
    },
    {
      id: "bio_gen_evolution",
      type: "custom",
      data: { 
        label: "Evolution", 
        exam: "NEET",
        subject: "Biology",
        branch: "Evolution", 
        description: "Origin of life, Darwinism, Hardy-Weinberg, and Human Evolution.",
        quizId: "quiz_bio_gen_003", 
      },
      position: { x: 400, y: 150 } 
    }
  ],
  edges: [
    { id: "e_mendel_mol", source: "bio_gen_mendel", target: "bio_gen_molecular", animated: true },
    { id: "e_mol_evo", source: "bio_gen_molecular", target: "bio_gen_evolution", animated: true }
  ]
};