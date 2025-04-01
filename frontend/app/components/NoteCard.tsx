'use client';

import { Note } from '../types/note';
import SentimentBadge from './SentimentBadge';
import { formatDate, truncateText } from '../lib/utils';
import { ClockIcon } from '@heroicons/react/24/outline';

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="card group hover:scale-[1.02] transition-transform duration-200 cursor-pointer animate-fadeIn">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{note.title}</h3>
          <SentimentBadge sentiment={note.sentiment} />
        </div>
        <p className="text-neutral line-clamp-3 mb-4">
          {truncateText(note.content, 150)}
        </p>
        <div className="flex items-center text-sm text-neutral pt-4 border-t border-card-border">
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>{formatDate(note.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 