export const SIMULATION_YEAR = 2026

export function getCurrentSimulatedDate(): Date {
  const now = new Date()
  const simulated = new Date(now)
  simulated.setFullYear(SIMULATION_YEAR)
  return simulated
}

export function getSimulatedDate(offsetMs: number = 0): Date {
  const simulated = getCurrentSimulatedDate()
  return new Date(simulated.getTime() + offsetMs)
}

export function formatSimulatedDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const simulated = new Date(dateObj)
  simulated.setFullYear(SIMULATION_YEAR)
  return simulated.toLocaleDateString('en-US', options)
}

export function formatSimulatedDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const simulated = new Date(dateObj)
  simulated.setFullYear(SIMULATION_YEAR)
  return simulated.toLocaleString('en-US', options)
}

export function getSimulatedISOString(offsetMs: number = 0): string {
  return getSimulatedDate(offsetMs).toISOString()
}
