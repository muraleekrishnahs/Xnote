'use client';

import { useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import NoteForm from '../../components/NoteForm';
import PageContainer from '../../components/PageContainer';

export default function NewNotePage() {
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Note</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <NoteForm />
        </div>
      </div>
    </PageContainer>
  );
} 