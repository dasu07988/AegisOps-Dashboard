import { Badge } from "./Badge";
import { Icon } from "./Icons";


/* =========================================================================
   CLEAN TEXT
   ========================================================================= */

function cleanText(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}


/* =========================================================================
   FORMAT RUNBOOK TEXT
   ========================================================================= */

function formatRunbookText(value) {
  const text = cleanText(value);

  if (!text) {
    return "";
  }

  /*
   * Add visual line breaks before important runbook sections.
   *
   * The Bedrock Knowledge Base can sometimes return a large chunk
   * containing several parts of the original runbook.
   */

  return text
    .replace(
      /\s+(Trigger)\s+/gi,
      "\n\n$1\n"
    )
    .replace(
      /\s+(Investigation Steps)\s+/gi,
      "\n\n$1\n"
    )
    .replace(
      /\s+(Evidence to Collect)\s+/gi,
      "\n\n$1\n"
    )
    .replace(
      /\s+(Recommended Actions)\s+/gi,
      "\n\n$1\n"
    )
    .replace(
      /\s+(Safety Guidelines)\s+/gi,
      "\n\n$1\n"
    )
    .replace(
      /\s+(\d+\.)\s+/g,
      "\n$1 "
    )
    .replace(
      /\s+-\s+/g,
      "\n- "
    )
    .replace(
      /\n{3,}/g,
      "\n\n"
    )
    .trim();
}


/* =========================================================================
   CHUNK TITLE
   ========================================================================= */

function chunkTitle(
  chunk,
  index
) {
  const text =
    cleanText(
      chunk?.text
    );

  if (!text) {
    return `Retrieved guidance ${index + 1}`;
  }

  /*
   * Try to identify meaningful runbook section names.
   */

  const sectionMatches = [
    "Trigger",
    "Investigation Steps",
    "Evidence to Collect",
    "Recommended Actions",
    "Safety Guidelines",
  ];

  for (
    const section of sectionMatches
  ) {
    if (
      new RegExp(
        `\\b${section}\\b`,
        "i"
      ).test(text)
    ) {
      return section;
    }
  }

  /*
   * Otherwise use the first sentence.
   */

  const first =
    text
      .split(/[.!?]/)[0]
      .trim();

  if (!first) {
    return `Retrieved guidance ${index + 1}`;
  }

  return first.length > 72
    ? `${first.slice(0, 69)}...`
    : first;
}


/* =========================================================================
   RELEVANCE SCORE
   ========================================================================= */

function formatScore(score) {
  const numeric =
    Number(score);

  if (
    !Number.isFinite(numeric)
  ) {
    return "N/A";
  }

  return numeric.toFixed(3);
}


/* =========================================================================
   SOURCE
   ========================================================================= */

function formatSource(source) {
  if (!source) {
    return "S3 runbook source";
  }

  const value =
    String(source);

  /*
   * Keep the full S3 path available to the user,
   * but make it visually cleaner.
   */

  if (
    value.startsWith("s3://")
  ) {
    return value;
  }

  return value;
}


/* =========================================================================
   PREVIEW
   ========================================================================= */

function previewText(
  text,
  maxLength = 280
) {
  const cleaned =
    cleanText(text);

  if (
    cleaned.length <= maxLength
  ) {
    return cleaned;
  }

  return (
    cleaned.slice(
      0,
      maxLength
    ) + "..."
  );
}


/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function RunbookPanel({
  runbook,
}) {
  const chunks =
    Array.isArray(
      runbook?.retrieved_chunks
    )
      ? runbook.retrieved_chunks
      : [];

  const count =
    chunks.length;

  /*
   * Use the first available source.
   */

  const source =
    chunks.find(
      (chunk) =>
        chunk?.source
    )?.source ??
    "S3 runbook source";


  return (
    <div className="runbook-panel">

      {/* ================================================================
          HEADER
          ================================================================ */}

      <div className="section-head">

        <div>

          <div className="section-kicker">
            RAG KNOWLEDGE
          </div>

          <h2>
            Runbook Intelligence
          </h2>

          <p>
            Retrieved guidance used by the
            incident analysis agent.
          </p>

        </div>

        <Badge tone="blue">
          {count} RETRIEVED
        </Badge>

      </div>


      {/* ================================================================
          RUNBOOK EXISTS
          ================================================================ */}

      {runbook ? (
        <>

          {/* ============================================================
              METADATA
              ============================================================ */}

          <div className="runbook-meta">

            <div>
              <span>
                Knowledge Base
              </span>

              <strong>
                {runbook.name ??
                  runbook.knowledge_base_name ??
                  "AegisOps-Runbook-KB"}
              </strong>
            </div>


            <div>
              <span>
                Knowledge Base ID
              </span>

              <strong className="mono">
                {
                  runbook.knowledge_base_id ??
                  "N/A"
                }
              </strong>
            </div>


            <div>
              <span>
                Source
              </span>

              <strong
                title={formatSource(source)}
              >
                {formatSource(source)}
              </strong>
            </div>

          </div>


          {/* ============================================================
              RETRIEVED CHUNKS
              ============================================================ */}

          <div className="runbook-list">

            {chunks.length > 0 ? (

              chunks.map(
                (chunk, index) => {

                  const rawText =
                    cleanText(
                      chunk?.text
                    );

                  const formattedText =
                    formatRunbookText(
                      chunk?.text
                    );

                  const title =
                    chunkTitle(
                      chunk,
                      index
                    );

                  const score =
                    formatScore(
                      chunk?.score
                    );

                  const sourceValue =
                    formatSource(
                      chunk?.source
                    );


                  return (
                    <details
                      key={`${sourceValue}-${index}`}
                      open={index === 0}
                      className="runbook-chunk"
                    >

                      {/* =================================================
                          CHUNK HEADER
                          ================================================= */}

                      <summary>

                        <span className="chunk-index">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>


                        <span>

                          <strong>
                            {title}
                          </strong>

                          <small>
                            Relevance score ·{" "}
                            {score}
                          </small>

                        </span>


                        <Icon
                          name="chevron"
                          size={16}
                        />

                      </summary>


                      {/* =================================================
                          CHUNK CONTENT
                          ================================================= */}

                      <div className="runbook-chunk-content">

                        {/* ------------------------------------------------
                            Preview
                            ------------------------------------------------ */}

                        <p>
                          {previewText(
                            rawText
                          )}
                        </p>


                        {/* ------------------------------------------------
                            Full retrieved evidence
                            ------------------------------------------------ */}

                        {rawText.length >
                          280 && (
                          <details className="runbook-full-text">

                            <summary>
                              View full retrieved evidence
                            </summary>

                            <div
                              style={{
                                whiteSpace:
                                  "pre-line",
                                marginTop:
                                  "12px",
                              }}
                            >
                              {formattedText}
                            </div>

                          </details>
                        )}


                        {/* ------------------------------------------------
                            Source
                            ------------------------------------------------ */}

                        <div
                          style={{
                            marginTop:
                              "12px",
                            fontSize:
                              "11px",
                            opacity:
                              0.65,
                          }}
                        >
                          Source:{" "}
                          {sourceValue}
                        </div>

                      </div>

                    </details>
                  );
                }
              )

            ) : (

              /* ==========================================================
                 EMPTY CHUNKS
                 ========================================================== */

              <div className="empty-state compact-empty">

                <strong>
                  No runbook chunks retrieved
                </strong>

                <span>
                  The agent did not return
                  knowledge-base evidence
                  for this incident.
                </span>

              </div>

            )}

          </div>

        </>

      ) : (

        /* ================================================================
           NO RUNBOOK
           ================================================================ */

        <div className="empty-state compact-empty">

          <strong>
            No runbook data
          </strong>

          <span>
            No knowledge-base retrieval
            record is attached to this
            incident.
          </span>

        </div>

      )}

    </div>
  );
}