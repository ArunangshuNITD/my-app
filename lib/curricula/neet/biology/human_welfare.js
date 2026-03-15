export const neetBiologyWelfareTree = {
  nodes: [
    {
      id: "bio_welfare_health",
      type: "custom",
      data: { 
        label: "Human Health & Disease", 
        exam: "NEET",
        subject: "Biology",
        branch: "Zoology", 
        description: "Pathogens, Immunology, Cancer, AIDS, and Drug abuse.",
        quizId: "quiz_bio_wel_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "bio_welfare_microbes",
      type: "custom",
      data: { 
        label: "Microbes in Human Welfare", 
        exam: "NEET",
        subject: "Biology",
        branch: "Botany/Zoology", 
        description: "Sewage treatment, Biofertilizers, and Industrial production.",
        quizId: "quiz_bio_wel_002", 
      },
      position: { x: 250, y: 150 } 
    }
  ],
  edges: [
    { id: "e_health_microbe", source: "bio_welfare_health", target: "bio_welfare_microbes", animated: true }
  ]
};