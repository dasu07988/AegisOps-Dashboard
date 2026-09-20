export const mockIncidents = [
  {
    incident_id: "INC-20260920075340",
    alarm_name: "AegisOps-High-CPU",
    state: "ALARM",
    severity: "HIGH",
    reason: "CPU utilization exceeded 70 percent",
    status: "INVESTIGATING",
    detected_at: "2026-09-20T07:53:40.391660+00:00",
    source: "CloudWatch",
    infrastructure: {
      instance_id: "i-01a9cf54167d13402",
      region: "eu-north-1"
    },
    metrics: {
      cpu_utilization: {
        latest_cpu: 0.51,
        latest_timestamp: "2026-09-20T07:48:00+00:00",
        values: [0.51, 0.49, 0.51, 0.50, 0.51, 0.50]
      }
    },
    logs: {
      apache_access: { event_count: 0, log_group: "/aegisops/apache/access" },
      apache_error: { event_count: 0, log_group: "/aegisops/apache/error" }
    },
    runbook: {
      knowledge_base_id: "QFIDUYD6VY",
      source: "ApexPay_Internal_Troubleshooting_Guide.docx",
      retrieved_chunks: [
        { score: 0.6783, title: "EC2 High CPU Utilization Runbook", text: "Check CPU utilization, determine whether the spike is temporary or sustained, review logs, identify CPU-intensive processes, check unusual traffic and scheduled tasks, and review instance sizing." },
        { score: 0.5191, title: "EC2 High CPU Utilization Runbook", text: "Review CloudWatch CPUUtilization and collect current CPU, trend, alarm state, logs, processes, traffic, and scheduled-task evidence." },
        { score: 0.4145, title: "Operational Troubleshooting Guide", text: "Use evidence-based troubleshooting steps and escalate production-impacting changes for approval." }
      ]
    },
    ai_analysis: {
      summary: "A CloudWatch high-CPU alarm triggered for the AegisOps demo EC2 instance. The latest retrieved metric is below the configured alarm threshold, so the current state should be distinguished from the earlier alarm event.",
      evidence: [
        "CloudWatch alarm state: ALARM",
        "Latest CPU datapoint: 0.51% as stored by the current backend",
        "Recent CPU values: 0.49%–0.51%",
        "Apache access logs: 0 events",
        "Apache error logs: 0 events"
      ],
      rootCause: "Root cause is not confirmed from the available evidence. Possible explanations include a temporary CPU spike or an event outside the retrieved observation window.",
      severity: "HIGH",
      recommendations: [
        "Retrieve CPU metrics around the exact alarm time.",
        "Inspect CPU-intensive processes on the EC2 instance.",
        "Review application and system logs around the alarm time.",
        "Check scheduled tasks, backups, updates, and batch jobs.",
        "Review traffic patterns if additional request metrics are available."
      ],
      confidence: "MEDIUM"
    }
  },
  {
    incident_id: "INC-20260920074545",
    alarm_name: "AegisOps-High-CPU",
    state: "ALARM",
    severity: "HIGH",
    reason: "CPU utilization exceeded 70 percent",
    status: "INVESTIGATING",
    detected_at: "2026-09-20T07:45:45+00:00",
    source: "CloudWatch",
    infrastructure: {
      instance_id: "i-01a9cf54167d13402",
      region: "eu-north-1"
    },
    metrics: {
      cpu_utilization: {
        latest_cpu: 0.62,
        latest_timestamp: "2026-09-20T07:40:00+00:00",
        values: [0.55, 0.58, 0.61, 0.60, 0.62, 0.59]
      }
    },
    logs: {
      apache_access: { event_count: 2, log_group: "/aegisops/apache/access" },
      apache_error: { event_count: 0, log_group: "/aegisops/apache/error" }
    },
    runbook: {
      knowledge_base_id: "QFIDUYD6VY",
      source: "ApexPay_Internal_Troubleshooting_Guide.docx",
      retrieved_chunks: [
        { score: 0.65, title: "EC2 High CPU Utilization Runbook", text: "Determine whether CPU usage is temporary or sustained and review application/system logs." },
        { score: 0.51, title: "EC2 High CPU Utilization Runbook", text: "Identify CPU-intensive processes and check unusual traffic or scheduled tasks." }
      ]
    },
    ai_analysis: {
      summary: "A second high-CPU alarm event was recorded for the same EC2 instance and retained in the incident history.",
      evidence: [
        "CloudWatch alarm state: ALARM",
        "Latest stored CPU datapoint: 0.62%",
        "Apache access logs: 2 events",
        "Apache error logs: 0 events"
      ],
      rootCause: "Root cause is not confirmed. Additional historical metrics and process-level evidence are required.",
      severity: "HIGH",
      recommendations: [
        "Inspect the CPU trend around the alarm timestamp.",
        "Review the two Apache access events.",
        "Check process-level CPU usage.",
        "Continue monitoring before any production-impacting change."
      ],
      confidence: "LOW"
    }
  }
];