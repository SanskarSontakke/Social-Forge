import React, { useState, useRef, useEffect } from 'react';
import { Settings, AspectRatio, Tone, TextLength } from '../types';
import { Icons } from './Icon';

interface SettingsPanelProps {
  settings: Settings;
  onUpdate: (newSettings: Partial<Settings>) => void;
  disabled: boolean;
}

const TONE_DESCRIPTIONS: Record<Tone, string> = {
  Professional: "Authoritative, polished, and credible. Best for industry insights and corporate announcements.",
  Witty: "Humorous, clever, and entertaining. Great for high engagement and brand personality.",
  Urgent: "Time-sensitive and direct. Ideal for sales, limited-time offers, or critical updates.",
  Empathetic: "Compassionate, warm, and supportive. Ideal for building community trust and addressing sensitive topics.",
  Controversial: "Provocative and bold. Designed to spark debate and maximize reach (use with caution)."
};

const tones: Tone[] = ['Professional', 'Witty', 'Urgent', 'Empathetic', 'Controversial'];

const textLengths: { value: TextLength; label: string }[] = [
  { value: 'Short', label: 'Short (Concise)' },
  { value: 'Medium', label: 'Medium (Standard)' },
  { value: 'Long', label: 'Long (Detailed)' },
];

const supportedRatios = [
  AspectRatio.Auto,
  AspectRatio.Square_1_1,
  AspectRatio.Portrait_3_4,
  AspectRatio.Landscape_4_3,
  AspectRatio.Portrait_9_16,
  AspectRatio.Landscape_16_9,
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, disabled }) => {
  const [isToneOpen, setIsToneOpen] = useState(false);
  const toneDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toneDropdownRef.current && !toneDropdownRef.current.contains(event.target as Node)) {
        setIsToneOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToneSelect = (tone: Tone) => {
    if (disabled) return;
    onUpdate({ tone });
    setIsToneOpen(false);
  };

  return (
    <div className="bg-neutral-950/50 rounded-xl border border-neutral-800 p-4 mb-6 animate-fade-in relative z-20">
      <div className="flex items-center gap-2 mb-4 text-neutral-200 font-medium">
        <Icons.Settings className="w-4 h-4 text-orange-500" />
        <span>Generation Configuration</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* Tone Selector */}
        <div ref={toneDropdownRef} className="relative group/dropdown">
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2 flex items-center gap-2">
            Tone of Voice
            <Icons.Info className="w-3 h-3 text-neutral-600" />
          </label>
          
          <button
            type="button"
            onClick={() => !disabled && setIsToneOpen(!isToneOpen)}
            disabled={disabled}
            className={`w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 block p-2.5 text-left flex items-center justify-between transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-neutral-500'}`}
          >
            <span className="truncate">{settings.tone}</span>
            <Icons.ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isToneOpen ? 'rotate-180' : ''}`} />
          </button>

          {isToneOpen && (
            <div className="absolute z-50 w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl ring-1 ring-black/50"> 
              <div className="py-1">
                {tones.map((tone) => (
                  <div
                    key={tone}
                    onClick={() => handleToneSelect(tone)}
                    className={`relative group px-4 py-2.5 text-sm cursor-pointer hover:bg-neutral-800 flex items-center justify-between transition-colors ${settings.tone === tone ? 'text-orange-400 bg-orange-900/10' : 'text-neutral-200'}`}
                  >
                    <span>{tone}</span>
                    {settings.tone === tone && <Icons.Check className="w-4 h-4" />}

                    {/* Tooltip */}
                    <div className="absolute hidden group-hover:block z-50 w-64 p-3 bg-neutral-950/95 backdrop-blur-md border border-neutral-700 rounded-xl shadow-2xl text-xs text-left pointer-events-none animate-in fade-in zoom-in-95 duration-200 bottom-full left-0 mb-2 md:bottom-auto md:top-0 md:left-full md:ml-2 md:mb-0">
                       <div className="font-bold text-white mb-1">{tone}</div>
                       <p className="text-neutral-300 leading-relaxed font-light">{TONE_DESCRIPTIONS[tone]}</p>
                       
                       {/* Arrow for Desktop (Left side of tooltip) */}
                       <div className="hidden md:block absolute top-3 -left-1 w-2 h-2 bg-neutral-950/95 border-l border-b border-neutral-700 transform rotate-45"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text Length Selector */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2">
            Text Length
          </label>
          <div className="relative">
             <select
              value={settings.textLength}
              onChange={(e) => onUpdate({ textLength: e.target.value as TextLength })}
              disabled={disabled}
              className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 appearance-none disabled:opacity-50"
            >
              {textLengths.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2">
            Aspect Ratio
          </label>
          <div className="relative">
            <select
              value={settings.aspectRatio}
              onChange={(e) => onUpdate({ aspectRatio: e.target.value as AspectRatio })}
              disabled={disabled}
              className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 appearance-none disabled:opacity-50"
            >
              {supportedRatios.map((ratio) => (
                <option key={ratio} value={ratio}>
                  {ratio === AspectRatio.Auto ? 'Auto (Platform Optimized)' : ratio}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};