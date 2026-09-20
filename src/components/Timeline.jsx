import { Icon } from "./Icons";

function formatTime(value) {
  if (!value) return "--:--";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "--:--" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Timeline({ incident }) {
  const time = incident?.detected_at;
  const chunks = incident?.runbook?.retrieved_chunks?.length || 0;
  const steps = [
    ["CloudWatch", "Alarm state changed to ALARM", time, "alert"],
    ["EventBridge", "Incident trigger delivered", time, "activity"],
    ["Lambda Agent", "Metrics and logs collected", time, "server"],
    ["RAG", `${chunks} runbook chunks retrieved`, time, "book"],
    ["Nova 2 Lite", "Evidence-grounded analysis generated", time, "brain"],
    ["DynamoDB", "Incident persisted", time, "check"],
  ];

  return (
    <div className="timeline">
      {steps.map(([title, text, timestamp, icon], i) => (
        <div className="timeline-item" key={title}>
          <div className="timeline-line">
            <div className="timeline-icon"><Icon name={icon} size={15}/></div>
            {i < steps.length - 1 && <span/>}
          </div>
          <div className="timeline-copy"><strong>{title}</strong><p>{text}</p></div>
          <time>{formatTime(timestamp)}</time>
        </div>
      ))}
    </div>
  );
}
