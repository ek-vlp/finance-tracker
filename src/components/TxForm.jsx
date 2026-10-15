import { useState } from 'react'
import { EXP, INC, iso } from '../utils'

export default function TxForm({ onAdd }) {
  const [f, setF] = useState({ type:'expense', title:'', cat:'Food', amt:'', date: iso(new Date()) })
  const set = (k, v) => setF(p => ({ ...p, [k]: v, ...(k === 'type' ? { cat: v === 'expense' ? 'Food' : 'Salary' } : {}) }))
  const go = () => {
    if (!f.title.trim() || !(+f.amt > 0)) return
    onAdd({ ...f, title: f.title.trim(), amt: +f.amt, id: Date.now() })
    setF(p => ({ ...p, title:'', amt:'' }))
  }
  return (
    <div className="glass p-5">
      <h3 className="font-semibold mb-3">Add transaction</h3>
      <div className="grid grid-cols-2 gap-3">
        <select className="inp" value={f.type} onChange={e => set('type', e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select className="inp" value={f.cat} onChange={e => set('cat', e.target.value)}>
          {(f.type === 'expense' ? EXP : INC).map(c => <option key={c}>{c}</option>)}
        </select>
        <input className="inp col-span-2" placeholder="Title (e.g. Groceries)" value={f.title} onChange={e => set('title', e.target.value)} />
        <input className="inp" type="number" min="0" placeholder="Amount (₹)" value={f.amt} onChange={e => set('amt', e.target.value)} />
        <input className="inp" type="date" value={f.date} onChange={e => set('date', e.target.value)} />
        <button className="btn col-span-2" onClick={go}>+ Add</button>
      </div>
    </div>
  )
}
