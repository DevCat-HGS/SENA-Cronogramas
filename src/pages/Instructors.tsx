import { useState, useEffect } from 'react';
import { Plus,  Search } from 'lucide-react';
import InstructorForm from '../components/instructors/InstructorForm';
import InstructorList from '../components/instructors/InstructorList';
import { getInstructors, deleteInstructor } from '../services/instructorService';
import { Instructor } from '../services/instructorService';

const Instructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    const data = await getInstructors();
    setInstructors(data);
  };

  const handleEdit = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este instructor?')) {
      await deleteInstructor(id);
      loadInstructors();
    }
  };

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.No_Documento_Identidad.includes(searchTerm) ||
      instructor.Contraseña.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Instructores</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Instructor
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por documento ..."
            className="pl-10 w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <InstructorList
          instructors={filteredInstructors}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <InstructorForm
          instructor={selectedInstructor}
          onClose={() => {
            setShowForm(false);
            setSelectedInstructor(null);
          }}
          onSave={() => {
            loadInstructors();
            setShowForm(false);
            setSelectedInstructor(null);
          }}
        />
      )}
    </div>
  );
};

export default Instructors;