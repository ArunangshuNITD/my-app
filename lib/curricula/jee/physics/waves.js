export const jeePhysicsWavesTree = {
  nodes: [
    {
      id: "jee_phys_wave_shm",
      type: "custom",
      data: { 
        label: "Oscillations (SHM)", 
        exam: "JEE",
        subject: "Physics",
        branch: "Waves", 
        description: "Simple Harmonic Motion, energy in SHM, and Pendulums.",
        quizId: "quiz_jee_phys_wave_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "jee_phys_wave_string",
      type: "custom",
      data: { 
        label: "Waves on a String", 
        exam: "JEE",
        subject: "Physics",
        branch: "Waves", 
        description: "Transverse waves, speed on a stretched string, and Standing waves.",
        quizId: "quiz_jee_phys_wave_002", 
      },
      position: { x: 100, y: 150 } 
    },
    {
      id: "jee_phys_wave_sound",
      type: "custom",
      data: { 
        label: "Sound Waves", 
        exam: "JEE",
        subject: "Physics",
        branch: "Waves", 
        description: "Longitudinal waves, speed of sound, Doppler Effect, and Beats.",
        quizId: "quiz_jee_phys_wave_003", 
      },
      position: { x: 400, y: 150 } 
    }
  ],
  edges: [
    { id: "e_shm_string", source: "jee_phys_wave_shm", target: "jee_phys_wave_string", animated: true },
    { id: "e_shm_sound", source: "jee_phys_wave_shm", target: "jee_phys_wave_sound", animated: true }
  ]
};