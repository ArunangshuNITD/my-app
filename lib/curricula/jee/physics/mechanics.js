export const jeePhysicsMechanicsTree = {
  nodes: [
    {
      id: "jee_phys_mech_units",
      type: "custom",
      data: { 
        label: "Units & Measurements", 
        exam: "JEE",
        subject: "Physics",
        branch: "Mechanics", 
        description: "SI units, Dimensional analysis, Errors in measurement, and Significant figures.",
        quizId: "quiz_jee_phys_mech_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "jee_phys_mech_kinematics",
      type: "custom",
      data: { 
        label: "Kinematics", 
        exam: "JEE",
        subject: "Physics",
        branch: "Mechanics", 
        description: "Motion in 1D and 2D, Projectile motion, Relative velocity, and Calculus in kinematics.",
        quizId: "quiz_jee_phys_mech_002", 
      },
      position: { x: 250, y: 150 } 
    },
    {
      id: "jee_phys_mech_lom",
      type: "custom",
      data: { 
        label: "Laws of Motion", 
        exam: "JEE",
        subject: "Physics",
        branch: "Mechanics", 
        description: "Newton's laws, Free body diagrams, Friction, and Circular motion dynamics.",
        quizId: "quiz_jee_phys_mech_003", 
      },
      position: { x: 250, y: 300 } 
    },
    {
      id: "jee_phys_mech_wep",
      type: "custom",
      data: { 
        label: "Work, Energy & Power", 
        exam: "JEE",
        subject: "Physics",
        branch: "Mechanics", 
        description: "Work-Energy theorem, Conservative forces, Potential energy, and Collisions.",
        quizId: "quiz_jee_phys_mech_004", 
      },
      position: { x: 100, y: 450 } 
    },
    {
      id: "jee_phys_mech_com",
      type: "custom",
      data: { 
        label: "System of Particles (COM)", 
        exam: "JEE",
        subject: "Physics",
        branch: "Mechanics", 
        description: "Center of mass, Linear momentum conservation, and Impulse.",
        quizId: "quiz_jee_phys_mech_005", 
      },
      position: { x: 400, y: 450 } 
    },
    {
      id: "jee_phys_mech_rotational",
      type: "custom",
      data: { 
        label: "Rotational Motion", 
        exam: "JEE",
        subject: "Physics",
        branch: "Mechanics", 
        description: "Moment of Inertia, Torque, Angular momentum, and Rolling motion.",
        quizId: "quiz_jee_phys_mech_006", 
      },
      position: { x: 250, y: 600 } 
    }
  ],
  edges: [
    { id: "e_units_kin", source: "jee_phys_mech_units", target: "jee_phys_mech_kinematics", animated: true },
    { id: "e_kin_lom", source: "jee_phys_mech_kinematics", target: "jee_phys_mech_lom", animated: true },
    { id: "e_lom_wep", source: "jee_phys_mech_lom", target: "jee_phys_mech_wep", animated: true },
    { id: "e_lom_com", source: "jee_phys_mech_lom", target: "jee_phys_mech_com", animated: true },
    { id: "e_wep_rot", source: "jee_phys_mech_wep", target: "jee_phys_mech_rotational", animated: true },
    { id: "e_com_rot", source: "jee_phys_mech_com", target: "jee_phys_mech_rotational", animated: true }
  ]
};