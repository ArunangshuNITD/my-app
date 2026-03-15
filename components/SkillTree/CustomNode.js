'use client'
import { Handle, Position } from '@xyflow/react';
import { Lock, Play, CheckCircle } from 'lucide-react';

export default function CustomNode({ data }) {
  // data.status will be passed down from the Board: 'locked', 'unlocked', or 'mastered'
  const isMastered = data.status === 'mastered';
  const isUnlocked = data.status === 'unlocked';
  const isLocked = data.status === 'locked';

  return (
    <div className={`px-4 py-3 shadow-lg rounded-xl border-2 w-48 transition-all ${
      isMastered ? 'bg-yellow-500 border-yellow-300 text-white' : 
      isUnlocked ? 'bg-blue-600 border-blue-400 text-white cursor-pointer hover:scale-105' : 
      'bg-gray-200 border-gray-300 text-gray-500 opacity-70'
    }`}>
      
      {/* Top Connection Point */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white" />

      <div className="flex items-center justify-between">
        <div className="font-bold text-sm">{data.label}</div>
        {isMastered && <CheckCircle size={18} />}
        {isUnlocked && <Play size={18} className="animate-pulse" />}
        {isLocked && <Lock size={18} />}
      </div>
      <div className="text-xs mt-1 opacity-80">{data.description}</div>

      {/* Bottom Connection Point */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white" />
    </div>
  );
}