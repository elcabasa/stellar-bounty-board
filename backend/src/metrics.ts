

export async function getMetrics(): Promise<string> {
  return register.metrics();
}
