import { createAsyncThunk } from '@reduxjs/toolkit';
import { SystemStatus } from '~/redux/models/Status';

type UptimeService = {
  name: string;
  status: 'up' | 'down' | 'degraded';
  uptime: string;
};

export const fetchSystemStatus = createAsyncThunk(
  'status/fetch',
  async (): Promise<SystemStatus> => {
    const response = await fetch(
      'https://raw.githubusercontent.com/webkom/uptime/master/history/summary.json',
    );

    if (!response.ok) {
      throw new Error('Failed to fetch system status');
    }

    const data = (await response.json()) as UptimeService[];

    const servicesDown = data.filter(
      (service) => service.status === 'down',
    ).length;
    const servicesDegraded = data.filter(
      (service) => service.status === 'degraded',
    ).length;

    let status: SystemStatus['status'];
    let message: string;

    if (servicesDown > 0) {
      status = 'major';
      message = `${servicesDown} ${servicesDown === 1 ? 'tjeneste er' : 'tjenester er'} nede`;
    } else if (servicesDegraded > 0) {
      status = 'degraded';
      message = `${servicesDegraded} ${servicesDegraded === 1 ? 'tjeneste har' : 'tjenester har'} redusert ytelse`;
    } else {
      status = 'operational';
      message = `Alle tjenester opererer normalt`;
    }

    return { status, message };
  },
);
