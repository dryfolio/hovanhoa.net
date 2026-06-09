// TechGraph — a simple constellation of the stack, dashed-connected.
const NODES: { label: string; x: number; y: number; hub?: boolean }[] = [
    { label: 'go', x: 16, y: 18 },
    { label: 'python', x: 72, y: 13 },
    { label: 'postgresql', x: 80, y: 47 },
    { label: 'mongodb', x: 38, y: 52, hub: true },
    { label: 'aws', x: 20, y: 84 },
    { label: 'gcp', x: 66, y: 84 },
]

// edges as [x1,y1,x2,y2, accent?]
const EDGES: [number, number, number, number, boolean][] = [
    [38, 52, 16, 18, true],
    [38, 52, 72, 13, true],
    [38, 52, 80, 47, true],
    [38, 52, 20, 84, true],
    [38, 52, 66, 84, true],
    [16, 18, 72, 13, false],
    [20, 84, 66, 84, false],
]

export function TechGraph() {
    return (
        <div className="relative aspect-[5/4] w-full">
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
            >
                {EDGES.map((e, i) => (
                    <line
                        key={i}
                        x1={e[0]}
                        y1={e[1]}
                        x2={e[2]}
                        y2={e[3]}
                        stroke={
                            e[4] ? 'var(--rd-accent)' : 'var(--rd-border-2)'
                        }
                        strokeWidth={1.2}
                        strokeDasharray="4 4"
                        opacity={e[4] ? 0.45 : 0.7}
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
            </svg>
            {NODES.map((n) => (
                <span
                    key={n.label}
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[12px] font-medium ${
                        n.hub
                            ? 'border-[var(--rd-accent)] bg-[var(--rd-accent-bg)] text-[var(--rd-accent-ink)]'
                            : 'border-[var(--rd-border)] bg-[var(--rd-surface)] text-[var(--rd-text-2)]'
                    }`}
                >
                    {n.label}
                </span>
            ))}
        </div>
    )
}

export default TechGraph
