// OrbitArt — a quiet decorative mark: dashed rings + orbiting dots, orange core.
const spin = { transformBox: 'view-box', transformOrigin: 'center' } as const

export function OrbitArt() {
    return (
        <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full"
            >
                {/* rings */}
                <circle
                    cx="100"
                    cy="100"
                    r="40"
                    fill="none"
                    stroke="var(--rd-border-2)"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="64"
                    fill="none"
                    stroke="var(--rd-border-2)"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="var(--rd-accent)"
                    strokeWidth="1"
                    strokeDasharray="2 6"
                    opacity="0.35"
                />

                {/* orbiting dots */}
                <g
                    className="animate-[spin_24s_linear_infinite] motion-reduce:animate-none"
                    style={spin}
                >
                    <circle cx="100" cy="60" r="3.5" fill="var(--rd-accent)" />
                </g>
                <g
                    className="animate-[spin_40s_linear_infinite_reverse] motion-reduce:animate-none"
                    style={spin}
                >
                    <circle cx="100" cy="36" r="3" fill="var(--rd-text-3)" />
                    <circle cx="164" cy="100" r="2.5" fill="var(--rd-accent)" opacity="0.7" />
                </g>
                <g
                    className="animate-[spin_30s_linear_infinite] motion-reduce:animate-none"
                    style={spin}
                >
                    <circle cx="100" cy="12" r="2.5" fill="var(--rd-text-4)" />
                </g>

                {/* core */}
                <circle cx="100" cy="100" r="15" fill="var(--rd-accent-bg)" />
                <circle cx="100" cy="100" r="6" fill="var(--rd-accent)" />
            </svg>
        </div>
    )
}

export default OrbitArt
