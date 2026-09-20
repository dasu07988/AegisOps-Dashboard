import { NavLink } from "react-router-dom";
import { Icon } from "./Icons";

const items = [
  ["Overview", "/", "grid"],
  ["Incidents", "/incidents", "alert"],
  ["Infrastructure", "/infrastructure", "server"],
  ["Runbooks", "/runbooks", "book"],
  ["AI Analysis", "/ai-analysis", "brain"],
  ["Activity", "/activity", "activity"],
  ["Settings", "/settings", "settings"]
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">A</div>
        <div>
          <strong>AegisOps</strong>
          <span>AI OPERATIONS</span>
        </div>
        <button className="icon-button mobile-close" onClick={onClose}><Icon name="close"/></button>
      </div>

      <div className="side-section-label">WORKSPACE</div>
      <nav>
        {items.map(([label, path, icon]) => (
          <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Icon name={icon} size={17}/>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-spacer" />

      <div className="system-card">
        <div className="system-title"><span className="status-dot green"></span> System status</div>
        <div className="system-sub">Configured integrations</div>
        <div className="mini-health">
          <span><i></i> CloudWatch</span>
          <span><i></i> Bedrock</span>
          <span><i></i> DynamoDB</span>
        </div>
      </div>

      <div className="sidebar-footer">AegisOps AI · v1.0</div>
    </aside>
  );
}