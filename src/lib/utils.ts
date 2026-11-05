import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
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
