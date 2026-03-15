'use client';
import { useState, useMemo, useEffect } from 'react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';
import QuizModal from './QuizModel';

// --- PHYSICS & CHEMISTRY IMPORTS ---
import { jeePhysicsMechanicsTree } from '@/lib/curricula/jee/physics/mechanics';
import { jeePhysicsExtendedMechanicsTree } from '@/lib/curricula/jee/physics/extendedmechanics';
import { jeePhysicsThermalTree } from '@/lib/curricula/jee/physics/thermal';
import { jeePhysicsWavesTree } from '@/lib/curricula/jee/physics/waves';
import { jeePhysicsElectromagnetismFullTree } from '@/lib/curricula/jee/physics/electromagnetism';
import { jeePhysicsOpticsModernTree } from '@/lib/curricula/jee/physics/optics';
import { jeePhysicsModernExperimentalTree } from '@/lib/curricula/jee/physics/modern';

import { jeeChemPhysicalTree } from '@/lib/curricula/jee/chemistry/physical';
import { jeeChemInorganicTree } from '@/lib/curricula/jee/chemistry/inorganic';
import { jeeChemOrganicTree } from '@/lib/curricula/jee/chemistry/organic';

// --- JEE EXCLUSIVE IMPORTS (Maths) ---
import { jeeMathsAlgebraTree } from '@/lib/curricula/jee/mathametics/algebra';
import { jeeMathsGeometryTree } from '@/lib/curricula/jee/mathametics/geometry';
import { jeeMathsCalculusTree } from '@/lib/curricula/jee/mathametics/calculus';

// --- NEET EXCLUSIVE IMPORTS (Biology) ---
import { neetBiologyDiversityTree } from '@/lib/curricula/neet/biology/diversity';
import { neetBiologyStructuralOrgTree } from '@/lib/curricula/neet/biology/structure';
import { neetBiologyCellTree } from '@/lib/curricula/neet/biology/cell';
import { neetBiologyPlantPhysTree } from '@/lib/curricula/neet/biology/plant_physiology';
import { neetBiologyHumanPhysTree } from '@/lib/curricula/neet/biology/human_physiology';
import { neetBiologyReproductionTree } from '@/lib/curricula/neet/biology/reproduction';
import { neetBiologyGeneticsTree } from '@/lib/curricula/neet/biology/genetics';
import { neetBiologyWelfareTree } from '@/lib/curricula/neet/biology/human_welfare';
import { neetBiologyBiotechTree } from '@/lib/curricula/neet/biology/biotech';
import { neetBiologyEcologyTree } from '@/lib/curricula/neet/biology/ecology';

const nodeTypes = { custom: CustomNode };

const allCurriculumData = {
  JEE: {
    Physics: {
      "Mechanics": jeePhysicsMechanicsTree,
      "Properties & Gravitation": jeePhysicsExtendedMechanicsTree,
      "Thermal Physics": jeePhysicsThermalTree,
      "Waves & SHM": jeePhysicsWavesTree,
      "Electromagnetism": jeePhysicsElectromagnetismFullTree,
      "Optics & Dual Nature": jeePhysicsOpticsModernTree,
      "Modern & Experimental": jeePhysicsModernExperimentalTree,
    },
    Chemistry: {
      "Physical": jeeChemPhysicalTree,
      "Organic": jeeChemOrganicTree,
      "Inorganic": jeeChemInorganicTree,
    },
    Maths: {
      "Calculus and Trigonometry": jeeMathsCalculusTree,
      "Algebra": jeeMathsAlgebraTree,
      "Coordinate Geometry and Vector Algebra": jeeMathsGeometryTree,
    }
  },
  NEET: {
    Physics: {
      "Mechanics": jeePhysicsMechanicsTree,
      "Properties & Gravitation": jeePhysicsExtendedMechanicsTree,
      "Thermal Physics": jeePhysicsThermalTree,
      "Waves & SHM": jeePhysicsWavesTree,
      "Electromagnetism": jeePhysicsElectromagnetismFullTree,
      "Optics & Dual Nature": jeePhysicsOpticsModernTree,
      "Modern & Experimental": jeePhysicsModernExperimentalTree,
    },
    Chemistry: {
      "Physical": jeeChemPhysicalTree,
      "Organic": jeeChemOrganicTree,
      "Inorganic": jeeChemInorganicTree,
    },
    // Organized Botany and Zoology as primary subjects for NEET
    Botany: {
      "Diversity in Living World": neetBiologyDiversityTree,
      "Plant Physiology": neetBiologyPlantPhysTree,
      "Reproduction (Plants)": neetBiologyReproductionTree,
      "Genetics & Evolution": neetBiologyGeneticsTree,
      "Ecology & Environment": neetBiologyEcologyTree,
      "Biotechnology": neetBiologyBiotechTree,
    },
    Zoology: {
      "Structural Organization": neetBiologyStructuralOrgTree,
      "Cell Structure & Function": neetBiologyCellTree,
      "Human Physiology": neetBiologyHumanPhysTree,
      "Human Reproduction": neetBiologyReproductionTree,
      "Human Welfare": neetBiologyWelfareTree,
    }
  }
};

// Color Theme Configuration
const examThemes = {
  JEE: {
    primary: 'bg-blue-600',
    border: 'border-blue-400',
    text: 'text-blue-400',
    accentBorder: 'border-blue-500',
    backgroundDot: '#2563eb' // Blue-600
  },
  NEET: {
    // --- UPDATED DARK GREENISH THEME ---
    primary: 'bg-green-900 border-green-700', // Very dark green background and border
    border: 'border-green-600',
    text: 'text-green-300', // Lighter green for text on dark background
    accentBorder: 'border-green-500',
    backgroundDot: '#15803d', // Green-700 for subtle dots
    nodeBg: 'bg-green-950', // Extremely dark green for node background
    nodeBorder: 'border-green-800' // Darker green for node borders
  }
}

export default function SkillTreeBoard({ userId, masteredNodes = [], examType = "JEE" }) {
  // Use the provided examType to select data and theme
  const examData = allCurriculumData[examType];
  const theme = examThemes[examType] || examThemes.JEE;

  const [activeSubject, setActiveSubject] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  // Auto-switch tabs when the exam type changes (e.g., from JEE to NEET)
  useEffect(() => {
    if (examData) {
      const subjects = Object.keys(examData);
      if (subjects.length > 0) {
        const firstSubject = subjects[0];
        const subTabs = Object.keys(examData[firstSubject]);

        setActiveSubject(firstSubject);
        setActiveSubTab(subTabs.length > 0 ? subTabs[0] : "");
      }
    }
    setSelectedNode(null);
  }, [examType, examData]);

  const activeTree = useMemo(() => {
    if (!examData || !activeSubject || !activeSubTab) return { nodes: [], edges: [] };
    return examData[activeSubject]?.[activeSubTab] || { nodes: [], edges: [] };
  }, [examData, activeSubject, activeSubTab]);

  const nodesWithStatus = useMemo(() => {
    const nodes = activeTree.nodes || [];
    const edges = activeTree.edges || [];

    return nodes.map(node => {
      let status = 'locked';
      if (masteredNodes.includes(node.id)) {
        status = 'mastered';
      } else {
        const prerequisites = edges
          .filter(edge => edge.target === node.id)
          .map(edge => edge.source);

        const allPrereqsMet = prerequisites.length === 0 ||
          prerequisites.every(p => masteredNodes.includes(p));

        if (allPrereqsMet) status = 'unlocked';
      }
      // Passing examType and theme context to custom nodes for internal styling
      return { ...node, data: { ...node.data, status, examType } };
    });
  }, [masteredNodes, activeTree, examType]);

  const handleNodeClick = (event, node) => {
    if (node.data.status !== 'locked') {
      setSelectedNode(node);
    }
  };

  if (!examData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-slate-900 rounded-[2rem] border border-slate-800">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Curriculum under construction!</h2>
        <p className="text-slate-500">The roadmap for {examType} is coming soon.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto p-4 bg-slate-950 min-h-screen rounded-[2rem]">

      {/* --- SUBJECT TABS (Physics, Chemistry, Botany, Zoology, etc.) --- */}
      <div className="flex gap-2 border-b border-slate-800 pb-4 overflow-x-auto no-scrollbar">
        {Object.keys(examData).map((subject) => (
          <button
            key={subject}
            onClick={() => {
              setActiveSubject(subject);
              const firstSubTab = Object.keys(examData[subject])[0];
              setActiveSubTab(firstSubTab || "");
              setSelectedNode(null);
            }}
            className={`px-6 py-2 rounded-t-lg font-bold transition-all whitespace-nowrap ${activeSubject === subject
                ? `${theme.primary} text-white border-b-2 ${theme.border}`
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
              }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* --- CHAPTER/SUB-TOPIC TABS --- */}
      <div className="flex flex-wrap gap-2 py-2">
        {activeSubject && Object.keys(examData[activeSubject] || {}).map((subTab) => (
          <button
            key={subTab}
            onClick={() => {
              setActiveSubTab(subTab);
              setSelectedNode(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${activeSubTab === subTab
                ? `bg-slate-800 ${theme.accentBorder} ${theme.text}`
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
          >
            {subTab}
          </button>
        ))}
      </div>

      {/* --- THE CANVAS --- */}
      <div className="w-full h-[65vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl">
        <ReactFlow
          key={`${examType}-${activeSubject}-${activeSubTab}`}
          nodes={nodesWithStatus}
          edges={activeTree.edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          {/* Background dots now match the exam theme blue or emerald */}
          <Background color={theme.backgroundDot} gap={20} opacity={0.15} />
          <Controls />
        </ReactFlow>

        {selectedNode && (
          <QuizModal
            node={selectedNode}
            userId={userId}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
}