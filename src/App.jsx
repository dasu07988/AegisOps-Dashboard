import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import IncidentDetails from "./pages/IncidentDetails";
import Infrastructure from "./pages/Infrastructure";
import Runbooks from "./pages/Runbooks";
import AIAnalysisPage from "./pages/AIAnalysisPage";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import { getIncidents } from "./services/incidentService";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("now");
  const location = useLocation();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getIncidents();
      setIncidents(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setError(e.message || "Unable to load incidents.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}
      <div className="main-shell">
        <Topbar onMenu={() => setSidebarOpen(true)} onRefresh={load} lastUpdated={lastUpdated}/>
        <main className="main-content">
          {loading ? (
            <div className="loading-state"><div className="loader"></div><strong>Loading incident intelligence...</strong><span>Connecting to the AegisOps data layer</span></div>
          ) : error ? (
            <div className="error-state"><strong>Unable to load incidents</strong><span>{error}</span><button className="primary-btn" onClick={load}>Retry</button></div>
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard incidents={incidents}/>}/>
              <Route path="/incidents" element={<Incidents incidents={incidents}/>}/>
              <Route path="/incidents/:id" element={<IncidentDetails incidents={incidents}/>}/>
              <Route path="/infrastructure" element={<Infrastructure incidents={incidents}/>}/>
              <Route path="/runbooks" element={<Runbooks incidents={incidents}/>}/>
              <Route path="/ai-analysis" element={<AIAnalysisPage incidents={incidents}/>}/>
              <Route path="/activity" element={<Activity incidents={incidents}/>}/>
              <Route path="/settings" element={<Settings/>}/>
            </Routes>
          )}
        </main>
        <footer className="app-footer"><span>AegisOps AI</span><span>Autonomous Cloud Operations Agent</span><span>Built for AWS · MVP</span></footer>
      </div>
    </div>
  );
}