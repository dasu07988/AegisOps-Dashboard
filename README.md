
# AegisOps AI — Autonomous Cloud Operations Dashboard

A professional React/Vite dashboard for **AegisOps AI**, an AI-powered cloud operations system that detects infrastructure incidents, investigates monitoring evidence, retrieves troubleshooting guidance, and presents AI-generated incident analysis.

AegisOps AI connects AWS monitoring, AI-powered investigation, knowledge retrieval, and incident management in a unified dashboard.

---

## 🚀 Live Demo

**Live Dashboard:** [AegisOps AI](https://main.d289vrijhfwvab.amplifyapp.com)

**Incident API:** [AegisOps Incident API](https://eb0fdpju28.execute-api.eu-north-1.amazonaws.com/incidents )

---

## ✨ Features

### Operations Dashboard
- Executive operations overview
- Active incident table
- Incident severity and status badges
- CPU utilization chart with alarm threshold
- Incident search and filters
- Responsive desktop and mobile layout

### Incident Investigation
- Incident detail view
- AI-generated incident summaries
- Root-cause hypotheses
- Evidence versus hypothesis presentation
- Severity assessment
- Recommended troubleshooting actions
- Incident timeline

### AI and Runbook Intelligence
- Amazon Nova 2 Lite-powered incident analysis
- Retrieval-Augmented Generation (RAG)
- Amazon Bedrock Knowledge Bases integration
- Runbook intelligence panel
- Evidence completeness presentation
- Human-centered incident investigation

### AWS Integration
- AWS Lambda incident agent
- Amazon CloudWatch metrics and logs
- CloudWatch alarms and Amazon EventBridge
- Amazon DynamoDB incident storage
- Amazon API Gateway incident API
- AWS Amplify dashboard hosting

---

## 🏗️ System Architecture

```text
EC2 Instance
     |
     v
Amazon CloudWatch
(Metrics and Logs)
     |
     v
CloudWatch Alarm
     |
     v
Amazon EventBridge
     |
     v
AWS Lambda Incident Agent
     |
     +----------------------+
     |                      |
     v                      v
CloudWatch Evidence    Bedrock Knowledge Base
                            |
                            v
                     Runbook Retrieval
     |                      |
     +-----------+----------+
                 |
                 v
          Amazon Nova 2 Lite
          AI Incident Analysis
                 |
                 v
          Amazon DynamoDB
          Incident Records
                 |
                 v
          Amazon API Gateway
                 |
                 v
          React Dashboard
                 |
                 v
            AWS Amplify
```

---

## 🔄 Incident Workflow

1. CloudWatch monitors the EC2 instance and application logs.
2. A CloudWatch alarm detects high CPU utilization.
3. EventBridge triggers the AWS Lambda incident agent.
4. The agent collects available monitoring evidence.
5. Bedrock Knowledge Bases retrieves relevant runbook information.
6. Amazon Nova 2 Lite generates an incident summary, root-cause hypothesis, and recommendations.
7. The incident record is stored in DynamoDB.
8. API Gateway exposes incident data to the frontend.
9. The dashboard displays the incident and its AI-generated analysis for human review.

---

## 🧰 Technology Stack

| Category | Technology |
|---|---|
| Frontend | React, Vite |
| Styling | CSS |
| Cloud Infrastructure | Amazon EC2 |
| Monitoring | Amazon CloudWatch |
| Event Routing | Amazon EventBridge |
| Incident Agent | AWS Lambda |
| AI Model | Amazon Nova 2 Lite |
| RAG | Amazon Bedrock Knowledge Bases |
| Embeddings | Amazon Titan Text Embeddings V2 |
| Vector Storage | Amazon S3 Vectors |
| Runbook Storage | Amazon S3 |
| Database | Amazon DynamoDB |
| API | Amazon API Gateway |
| Hosting | AWS Amplify |

---

## 🔌 API Integration

The frontend connects to the deployed AWS API through the incident service abstraction:

`src/services/incidentService.js`

The dashboard retrieves incident records from the backend rather than accessing DynamoDB directly from the browser.

### Current API Endpoint

```http
GET /incidents
```

Base URL:

```text
https://eb0fdpju28.execute-api.eu-north-1.amazonaws.com
```

The API provides incident data stored in DynamoDB.

### Backend Architecture

```text
Browser
   |
   v
React Dashboard
   |
   v
API Gateway
   |
   v
Incident API / Lambda
   |
   v
Amazon DynamoDB
   |
   v
AegisOps-Incidents
```

AWS credentials and database permissions remain on the backend. The frontend does not connect directly to DynamoDB using AWS credentials.

---

## 📊 Incident Data and CPU Metrics

The dashboard displays incident records containing information such as CPU utilization, severity, incident status, evidence, and AI-generated analysis.

The backend may store CPU utilization as a fractional value, such as `0.51`, while the dashboard displays it as `51%`.

The frontend and backend should use a consistent metric representation to avoid incorrect percentage calculations.

---

## 🧠 AI Analysis and Safety

The AI analysis may include:

- Incident summary
- Observed evidence
- Root-cause hypothesis
- Severity assessment
- Evidence completeness
- Recommended actions

**Safety principles:**

- AI-generated root causes are hypotheses, not confirmed facts.
- Recommendations should be reviewed against available evidence and runbook guidance.
- Risky remediation actions are not automatically executed.
- Human oversight remains central to incident response.

---

## 🧪 Testing and Validation

The deployed system has been tested with a high-CPU incident scenario.

| Component | Validation |
|---|---|
| EC2 web server | Deployed |
| CloudWatch CPU alarm | Triggered |
| EventBridge trigger | Tested |
| Lambda incident agent | Tested |
| Bedrock knowledge retrieval | Tested |
| DynamoDB incident storage | Verified |
| API Gateway incident retrieval | Verified |
| Live dashboard integration | Verified |
| High-CPU incident simulation | Successfully tested |

---

## 🖥️ Run Locally

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/dasu07988/AegisOps-Dashboard
```

Navigate to the project directory:

```bash
cd AegisOps-Dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite, normally:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

Build the frontend:

```bash
npm run build
```

The production build is generated in the `dist` directory by default.

---

## 🗺️ Main Routes

| Route | Description |
|---|---|
| `/` | Operations overview |
| `/incidents` | Incident list |
| `/incidents/:id` | Incident details |
| `/infrastructure` | Infrastructure overview |
| `/runbooks` | Runbook intelligence |
| `/ai-analysis` | AI analysis |
| `/activity` | Activity timeline |
| `/settings` | Dashboard settings |

---

## ⚠️ Current Scope and Limitations

- The current implementation focuses on high CPU utilization incidents.
- AI analysis depends on available monitoring evidence and runbook content.
- AI-generated hypotheses and recommendations require human review.
- Automated remediation is not implemented in the current workflow.
- The application depends on the availability and configuration of its AWS resources.

---

## 🔮 Future Improvements

- Support additional incident types.
- Improve incident correlation across multiple services.
- Expand the runbook knowledge base.
- Add human-approved remediation workflows.
- Improve incident analytics and reporting.
- Expand automated testing and deployment documentation.

---

## 👩‍💻 Author

**Yashadhi Jayasundara**

Information Technology Undergraduate

Interests:
- Artificial Intelligence
- Cloud Computing
- AI Agents and Automation
- Retrieval-Augmented Generation
- Cloud Operations

---

## 📄 License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>AegisOps AI</strong><br/>
  Intelligent Cloud Operations · Evidence-Grounded Investigation · Human Oversight
</p>