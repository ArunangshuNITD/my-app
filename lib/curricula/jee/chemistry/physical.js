export const jeeChemPhysicalTree = {
  nodes: [
    {
      id: "jee_chem_mole",
      type: "custom",
      data: { 
        label: "Mole Concept", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Physical", 
        description: "Stoichiometry, concentration terms (Molarity, Molality), and limiting reagents.",
        quizId: "quiz_chem_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "jee_chem_atomic",
      type: "custom",
      data: { 
        label: "Atomic Structure", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Physical", 
        description: "Quantum numbers, Bohr's model, and electronic configurations.",
        quizId: "quiz_chem_002", 
      },
      position: { x: 100, y: 150 } 
    },
    {
      id: "jee_chem_bonding",
      type: "custom",
      data: { 
        label: "Chemical Bonding", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Physical/Inorganic", 
        description: "VSEPR theory, Hybridization, and Molecular Orbital Theory.",
        quizId: "quiz_chem_003", 
      },
      position: { x: 400, y: 150 } 
    },
    {
      id: "jee_chem_thermo",
      type: "custom",
      data: { 
        label: "Thermodynamics", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Physical", 
        description: "Enthalpy, Entropy, Gibbs Free Energy, and Laws of Thermo.",
        quizId: "quiz_chem_004", 
      },
      position: { x: 250, y: 300 } 
    },
    {
      id: "jee_chem_equilibrium",
      type: "custom",
      data: { 
        label: "Equilibrium", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Physical", 
        description: "Chemical equilibrium and Ionic equilibrium (pH, buffers, solubility product).",
        quizId: "quiz_chem_005", 
      },
      position: { x: 100, y: 450 } 
    },
    {
      id: "jee_chem_solutions",
      type: "custom",
      data: { 
        label: "Solutions", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Physical", 
        description: "Raoult's Law, Colligative properties, and Van't Hoff factor.",
        quizId: "quiz_chem_006", 
      },
      position: { x: 400, y: 450 } 
    },
    {
      id: "jee_chem_electro",
      type: "custom",
      data: { 
        label: "Electrochemistry", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Physical", 
        description: "Nernst Equation, Galvanic cells, and Electrolysis.",
        quizId: "quiz_chem_007", 
      },
      position: { x: 100, y: 600 } 
    },
    {
      id: "jee_chem_kinetics",
      type: "custom",
      data: { 
        label: "Chemical Kinetics", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Physical", 
        description: "Rate laws, Order of reaction, and Arrhenius Equation.",
        quizId: "quiz_chem_008", 
      },
      position: { x: 400, y: 600 } 
    }
  ],
  edges: [
    { id: "e1", source: "jee_chem_mole", target: "jee_chem_atomic", animated: true },
    { id: "e2", source: "jee_chem_mole", target: "jee_chem_bonding", animated: true },
    { id: "e3", source: "jee_chem_atomic", target: "jee_chem_thermo", animated: true },
    { id: "e4", source: "jee_chem_bonding", target: "jee_chem_thermo", animated: true },
    { id: "e5", source: "jee_chem_thermo", target: "jee_chem_equilibrium", animated: true },
    { id: "e6", source: "jee_chem_thermo", target: "jee_chem_solutions", animated: true },
    { id: "e7", source: "jee_chem_equilibrium", target: "jee_chem_electro", animated: true },
    { id: "e8", source: "jee_chem_solutions", target: "jee_chem_kinetics", animated: true }
  ]
};