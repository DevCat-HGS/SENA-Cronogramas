'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import InstructorModal from './components/InstructorModal';
import InstructorTable from './components/InstructorTable';
import { useQuery } from '@tanstack/react-query';
import { instructorService } from '@/services/instructorService';
import { API } from '@/types/api';

export default function InstructoresPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<API.Instructor | null>(null);
  const { data: instructores, isLoading } = useQuery({
    queryKey: ['instructores'],
    queryFn: instructorService.getAll
  });

  const handleEdit = (instructor: API.Instructor) => {
    setSelectedInstructor(instructor);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Instructores</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Nuevo Instructor
        </Button>
      </div>

      <InstructorTable 
        instructores={instructores?.data || []}
        onEdit={handleEdit}
      />

      <InstructorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInstructor(null);
        }}
        instructor={selectedInstructor}
      />
    </div>
  );
} 