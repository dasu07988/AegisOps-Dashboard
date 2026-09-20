const API_BASE_URL =
  "https://eb0fdpju28.execute-api.eu-north-1.amazonaws.com";

/*
|--------------------------------------------------------------------------
| AegisOps Incident Service
|--------------------------------------------------------------------------
|
| React Dashboard
|       ↓
| API Gateway
|       ↓
| AegisOps-Incident-API Lambda
|       ↓
| DynamoDB + CloudWatch
|
| This service:
| 1. Fetches incidents from AWS
| 2. Normalizes API data
| 3. Normalizes CPU metrics
| 4. Normalizes logs
| 5. Parses AI analysis
| 6. Normalizes RAG/runbook data
| 7. Prepares data for React components
|
|--------------------------------------------------------------------------
*/


/* =========================================================================
   API
   ========================================================================= */

export async function getIncidents() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/incidents`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to load incidents: HTTP ${response.status}`
      );
    }

    const data = await response.json();

    const incidents = Array.isArray(data)
      ? data
      : data?.incidents ?? [];

    return incidents.map(normalizeIncident);
  } catch (error) {
    console.error(
      "AegisOps Incident API Error:",
      error
    );

    throw error;
  }
}


/* =========================================================================
   GET SINGLE INCIDENT
   ========================================================================= */

export async function getIncidentById(id) {
  try {
    const incidents = await getIncidents();

    return (
      incidents.find(
        (incident) =>
          String(incident.incident_id) === String(id)
      ) ?? null
    );
  } catch (error) {
    console.error(
      "AegisOps Get Incident Error:",
      error
    );

    throw error;
  }
}


/* =========================================================================
   NORMALIZE INCIDENT
   ========================================================================= */

function normalizeIncident(raw) {
  if (!raw || typeof raw !== "object") {
    return raw;
  }

  const infrastructure =
    raw.infrastructure ??
    raw.infrastructure_info ??
    raw.instance ??
    {};

  const metrics =
    raw.metrics ??
    raw.cpu_metrics ??
    {};

  const logs =
    raw.logs ??
    raw.log_evidence ??
    {};

  const aiRaw =
    raw.ai_analysis ??
    raw.aiAnalysis ??
    raw.analysis ??
    null;

  const runbook =
    raw.runbook ??
    raw.rag ??
    raw.knowledge_base ??
    null;

  const cpu = normalizeCpuMetrics(
    metrics,
    raw
  );

  const normalizedLogs =
    normalizeLogs(logs);

  const aiAnalysis =
    parseAIAnalysis(
      aiRaw,
      raw
    );

  return {
    ...raw,

    incident_id:
      raw.incident_id ??
      raw.id ??
      "UNKNOWN",

    alarm_name:
      raw.alarm_name ??
      raw.alarmName ??
      "Unknown Alarm",

    state:
      raw.state ??
      raw.alarm_state ??
      "UNKNOWN",

    severity:
      raw.severity ??
      aiAnalysis?.severity ??
      "UNKNOWN",

    status:
      raw.status ??
      "INVESTIGATING",

    reason:
      raw.reason ??
      raw.alarm_reason ??
      "No incident reason available.",

    detected_at:
      raw.detected_at ??
      raw.detectedAt ??
      raw.timestamp ??
      new Date().toISOString(),

    infrastructure: {
      instance_id:
        infrastructure.instance_id ??
        infrastructure.instanceId ??
        raw.instance_id ??
        "UNKNOWN",

      region:
        infrastructure.region ??
        raw.region ??
        "eu-north-1",

      instance_type:
        infrastructure.instance_type ??
        infrastructure.instanceType ??
        raw.instance_type ??
        "UNKNOWN",
    },

    metrics: {
      cpu_utilization: cpu,
    },

    logs: normalizedLogs,

    ai_analysis: aiAnalysis,

    runbook:
      normalizeRunbook(runbook),
  };
}


/* =========================================================================
   CPU METRICS
   ========================================================================= */

function normalizeCpuMetrics(metrics, raw) {
  const cpuData =
    metrics?.cpu_utilization ??
    metrics?.cpuUtilization ??
    {};

  let latestCpu =
    cpuData.latest_cpu ??
    cpuData.latestCpu ??
    metrics?.latest_cpu ??
    metrics?.latestCpu ??
    raw?.latest_cpu ??
    raw?.cpu_utilization ??
    null;

  if (typeof latestCpu === "string") {
    latestCpu = latestCpu
      .trim()
      .replace("%", "");
  }

  latestCpu = Number(latestCpu);

  if (!Number.isFinite(latestCpu)) {
    latestCpu = null;
  }

  /*
   * Frontend internal CPU format:
   * 48.83 → 0.4883
   * 51    → 0.51
   * 0.51  → 0.51
   */

  const normalizedLatestCpu =
    latestCpu === null
      ? null
      : latestCpu > 1
      ? latestCpu / 100
      : latestCpu;

  let values =
    cpuData.values ??
    cpuData.recent_values ??
    cpuData.recentValues ??
    cpuData.cpu_values ??
    metrics?.values ??
    metrics?.recent_values ??
    metrics?.recentValues ??
    metrics?.cpu_values ??
    [];

  if (!Array.isArray(values)) {
    values = [];
  }

  values = values
    .map((value) => {
      if (typeof value === "string") {
        value = value
          .trim()
          .replace("%", "");
      }

      const number = Number(value);

      if (!Number.isFinite(number)) {
        return null;
      }

      return number > 1
        ? number / 100
        : number;
    })
    .filter(
      (value) =>
        value !== null &&
        Number.isFinite(value)
    );

  /*
   * If there are no historical values,
   * repeat latest CPU for the chart.
   */

  if (
    values.length === 0 &&
    normalizedLatestCpu !== null
  ) {
    values = [
      normalizedLatestCpu,
      normalizedLatestCpu,
      normalizedLatestCpu,
      normalizedLatestCpu,
      normalizedLatestCpu,
    ];
  }

  const latestTimestamp =
    cpuData.latest_timestamp ??
    cpuData.latestTimestamp ??
    metrics?.latest_timestamp ??
    metrics?.latestTimestamp ??
    raw?.detected_at ??
    new Date().toISOString();

  return {
    latest_cpu:
      normalizedLatestCpu,

    latest_timestamp:
      latestTimestamp,

    values,
  };
}


/* =========================================================================
   LOG NORMALIZATION
   ========================================================================= */

function normalizeLogs(logs) {
  const apacheAccess =
    logs?.apache_access ??
    logs?.apacheAccess ??
    logs?.access ??
    {};

  const apacheError =
    logs?.apache_error ??
    logs?.apacheError ??
    logs?.error ??
    {};

  return {
    apache_access: {
      event_count:
        Number(
          apacheAccess.event_count ??
          apacheAccess.eventCount ??
          0
        ),

      log_group:
        apacheAccess.log_group ??
        apacheAccess.logGroup ??
        "/aegisops/apache/access",

      stream:
        apacheAccess.stream ??
        apacheAccess.log_stream ??
        null,

      events:
        Array.isArray(
          apacheAccess.events
        )
          ? apacheAccess.events
          : [],
    },

    apache_error: {
      event_count:
        Number(
          apacheError.event_count ??
          apacheError.eventCount ??
          0
        ),

      log_group:
        apacheError.log_group ??
        apacheError.logGroup ??
        "/aegisops/apache/error",

      stream:
        apacheError.stream ??
        apacheError.log_stream ??
        null,

      events:
        Array.isArray(
          apacheError.events
        )
          ? apacheError.events
          : [],
    },
  };
}


/* =========================================================================
   AI ANALYSIS PARSER
   ========================================================================= */

function parseAIAnalysis(
  rawAnalysis,
  incident
) {
  if (!rawAnalysis) {
    return {
      summary: "",

      evidence:
        buildObservedEvidence(
          incident
        ),

      rootCause:
        "No root cause hypothesis established.",

      severity:
        incident?.severity ??
        "UNKNOWN",

      recommendations: [],

      confidence:
        "UNKNOWN",

      evidenceCompleteness:
        "UNKNOWN",

      raw: null,
    };
  }

  let analysis = rawAnalysis;

  /*
   * Unwrap common API structures.
   */

  if (
    typeof analysis === "object" &&
    !Array.isArray(analysis)
  ) {
    if (analysis.analysis) {
      analysis = analysis.analysis;
    } else if (analysis.text) {
      analysis = analysis.text;
    } else if (analysis.content) {
      analysis = analysis.content;
    } else if (analysis.response) {
      analysis = analysis.response;
    } else if (analysis.output) {
      analysis = analysis.output;
    } else if (analysis.result) {
      analysis = analysis.result;
    }
  }

  /*
   * Parse JSON string if possible.
   */

  if (typeof analysis === "string") {
    const trimmed = analysis.trim();

    try {
      const parsed = JSON.parse(trimmed);

      if (parsed?.analysis) {
        analysis = parsed.analysis;
      } else if (parsed?.text) {
        analysis = parsed.text;
      } else if (parsed?.content) {
        analysis = parsed.content;
      } else if (parsed?.response) {
        analysis = parsed.response;
      } else {
        analysis = parsed;
      }
    } catch {
      /*
       * Not JSON.
       * Treat as Markdown/plain text.
       */
      analysis = trimmed;
    }
  }

  /*
   * Structured AI object.
   */

  if (
    typeof analysis === "object" &&
    !Array.isArray(analysis)
  ) {
    const evidence =
      Array.isArray(analysis.evidence)
        ? analysis.evidence
        : Array.isArray(
            analysis.observed_evidence
          )
        ? analysis.observed_evidence
        : Array.isArray(
            analysis.observedEvidence
          )
        ? analysis.observedEvidence
        : buildObservedEvidence(
            incident
          );

    const recommendations =
      Array.isArray(
        analysis.recommendations
      )
        ? analysis.recommendations
        : Array.isArray(
            analysis.recommended_actions
          )
        ? analysis.recommended_actions
        : Array.isArray(
            analysis.recommendedActions
          )
        ? analysis.recommendedActions
        : [];

    return {
      summary:
        cleanAIText(
          analysis.summary ??
          analysis.incident_summary ??
          analysis.incidentSummary ??
          ""
        ),

      evidence:
        evidence.map(
          (item) =>
            typeof item === "string"
              ? cleanAIText(item)
              : String(item)
        ),

      rootCause:
        cleanAIText(
          analysis.rootCause ??
          analysis.root_cause ??
          analysis.root_cause_hypothesis ??
          analysis.rootCauseHypothesis ??
          "No root cause hypothesis established."
        ),

      severity:
        String(
          analysis.severity ??
          incident?.severity ??
          "UNKNOWN"
        ).toUpperCase(),

      recommendations:
        recommendations.map(
          (item) =>
            cleanAIText(
              typeof item === "string"
                ? item
                : String(item)
            )
        ),

      confidence:
        String(
          analysis.confidence ??
          "UNKNOWN"
        ),

      evidenceCompleteness:
        String(
          analysis.evidence_completeness ??
          analysis.evidenceCompleteness ??
          "UNKNOWN"
        ),

      raw: analysis,
    };
  }

  /*
   * Raw Markdown / plain text AI response.
   */

  const rawText = String(analysis);

  return {
    summary:
      extractSection(
        rawText,
        [
          "Incident Summary",
          "INCIDENT SUMMARY",
          "Incident summary",
        ]
      ),

    evidence:
      buildObservedEvidence(
        incident
      ),

    rootCause:
      extractSection(
        rawText,
        [
          "Possible Root Cause",
          "Possible Root Causes",
          "Root Cause",
          "Root Cause Hypothesis",
          "POSSIBLE ROOT CAUSE",
          "ROOT CAUSE HYPOTHESIS",
        ]
      ) ||
      "No root cause hypothesis established.",

    severity:
      (
        extractValue(
          rawText,
          "Severity"
        ) ??
        incident?.severity ??
        "UNKNOWN"
      ).toUpperCase(),

    recommendations:
      extractRecommendations(
        rawText
      ),

    confidence:
      extractValue(
        rawText,
        "Confidence"
      ) ??
      "UNKNOWN",

    evidenceCompleteness:
      extractValue(
        rawText,
        "Evidence Completeness"
      ) ??
      "UNKNOWN",

    raw:
      rawText,
  };
}


/* =========================================================================
   OBSERVED EVIDENCE
   ========================================================================= */

function buildObservedEvidence(
  incident
) {
  if (!incident) {
    return [];
  }

  const evidence = [];

  /*
   * Alarm
   */

  if (incident.alarm_name) {
    evidence.push(
      `CloudWatch alarm: ${incident.alarm_name}`
    );
  }

  if (incident.state) {
    evidence.push(
      `Alarm state: ${incident.state}`
    );
  }

  /*
   * Infrastructure
   */

  if (
    incident.infrastructure?.instance_id
  ) {
    evidence.push(
      `EC2 instance: ${incident.infrastructure.instance_id}`
    );
  }

  if (
    incident.infrastructure?.region
  ) {
    evidence.push(
      `AWS region: ${incident.infrastructure.region}`
    );
  }

  /*
   * CPU
   */

  const cpu =
    incident.metrics?.cpu_utilization;

  if (cpu) {
    const latest =
      Number(cpu.latest_cpu);

    if (Number.isFinite(latest)) {
      const latestPercent =
        latest <= 1
          ? latest * 100
          : latest;

      evidence.push(
        `Latest CPU utilization: ${latestPercent.toFixed(0)}%`
      );
    }

    if (
      Array.isArray(cpu.values) &&
      cpu.values.length > 0
    ) {
      const values =
        cpu.values
          .map((value) => {
            const number =
              Number(value);

            return number <= 1
              ? number * 100
              : number;
          })
          .filter(
            (value) =>
              Number.isFinite(value)
          );

      if (values.length > 0) {
        const min =
          Math.min(...values);

        const max =
          Math.max(...values);

        evidence.push(
          `Recent CPU range: ${min.toFixed(0)}%–${max.toFixed(0)}%`
        );
      }
    }
  }

  /*
   * Apache logs
   */

  const accessCount =
    Number(
      incident.logs?.apache_access
        ?.event_count ?? 0
    );

  const errorCount =
    Number(
      incident.logs?.apache_error
        ?.event_count ?? 0
    );

  evidence.push(
    `Apache access log events: ${accessCount}`
  );

  evidence.push(
    `Apache error log events: ${errorCount}`
  );

  /*
   * RAG
   */

  const chunks =
    incident.runbook?.retrieved_chunks ??
    incident.runbook?.retrievedChunks ??
    [];

  if (Array.isArray(chunks)) {
    evidence.push(
      `RAG runbook chunks retrieved: ${chunks.length}`
    );
  }

  return evidence;
}


/* =========================================================================
   EXTRACT SECTION FROM AI MARKDOWN
   ========================================================================= */

function extractSection(
  text,
  headings
) {
  if (!text) {
    return "";
  }

  const lines =
    String(text)
      .replace(/\r/g, "")
      .split("\n");

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    const normalizedLine =
      lines[i]
        .replace(/^#+\s*/, "")
        .replace(/\*\*/g, "")
        .replace(/__/g, "")
        .replace(/:/g, "")
        .trim()
        .toLowerCase();

    const matched =
      headings.some(
        (heading) =>
          normalizedLine ===
            heading.toLowerCase() ||
          normalizedLine.includes(
            heading.toLowerCase()
          )
      );

    if (!matched) {
      continue;
    }

    const content = [];

    for (
      let j = i + 1;
      j < lines.length;
      j++
    ) {
      const rawLine =
        lines[j];

      const nextLine =
        rawLine
          .replace(/^#+\s*/, "")
          .replace(/\*\*/g, "")
          .trim();

      if (
        /^#{1,6}\s/.test(rawLine) ||
        /^\d+\.\s/.test(nextLine) ||
        /^\d+\s*[·.-]\s*/.test(
          nextLine
        )
      ) {
        break;
      }

      if (
        nextLine &&
        !nextLine.startsWith("---")
      ) {
        content.push(
          nextLine
        );
      }
    }

    if (content.length > 0) {
      return cleanAIText(
        content.join(" ")
      );
    }
  }

  /*
   * Fallback inline parser.
   */

  const plain =
    String(text)
      .replace(/\*\*/g, "")
      .replace(/__/g, "");

  for (
    const heading of headings
  ) {
    const regex =
      new RegExp(
        `${escapeRegExp(heading)}\\s*[:\\-]?\\s*(.*?)(?=\\n#{1,6}\\s|\\n\\d+[\\.\\)]\\s|$)`,
        "is"
      );

    const match =
      plain.match(regex);

    if (match?.[1]) {
      return cleanAIText(
        match[1]
      );
    }
  }

  return "";
}


/* =========================================================================
   EXTRACT SIMPLE VALUE
   ========================================================================= */

function extractValue(
  text,
  label
) {
  if (!text) {
    return null;
  }

  const regex =
    new RegExp(
      `${escapeRegExp(label)}\\s*[:\\-]?\\s*(.+)`,
      "i"
    );

  const match =
    String(text).match(regex);

  if (!match) {
    return null;
  }

  return cleanAIText(
    match[1]
  );
}


/* =========================================================================
   EXTRACT RECOMMENDATIONS
   ========================================================================= */

function extractRecommendations(text) {
  if (!text) return [];

  const lines = String(text)
    .replace(/\r/g, "")
    .split("\n");

  const results = [];
  let inside = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    /*
     * Remove markdown formatting.
     */

    const clean = line
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      .trim();

    /*
     * ---------------------------------------------------------------
     * START: Recommended Actions section
     * ---------------------------------------------------------------
     */

    const isRecommendationHeading =
      /^#{0,6}\s*\d*\.?\s*recommended\s+(actions?|remediation|next\s+steps?)\s*:?\s*$/i.test(
        clean
      ) ||
      /^recommended\s+(actions?|remediation|next\s+steps?)\s*:?\s*$/i.test(
        clean
      );

    if (isRecommendationHeading) {
      inside = true;
      continue;
    }

    if (!inside) {
      continue;
    }

    /*
     * ---------------------------------------------------------------
     * STOP: next major numbered section
     *
     * Example:
     * 7. Safety Guidelines
     * 8. Conclusion
     * ---------------------------------------------------------------
     */

    const nextSection =
      /^(?:#{1,6}\s*)?\d+\.\s+[A-Z][A-Za-z\s&/()_-]{2,100}:?\s*$/;

    if (nextSection.test(clean)) {
      break;
    }

    /*
     * ---------------------------------------------------------------
     * STOP / SKIP markdown headings
     *
     * This allows nested headings such as:
     *
     * Based on Runbook Guidance
     * ---------------------------------------------------------------
     */

    if (/^#{1,6}\s+/.test(line)) {
      continue;
    }

    /*
     * ---------------------------------------------------------------
     * Numbered recommendation
     *
     * 1. Check CPU-intensive processes
     * 2) Review logs
     * ---------------------------------------------------------------
     */

    const numberedMatch =
      clean.match(
        /^(?:\d+[\.\)])\s+(.+)$/
      );

    if (numberedMatch?.[1]) {
      results.push(
        cleanAIText(
          numberedMatch[1]
        )
      );

      continue;
    }

    /*
     * ---------------------------------------------------------------
     * Bullet recommendation
     *
     * - Check CPU
     * * Review logs
     * • Investigate traffic
     * ---------------------------------------------------------------
     */

    const bulletMatch =
      clean.match(
        /^[-*•]\s+(.+)$/
      );

    if (bulletMatch?.[1]) {
      results.push(
        cleanAIText(
          bulletMatch[1]
        )
      );

      continue;
    }

    /*
     * ---------------------------------------------------------------
     * Single-line recommendation fallback
     *
     * Handles AI responses such as:
     *
     * Investigate CPU-intensive processes on the EC2 instance.
     *
     * This makes the parser more tolerant of Bedrock's formatting.
     * ---------------------------------------------------------------
     */

    if (
      clean.length > 20 &&
      !clean.endsWith(":") &&
      !/^note\b/i.test(clean) &&
      !/^evidence\b/i.test(clean) &&
      !/^safety\b/i.test(clean) &&
      !/^observed\b/i.test(clean) &&
      !/^root\s+cause\b/i.test(clean) &&
      !/^severity\b/i.test(clean) &&
      !/^confidence\b/i.test(clean)
    ) {
      results.push(
        cleanAIText(clean)
      );
    }
  }

  /*
   * ---------------------------------------------------------------
   * Remove duplicates and empty values.
   * ---------------------------------------------------------------
   */

  return [
    ...new Set(
      results
        .map((item) =>
          cleanAIText(item)
        )
        .filter(Boolean)
    ),
  ];
}


/* =========================================================================
   RUNBOOK NORMALIZATION
   ========================================================================= */

function normalizeRunbook(
  runbook
) {
  if (!runbook) {
    return null;
  }

  const chunks =
    runbook.retrieved_chunks ??
    runbook.retrievedChunks ??
    runbook.chunks ??
    [];

  return {
    ...runbook,

    knowledge_base_id:
      runbook.knowledge_base_id ??
      runbook.knowledgeBaseId ??
      null,

    query:
      runbook.query ??
      "",

    retrieved_chunks:
      Array.isArray(chunks)
        ? chunks.map(
            normalizeRunbookChunk
          )
        : [],
  };
}


/* =========================================================================
   RUNBOOK CHUNK NORMALIZATION
   ========================================================================= */

function normalizeRunbookChunk(
  chunk
) {
  if (!chunk) {
    return {
      text: "",
      score: null,
      source: null,
    };
  }

  if (typeof chunk === "string") {
    return {
      text:
        cleanAIText(chunk),

      score:
        null,

      source:
        null,
    };
  }

  return {
    text:
      cleanAIText(
        chunk.text ??
        chunk.content ??
        chunk.chunk ??
        ""
      ),

    score:
      Number(
        chunk.score ??
        chunk.relevance_score ??
        chunk.relevanceScore ??
        0
      ),

    source:
      chunk.source ??
      chunk.location ??
      null,
  };
}


/* =========================================================================
   CLEAN AI TEXT
   ========================================================================= */

function cleanAIText(
  text
) {
  if (
    text === null ||
    text === undefined
  ) {
    return "";
  }

  return String(text)
    .replace(
      /^#{1,6}\s*/gm,
      ""
    )
    .replace(
      /\*\*/g,
      ""
    )
    .replace(
      /__/g,
      ""
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}


/* =========================================================================
   ESCAPE REGEX
   ========================================================================= */

function escapeRegExp(
  value
) {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}