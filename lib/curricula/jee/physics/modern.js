export const jeePhysicsModernExperimentalTree = {
  nodes: [
    {
      id: "jee_phys_mod_atoms",
      type: "custom",
      data: { 
        label: "Atoms", 
        exam: "JEE",
        subject: "Physics",
        branch: "Modern Physics", 
        description: "Bohr’s model, Hydrogen spectrum, and X-rays.",
        quizId: "quiz_jee_phys_mod_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "jee_phys_mod_nuclei",
      type: "custom",
      data: { 
        label: "Nuclei", 
        exam: "JEE",
        subject: "Physics",
        branch: "Modern Physics", 
        description: "Radioactivity, Mass defect, Binding energy, and Nuclear reactions.",
        quizId: "quiz_jee_phys_mod_002", 
      },
      position: { x: 250, y: 150 } 
    },
    {
      id: "jee_phys_mod_semicond",
      type: "custom",
      data: { 
        label: "Electronic Devices", 
        exam: "JEE",
        subject: "Physics",
        branch: "Modern Physics", 
        description: "Semiconductors, p-n junction, Transistors, and Logic Gates.",
        quizId: "quiz_jee_phys_mod_003", 
      },
      position: { x: 100, y: 300 } 
    },
    {
      id: "jee_phys_mod_experimental",
      type: "custom",
      data: { 
        label: "Experimental Physics", 
        exam: "JEE",
        subject: "Physics",
        branch: "Practical", 
        description: "Vernier calipers, Screw gauge, Spectrometer, and Error analysis.",
        quizId: "quiz_jee_phys_mod_004", 
      },
      position: { x: 400, y: 300 } 
    }
  ],
  edges: [
    { id: "e_atoms_nuclei", source: "jee_phys_mod_atoms", target: "jee_phys_mod_nuclei", animated: true },
    { id: "e_nuclei_semicond", source: "jee_phys_mod_nuclei", target: "jee_phys_mod_semicond", animated: true },
    { id: "e_atoms_exp", source: "jee_phys_mod_atoms", target: "jee_phys_mod_experimental", animated: true }
  ]
};