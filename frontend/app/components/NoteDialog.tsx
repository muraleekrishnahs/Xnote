'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Note, NoteCreate } from '../types/note';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { formatDate } from '../lib/utils';
import SentimentBadge from './SentimentBadge';
import { DocumentTextIcon, XMarkIcon, PencilIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '../lib/utils';

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const contentVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 30,
      delay: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

// Alert animation variants
const alertVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Combine motion and Dialog.Content
const MotionDialogContent = motion(Dialog.Content);
const MotionDialogOverlay = motion(Dialog.Overlay);

interface NoteDialogProps {
  mode: 'create' | 'view';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: Note;
  onNoteCreated?: (newNote: Note) => void;
  onNoteUpdated?: (updatedNote: Note) => void;
  onNoteDeleted?: (deletedNoteId: number) => void;
}

export default function NoteDialog({ mode, open, onOpenChange, note, onNoteCreated, onNoteUpdated, onNoteDeleted }: NoteDialogProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteCreate>({
    defaultValues: {
      title: note?.title || '',
      content: note?.content || ''
    }
  });

  const onSubmit = async (data: NoteCreate) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (mode === 'create') {
        // Create a new note and get the created note data
        const response = await api.post<Note>('/notes/', data);
        const newNote = response.data;
        
        setSuccessMessage('Note created successfully!');
        
        // Update parent state and reset form
        onNoteCreated?.(newNote);
        reset();
        
        // Close dialog after a short delay (optional, could remove timeout)
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      } else if (isEditing && note) {
        // Update existing note
        const response = await api.put<Note>(`/notes/${note.id}`, data);
        const updatedNote = response.data;
        
        setSuccessMessage('Note updated successfully!');
        setIsEditing(false);
        
        // Update parent state
        onNoteUpdated?.(updatedNote);
        
        // Close dialog after a short delay (optional)
        setTimeout(() => {
          // router.refresh(); // Remove this line
        }, 1500); // Delay could be removed or adjusted
      }
    } catch (err: any) {
      console.error('Error saving note:', err);
      setError(err.response?.data?.detail || 'Failed to save note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!note || !confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await api.delete(`/notes/${note.id}`);
      onOpenChange(false);
      onNoteDeleted?.(note.id);
    } catch (err: any) {
      console.error('Error deleting note:', err);
      setError(err.response?.data?.detail || 'Failed to delete note. Please try again.');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <MotionDialogOverlay
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[998] bg-black/80 backdrop-blur-sm"
            />
            
            {/* Dialog Content */}            
            <MotionDialogContent
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-[50%] top-[50%] z-[999] w-[95vw] max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#1e293b] focus:outline-none"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 bg-black/20 p-4 md:p-6">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-400" />
                    <Dialog.Title className="text-xl font-semibold text-white">
                      {mode === 'create' ? 'Create New Note' : (isEditing ? 'Edit Note' : 'View Note')}
                    </Dialog.Title>
                  </div>
                  
                  <Dialog.Close asChild>
                    <button 
                      className="rounded-full p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                      aria-label="Close"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>
                
                {/* Content Scroll Area */}
                <div className="p-4 md:p-6 max-h-[65vh] overflow-y-auto bg-[#0f172a]/80">
                  {/* Alerts */}
                  {error && (
                    <motion.div 
                      variants={alertVariants}
                      initial="hidden"
                      animate="visible"
                      style={{
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: '1px',
                        borderColor: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444'
                      }}
                    >
                      <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                      <p>{error}</p>
                    </motion.div>
                  )}
                  
                  {successMessage && (
                    <motion.div 
                      variants={alertVariants}
                      initial="hidden"
                      animate="visible"
                      style={{
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: '1px',
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981'
                      }}
                    >
                      <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                      <p>{successMessage}</p>
                    </motion.div>
                  )}
                  
                  {/* Form / View Mode */}
                  {mode === 'create' || isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-300">
                          Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          placeholder="Enter note title"
                          {...register('title', { required: 'Title is required' })}
                          className={cn(
                            "w-full rounded-md bg-[#1e293b] border p-3 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow text-white placeholder:text-gray-500",
                            errors.title ? "border-red-500" : "border-white/10"
                          )}
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-500 flex items-center">
                            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                            {errors.title.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-1 text-gray-300">
                          Content
                        </label>
                        <textarea
                          id="content"
                          rows={8}
                          placeholder="What's on your mind?"
                          {...register('content', { 
                            required: 'Content is required',
                            minLength: {
                              value: 10,
                              message: 'Content must be at least 10 characters long'
                            }
                          })}
                          className={cn(
                            "w-full rounded-md bg-[#1e293b] border p-3 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow resize-y text-white placeholder:text-gray-500",
                            errors.content ? "border-red-500" : "border-white/10"
                          )}
                        />
                        {errors.content && (
                          <p className="mt-1 text-sm text-red-500 flex items-center">
                            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                            {errors.content.message}
                          </p>
                        )}
                      </div>
                    </form>
                  ) : (
                    note && (
                      <div className="space-y-4 text-white">
                        <h3 className="text-xl font-semibold">{note.title}</h3>
                        {note.sentiment && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Sentiment:</span>
                            <SentimentBadge sentiment={note.sentiment} />
                          </div>
                        )}
                        <p className="text-sm text-gray-400">
                          Created: {formatDate(note.created_at)} | Updated: {formatDate(note.updated_at)}
                        </p>
                        <div className="mt-4 whitespace-pre-wrap text-gray-300 bg-black/10 p-4 rounded-md border border-white/10">
                          {note.content}
                        </div>
                      </div>
                    )
                  )}
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-white/5 bg-black/20 p-4 md:p-6">
                  {(mode === 'create' || isEditing) && (
                    <button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className={cn(
                        "rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                        isSubmitting && "animate-pulse"
                      )}
                    >
                      {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Note' : 'Update Note')}
                    </button>
                  )}

                  {mode === 'view' && !isEditing && note && (
                    <>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-md bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          reset({ title: note.title, content: note.content }); // Reset form with current note data
                          setIsEditing(true);
                          setError(null); // Clear previous errors
                          setSuccessMessage(null); // Clear previous success messages
                        }}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
                      >
                        Edit
                      </button>
                    </>
                  )}
                  
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-md bg-white/5 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
                    >
                      {mode === 'create' || isEditing ? 'Cancel' : 'Close'}
                    </button>
                  </Dialog.Close>
                </div>
            </MotionDialogContent>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
} 