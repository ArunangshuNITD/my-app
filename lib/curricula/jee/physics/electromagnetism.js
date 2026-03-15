export const jeePhysicsElectromagnetismFullTree = {
  nodes: [
    {
      id: "jee_phys_em_electrostatics",
      type: "custom",
      data: { 
        label: "Electrostatics & Capacitance", 
        exam: "JEE",
        subject: "Physics",
        branch: "Electromagnetism", 
        description: "Coulomb's Law, Gauss Law, Electric Potential, and Dielectrics.",
        quizId: "quiz_jee_phys_em_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "jee_phys_em_current",
      type: "custom",
      data: { 
        label: "Current Electricity", 
        exam: "JEE",
        subject: "Physics",
        branch: "Electromagnetism", 
        description: "Drift velocity, Kirchhoff’s Laws, and RC/LR circuit transients.",
        quizId: "quiz_jee_phys_em_002", 
      },
      position: { x: 250, y: 150 } 
    },
    {
      id: "jee_phys_em_magnetism",
      type: "custom",
      data: { 
        label: "Magnetism & Moving Charges", 
        exam: "JEE",
        subject: "Physics",
        branch: "Electromagnetism", 
        description: "Biot-Savart Law, Ampere’s Law, Lorentz Force, and Magnetic Properties.",
        quizId: "quiz_jee_phys_em_003", 
      },
      position: { x: 250, y: 300 } 
    },
    {
      id: "jee_phys_em_induction",
      type: "custom",
      data: { 
        label: "EMI & Alternating Current", 
        exam: "JEE",
        subject: "Physics",
        branch: "Electromagnetism", 
        description: "Faraday’s Law, Lenz’s Law, Self/Mutual Induction, and LCR circuits.",
        quizId: "quiz_jee_phys_em_004", 
      },
      position: { x: 250, y: 450 } 
    },
    {
      id: "jee_phys_em_waves",
      type: "custom",
      data: { 
        label: "Electromagnetic Waves", 
        exam: "JEE",
        subject: "Physics",
        branch: "Electromagnetism", 
        description: "Displacement current, Maxwell’s Equations, and EM Spectrum.",
        quizId: "quiz_jee_phys_em_005", 
      },
      position: { x: 250, y: 600 } 
    }
  ],
  edges: [
    { id: "e_elec_curr", source: "jee_phys_em_electrostatics", target: "jee_phys_em_current", animated: true },
    { id: "e_curr_mag", source: "jee_phys_em_current", target: "jee_phys_em_magnetism", animated: true },
    { id: "e_mag_ind", source: "jee_phys_em_magnetism", target: "jee_phys_em_induction", animated: true },
    { id: "e_ind_waves", source: "jee_phys_em_induction", target: "jee_phys_em_waves", animated: true }
  ]
};