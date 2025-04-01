'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Note, NoteAnalysis } from '../../types/note';
import SentimentBadge from '../../components/SentimentBadge';
import api from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useParams } from 'next/navigation';
import PageContainer from '../../components/PageContainer';

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { checkAuth } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const noteId = parseInt(params.id as string);

  useEffect(() => {
    const fetchNote = async () => {
      if (!checkAuth() || isNaN(noteId)) return;
      
      try {
        const response = await api.get<Note>(`/notes/${noteId}`);
        setNote(response.data);
      } catch (err) {
        console.error('Error fetching note:', err);
        setError('Failed to load note. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [checkAuth, noteId, router]);

  const analyzeNote = async () => {
    if (!note) return;
    
    setIsAnalyzing(true);
    try {
      const response = await api.get<NoteAnalysis>(`/notes/${noteId}/analyze`);
      setNote({ ...note, sentiment: response.data.sentiment });
    } catch (err) {
      console.error('Error analyzing note:', err);
      setError('Failed to analyze note. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Loading note...</p>
          </div>
        </div>
      );
    }
  
    if (error || !note) {
      return (
        <div className="bg-red-100 p-4 rounded-md text-red-700 max-w-md mx-auto mt-8">
          <p>{error || 'Note not found'}</p>
          <div className="mt-4 flex gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
            <Link 
              href="/notes" 
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to Notes
            </Link>
          </div>
        </div>
      );
    }
  
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/notes" 
            className="text-blue-600 hover:underline"
          >
            ← Back to Notes
          </Link>
        </div>
  
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
            <SentimentBadge sentiment={note.sentiment} />
          </div>
          
          <div className="flex gap-4 text-sm text-gray-500 mb-8">
            <div>Created: {formatDate(note.created_at)}</div>
            <div>Updated: {formatDate(note.updated_at)}</div>
          </div>
          
          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap">{note.content}</div>
          </div>
          
          <div className="border-t pt-4 mt-8">
            <button
              onClick={analyzeNote}
              disabled={isAnalyzing}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      {renderContent()}
    </PageContainer>
  );
} 