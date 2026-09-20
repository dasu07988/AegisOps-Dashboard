export default function Placeholder({ title, kicker, text }) {
  return <div className="page-header"><div><div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{text}</p></div></div>;
}