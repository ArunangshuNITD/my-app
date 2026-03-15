export const jeePhysicsOpticsModernTree = {
  nodes: [
    {
      id: "jee_phys_opt_ray",
      type: "custom",
      data: { 
        label: "Ray Optics", 
        exam: "JEE",
        subject: "Physics",
        branch: "Optics", 
        description: "Reflection, Refraction, Total Internal Reflection, Lenses, and Optical Instruments.",
        quizId: "quiz_jee_phys_opt_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "jee_phys_opt_wave",
      type: "custom",
      data: { 
        label: "Wave Optics", 
        exam: "JEE",
        subject: "Physics",
        branch: "Optics", 
        description: "Huygens' Principle, Interference (YDSE), Diffraction, and Polarization.",
        quizId: "quiz_jee_phys_opt_002", 
      },
      position: { x: 100, y: 150 } 
    },
    {
      id: "jee_phys_opt_dual",
      type: "custom",
      data: { 
        label: "Dual Nature of Matter & Radiation", 
        exam: "JEE",
        subject: "Physics",
        branch: "Modern Physics", 
        description: "Photoelectric Effect, Einstein’s equation, and De Broglie wavelength.",
        quizId: "quiz_jee_phys_opt_003", 
      },
      position: { x: 400, y: 150 } 
    },
    {
      id: "jee_phys_opt_quantum_bridge",
      type: "custom",
      data: { 
        label: "Modern Physics Integration", 
        exam: "JEE",
        subject: "Physics",
        branch: "Modern Physics", 
        description: "Synthesis of wave-particle duality in atomic and nuclear phenomena.",
        quizId: "quiz_jee_phys_opt_004", 
      },
      position: { x: 250, y: 300 } 
    }
  ],
  edges: [
    { id: "e_ray_wave", source: "jee_phys_opt_ray", target: "jee_phys_opt_wave", animated: true },
    { id: "e_wave_dual", source: "jee_phys_opt_wave", target: "jee_phys_opt_dual", animated: true },
    { id: "e_dual_bridge", source: "jee_phys_opt_dual", target: "jee_phys_opt_quantum_bridge", animated: true }
  ]
};