import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Thousands-separated number, e.g. 4.7. */
export function formatNumber(value: number): string {
    return Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(
        value || 0
    )
}

/** Compact notation, e.g. 243600 -> "243.6k". */
export function formatCompact(value: number): string {
    return Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    })
        .format(value || 0)
        .toLowerCase()
}

/** Percentage change of the recent half vs the prior half, e.g. "+1.9%". */
export function computeTrend(series: number[]): string {
    if (!series || series.length < 2) return '0%'
    const half = Math.floor(series.length / 2)
    const prev = series.slice(0, half).reduce((a, b) => a + (b || 0), 0)
    const recent = series.slice(half).reduce((a, b) => a + (b || 0), 0)
    if (prev === 0) return recent > 0 ? '+100%' : '0%'
    const pct = ((recent - prev) / prev) * 100
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`
}
