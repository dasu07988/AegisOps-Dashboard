import { Badge } from "../components/Badge";

export default function Runbooks({ incidents }) {
  const chunks = incidents.flatMap((incident) => (incident.runbook?.retrieved_chunks || []).map((chunk) => ({ ...chunk, incident: incident.incident_id })));
  const kb = incidents.find((i) => i.runbook?.knowledge_base_id)?.runbook?.knowledge_base_id;
  return <>
    <div className="page-header"><div><div className="eyebrow">RAG KNOWLEDGE</div><h1>Runbooks</h1><p>Knowledge-base evidence retrieved during incident investigation.</p></div><Badge tone="blue">{chunks.length} CHUNKS</Badge></div>
    <section className="panel"><div className="knowledge-banner"><div><span>Knowledge Base</span><strong>AegisOps-Runbook-KB</strong></div><div><span>Knowledge Base ID</span><strong className="mono">{kb || "N/A"}</strong></div><div><span>Source</span><strong>S3 operational runbooks</strong></div></div><div className="knowledge-list">{chunks.map((chunk, i) => <details className="knowledge-row" key={`${chunk.incident}-${i}`}><summary><span className="chunk-index">{String(i + 1).padStart(2, "0")}</span><div><strong>{chunk.incident}</strong><small>Relevance {Number(chunk.score || 0).toFixed(3)}</small></div><Badge tone="neutral">RETRIEVED</Badge></summary><p>{chunk.text}</p><small className="source-line">{chunk.source || "S3 runbook source"}</small></details>)}</div>{!chunks.length && <div className="empty-state compact-empty"><strong>No retrieved runbook chunks</strong><span>Runbook evidence will appear after the agent performs a knowledge-base retrieval.</span></div>}</section>
  </>;
}
