'use client'

import dynamic from 'next/dynamic'

// React Flow is heavy; load the graph off the critical path. The placeholder
// reserves the compact hero height so the layout never shifts.
const EcosystemGraph = dynamic(
    () =>
        import('@/components/redesign/ecosystem-graph').then(
            (m) => m.EcosystemGraph
        ),
    {
        ssr: false,
        loading: () => (
            <div
                aria-hidden
                className="h-[clamp(360px,52vh,520px)] w-full"
            />
        ),
    }
)

export default EcosystemGraph
