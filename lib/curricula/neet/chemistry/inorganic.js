export const jeeChemInorganicTree = {
  nodes: [
    {
      id: "jee_chem_periodic",
      type: "custom",
      data: { 
        label: "Periodic Table", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Inorganic", 
        description: "Periodic trends, ionization enthalpy, electronegativity, and atomic radii.",
        quizId: "quiz_chem_inorg_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "jee_chem_pblock",
      type: "custom",
      data: { 
        label: "p-Block Elements", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Inorganic", 
        description: "Groups 13 to 18: Boron, Carbon, Nitrogen, Oxygen, Halogens, and Noble gases.",
        quizId: "quiz_chem_inorg_002", 
      },
      position: { x: 100, y: 150 } 
    },
    {
      id: "jee_chem_dblock",
      type: "custom",
      data: { 
        label: "d & f Block Elements", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Inorganic", 
        description: "Transition elements, Lanthanides, Actinides, and magnetic properties.",
        quizId: "quiz_chem_inorg_003", 
      },
      position: { x: 400, y: 150 } 
    },
    {
      id: "jee_chem_coordination",
      type: "custom",
      data: { 
        label: "Coordination Compounds", 
        exam: "JEE",
        subject: "Chemistry",
        branch: "Inorganic", 
        description: "Werner's theory, IUPAC naming, VBT, and Crystal Field Theory (CFT).",
        quizId: "quiz_chem_inorg_004", 
      },
      position: { x: 250, y: 300 } 
    }
  ],
  edges: [
    { id: "e_per_p", source: "jee_chem_periodic", target: "jee_chem_pblock", animated: true },
    { id: "e_per_d", source: "jee_chem_periodic", target: "jee_chem_dblock", animated: true },
    { id: "e_d_coord", source: "jee_chem_dblock", target: "jee_chem_coordination", animated: true },
    { id: "e_p_coord", source: "jee_chem_pblock", target: "jee_chem_coordination", animated: true }
  ]
};