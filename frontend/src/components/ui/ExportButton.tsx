import { useState } from 'react';
import Button from './Button';

interface ExportButtonProps<T extends Record<string, unknown>> {
  data: T[];
  filename?: string;
  format?: 'csv' | 'json';
}

export function ExportButton<T extends Record<string, unknown>>({
  data,
  filename = 'export',
  format = 'csv',
}: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = () => {
    setIsExporting(true);
    try {
      let content: string;
      let mimeType: string;
      let fileExtension: string;

      if (format === 'csv' && data.length > 0) {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map((item) =>
          Object.values(item)
            .map((value) => `"${value}"`)
            .join(',')
        );
        content = [headers, ...rows].join('\n');
        mimeType = 'text/csv';
        fileExtension = 'csv';
      } else {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportData}
      isLoading={isExporting}
      variant="secondary"
      size="sm"
    >
      Exportar {format.toUpperCase()}
    </Button>
  );
}