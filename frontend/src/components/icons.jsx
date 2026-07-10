const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
};

export const IconDashboard = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
);

export const IconBottle = (p) => (
  <svg {...base} {...p}><path d="M9 2h6" /><path d="M10 2v5.5c0 .5-.2 1-.6 1.4L8 10.4A3 3 0 0 0 7 12.5V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-7.5a3 3 0 0 0-1-2.1l-1.4-1.5A2 2 0 0 1 14 7.5V2" /></svg>
);

export const IconUsers = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.4 2.9-6 6.5-6s6.5 2.6 6.5 6" /><circle cx="17.5" cy="8.5" r="2.6" /><path d="M15.7 14.2c2.9.4 5.3 2.6 5.3 5.8" /></svg>
);

export const IconClipboard = (p) => (
  <svg {...base} {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="M9 11h6M9 15h6M9 19h3" /></svg>
);

export const IconReceipt = (p) => (
  <svg {...base} {...p}><path d="M6 2h12v19l-3-2-3 2-3-2-3 2V2Z" /><path d="M9 8h6M9 12h6" /></svg>
);

export const IconCart = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /><path d="M2.5 3h2.4l2.2 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 7H6" /></svg>
);

export const IconChart = (p) => (
  <svg {...base} {...p}><path d="M4 20V10M11 20V4M18 20v-7" /><path d="M2 20h20" /></svg>
);

export const IconEdit = (p) => (
  <svg {...base} {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);

export const IconTrash = (p) => (
  <svg {...base} {...p}><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /><path d="M10 11v6M14 11v6" /></svg>
);

export const IconSearch = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);

export const IconAlert = (p) => (
  <svg {...base} {...p}><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.6 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" /></svg>
);

export const IconPlus = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);

export const IconTrend = (p) => (
  <svg {...base} {...p}><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
);

export const IconCoin = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5c0-1.4 1.1-2.5 2.5-2.5s2.5.8 2.5 2c0 3-5 1.6-5 4.5 0 1.2 1.1 2 2.5 2s2.5-1.1 2.5-2.5" /></svg>
);
