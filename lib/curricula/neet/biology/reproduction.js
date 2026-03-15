export const neetBiologyReproductionTree = {
  nodes: [
    {
      id: "bio_repro_flowering",
      type: "custom",
      data: { 
        label: "Sexual Reproduction in Flowering Plants", 
        exam: "NEET",
        subject: "Biology",
        branch: "Botany", 
        description: "Gametophyte development, pollination, double fertilization, and apomixis.",
        quizId: "quiz_bio_repro_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "bio_repro_human",
      type: "custom",
      data: { 
        label: "Human Reproduction", 
        exam: "NEET",
        subject: "Biology",
        branch: "Zoology", 
        description: "Male/Female systems, gametogenesis, menstrual cycle, and parturition.",
        quizId: "quiz_bio_repro_002", 
      },
      position: { x: 250, y: 150 } 
    },
    {
      id: "bio_repro_health",
      type: "custom",
      data: { 
        label: "Reproductive Health", 
        exam: "NEET",
        subject: "Biology",
        branch: "Zoology", 
        description: "Contraception, STD prevention, MTP, and ART (IVF, ZIFT, GIFT).",
        quizId: "quiz_bio_repro_003", 
      },
      position: { x: 250, y: 300 } 
    }
  ],
  edges: [
    { id: "e_human_health", source: "bio_repro_human", target: "bio_repro_health", animated: true }
  ]
};