export const jeePhysicsThermalTree = {
  nodes: [
    {
      id: "jee_phys_therm_fluids",
      type: "custom",
      data: { 
        label: "Fluid Mechanics", 
        exam: "JEE",
        subject: "Physics",
        branch: "Thermal Physics", 
        description: "Hydrostatics, Bernoulli's Principle, Viscosity, and Reynolds Number.",
        quizId: "quiz_jee_phys_therm_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "jee_phys_therm_ktg",
      type: "custom",
      data: { 
        label: "Kinetic Theory of Gases", 
        exam: "JEE",
        subject: "Physics",
        branch: "Thermal Physics", 
        description: "Ideal gas laws, RMS speed, degrees of freedom, and Law of Equipartition.",
        quizId: "quiz_jee_phys_therm_002", 
      },
      position: { x: 250, y: 150 } 
    },
    {
      id: "jee_phys_therm_thermo",
      type: "custom",
      data: { 
        label: "Thermodynamics", 
        exam: "JEE",
        subject: "Physics",
        branch: "Thermal Physics", 
        description: "Zeroth, First, and Second laws, Isothermal/Adiabatic processes, and Heat Engines.",
        quizId: "quiz_jee_phys_therm_003", 
      },
      position: { x: 250, y: 300 } 
    }
  ],
  edges: [
    { id: "e_fluids_ktg", source: "jee_phys_therm_fluids", target: "jee_phys_therm_ktg", animated: true },
    { id: "e_ktg_thermo", source: "jee_phys_therm_ktg", target: "jee_phys_therm_thermo", animated: true }
  ]
};