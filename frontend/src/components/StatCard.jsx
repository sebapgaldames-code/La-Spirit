function StatCard({ icon: Icon, label, value, sub, tone }) {
  return (
    <div className={`stat-card${tone ? ` is-${tone}` : ''}`}>
      <div className="stat-label">
        {Icon && <Icon />}
        {label}
      </div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default StatCard;
