import { CATS, inr } from '../utils'

export default function Donut({ data, total }) {
  let off = 0
  const R = 70, C = 2 * Math.PI * R
  return (
    <div className="flex items-center gap-6 flex-wrap justify-center">
      <svg width="190" height="190" viewBox="0 0 190 190">
        <g transform="rotate(-90 95 95)">
          <circle cx="95" cy="95" r={R} fill="none" stroke="var(--in)" strokeWidth="26" />
          {data.map(([k, v]) => {
            const len = (v / total) * C
            const el = <circle key={k} cx="95" cy="95" r={R} fill="none" stroke={CATS[k]} strokeWidth="26" strokeDasharray={`${Math.max(len - 2, 0)} ${C}`} strokeDashoffset={-off} />
            off += len
            return el
          })}
        </g>
        <text x="95" y="92" textAnchor="middle" fill="var(--t1)" fontSize="17" fontWeight="700">{inr(total)}</text>
        <text x="95" y="112" textAnchor="middle" fill="var(--t2)" fontSize="11">Spent this month</text>
      </svg>
      <div className="space-y-2 text-sm">
        {data.map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: CATS[k] }} />
            <span className="w-28">{k}</span>
            <span className="mut">{inr(v)} · {((v / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
