import { CATS, inr } from '../utils'

export default function TxList({ txs, onDel, limit }) {
  const rows = [...txs].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, limit || 999)
  return (
    <div className="space-y-2">
      {rows.length === 0 && <div className="mut text-sm">No transactions yet.</div>}
      {rows.map(t => (
        <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'var(--in)' }}>
          <span className="w-9 h-9 rounded-xl grid place-items-center text-white text-xs font-bold shrink-0" style={{ background: CATS[t.cat] }}>{t.cat[0]}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{t.title}</div>
            <div className="text-xs mut">{t.cat} · {t.date}</div>
          </div>
          <div className="font-semibold" style={{ color: t.type === 'income' ? 'var(--pos)' : 'var(--neg)' }}>
            {t.type === 'income' ? '+' : '-'}{inr(t.amt)}
          </div>
          <button aria-label="Delete" className="mut px-2 text-lg" onClick={() => onDel(t.id)}>×</button>
        </div>
      ))}
    </div>
  )
}
