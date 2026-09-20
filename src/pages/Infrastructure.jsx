import { Badge } from "../components/Badge";
import { Icon } from "../components/Icons";

function cpuPercent(value) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n <= 1 ? n * 100 : n;
}

export default function Infrastructure({ incidents }) {
  const byInstance = new Map();
  incidents.forEach((i) => {
    const id = i.infrastructure?.instance_id || "UNKNOWN";
    if (!byInstance.has(id)) byInstance.set(id, i);
  });
  const instances = [...byInstance.values()];

  return (
    <>
      <div className="page-header"><div><div className="eyebrow">INFRASTRUCTURE</div><h1>Infrastructure</h1><p>Observed AWS compute resources and the telemetry connected to AegisOps.</p></div><Badge tone="green">{instances.length} INSTANCE{instances.length === 1 ? "" : "S"}</Badge></div>
      <div className="resource-grid">
        {instances.map((incident) => {
          const cpu = cpuPercent(incident.metrics?.cpu_utilization?.latest_cpu);
          return <section className="panel resource-card" key={incident.infrastructure.instance_id}>
            <div className="resource-head"><div className="resource-icon"><Icon name="server" size={20}/></div><div><strong>{incident.infrastructure.instance_id}</strong><span>{incident.infrastructure.region} · {incident.infrastructure.instance_type}</span></div><Badge tone={incident.state === "ALARM" ? "red" : "green"}>{incident.state}</Badge></div>
            <div className="resource-metrics"><div><span>CPU</span><strong>{cpu === null ? "N/A" : `${cpu.toFixed(0)}%`}</strong></div><div><span>Alarm</span><strong>{incident.alarm_name}</strong></div><div><span>Logs</span><strong>{(incident.logs?.apache_access?.event_count || 0) + (incident.logs?.apache_error?.event_count || 0)}</strong></div></div>
            <div className="resource-foot"><span><i className="status-dot green"/> CloudWatch telemetry</span><span>Apache access + error logs</span></div>
          </section>;
        })}
      </div>
      {!instances.length && <div className="empty-state page-empty"><strong>No infrastructure evidence</strong><span>Infrastructure records will appear when incidents contain EC2 resource metadata.</span></div>}
    </>
  );
}
