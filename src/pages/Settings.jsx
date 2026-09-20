import { Badge } from "../components/Badge";

const rows = [
  ["Data API", "API Gateway HTTP API", "https://eb0fdpju28.execute-api.eu-north-1.amazonaws.com"],
  ["AWS Region", "Europe (Stockholm)", "eu-north-1"],
  ["Incident Store", "Amazon DynamoDB", "AegisOps-Incidents"],
  ["AI Model", "Amazon Nova 2 Lite", "eu.amazon.nova-2-lite-v1:0"],
  ["Knowledge Base", "Amazon Bedrock Knowledge Bases", "QFIDUYD6VY"],
  ["Telemetry", "CloudWatch + Apache logs", "AegisOps EC2 demo server"],
];
export default function Settings() { return <>
  <div className="page-header"><div><div className="eyebrow">CONFIGURATION</div><h1>Settings</h1><p>Read-only deployment configuration used by the current dashboard.</p></div><Badge tone="green">READ ONLY</Badge></div>
  <section className="panel"><div className="settings-list">{rows.map(([label,value,detail]) => <div className="settings-row" key={label}><div><span>{label}</span><strong>{value}</strong></div><code>{detail}</code></div>)}</div><div className="safety-note settings-note"><strong>Governance</strong><p>Production-impacting remediation is not automatically executed by this MVP. Incident recommendations remain evidence-based and require human review before operational changes.</p></div></section>
</>; }
