export const jeeChemOrganicTree = {
  nodes: [
    {
      id: "jee_chem_org_goc",
      type: "custom",
      data: { 
        label: "General Organic Chemistry (GOC)", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Organic", 
        description: "Inductive/Resonance effects, Hyperconjugation, and Isomerism.",
        quizId: "quiz_chem_org_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "jee_chem_org_hydrocarbons",
      type: "custom",
      data: { 
        label: "Hydrocarbons", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Organic", 
        description: "Alkanes, Alkenes, Alkynes, and Aromaticity (Benzene).",
        quizId: "quiz_chem_org_002", 
      },
      position: { x: 250, y: 150 } 
    },
    {
      id: "jee_chem_org_haloalkanes",
      type: "custom",
      data: { 
        label: "Haloalkanes & Haloarenes", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Organic", 
        description: "SN1, SN2, E1, E2 mechanisms and Grignard reagents.",
        quizId: "quiz_chem_org_003", 
      },
      position: { x: 100, y: 300 } 
    },
    {
      id: "jee_chem_org_alcohols",
      type: "custom",
      data: { 
        label: "Alcohols, Phenols & Ethers", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Organic", 
        description: "Acidity of phenols, Lucas test, and William's synthesis.",
        quizId: "quiz_chem_org_004", 
      },
      position: { x: 400, y: 300 } 
    },
    {
      id: "jee_chem_org_carbonyls",
      type: "custom",
      data: { 
        label: "Aldehydes & Ketones", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Organic", 
        description: "Nucleophilic addition, Aldol condensation, and Cannizzaro reaction.",
        quizId: "quiz_chem_org_005", 
      },
      position: { x: 250, y: 450 } 
    },
    {
      id: "jee_chem_org_acids_amines",
      type: "custom",
      data: { 
        label: "Acids & Amines", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Organic", 
        description: "Carboxylic acid derivatives and Basicity of Amines/Diazonium salts.",
        quizId: "quiz_chem_org_006", 
      },
      position: { x: 250, y: 600 } 
    },
    {
      id: "jee_chem_org_biomolecules",
      type: "custom",
      data: { 
        label: "Biomolecules", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Organic", 
        description: "Carbohydrates, Proteins, Nucleic Acids, and Vitamins.",
        quizId: "quiz_chem_org_007", 
      },
      position: { x: 100, y: 750 } 
    },
    {
      id: "jee_chem_org_practical",
      type: "custom",
      data: { 
        label: "Practical Organic Chemistry", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Organic", 
        description: "Detection of elements (Lassaigne's test) and functional group tests.",
        quizId: "quiz_chem_org_008", 
      },
      position: { x: 400, y: 750 } 
    }
  ],
  edges: [
    { id: "e_goc_hydro", source: "jee_chem_org_goc", target: "jee_chem_org_hydrocarbons", animated: true },
    { id: "e_hydro_halo", source: "jee_chem_org_hydrocarbons", target: "jee_chem_org_haloalkanes", animated: true },
    { id: "e_hydro_alc", source: "jee_chem_org_hydrocarbons", target: "jee_chem_org_alcohols", animated: true },
    { id: "e_alc_carb", source: "jee_chem_org_alcohols", target: "jee_chem_org_carbonyls", animated: true },
    { id: "e_halo_carb", source: "jee_chem_org_haloalkanes", target: "jee_chem_org_carbonyls", animated: true },
    { id: "e_carb_acid", source: "jee_chem_org_carbonyls", target: "jee_chem_org_acids_amines", animated: true },
    { id: "e_acid_bio", source: "jee_chem_org_acids_amines", target: "jee_chem_org_biomolecules", animated: true },
    { id: "e_acid_prac", source: "jee_chem_org_acids_amines", target: "jee_chem_org_practical", animated: true }
  ]
};