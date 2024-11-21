import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import EventForm from '../components/events/EventForm';
import EventList from '../components/events/EventList';
import { getEvents, deleteEvent, Event } from '../services/eventService';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>  (null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este evento?')) {
      await deleteEvent(id);
      loadEvents();
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.Nombre_Evento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Eventos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Evento
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar eventos..."
            className="pl-10 w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <EventList
          events={filteredEvents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <EventForm
          event={selectedEvent || undefined}
          onClose={() => {
            setShowForm(false);
            setSelectedEvent(null);
          }}
          onSave={() => {
            loadEvents();
            setShowForm(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Events;