export const jeeMathsCalculusTree = {
  nodes: [
    {
      id: "math_trig",
      type: "custom",
      data: { 
        label: "Trigonometry", 
        exam: "JEE",
        subject: "Maths",
        branch: "Calculus", 
        description: "Identities, Trig functions, and Inverse Trig Properties.",
        quizId: "quiz_math_007", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "math_limits_cont",
      type: "custom",
      data: { 
        label: "Limits & Continuity", 
        exam: "JEE",
        subject: "Maths",
        branch: "Calculus", 
        description: "Standard limits, L'Hopital rule, and Differentiability.",
        quizId: "quiz_math_008", 
      },
      position: { x: 250, y: 150 } 
    },
    {
      id: "math_diff_app",
      type: "custom",
      data: { 
        label: "Differentiation & AOD", 
        exam: "JEE",
        subject: "Maths",
        branch: "Calculus", 
        description: "Chain rule, Maxima/Minima, and Monotonicity.",
        quizId: "quiz_math_009", 
      },
      position: { x: 250, y: 300 } 
    },
    {
      id: "math_integral",
      type: "custom",
      data: { 
        label: "Integral Calculus", 
        exam: "JEE",
        subject: "Maths",
        branch: "Calculus", 
        description: "Definite/Indefinite integrals and Area under curves.",
        quizId: "quiz_math_010", 
      },
      position: { x: 250, y: 450 } 
    },
    {
      id: "math_diff_eq",
      type: "custom",
      data: { 
        label: "Differential Equations", 
        exam: "JEE",
        subject: "Maths",
        branch: "Calculus", 
        description: "Variable separation, Homogeneous and Linear differential equations.",
        quizId: "quiz_math_011", 
      },
      position: { x: 250, y: 600 } 
    }
  ],
  edges: [
    { id: "e_trig_lim", source: "math_trig", target: "math_limits_cont", animated: true },
    { id: "e_lim_diff", source: "math_limits_cont", target: "math_diff_app", animated: true },
    { id: "e_diff_int", source: "math_diff_app", target: "math_integral", animated: true },
    { id: "e_int_de", source: "math_integral", target: "math_diff_eq", animated: true }
  ]
};