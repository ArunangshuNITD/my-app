export const neetBiologyBiotechTree = {
  nodes: [
    {
      id: "bio_biotech_principles",
      type: "custom",
      data: { 
        label: "Biotech: Principles & Processes", 
        exam: "NEET",
        subject: "Biology",
        branch: "Biotechnology", 
        description: "Genetic engineering and Recombinant DNA technology.",
        quizId: "quiz_bio_bt_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "bio_biotech_apps",
      type: "custom",
      data: { 
        label: "Biotechnology & Applications", 
        exam: "NEET",
        subject: "Biology",
        branch: "Biotechnology", 
        description: "Bt crops, Insulin production, Gene therapy, and Biopiracy.",
        quizId: "quiz_bio_bt_002", 
      },
      position: { x: 250, y: 150 } 
    }
  ],
  edges: [
    { id: "e_bt_prin_app", source: "bio_biotech_principles", target: "bio_biotech_apps", animated: true }
  ]
};