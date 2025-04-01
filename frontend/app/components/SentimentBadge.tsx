'use client';

import { cn } from '../lib/utils';
import { HeartIcon, FaceSmileIcon, FaceFrownIcon } from '@heroicons/react/24/solid';

interface SentimentBadgeProps {
  sentiment: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function SentimentBadge({ sentiment, size = 'md' }: SentimentBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const getConfig = () => {
    if (!sentiment) {
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-500',
        icon: <HeartIcon className="w-4 h-4 mr-1" />
      };
    }

    switch (sentiment.toLowerCase()) {
      case 'positive':
        return {
          bg: 'bg-success/10',
          border: 'border-success/20',
          text: 'text-success',
          icon: <FaceSmileIcon className="w-4 h-4 mr-1" />
        };
      case 'negative':
        return {
          bg: 'bg-danger/10',
          border: 'border-danger/20',
          text: 'text-danger',
          icon: <FaceFrownIcon className="w-4 h-4 mr-1" />
        };
      case 'neutral':
      default:
        return {
          bg: 'bg-neutral/10',
          border: 'border-neutral/20',
          text: 'text-neutral',
          icon: <HeartIcon className="w-4 h-4 mr-1" />
        };
    }
  };

  const config = getConfig();

  return (
    <span className={cn(
      'inline-flex items-center rounded-full border font-medium',
      sizeClasses[size],
      config.bg,
      config.border,
      config.text
    )}>
      {config.icon}
      {sentiment || 'Unknown'}
    </span>
  );
} 