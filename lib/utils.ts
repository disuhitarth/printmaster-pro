import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function isLate(shipDate: Date | string): boolean {
  const today = new Date()
  const ship = new Date(shipDate)
  return ship < today
}

export function generateJobCode(): string {
  const timestamp = Date.now().toString().slice(-6)
  return `JOB-${timestamp}`
}

export function hexFromPMS(pms: string): string {
  // Simple mapping for common PMS colors - in production, use a complete PMS-to-hex conversion library
  const pmsColors: { [key: string]: string } = {
    '186C': '#CE1126',
    'Black': '#000000',
    'Cool Gray 6C': '#97999B',
    '306C': '#00B4D8',
    'White': '#FFFFFF',
  }
  
  return pmsColors[pms] || '#CCCCCC'
}