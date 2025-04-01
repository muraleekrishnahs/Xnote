'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Note } from '../types/note';
import NoteCard from '../components/NoteCard';
import NoteDialog from '../components/NoteDialog';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { PlusIcon, DocumentTextIcon, ExclamationCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function NotesPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!checkAuth()) return;
      
      try {
        setIsLoading(true);
        const response = await api.get<Note[]>('/notes/');
        setNotes(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching notes:', err);
        
        // Provide more specific error messages based on error type
        if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to the backend server. Please ensure Docker containers are running properly.');
        } else if (err.code === 'ECONNABORTED') {
          setError('Request timed out. The server took too long to respond.');
        } else if (err.response) {
          setError(`Server error: ${err.response.status} ${err.response.statusText}`);
        } else {
          setError('Failed to load notes. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [checkAuth]);

  // Handle viewing a note
  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setViewDialogOpen(true);
  };

  // Handle newly created note
  const handleNoteCreated = (newNote: Note) => {
    setNotes(prevNotes => [newNote, ...prevNotes]);
    // Optionally, scroll to the top or highlight the new note
  };

  // Handle updated note
  const handleNoteUpdated = (updatedNote: Note) => {
    setNotes(prevNotes => 
      prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note)
    );
    // Optionally close the view dialog if it's open
    // setViewDialogOpen(false); 
  };

  // Handle deleted note
  const handleNoteDeleted = (deletedNoteId: number) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== deletedNoteId));
    setViewDialogOpen(false); // Close the dialog after deletion
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-neutral">Loading your notes...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="card backdrop-blur-sm bg-danger/5 border-danger/20 p-8 max-w-md mx-auto mt-8">
          <div className="flex items-start space-x-3">
            <ExclamationCircleIcon className="w-6 h-6 text-danger flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-danger mb-2">Error Loading Notes</h3>
              <p className="text-neutral mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md hover:shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div>
        {/* Search and create bar - This section will be moved */}
        {/*
        <div className="backdrop-blur-sm bg-black/5 border border-white/10 p-4 rounded-xl mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-auto flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300"
              />
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-300"></div>
            </div>
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="whitespace-nowrap bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 inline-flex items-center shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30 group"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Note
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        */}
  
        {notes.length === 0 ? (
          <div className="backdrop-blur-sm bg-black/10 border border-white/5 rounded-2xl p-12 text-center animate-fadeIn">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
                <DocumentTextIcon className="w-24 h-24 text-neutral opacity-60 absolute inset-0" />
              </div>
              <h2 className="text-3xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">No notes yet</h2>
              <p className="text-neutral mb-6 max-w-md">Start capturing your thoughts with Xnote's smart note-taking experience.</p>
              <button 
                onClick={() => setCreateDialogOpen(true)} 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 inline-flex items-center shadow-md hover:shadow-lg group"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Note
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search and create bar - Moved here */}
            <div className="backdrop-blur-sm bg-black/5 border border-white/10 p-4 rounded-xl mb-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-auto flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300"
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-300"></div>
                </div>
                <button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="whitespace-nowrap bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 inline-flex items-center shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30 group"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create New Note
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Visual hint for search results */}
            {searchQuery && (
              <div className="mb-4 text-neutral text-sm">
                Found {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </div>
            )}
            
            {/* Abstract shapes for visual interest */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
              <div className="absolute top-[30%] left-[10%] w-[30%] h-[30%] rounded-full bg-indigo-900/5 blur-3xl"></div>
              <div className="absolute bottom-[20%] right-[5%] w-[40%] h-[40%] rounded-full bg-purple-900/5 blur-3xl"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-fadeIn">
              {filteredNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="animate-fadeIn cursor-pointer" 
                  style={{animationDelay: `${note.id * 0.05}s`}}
                  onClick={() => handleViewNote(note)}
                >
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 to-[#1e293b] text-gray-300">
        {renderContent()}
        
        {/* Create Note Dialog */}
        <NoteDialog
          mode="create"
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onNoteCreated={handleNoteCreated}
        />
        
        {/* View/Edit Note Dialog */}
        <NoteDialog
          mode="view"
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          note={selectedNote}
          onNoteUpdated={handleNoteUpdated}
          onNoteDeleted={handleNoteDeleted}
        />
      </main>
    </>
  );
} 