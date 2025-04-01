'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { NoteCreate } from '../types/note';
import { 
  ExclamationCircleIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface NoteFormProps {
  onSuccess?: () => void;
}

export default function NoteForm({ onSuccess }: NoteFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<NoteCreate>({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const onSubmit = async (data: NoteCreate) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await api.post('/notes/', data);
      setSuccessMessage('Note created successfully!');
      reset();
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/notes');
        }
      }, 1500);
    } catch (err: Error | unknown) {
      console.error('Error creating note:', err);
      setError(
        // @ts-expect-error - Handling various error types
        err.response?.data?.detail || 
        'Failed to create note. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-card-border">
          <DocumentTextIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Create New Note</h2>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-md flex items-center"
          >
            <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
        
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-success/10 border border-success/20 text-success rounded-md flex items-center"
          >
            <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>{successMessage}</p>
          </motion.div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter note title"
            {...register('title', { required: 'Title is required' })}
            className={cn(
              "w-full rounded-md border bg-card-bg p-3 outline-none focus:ring-2 focus:ring-primary/50 transition-shadow",
              errors.title ? "border-danger" : "border-card-border"
            )}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-danger flex items-center">
              <ExclamationCircleIcon className="w-4 h-4 mr-1" />
              {errors.title.message}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
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
              "w-full rounded-md border bg-card-bg p-3 outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-y",
              errors.content ? "border-danger" : "border-card-border"
            )}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-danger flex items-center">
              <ExclamationCircleIcon className="w-4 h-4 mr-1" />
              {errors.content.message}
            </p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className={cn(
              "w-full flex justify-center items-center py-3 px-4 rounded-md text-white font-medium transition-all",
              isSubmitting || !isDirty
                ? "bg-primary/50 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30"
            )}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                Save Note
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 