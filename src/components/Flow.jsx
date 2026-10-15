import { inr } from '../utils'

export default function Flow({ months }) {
  const mx = Math.max(...months.flatMap(m => [m.i, m.e]), 1)
  return (
    <div className="flex items-end justify-between gap-3 h-48 pt-4">
      {months.map(m => (
        <div key={m.k} className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-end gap-1 h-36 w-full justify-center">
            <div title={inr(m.i)} className="w-1/3 rounded-t-lg" style={{ height: (m.i / mx) * 100 + '%', background: 'linear-gradient(180deg,#34d399,#10b98166)' }} />
            <div title={inr(m.e)} className="w-1/3 rounded-t-lg" style={{ height: (m.e / mx) * 100 + '%', background: 'linear-gradient(180deg,#6b7bff,#5b5bf066)' }} />
          </div>
          <span className="text-xs mut">{m.l}</span>
        </div>
      ))}
    </div>
  )
}
