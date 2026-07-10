function Toast({ notification }) {
  if (!notification) return null;
  return (
    <div className={`toast ${notification.type}`} role="status" aria-live="polite">
      {notification.message}
    </div>
  );
}

export default Toast;
