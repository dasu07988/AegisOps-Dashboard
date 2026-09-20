export default function CpuChart({ values = [], threshold = 70 }) {
  const max = Math.max(100, threshold + 10, ...values.map((v) => v * 100));
  const points = values.map((v, i) => {
    const x = values.length <= 1 ? 0 : (i / (values.length - 1)) * 100;
    const y = 100 - ((v * 100) / max) * 100;
    return `${x},${Math.max(4, Math.min(96, y))}`;
  }).join(" ");

  const thresholdY = 100 - (threshold / max) * 100;

  return (
    <div className="chart-wrap">
      <svg className="cpu-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cpuFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4f8cff" stopOpacity=".28"/>
            <stop offset="100%" stopColor="#4f8cff" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[20,40,60,80].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(148,163,184,.10)" strokeWidth=".5"/>)}
        <line x1="0" x2="100" y1={thresholdY} y2={thresholdY} stroke="#ff7b72" strokeWidth=".7" strokeDasharray="2 2"/>
        {values.length > 1 && <polygon points={`0,100 ${points} 100,100`} fill="url(#cpuFill)"/>}
        {values.length > 1 && <polyline points={points} fill="none" stroke="#5b9cff" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>}
      </svg>
      <div className="threshold-label" style={{ top: `${thresholdY}%` }}>Alarm {threshold}%</div>
      <div className="chart-axis"><span>30m ago</span><span>Now</span></div>
    </div>
  );
}