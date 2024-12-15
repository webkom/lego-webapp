export type SystemStatus = {
  status: 'operational' | 'degraded' | 'major';
  message: string;
};