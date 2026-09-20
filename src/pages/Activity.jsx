import { Badge } from "../components/Badge";
import { Icon } from "../components/Icons";

function formatDate(value) { const d = new Date(value); return Number.isNaN(d.getTime()) ? "Unknown time" : d.toLocaleString(); }
export default function Activity({ incidents }) {
  const events = incidents.flatMap((i) => [
    { id: `${i.incident_id}-alarm`, title: "CloudWatch alarm detected", text: `${i.alarm_name} entered ${i.state}.`, time: i.detected_at, icon: "alert" },
    { id: `${i.incident_id}-analysis`, title: "AI investigation completed", text: `${i.ai_analysis?.evidence?.length || 0} evidence items and ${i.runbook?.retrieved_chunks?.length || 0} RAG chunks attached.`, time: i.detected_at, icon: "brain" },
    { id: `${i.incident_id}-db`, title: "Incident persisted", text: `${i.incident_id} is stored in the incident data layer.`, time: i.detected_at, icon: "check" },
  ]).sort((a,b) => new Date(b.time) - new Date(a.time));
  return <>
    <div className="page-header"><div><div className="eyebrow">AUDIT TRAIL</div><h1>Activity</h1><p>Observable incident-processing events from the current AegisOps data set.</p></div><Badge tone="blue">{events.length} EVENTS</Badge></div>
    <section className="panel"><div className="activity-list">{events.map((e) => <div className="activity-row" key={e.id}><div className="timeline-icon"><Icon name={e.icon} size={15}/></div><div><strong>{e.title}</strong><p>{e.text}</p></div><time>{formatDate(e.time)}</time></div>)}</div>{!events.length && <div className="empty-state compact-empty"><strong>No activity yet</strong><span>Processed incidents will appear here.</span></div>}</section>
  </>;
}
