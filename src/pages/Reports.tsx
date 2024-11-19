import { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { getInstructors, Instructor } from '../services/instructorService';
import { generateReport } from '../services/reportService';

const Reports = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    const data = await getInstructors();
    setInstructors(data);
  };

  const handleGenerateReport = async () => {
    if (!selectedMonth || !selectedInstructor) {
      alert('Por favor seleccione todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const report = await generateReport({
        month: selectedMonth,
        year: selectedYear,
        instructorId: parseInt(selectedInstructor)
      });

      // Crear y descargar el archivo CSV
      const csvContent = "data:text/csv;charset=utf-8," + report;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `reporte_${selectedMonth}_${selectedYear}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Generación de Reportes</h1>
        <FileText className="w-8 h-8 text-indigo-600" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor
            </label>
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seleccione un instructor</option>
              {instructors.map(instructor => (
                <option key={instructor.ID_Instructor} value={instructor.ID_Instructor}>
                  {instructor.Nombre} {instructor.Apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mes
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seleccione un mes</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'Generando...' : 'Generar Reporte'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Información del Reporte</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>El reporte incluirá los días hábiles trabajados en el mes seleccionado</li>
          <li>Se calcularán las horas totales de formación impartidas</li>
          <li>Se detallarán las actividades y eventos asignados</li>
          <li>El archivo se generará en formato CSV para fácil manipulación</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;