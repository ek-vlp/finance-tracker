export default function Stat({ label, value, sub, color }) {
  return (
    <div className="glass p-5">
      <div className="mut text-sm">{label}</div>
      <div className="text-2xl font-bold mt-1" style={{ color }}>{value}</div>
      <div className="text-xs mt-1 mut">{sub}</div>
    </div>
  )
}
