export function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    alert: <><path d="M10.3 4.2 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
    server: <><rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 7h.01M7 18h.01"/><path d="M11 7h7M11 18h7"/></>,
    brain: <><path d="M9.5 3.5a3 3 0 0 0-3 3v.4A3.5 3.5 0 0 0 4 10.3a3.5 3.5 0 0 0 1.7 3A3.5 3.5 0 0 0 9 18.8a3 3 0 0 0 6 0 3.5 3.5 0 0 0 3.3-5.5 3.5 3.5 0 0 0 1.7-3 3.5 3.5 0 0 0-2.5-3.4v-.4a3 3 0 0 0-3-3A3 3 0 0 0 12 5a3 3 0 0 0-2.5-1.5Z"/><path d="M12 5v14M8 9h2M14 9h2M8 14h2M14 14h2"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Z"/><path d="M4 5.5V22M8 7h8M8 11h8"/></>,
    activity: <><path d="M3 12h4l2-6 4 12 2-6h6"/><path d="M21 5v14"/></>,
    settings: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="m19.4 15 .1.1a2 2 0 1 1-2.8 2.8l-.1-.1M4.6 9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1M15 4.6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1M9 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.8-4L3 10"/><path d="M3 5v5h5"/><path d="M4 13a8 8 0 0 0 14.8 4L21 14"/><path d="M21 19v-5h-5"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    cpu: <><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/></>,
    chevron: <><path d="m6 9 6 6 6-6"/></>
  };
  return <svg {...common}>{paths[name] ?? paths.grid}</svg>;
}