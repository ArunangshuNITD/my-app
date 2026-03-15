export const jeeMathsAlgebraTree = {
  nodes: [
    {
      id: "math_sets_func",
      type: "custom",
      data: { 
        label: "Sets, Relations & Functions", 
        exam: "JEE",
        subject: "Maths",
        branch: "Algebra", 
        description: "Union/Intersection, Equivalence relations, One-one/Onto functions, and Composition.",
        quizId: "quiz_math_001", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "math_complex_quad",
      type: "custom",
      data: { 
        label: "Complex & Quadratic", 
        exam: "JEE",
        subject: "Maths",
        branch: "Algebra", 
        description: "Argand diagram, Roots of Unity, and Nature of quadratic roots.",
        quizId: "quiz_math_002", 
      },
      position: { x: 100, y: 150 } 
    },
    {
      id: "math_matrices",
      type: "custom",
      data: { 
        label: "Matrices & Determinants", 
        exam: "JEE",
        subject: "Maths",
        branch: "Algebra", 
        description: "Adjoint, Inverse, and Solving linear equations using Cramer's rule/Matrix method.",
        quizId: "quiz_math_003", 
      },
      position: { x: 400, y: 150 } 
    },
    {
      id: "math_pnc_binomial",
      type: "custom",
      data: { 
        label: "P&C and Binomial", 
        exam: "JEE",
        subject: "Maths",
        branch: "Algebra", 
        description: "Fundamental principle of counting, nCr/nPr, and Binomial expansions.",
        quizId: "quiz_math_004", 
      },
      position: { x: 250, y: 300 } 
    },
    {
      id: "math_seq_series",
      type: "custom",
      data: { 
        label: "Sequence & Series", 
        exam: "JEE",
        subject: "Maths",
        branch: "Algebra", 
        description: "AP, GP, and Relation between AM and GM.",
        quizId: "quiz_math_005", 
      },
      position: { x: 100, y: 450 } 
    },
    {
      id: "math_stats_prob",
      type: "custom",
      data: { 
        label: "Statistics & Probability", 
        exam: "JEE",
        subject: "Maths",
        branch: "Algebra", 
        description: "Variance/SD, Bayes' Theorem, and Probability distributions.",
        quizId: "quiz_math_006", 
      },
      position: { x: 400, y: 450 } 
    }
  ],
  edges: [
    { id: "e_set_comp", source: "math_sets_func", target: "math_complex_quad", animated: true },
    { id: "e_set_mat", source: "math_sets_func", target: "math_matrices", animated: true },
    { id: "e_mat_pnc", source: "math_matrices", target: "math_pnc_binomial", animated: true },
    { id: "e_pnc_prob", source: "math_pnc_binomial", target: "math_stats_prob", animated: true },
    { id: "e_pnc_seq", source: "math_pnc_binomial", target: "math_seq_series", animated: true }
  ]
};