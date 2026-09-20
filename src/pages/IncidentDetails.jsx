import { Link, useParams } from "react-router-dom";
import { SeverityBadge, StatusBadge, Badge } from "../components/Badge";
import { Icon } from "../components/Icons";
import CpuChart from "../components/CpuChart";
import AIAnalysis from "../components/AIAnalysis";
import RunbookPanel from "../components/RunbookPanel";
import Timeline from "../components/Timeline";

/*
  AegisOps Incident Details

  Data flow:

  API Gateway
      ↓
  AegisOps-Incident-API Lambda
      ↓
  DynamoDB
      ↓
  React Dashboard

  CPU values may arrive as:

    0.51
    51
    "0.51"
    "51%"
    null

  This page normalizes them to percentage values.
*/

export default function IncidentDetails({ incidents = [] }) {
  const { id } = useParams();

  // --------------------------------------------------
  // Find incident
  // --------------------------------------------------

  const incident = incidents.find(
    (item) => item?.incident_id === id
  );

  // --------------------------------------------------
  // Incident not found
  // --------------------------------------------------

  if (!incident) {
    return (
      <div className="empty-state page-empty">
        <strong>Incident not found</strong>

        <Link
          to="/incidents"
          className="back-incidents-btn"
        >
          <Icon name="arrow" size={15} />
          <span>Back to Incidents</span>
        </Link>
      </div>
    );
  }

  // --------------------------------------------------
  // Safe nested objects
  // --------------------------------------------------

  const metrics = incident.metrics ?? {};

  const cpu =
    metrics.cpu_utilization ?? {};

  const logs =
    incident.logs ?? {};

  const apacheAccess =
    logs.apache_access ?? {};

  const apacheError =
    logs.apache_error ?? {};

  const infrastructure =
    incident.infrastructure ?? {};

  // --------------------------------------------------
  // CPU NORMALIZATION
  // --------------------------------------------------

  /*
    Converts different backend formats to percentage.

    Examples:

      0.51     → 51
      0.5      → 50
      51       → 51
      "51"     → 51
      "51%"    → 51
      "0.51"   → 51
  */

  const normalizeCpuPercent = (value) => {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === "string") {
      value = value.trim();

      if (!value) {
        return null;
      }

      value = value.replace("%", "");
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return null;
    }

    /*
      CloudWatch CPU values in our incident data can be:

      0 - 1   → fractional representation
      > 1     → percentage representation
    */

    if (
      numericValue >= 0 &&
      numericValue <= 1
    ) {
      return numericValue * 100;
    }

    return numericValue;
  };

  // --------------------------------------------------
  // CPU latest value
  // --------------------------------------------------

  const latestCpuFromBackend =
    normalizeCpuPercent(cpu.latest_cpu);

  // --------------------------------------------------
  // CPU historical values
  // --------------------------------------------------

  const rawCpuValues =
    Array.isArray(cpu.values)
      ? cpu.values
      : [];

  const cpuValues = rawCpuValues
    .map(normalizeCpuPercent)
    .filter(
      (value) =>
        value !== null &&
        Number.isFinite(value)
    );

  /*
    Primary source:

      cpu.latest_cpu

    Fallback:

      last valid value from cpu.values

    This prevents the UI from showing 0%
    when the latest metric field is missing but
    historical CPU data is available.
  */

  const latestCpu =
    latestCpuFromBackend !== null
      ? latestCpuFromBackend
      : cpuValues.length > 0
      ? cpuValues[cpuValues.length - 1]
      : null;

  // --------------------------------------------------
  // CPU timestamp
  // --------------------------------------------------

  const cpuTimestamp =
    cpu.latest_timestamp
      ? new Date(cpu.latest_timestamp)
      : null;

  const formattedCpuTimestamp =
    cpuTimestamp &&
    !Number.isNaN(cpuTimestamp.getTime())
      ? cpuTimestamp.toLocaleString()
      : "Unavailable";

  // --------------------------------------------------
  // Incident detected timestamp
  // --------------------------------------------------

  const detectedDate =
    incident.detected_at
      ? new Date(incident.detected_at)
      : null;

  const formattedDetectedDate =
    detectedDate &&
    !Number.isNaN(detectedDate.getTime())
      ? detectedDate.toLocaleString()
      : "N/A";

  // --------------------------------------------------
  // Log event counts
  // --------------------------------------------------

  const accessEventCount =
    Number(apacheAccess.event_count ?? 0);

  const errorEventCount =
    Number(apacheError.event_count ?? 0);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <>
      {/* =================================================
          BACK NAVIGATION
      ================================================= */}

      <div className="detail-back">
        <Link
          to="/incidents"
          className="back-incidents-btn"
        >
          <Icon
            name="arrow"
            size={15}
          />

          <span>
            Back to Incidents
          </span>
        </Link>
      </div>

      {/* =================================================
          INCIDENT HEADER
      ================================================= */}

      <div className="detail-header">
        <div>
          <div className="eyebrow">
            INCIDENT DETAILS
          </div>

          <div className="detail-title">
            <h1>
              {incident.incident_id}
            </h1>

            <SeverityBadge
              severity={
                incident.severity ||
                "UNKNOWN"
              }
            />

            <StatusBadge
              status={
                incident.status ||
                "INVESTIGATING"
              }
            />
          </div>

          <p>
            {incident.reason ||
              "Infrastructure incident detected by AegisOps."}
          </p>
        </div>

        <div className="detail-actions">
          <button
            className="secondary-btn"
            type="button"
          >
            <Icon
              name="check"
              size={15}
            />

            Mark resolved
          </button>
        </div>
      </div>

      {/* =================================================
          INCIDENT KPI CARDS
      ================================================= */}

      <div className="detail-kpis">

        {/* Alarm */}

        <div>
          <span>
            Alarm
          </span>

          <strong className="mono">
            {incident.alarm_name ||
              "N/A"}
          </strong>
        </div>

        {/* State */}

        <div>
          <span>
            State
          </span>

          <strong className="red-text">
            {incident.state ||
              "N/A"}
          </strong>
        </div>

        {/* EC2 Instance */}

        <div>
          <span>
            EC2 Instance
          </span>

          <strong className="mono">
            {infrastructure.instance_id ||
              "N/A"}
          </strong>
        </div>

        {/* Region */}

        <div>
          <span>
            Region
          </span>

          <strong className="mono">
            {infrastructure.region ||
              "eu-north-1"}
          </strong>
        </div>

        {/* Detected */}

        <div>
          <span>
            Detected
          </span>

          <strong>
            {formattedDetectedDate}
          </strong>
        </div>
      </div>

      {/* =================================================
          EVIDENCE GRID
      ================================================= */}

      <div className="content-grid two-thirds detail-grid">

        {/* =================================================
            CPU EVIDENCE
        ================================================= */}

        <section className="panel">

          <div className="section-head compact">
            <div>
              <div className="section-kicker">
                EVIDENCE
              </div>

              <h2>
                CPU Utilization
              </h2>
            </div>

            <Badge tone="amber">
              THRESHOLD 70%
            </Badge>
          </div>

          {/* CPU VALUE */}

          <div className="detail-cpu">

            <div>
              <span>
                Latest retrieved value
              </span>

              <strong>
                {latestCpu !== null
                  ? `${latestCpu.toFixed(0)}%`
                  : "N/A"}
              </strong>
            </div>

            <span className="muted">
              Metric timestamp ·{" "}
              {formattedCpuTimestamp}
            </span>
          </div>

          {/* CPU CHART */}

          <CpuChart
            values={cpuValues}
            threshold={70}
          />

        </section>

        {/* =================================================
            APACHE LOG EVIDENCE
        ================================================= */}

        <section className="panel">

          <div className="section-head compact">

            <div>
              <div className="section-kicker">
                LOG EVIDENCE
              </div>

              <h2>
                Apache Logs
              </h2>
            </div>

          </div>

          {/* LOG COUNTERS */}

          <div className="log-counters">

            {/* Access Logs */}

            <div>
              <span>
                Access events
              </span>

              <strong>
                {accessEventCount}
              </strong>

              <small>
                {apacheAccess.log_group ||
                  "/aegisops/apache/access"}
              </small>
            </div>

            {/* Error Logs */}

            <div>
              <span>
                Error events
              </span>

              <strong>
                {errorEventCount}
              </strong>

              <small>
                {apacheError.log_group ||
                  "/aegisops/apache/error"}
              </small>
            </div>

          </div>

          {/* LOG TERMINAL */}

          <div className="terminal">

            <div className="terminal-bar">
              <span></span>
              <span></span>
              <span></span>

              <em>
                recent-events.log
              </em>
            </div>

            <div className="terminal-body">

              {accessEventCount > 0 ||
              errorEventCount > 0
                ? "Recent Apache log events were retrieved."
                : "No events available in the retrieved observation window."}

            </div>

          </div>

        </section>

      </div>

      {/* =================================================
          AI INCIDENT ANALYSIS
      ================================================= */}

      <AIAnalysis
        analysis={
          incident.ai_analysis
        }
        severity={
          incident.severity
        }
      />

      {/* =================================================
          RAG RUNBOOK INTELLIGENCE
      ================================================= */}

      <RunbookPanel
        runbook={
          incident.runbook
        }
      />

      {/* =================================================
          TIMELINE + GOVERNANCE
      ================================================= */}

      <div className="content-grid two-thirds">

        {/* =================================================
            INCIDENT TIMELINE
        ================================================= */}

        <section className="panel">

          <div className="section-head compact">

            <div>
              <div className="section-kicker">
                PROCESS
              </div>

              <h2>
                Incident Timeline
              </h2>
            </div>

          </div>

          <Timeline incident={incident} />

        </section>

        {/* =================================================
            INCIDENT GOVERNANCE
        ================================================= */}

        <section className="panel">

          <div className="section-head compact">

            <div>
              <div className="section-kicker">
                GOVERNANCE
              </div>

              <h2>
                Incident Status
              </h2>
            </div>

          </div>

          {/* STATUS FLOW */}

          <div className="status-flow">

            {[
              "DETECTED",
              "INVESTIGATING",
              "ANALYZED",
              "AWAITING APPROVAL",
              "RESOLVED",
            ].map(
              (step, index) => {

                const status = String(incident.status || "INVESTIGATING").toUpperCase();
                const statusIndex = {
                  DETECTED: 0,
                  INVESTIGATING: 1,
                  ANALYZED: 2,
                  "AWAITING APPROVAL": 3,
                  RESOLVED: 4,
                }[status] ?? 1;

                const isDone = index < statusIndex;
                const isCurrent = index === statusIndex;

                return (
                  <div
                    key={step}
                    className={`flow-step ${
                      isCurrent
                        ? "current"
                        : isDone
                        ? "done"
                        : ""
                    }`}
                  >

                    <span>
                      {isDone
                        ? "✓"
                        : index + 1}
                    </span>

                    <strong>
                      {step}
                    </strong>

                  </div>
                );
              }
            )}

          </div>

          {/* SAFETY GOVERNANCE */}

          <div className="safety-note">

            <Icon
              name="shield"
              size={17}
            />

            <div>

              <strong>
                Human approval required
              </strong>

              <p>
                AegisOps does not automatically
                perform production-impacting
                remediation in this MVP.
              </p>

            </div>

          </div>

        </section>

      </div>
    </>
  );
}