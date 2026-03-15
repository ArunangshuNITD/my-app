export const jeePhysicsExtendedMechanicsTree = {
  nodes: [
    {
      id: "jee_phys_ext_gravitation",
      type: "custom",
      data: { 
        label: "Gravitation", 
        exam: "JEE",
        subject: "Physics",
        branch: "Mechanics", 
        description: "Universal law, acceleration due to gravity, Kepler's laws, and satellite motion.",
        quizId: "quiz_jee_phys_ext_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "jee_phys_ext_solids",
      type: "custom",
      data: { 
        label: "Elasticity (Solids)", 
        exam: "JEE",
        subject: "Physics",
        branch: "Properties of Matter", 
        description: "Hooke's Law, Young's modulus, stress-strain curves, and elastic energy.",
        quizId: "quiz_jee_phys_ext_002", 
      },
      position: { x: 100, y: 150 } 
    },
    {
      id: "jee_phys_ext_fluids_static",
      type: "custom",
      data: { 
        label: "Fluid Statics", 
        exam: "JEE",
        subject: "Physics",
        branch: "Properties of Matter", 
        description: "Pascal’s law, Archimedes' principle, and pressure variations.",
        quizId: "quiz_jee_phys_ext_003", 
      },
      position: { x: 400, y: 150 } 
    },
    {
      id: "jee_phys_ext_fluids_dynamic",
      type: "custom",
      data: { 
        label: "Fluid Dynamics", 
        exam: "JEE",
        subject: "Physics",
        branch: "Properties of Matter", 
        description: "Bernoulli’s theorem, Equation of continuity, and Viscosity.",
        quizId: "quiz_jee_phys_ext_004", 
      },
      position: { x: 400, y: 300 } 
    },
    {
      id: "jee_phys_ext_surface",
      type: "custom",
      data: { 
        label: "Surface Tension", 
        exam: "JEE",
        subject: "Physics",
        branch: "Properties of Matter", 
        description: "Surface energy, Capillarity, and excess pressure in drops/bubbles.",
        quizId: "quiz_jee_phys_ext_005", 
      },
      position: { x: 250, y: 450 } 
    }
  ],
  edges: [
    { id: "e_grav_solids", source: "jee_phys_ext_gravitation", target: "jee_phys_ext_solids", animated: true },
    { id: "e_grav_fluids", source: "jee_phys_ext_gravitation", target: "jee_phys_ext_fluids_static", animated: true },
    { id: "e_fstat_fdyn", source: "jee_phys_ext_fluids_static", target: "jee_phys_ext_fluids_dynamic", animated: true },
    { id: "e_fdyn_surf", source: "jee_phys_ext_fluids_dynamic", target: "jee_phys_ext_surface", animated: true },
    { id: "e_solids_surf", source: "jee_phys_ext_solids", target: "jee_phys_ext_surface", animated: true }
  ]
};