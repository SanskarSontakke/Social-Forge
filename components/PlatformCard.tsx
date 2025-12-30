import React, { useState } from 'react';
import { SocialPost, Platform } from '../types';
import { Icons } from './Icon';

interface PlatformCardProps {
  platform: Platform;
  data: SocialPost | undefined;
  image: string | undefined;
  isLoadingText: boolean;
  isLoadingImage: boolean;
  onRegenerateText: () => void;
  onRegenerateImage: () => void;
}

const platformConfig = {
  linkedin: {
    name: 'LinkedIn',
    icon: Icons.Linkedin,
    color: 'text-blue-500',
    borderColor: 'border-blue-500/30',
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
  },
  pinterest: {
    name: 'Pinterest',
    icon: Icons.Pinterest,
    color: 'text-red-500',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-neutral-900'
  },
  youtube: {
    name: 'YouTube',
    icon: Icons.Youtube,
    color: 'text-red-600',
    borderColor: 'border-red-600/30',
    bgColor: 'bg-neutral-900'
  },
  discord: {
    name: 'Discord',
    icon: Icons.Discord,
    color: 'text-indigo-500',
    borderColor: 'border-indigo-500/30',
    bgColor: 'bg-neutral-900'
  }
};

export const PlatformCard: React.FC<PlatformCardProps> = ({ 
  platform, 
  data, 
  image, 
  isLoadingText,
  isLoadingImage,
  onRegenerateText,
  onRegenerateImage
}) => {
  const config = platformConfig[platform];
  const Icon = config.icon;
  const [copied, setCopied] = useState(false);
  const isYoutube = platform === 'youtube';

  const handleCopy = () => {
    if (data) {
      const textToCopy = `${data.content}\n\n${data.hashtags.join(' ')}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!data) return;

    const text = `${data.content}\n\n${data.hashtags.join(' ')}`;
    const shareData: any = {
      title: `New ${config.name} Post`,
      text: text,
    };

    // 1. Try Web Share API with Files (Mobile/Supported Desktop)
    if (image && navigator.canShare) {
      try {
        const res = await fetch(`data:image/png;base64,${image}`);
        const blob = await res.blob();
        const file = new File([blob], 'image.png', { type: 'image/png' });
        const dataWithFiles = { ...shareData, files: [file] };

        if (navigator.canShare(dataWithFiles)) {
          await navigator.share(dataWithFiles);
          return;
        }
      } catch (e) {
        console.warn("File sharing failed, falling back to text/link", e);
      }
    }

    // 2. Try Web Share API Text Only
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        console.warn("Web Share API failed or cancelled", e);
      }
    }

    // 3. Fallback to Platform Specific URLs
    let url = '';
    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'linkedin':
        // LinkedIn does not support pre-filling text via URL for feed posts efficiently anymore
        url = `https://www.linkedin.com/feed/`;
        handleCopy(); // Copy text for convenience
        break;
      case 'pinterest':
        url = `https://www.pinterest.com/pin-builder/`;
        // Copy text for convenience (image has to be uploaded manually if not using API)
        handleCopy(); 
        break;
      case 'instagram':
        url = 'https://www.instagram.com/';
        handleCopy();
        break;
      case 'youtube':
        url = 'https://studio.youtube.com/';
        handleCopy();
        break;
      case 'discord':
        url = 'https://discord.com/app';
        handleCopy();
        break;
      default:
        break;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  // Do not render if there is no data and it's not the initial global load
  if (!data && !isLoadingText) return null;

  const renderImage = () => (
    <div className={isYoutube ? 'mb-2' : 'mt-auto pt-4'}>
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
            
            {/* YouTube Specific Play Overlay */}
            {isYoutube && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg opacity-90">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                </div>
              </div>
            )}

            <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
               {/* Regenerate Image Button */}
               <button 
                onClick={onRegenerateImage}
                className="p-2 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-sm border border-white/10 transition-transform hover:scale-105 active:scale-95"
                title="Regenerate Image"
              >
                <Icons.Refresh className="w-4 h-4" />
              </button>

               {/* Download Image Button */}
              <a 
                 href={`data:image/png;base64,${image}`} 
                 download={`${platform}_forge_image.png`}
                 className="p-2 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-sm border border-white/10 transition-transform hover:scale-105 active:scale-95"
                 title="Download Image"
              >
                <Icons.Download className="w-4 h-4" />
              </a>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
             <div className="text-neutral-600 text-xs">Waiting for content...</div>
             <button 
               onClick={onRegenerateImage} 
               className="text-[10px] px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded border border-neutral-700 transition-colors"
             >
               Retry Image
             </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderText = () => (
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
  );

  return (
    <div className={`flex flex-col h-full rounded-2xl border ${config.borderColor} ${config.bgColor} backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-${config.color.split('-')[1]}-900/20`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${config.color}`} />
          <h3 className="font-semibold text-white">{config.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          {data && (
            <>
              {/* Regenerate Text Button */}
              <button 
                onClick={onRegenerateText}
                disabled={isLoadingText}
                className={`text-xs flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all border border-white/5 group ${isLoadingText ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Regenerate Text"
              >
                 <Icons.Refresh className={`w-3.5 h-3.5 group-hover:text-white ${isLoadingText ? 'animate-spin' : ''}`} />
              </button>

              {/* Share Button */}
              <button 
                onClick={handleShare}
                className="text-xs flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all border border-white/5 group"
                title={`Share on ${config.name}`}
              >
                <Icons.Share className="w-3.5 h-3.5 group-hover:text-white" />
                <span className="hidden xl:inline group-hover:text-white">Share</span>
              </button>

              {/* Copy Button */}
              <button 
                onClick={handleCopy}
                className="text-xs flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all border border-white/5 group"
                title="Copy Text"
              >
                {copied ? <Icons.Check className="w-3.5 h-3.5 text-green-400" /> : <Icons.Copy className="w-3.5 h-3.5 group-hover:text-white" />}
                <span className="hidden xl:inline group-hover:text-white">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto max-h-[600px] scrollbar-thin">
        {isYoutube ? (
          <>
            {renderImage()}
            {renderText()}
          </>
        ) : (
          <>
            {renderText()}
            {renderImage()}
          </>
        )}
      </div>
    </div>
  );
};