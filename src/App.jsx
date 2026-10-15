import { useState, useMemo, useEffect } from 'react'
import Stat from './components/Stat'
import Donut from './components/Donut'
import Flow from './components/Flow'
import TxForm from './components/TxForm'
import TxList from './components/TxList'
import { CATS, EXP, DEFAULT_LIMITS, inr, iso, load, save, seed } from './utils'

const ICONS = { overview:'M3 12l9-9 9 9M5 10v10h14V10', tx:'M4 7h16M4 12h16M4 17h10', bud:'M12 3v9l6 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
const NAV = [['overview','Overview'], ['tx','Transactions'], ['bud','Budgets']]
const Icon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
)

export default function App() {
  const [txs, setTxs] = useState(() => load('pft-tx', seed()))
  const [lim, setLim] = useState(() => load('pft-lim', DEFAULT_LIMITS))
  const [tab, setTab] = useState('overview')
  const [theme, setTheme] = useState(() => load('pft-theme', null))

  useEffect(() => save('pft-tx', txs), [txs])
  useEffect(() => save('pft-lim', lim), [lim])
  useEffect(() => {
    if (theme) { document.documentElement.dataset.theme = theme; save('pft-theme', theme) }
  }, [theme])

  const add = t => setTxs(p => [...p, t])
  const del = id => setTxs(p => p.filter(t => t.id !== id))
  const now = new Date(), ym = iso(now).slice(0, 7)

  const S = useMemo(() => {
    const sum = a => a.reduce((s, t) => s + t.amt, 0)
    const inc = sum(txs.filter(t => t.type === 'income')), exp = sum(txs.filter(t => t.type === 'expense'))
    const cur = txs.filter(t => t.date.startsWith(ym))
    const ci = sum(cur.filter(t => t.type === 'income')), ce = sum(cur.filter(t => t.type === 'expense'))
    const by = {}
    cur.filter(t => t.type === 'expense').forEach(t => { by[t.cat] = (by[t.cat] || 0) + t.amt })
    const months = []
    for (let m = 5; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1), k = iso(d).slice(0, 7)
      const x = txs.filter(t => t.date.startsWith(k))
      months.push({ k, l: d.toLocaleString('en', { month: 'short' }), i: sum(x.filter(t => t.type === 'income')), e: sum(x.filter(t => t.type === 'expense')) })
    }
    return { bal: inc - exp, ci, ce, by, months, cat: Object.entries(by).sort((a, b) => b[1] - a[1]) }
  }, [txs])

  const rate = S.ci > 0 ? Math.round(((S.ci - S.ce) / S.ci) * 100) : 0
  const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches)
  const toggle = () => setTheme(dark ? 'light' : 'dark')

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 grid lg:grid-cols-[230px_1fr] gap-4 sm:gap-6">
      <aside className="glass p-4 lg:sticky lg:top-6 lg:self-start">
        <div className="flex items-center gap-2 px-2 pb-4 font-bold text-lg">
          <span className="w-8 h-8 rounded-xl grid place-items-center text-white" style={{ background: 'linear-gradient(135deg,#5b5bf0,#34d399)' }}>₹</span>FinPulse
        </div>
        <nav className="flex lg:flex-col gap-1">
          {NAV.map(([k, l]) => (
            <button key={k} className={'nav ' + (tab === k ? 'on' : '')} onClick={() => setTab(k)}>
              <Icon d={ICONS[k]} /><span className="text-sm">{l}</span>
            </button>
          ))}
        </nav>
        <button className="nav mt-2 hidden lg:flex" onClick={toggle}>{dark ? '☀️ Light mode' : '🌙 Dark mode'}</button>
      </aside>

      <main className="space-y-4 sm:space-y-6 min-w-0">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Poku's Personal Finance Tracker</h1>
            <p className="mut text-sm">{now.toLocaleString('en', { month: 'long', year: 'numeric' })} snapshot</p>
          </div>
          <button className="glass px-3 py-2 text-sm lg:hidden" onClick={toggle}>{dark ? '☀️' : '🌙'}</button>
        </header>

        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              <Stat label="Total balance" value={inr(S.bal)} sub="All time" color="var(--t1)" />
              <Stat label="Income" value={inr(S.ci)} sub="This month" color="var(--pos)" />
              <Stat label="Expenses" value={inr(S.ce)} sub="This month" color="var(--neg)" />
              <Stat label="Savings rate" value={rate + '%'} sub="Of this month's income" color="var(--acc)" />
            </div>
            <div className="grid xl:grid-cols-2 gap-4 sm:gap-6">
              <div className="glass p-5">
                <h3 className="font-semibold mb-3">Spending by category</h3>
                {S.cat.length ? <Donut data={S.cat} total={S.ce} /> : <p className="mut text-sm">No expenses this month.</p>}
              </div>
              <div className="glass p-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Cash flow · 6 months</h3>
                  <div className="text-xs mut flex gap-3"><span>🟢 Income</span><span>🔵 Expense</span></div>
                </div>
                <Flow months={S.months} />
              </div>
            </div>
            <div className="grid xl:grid-cols-[1fr_380px] gap-4 sm:gap-6">
              <div className="glass p-5"><h3 className="font-semibold mb-3">Recent transactions</h3><TxList txs={txs} onDel={del} limit={6} /></div>
              <TxForm onAdd={add} />
            </div>
          </>
        )}

        {tab === 'tx' && (
          <div className="grid xl:grid-cols-[1fr_380px] gap-4 sm:gap-6">
            <div className="glass p-5"><h3 className="font-semibold mb-3">All transactions ({txs.length})</h3><TxList txs={txs} onDel={del} /></div>
            <TxForm onAdd={add} />
          </div>
        )}

        {tab === 'bud' && (
          <div className="glass p-5">
            <h3 className="font-semibold mb-1">Monthly budgets</h3>
            <p className="mut text-sm mb-4">Edit a limit to update progress instantly.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {EXP.map(c => {
                const used = S.by[c] || 0, p = Math.min((used / (lim[c] || 1)) * 100, 100), over = used > lim[c]
                return (
                  <div key={c} className="p-4 rounded-2xl" style={{ background: 'var(--in)' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{c}</span>
                      <input className="inp !w-28 !py-1 text-right" type="number" min="0" value={lim[c]} onChange={e => setLim(l => ({ ...l, [c]: +e.target.value }))} />
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--glass)' }}>
                      <div className="h-full rounded-full" style={{ width: p + '%', background: over ? 'var(--neg)' : `linear-gradient(90deg,${CATS[c]},#34d399)` }} />
                    </div>
                    <div className="text-xs mt-2 mut">{inr(used)} of {inr(lim[c])}{over ? ' · over budget!' : ''}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
