import { Icon } from "./Icons";

export default function StatCard({ icon, label, value, meta, tone = "blue" }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-top">
        <div className="stat-icon"><Icon name={icon} size={18}/></div>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-meta">{meta}</div>
    </div>
  );
}