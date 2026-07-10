import Sidebar from './Sidebar.jsx';

function Layout({ view, onNavigate, eyebrow, title, description, actions, children }) {
  return (
    <div className="app-shell">
      <Sidebar view={view} onNavigate={onNavigate} />
      <div className="main-area">
        <header className="topbar">
          <div>
            {eyebrow && <div className="topbar-eyebrow">{eyebrow}</div>}
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          {actions && <div className="topbar-actions">{actions}</div>}
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
