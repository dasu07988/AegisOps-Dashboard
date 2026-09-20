import { useNavigate } from "react-router-dom";
import { SeverityBadge, StatusBadge } from "./Badge";
import { Icon } from "./Icons";

function relativeTime(date) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function IncidentTable({ incidents, compact = false }) {
  const navigate = useNavigate();
  return (
    <div className="table-wrap">
      <table className="incident-table">
        <thead>
          <tr>
            <th>Incident</th>
            <th>Severity</th>
            <th>Alarm</th>
            <th>EC2 Instance</th>
            <th>CPU</th>
            <th>Detected</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.incident_id} onClick={() => navigate(`/incidents/${incident.incident_id}`)}>
              <td>
                <div className="incident-cell">
                  <span className={`incident-dot ${incident.severity === "HIGH" ? "red" : "amber"}`}></span>
                  <div><strong>{incident.incident_id}</strong><small>{incident.reason}</small></div>
                </div>
              </td>
              <td><SeverityBadge severity={incident.severity}/></td>
              <td><span className="mono">{incident.alarm_name}</span></td>
              <td><span className="mono">{incident.infrastructure.instance_id}</span></td>
              <td><strong>{incident.metrics?.cpu_utilization?.latest_cpu == null ? "N/A" : `${(incident.metrics.cpu_utilization.latest_cpu <= 1 ? incident.metrics.cpu_utilization.latest_cpu * 100 : incident.metrics.cpu_utilization.latest_cpu).toFixed(0)}%`}</strong></td>
              <td>{relativeTime(incident.detected_at)}</td>
              <td><StatusBadge status={incident.status}/></td>
              <td><button className="row-arrow" onClick={(e) => { e.stopPropagation(); navigate(`/incidents/${incident.incident_id}`); }}><Icon name="arrow" size={15}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {!incidents.length && <div className="empty-state"><Icon name="check" size={24}/><strong>No active incidents</strong><span>AegisOps has no incidents matching the current filters.</span></div>}
    </div>
  );
}