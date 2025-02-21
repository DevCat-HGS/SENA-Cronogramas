export interface DashboardStats {
  totalInstructores: number;
  instructoresActivos: number;
  actividadesActivas: number;
  eventosPendientes: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface ActivitySummary {
  periodo: string;
  horasEjecutadas: number;
  actividadesCompletadas: number;
  eficiencia: number;
} 