export const jeeMathsGeometryTree = {
  nodes: [
    {
      id: "math_2d_lines",
      type: "custom",
      data: { 
        label: "Straight Lines", 
        exam: "JEE",
        subject: "Maths",
        branch: "Geometry", 
        description: "Slope, Locus, Various forms of lines, and Centroid/Orthocentre.",
        quizId: "quiz_math_012", 
      },
      position: { x: 250, y: 0 } 
    },
    {
      id: "math_conics",
      type: "custom",
      data: { 
        label: "Circles & Conics", 
        exam: "JEE",
        subject: "Maths",
        branch: "Geometry", 
        description: "Standard equations of Parabola, Ellipse, and Hyperbola.",
        quizId: "quiz_math_013", 
      },
      position: { x: 250, y: 150 } 
    },
    {
      id: "math_vectors",
      type: "custom",
      data: { 
        label: "Vector Algebra", 
        exam: "JEE",
        subject: "Maths",
        branch: "Vectors", 
        description: "Scalar and Vector products, components in 3D.",
        quizId: "quiz_math_014", 
      },
      position: { x: 100, y: 300 } 
    },
    {
      id: "math_3d_geo",
      type: "custom",
      data: { 
        label: "3D Geometry", 
        exam: "JEE",
        subject: "Maths",
        branch: "Geometry", 
        description: "Direction ratios/cosines and Skew lines shortest distance.",
        quizId: "quiz_math_015", 
      },
      position: { x: 400, y: 300 } 
    }
  ],
  edges: [
    { id: "e_line_conic", source: "math_2d_lines", target: "math_conics", animated: true },
    { id: "e_conic_vec", source: "math_conics", target: "math_vectors", animated: true },
    { id: "e_conic_3d", source: "math_conics", target: "math_3d_geo", animated: true },
    { id: "e_vec_3d", source: "math_vectors", target: "math_3d_geo", animated: true }
  ]
};