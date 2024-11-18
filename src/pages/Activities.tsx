import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import ActivityForm from '../components/activities/ActivityForm';
import ActivityList from '../components/activities/ActivityList';
import { getActivities, deleteActivity } from '../services/activityService';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const data = await getActivities();
    setActivities(data);
  };

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta actividad?')) {
      await deleteActivity(id);
      loadActivities();
    }
  };

  const filteredActivities = activities.filter(
    (activity) =>
      activity.Numero_Ficha.includes(searchTerm) ||
      activity.Fase_Proyecto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Actividades</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Actividad
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número de ficha o fase..."
            className="pl-10 w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ActivityList
          activities={filteredActivities}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <ActivityForm
          activity={selectedActivity}
          onClose={() => {
            setShowForm(false);
            setSelectedActivity(null);
          }}
          onSave={() => {
            loadActivities();
            setShowForm(false);
            setSelectedActivity(null);
          }}
        />
      )}
    </div>
  );
};

export default Activities;