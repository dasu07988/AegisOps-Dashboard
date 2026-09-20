import { useMemo, useState } from "react";
import IncidentTable from "../components/IncidentTable";
import { Badge } from "../components/Badge";
import { Icon } from "../components/Icons";

export default function Incidents({ incidents }) {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const filtered = useMemo(() => incidents.filter((i) => {
    const q = query.toLowerCase();
    const matchesQ = !q || [i.incident_id, i.alarm_name, i.infrastructure.instance_id].join(" ").toLowerCase().includes(q);
    return matchesQ && (severity === "ALL" || i.severity === severity) && (status === "ALL" || i.status === status);
  }), [incidents, query, severity, status]);

  return (
    <>
      <div className="page-header"><div><div className="eyebrow">OPERATIONS</div><h1>Incidents</h1><p>Investigate and track AWS infrastructure incidents detected by AegisOps.</p></div><Badge tone="red">{filtered.length} RECORDS</Badge></div>
      <section className="panel">
        <div className="filter-bar">
          <div className="search-box"><Icon name="search" size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search incident, alarm, or instance..."/></div>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}><option value="ALL">All severities</option><option>CRITICAL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="ALL">All statuses</option><option>INVESTIGATING</option><option>ANALYZED</option><option>AWAITING APPROVAL</option><option>RESOLVED</option></select>
        </div>
        <IncidentTable incidents={filtered}/>
      </section>
    </>
  );
}