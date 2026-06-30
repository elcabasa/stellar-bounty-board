import { register, Histogram } from 'prom-client';

 feat/concurrency-file-locking
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const bountiesCreatedTotal = new client.Counter({
  name: 'bounties_created_total',
  help: 'Total number of bounties created',
  registers: [register],
});

export const bountiesReleasedTotal = new client.Counter({
  name: 'bounties_released_total',
  help: 'Total number of bounties released',
  registers: [register],
 main
});

export async function getMetrics(): Promise<string> {
  return register.metrics();
}
