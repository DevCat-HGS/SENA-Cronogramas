import { useState, useEffect } from 'react';
import { getInstructorsForSelection, getInstructorActivitiesByMonth, generateReportCSV } from '../../services/reportService';
import { Activity } from '../../services/activityService';

interface ReportGeneratorProps {
  onClose: () => void;
  onGenerate: () => Promise<void>;
}

interface InstructorSelection {
  ID_Instructor: number;
  Nombre_Completo: string;
  seleccionado: boolean;
}

interface ActivitySelection extends Activity {
  seleccionado: boolean;
}

const ReportGenerator = ({ onClose }: ReportGeneratorProps) => {
  const [instructors, setInstructors] = useState<InstructorSelection[]>([]);
  const [activities, setActivities] = useState<ActivitySelection[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      const data = await getInstructorsForSelection();
      setInstructors(data);
    } catch (error) {
      console.error('Error al cargar instructores:', error);
    }
  };

  const handleMonthChange = async (value: string) => {
    setSelectedMonth(value);
    const [year, month] = value.split('-');
    await loadActivities(month, year);
  };

  const loadActivities = async (month: string, year: string) => {
    const selectedInstructors = instructors.filter(i => i.seleccionado).map(i => i.ID_Instructor);
    const activitiesPromises = selectedInstructors.map(id => 
      getInstructorActivitiesByMonth(id, month, year)
    );
    
    const allActivities = await Promise.all(activitiesPromises);
    const uniqueActivities = Array.from(new Set(allActivities.flat()));
    setActivities(uniqueActivities.map(activity => ({ ...activity, seleccionado: false })));
  };

  const toggleAllInstructors = () => {
    setInstructors(instructors.map(i => ({ ...i, seleccionado: !instructors.every(i => i.seleccionado) })));
  };

  const toggleAllActivities = () => {
    setActivities(activities.map(a => ({ ...a, seleccionado: !activities.every(a => a.seleccionado) })));
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const [year, month] = selectedMonth.split('-');
      const selectedInstructors = instructors.filter(i => i.seleccionado).map(i => i.ID_Instructor);
      const selectedActivities = activities.filter(a => a.seleccionado).map(a => a.ID_Actividad!);

      const blob = await generateReportCSV({
        instructorIds: selectedInstructors,
        month,
        year,
        activityIds: selectedActivities
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${month}-${year}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Generar Reporte</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mes a Reportar</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Instructores</label>
            <button
              onClick={toggleAllInstructors}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {instructors.every(i => i.seleccionado) ? 'Deseleccionar todos' : 'Seleccionar todos'}
            </button>
          </div>
          <div className="border rounded-md max-h-40 overflow-y-auto">
            {instructors.map(instructor => (
              <div key={instructor.ID_Instructor} className="flex items-center p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={instructor.seleccionado}
                  onChange={() => {
                    setInstructors(instructors.map(i => 
                      i.ID_Instructor === instructor.ID_Instructor 
                        ? { ...i, seleccionado: !i.seleccionado }
                        : i
                    ));
                  }}
                  className="h-4 w-4 text-indigo-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-900">{instructor.Nombre_Completo}</label>
              </div>
            ))}
          </div>
        </div>

        {activities.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Actividades</label>
              <button
                onClick={toggleAllActivities}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {activities.every(a => a.seleccionado) ? 'Deseleccionar todas' : 'Seleccionar todas'}
              </button>
            </div>
            <div className="border rounded-md max-h-60 overflow-y-auto">
              {activities.map(activity => (
                <div key={activity.ID_Actividad} className="flex items-center p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={activity.seleccionado}
                    onChange={() => {
                      setActivities(activities.map(a => 
                        a.ID_Actividad === activity.ID_Actividad 
                          ? { ...a, seleccionado: !a.seleccionado }
                          : a
                      ));
                    }}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">
                    {activity.Actividad_Desarrollar} - {activity.Numero_Ficha}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDownload}
            disabled={loading || !selectedMonth || !instructors.some(i => i.seleccionado) || !activities.some(a => a.seleccionado)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? 'Generando...' : 'Descargar Reporte'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;