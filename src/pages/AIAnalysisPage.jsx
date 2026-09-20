import { useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Icon } from "../components/Icons";

export default function AIAnalysisPage({ incidents }) {
  const navigate = useNavigate();
  const analyses = incidents.filter((i) => i.ai_analysis);
  return <>
    <div className="page-header"><div><div className="eyebrow">AI OPERATIONS</div><h1>AI Analysis</h1><p>Evidence-grounded investigation records generated from AWS telemetry and retrieved runbooks.</p></div><Badge tone="purple">{analyses.length} ANALYSES</Badge></div>
    <div className="analysis-list">{analyses.map((incident) => { const a = incident.ai_analysis; return <section className="panel analysis-summary-card" key={incident.incident_id} onClick={() => navigate(`/incidents/${incident.incident_id}`)}><div className="analysis-card-head"><div className="ai-orb"><Icon name="brain" size={17}/></div><div><strong>{incident.incident_id}</strong><span>{incident.alarm_name} · {incident.infrastructure?.instance_id}</span></div><Badge tone="red">{incident.severity}</Badge></div><p>{a.summary || "No summary available."}</p><div className="analysis-card-meta"><span>Evidence <strong>{a.evidence?.length || 0}</strong></span><span>Recommendations <strong>{a.recommendations?.length || 0}</strong></span><span>RAG <strong>{incident.runbook?.retrieved_chunks?.length || 0}</strong></span></div></section>; })}</div>
    {!analyses.length && <div className="empty-state page-empty"><strong>No AI analysis records</strong><span>AI analysis will appear after an incident is processed by the agent.</span></div>}
  </>;
}
