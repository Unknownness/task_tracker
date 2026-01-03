'use client';

import { Priority } from '@/lib/types';
import { ChevronDown, ArrowDown, Minus, ArrowUp, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface PrioritySelectProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  className?: string;
}

const priorityOptions: { 
  value: Priority; 
  label: string; 
  icon: React.ReactNode;
  bgColor: string; 
  borderColor: string;
  iconColor: string;
}[] = [
  { 
    value: 'low', 
    label: 'Low', 
    icon: <ArrowDown size={16} />,
    bgColor: 'bg-emerald-50', 
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-600'
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    icon: <Minus size={16} />,
    bgColor: 'bg-amber-50', 
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600'
  },
  { 
    value: 'high', 
    label: 'High', 
    icon: <ArrowUp size={16} />,
    bgColor: 'bg-rose-50', 
    borderColor: 'border-rose-200',
    iconColor: 'text-rose-600'
  },
];

export default function PrioritySelectAdvanced({ value, onChange, className = '' }: PrioritySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedPriority = priorityOptions.find(p => p.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (priority: Priority) => {
    onChange(priority);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${selectedPriority?.bgColor} border ${selectedPriority?.borderColor} flex items-center justify-center`}>
            <span className={selectedPriority?.iconColor}>
              {selectedPriority?.icon}
            </span>
          </div>
          <span className="text-gray-900 font-medium">{selectedPriority?.label}</span>
        </div>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                value === option.value ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${option.bgColor} border ${option.borderColor} flex items-center justify-center`}>
                  <span className={option.iconColor}>
                    {option.icon}
                  </span>
                </div>
                <span className="text-gray-900 font-medium">{option.label}</span>
              </div>
              {value === option.value && (
                <Check size={16} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}