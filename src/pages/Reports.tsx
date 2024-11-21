import { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { getReports, Report, generateReportCSV } from '../services/reportService';
import ReportGenerator from '../components/reports/ReportGenerator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (report: Report) => {
    try {
      const [year, month] = report.Mes_A_Reportar.split('-');
      const blob = await generateReportCSV({
        instructorIds: [report.ID_Instructor],
        month,
        year,
        activityIds: [] // Aquí deberías obtener las actividades asociadas al reporte
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${month}-${year}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    const reportDate = format(new Date(report.Mes_A_Reportar), 'MMMM yyyy', { locale: es });
    return reportDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
           `${report.Nombre} ${report.Apellido}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Generación de Reportes</h1>
        <button
          onClick={() => setShowGenerator(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generar Nuevo Reporte
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por mes o instructor..."
            className="pl-10 w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días Hábiles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.ID_Reporte}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(report.Mes_A_Reportar), 'MMMM yyyy', { locale: es })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.Nombre} {report.Apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.Dias_Habiles}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDownload(report)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Descargar CSV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showGenerator && (
        <ReportGenerator
          onClose={() => setShowGenerator(false)}
          onGenerate={async () => {
            await loadReports();
            setShowGenerator(false);
          }}
        />
      )}
    </div>
  );
};

export default Reports;
