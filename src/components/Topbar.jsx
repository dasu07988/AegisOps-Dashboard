import { Icon } from "./Icons";

export default function Topbar({ onMenu, onRefresh, lastUpdated }) {
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu}><Icon name="menu"/></button>
      <div className="topbar-context">
        <span className="eyebrow">AWS CLOUD OPERATIONS</span>
        <strong>AegisOps Control Center</strong>
      </div>
      <div className="topbar-actions">
        <div className="live-pill"><span className="status-dot green"></span> Monitoring</div>
        <div className="updated">Updated {lastUpdated}</div>
        <button className="refresh-btn" onClick={onRefresh}><Icon name="refresh" size={15}/> Refresh</button>
        <div className="avatar">DJ</div>
      </div>
    </header>
  );
}