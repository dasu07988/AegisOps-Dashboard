export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function StatusBadge({ status }) {
  const tone = status === "RESOLVED" ? "green" : ["INVESTIGATING", "ANALYZED", "AWAITING APPROVAL"].includes(status) ? "amber" : "red";
  return <Badge tone={tone}>{status}</Badge>;
}

export function SeverityBadge({ severity }) {
  const tone = severity === "CRITICAL" || severity === "HIGH" ? "red" : severity === "MEDIUM" ? "amber" : "green";
  return <Badge tone={tone}>{severity}</Badge>;
}