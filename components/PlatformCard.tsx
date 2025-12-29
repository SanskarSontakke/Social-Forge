import React, { useState } from 'react';
import { SocialPost, Platform } from '../types';
import { Icons } from './Icon';

interface PlatformCardProps {
  platform: Platform;
  data: SocialPost | undefined;
  image: string | undefined;
  isLoadingText: boolean;
  isLoadingImage: boolean;
}

const platformConfig = {
  linkedin: {
    name: 'LinkedIn',
    icon: Icons.Linkedin,
    color: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    // High contrast background override: dark neutral, but hint of branding in border/hover
    bgColor: 'bg-neutral-900'
  },
  twitter: {
    name: 'X (Twitter)',
    icon: Icons.Twitter,
    color: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-neutral-900'
  },
  instagram: {
    name: 'Instagram',
    icon: Icons.Instagram,
    color: 'text-pink-500',
    borderColor: 'border-pink-500/30',
    bgColor: 'bg-neutral-900'
  }
};

export const PlatformCard: React.FC<PlatformCardProps> = ({ 
  platform, 
  data, 
  image, 
  isLoadingText,
  isLoadingImage 
}) => {
  const config = platformConfig[platform];
  const Icon = config.icon;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (data) {
      const textToCopy = `${data.content}\n\n${data.hashtags.join(' ')}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!data && !isLoadingText) return null;

  return (
    <div className={`flex flex-col h-full rounded-2xl border ${config.borderColor} ${config.bgColor} backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-${config.color.split('-')[1]}-900/20`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${config.color}`} />
          <h3 className="font-semibold text-white">{config.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          {image && !isLoadingImage && (
             <a 
               href={`data:image/png;base64,${image}`} 
               download={`${platform}_forge_image.png`}
               className="text-xs flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all border border-white/5 group"
               title="Download Image"
             >
               <Icons.Download className="w-3.5 h-3.5 group-hover:text-white" />
               <span className="hidden xl:inline group-hover:text-white">Image</span>
             </a>
          )}
          {data && (
            <button 
              onClick={handleCopy}
              className="text-xs flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all border border-white/5 group"
              title="Copy Text"
            >
              {copied ? <Icons.Check className="w-3.5 h-3.5 text-green-400" /> : <Icons.Copy className="w-3.5 h-3.5 group-hover:text-white" />}
              <span className="hidden xl:inline group-hover:text-white">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto max-h-[600px] scrollbar-thin">
        
        {/* Text Content */}
        <div className="space-y-3">
          {isLoadingText ? (
             <div className="space-y-4 pt-2">
               {/* Skeleton Text */}
               <div className="space-y-2.5">
                 <div className="h-4 bg-neutral-800/80 rounded w-full animate-pulse"></div>
                 <div className="h-4 bg-neutral-800/80 rounded w-[95%] animate-pulse delay-75"></div>
                 <div className="h-4 bg-neutral-800/80 rounded w-[90%] animate-pulse delay-100"></div>
                 <div className="h-4 bg-neutral-800/80 rounded w-[85%] animate-pulse delay-150"></div>
                 <div className="h-4 bg-neutral-800/80 rounded w-3/4 animate-pulse delay-200"></div>
               </div>
               
               {/* Skeleton Hashtags */}
               <div className="flex gap-2 pt-2">
                 <div className={`h-3 ${config.bgColor === 'bg-neutral-900' ? 'bg-neutral-800' : 'bg-white/10'} rounded w-16 animate-pulse`}></div>
                 <div className={`h-3 ${config.bgColor === 'bg-neutral-900' ? 'bg-neutral-800' : 'bg-white/10'} rounded w-24 animate-pulse delay-75`}></div>
                 <div className={`h-3 ${config.bgColor === 'bg-neutral-900' ? 'bg-neutral-800' : 'bg-white/10'} rounded w-14 animate-pulse delay-150`}></div>
               </div>
             </div>
          ) : (
            <>
              <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                {data?.content}
              </p>
              {data?.hashtags && data.hashtags.length > 0 && (
                <p className={`text-sm ${config.color} opacity-90`}>
                  {data.hashtags.join(' ')}
                </p>
              )}
            </>
          )}
        </div>

        {/* Image Content */}
        <div className="mt-auto pt-4">
          <div className="relative rounded-lg overflow-hidden bg-black border border-neutral-800 aspect-video flex items-center justify-center group isolate">
            {isLoadingImage ? (
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center z-10">
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 overflow-hidden opacity-30">
                      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer skew-x-12"></div>
                  </div>
                  
                  {/* Central Spinner & Label */}
                  <div className="relative z-20 flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse-fast ${config.color.replace('text-', 'bg-')}`}></div>
                      <Icons.Sparkles className={`w-8 h-8 animate-spin ${config.color}`} />
                    </div>
                    <div className="text-center">
                       <span className="text-xs font-semibold text-neutral-300 tracking-wide uppercase block mb-0.5">Forging Visual</span>
                       <span className="text-[10px] text-neutral-500">Generating for {config.name}...</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-800">
                      <div className={`h-full ${config.color.replace('text-', 'bg-')} animate-progress`}></div>
                  </div>
              </div>
            ) : image ? (
              <>
                <img 
                  src={`data:image/png;base64,${image}`} 
                  alt={`${config.name} generated visual`} 
                  className="w-full h-full object-contain bg-black" 
                />
                {/* Overlay Download Button */}
                <a 
                   href={`data:image/png;base64,${image}`} 
                   download={`${platform}_forge_image.png`}
                   className="absolute bottom-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 backdrop-blur-sm border border-white/10"
                   title="Download Image"
                >
                  <Icons.Download className="w-4 h-4" />
                </a>
              </>
            ) : (
              <div className="text-neutral-600 text-xs">Waiting for content...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};