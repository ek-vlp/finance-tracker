export const CATS = { Food:'#6b7bff', Rent:'#5b5bf0', Transport:'#60a5fa', Shopping:'#34d399', Bills:'#a78bfa', Entertainment:'#f59e0b', Salary:'#10b981', Freelance:'#14b8a6' }
export const EXP = ['Food','Rent','Transport','Shopping','Bills','Entertainment']
export const INC = ['Salary','Freelance']
export const DEFAULT_LIMITS = { Food:12000, Rent:22000, Transport:6000, Shopping:6000, Bills:4000, Entertainment:4000 }

export const inr = n => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n)
export const iso = d => d.toISOString().slice(0, 10)

export const load = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f } catch { return f } }
export const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export const seed = () => {
  const o = [], now = new Date(); let id = 1
  for (let m = 5; m >= 0; m--) {
    const d = day => iso(new Date(now.getFullYear(), now.getMonth() - m, day))
    o.push({ id:id++, type:'income', title:'Monthly salary', cat:'Salary', amt:85000, date:d(1) })
    if (m % 2 === 0) o.push({ id:id++, type:'income', title:'Freelance project', cat:'Freelance', amt:12000 + m*1500, date:d(12) })
    o.push({ id:id++, type:'expense', title:'Rent', cat:'Rent', amt:22000, date:d(3) })
    o.push({ id:id++, type:'expense', title:'Groceries', cat:'Food', amt:7000 + m*400, date:d(8) })
    o.push({ id:id++, type:'expense', title:'Electricity & internet', cat:'Bills', amt:3200, date:d(10) })
    o.push({ id:id++, type:'expense', title:'Fuel & cabs', cat:'Transport', amt:3800 + m*200, date:d(15) })
    o.push({ id:id++, type:'expense', title:'Shopping', cat:'Shopping', amt:4000 + (m*900) % 5000, date:d(18) })
    o.push({ id:id++, type:'expense', title:'Movies & dining', cat:'Entertainment', amt:3500, date:d(22) })
  }
  return o
}
