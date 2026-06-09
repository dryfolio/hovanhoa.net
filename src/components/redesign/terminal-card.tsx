// Terminal card — a faux terminal window in the family mono aesthetic.
const LINES: { cmd: string; out: React.ReactNode }[] = [
    { cmd: 'whoami', out: 'hòa — software engineer' },
    { cmd: 'stack --top', out: 'go · python · postgres · aws · gcp' },
    { cmd: 'cat now.txt', out: 'building, writing & shipping' },
]

export function TerminalCard() {
    return (
        <div className="rd-card overflow-hidden font-[family-name:var(--font-mono)]">
            {/* title bar */}
            <div className="flex items-center gap-2 border-b border-[var(--rd-border)] bg-[var(--rd-surface-2)] px-4 py-3">
                <span className="block h-2.5 w-2.5 rounded-full border-[1.5px] border-[var(--rd-accent)]" />
                <span className="block h-2.5 w-2.5 rounded-full border-[1.5px] border-[var(--rd-accent)]" />
                <span className="block h-2.5 w-2.5 rounded-full border-[1.5px] border-[var(--rd-accent)]" />
                <span className="ml-auto text-[11.5px] text-[var(--rd-text-3)]">
                    ~/hovanhoa
                </span>
            </div>
            {/* body */}
            <div className="space-y-3 p-5 text-[13px] leading-relaxed sm:p-6">
                {LINES.map((l, i) => (
                    <div key={l.cmd} className="space-y-1">
                        <div>
                            <span className="text-[var(--rd-accent)]">$</span>{' '}
                            <span className="text-[var(--rd-text-2)]">
                                {l.cmd}
                            </span>
                        </div>
                        <div className="text-[var(--rd-text)]">
                            {l.out}
                            {i === LINES.length - 1 && (
                                <span className="rd-caret" aria-hidden />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TerminalCard
