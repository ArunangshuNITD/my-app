"use client";
import { useState, useRef, useEffect } from "react";
import { chatTemplates } from "../lib/chatTemplates";

export default function TemplateSelector({ onSelectTemplate }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (text) => {
    onSelectTemplate(text);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Template Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
        title="Use a template"
      >
        {/* Simple Document Icon (You can replace this with Lucide/Heroicons) */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </button>

      {/* Dropdown Menu - Pops up above the input box */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2 border-b bg-gray-50 rounded-t-lg">
            <h3 className="text-sm font-semibold text-gray-700">Quick Templates</h3>
          </div>
          
          <div className="p-2 space-y-3">
            {chatTemplates.map((category, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-2">
                  {category.category}
                </h4>
                <ul className="space-y-1">
                  {category.templates.map((template, tIdx) => (
                    <li key={tIdx}>
                      <button
                        type="button"
                        onClick={() => handleSelect(template.text)}
                        className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                      >
                        {template.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}