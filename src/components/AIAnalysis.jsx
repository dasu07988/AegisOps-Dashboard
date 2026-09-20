import { Badge } from "./Badge";
import { Icon } from "./Icons";

function displayCompleteness(value, evidence) {
  if (value && value !== "UNKNOWN") return value;
  const count = Array.isArray(evidence) ? evidence.length : 0;
  if (count >= 5) return "Strong evidence coverage";
  if (count >= 3) return "Partial evidence coverage";
  if (count > 0) return "Limited evidence coverage";
  return "Insufficient evidence";
}

export default function AIAnalysis({ analysis, severity }) {
  if (!analysis) {
    return <div className="empty-state"><strong>No AI analysis available</strong><span>The incident record does not contain an AI analysis payload.</span></div>;
  }

  const evidence = analysis.evidence || [];
  const recommendations = analysis.recommendations || [];
  const completeness = displayCompleteness(analysis.evidenceCompleteness, evidence);

  return (
    <div className="ai-panel">
      <div className="ai-head">
        <div className="ai-title">
          <div className="ai-orb"><Icon name="brain" size={18}/></div>
          <div>
            <strong>AI Incident Analysis</strong>
            <span>Amazon Nova 2 Lite · evidence-grounded analysis</span>
          </div>
        </div>
        <Badge tone="blue">AI ANALYSIS</Badge>
      </div>

      <div className="analysis-grid">
        <section className="analysis-block wide">
          <div className="block-label">01 · INCIDENT SUMMARY</div>
          <p>{analysis.summary || "No incident summary available."}</p>
        </section>

        <section className="analysis-block">
          <div className="block-label">02 · OBSERVED EVIDENCE</div>
          {evidence.length ? (
            <ul>{evidence.map((item, index) => <li key={index}><span className="checkmark">✓</span>{item}</li>)}</ul>
          ) : <p className="muted">No structured evidence items were returned.</p>}
        </section>

        <section className="analysis-block">
          <div className="block-label">03 · ROOT CAUSE HYPOTHESIS</div>
          <div className="hypothesis">
            <span>HYPOTHESIS</span>
            <p>{analysis.rootCause || "No root cause hypothesis established from the available evidence."}</p>
          </div>
          <div className="safety-note">
            <Icon name="shield" size={15}/>
            <div>This is an AI-generated hypothesis based on available evidence. It is not treated as a confirmed root cause unless supported by evidence.</div>
          </div>
        </section>

        <section className="analysis-block">
          <div className="block-label">04 · SEVERITY ASSESSMENT</div>
          <div className="severity-large">{severity || analysis.severity || "UNKNOWN"}</div>
          <p className="muted">Severity is sourced from the incident record; it is not independently scored by the dashboard.</p>
        </section>

        <section className="analysis-block">
          <div className="block-label">05 · EVIDENCE COMPLETENESS</div>
          <div className="confidence">
            <div className="confidence-ring">E</div>
            <div><strong>{completeness}</strong><span>{evidence.length} observed evidence item{evidence.length === 1 ? "" : "s"} available to the analysis.</span></div>
          </div>
        </section>

        <section className="analysis-block wide">
          <div className="block-label">06 · RECOMMENDED ACTIONS</div>
          {recommendations.length ? (
            <ol className="recommendations">
              {recommendations.map((recommendation, index) => (
                <li key={index}><span>{String(index + 1).padStart(2, "0")}</span>{recommendation}</li>
              ))}
            </ol>
          ) : (
            <div className="recommendation-empty">
              <Icon name="shield" size={15}/>
              <span>No actionable recommendation was returned. Review the retrieved runbook guidance and collect missing evidence before remediation.</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
