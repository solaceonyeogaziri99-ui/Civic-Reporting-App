/* ============================================
   CIVIC REPORTING APP — ADMIN JS
   Handles: mobile sidebar toggle, notification
   button, logout confirmation, and DEMO data
   rendering for the admin dashboard (stats +
   recent reports).
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initSidebarToggle();
  initNotificationButton();
  initLogoutConfirm();
  renderAdminStats();
  renderAdminRecentReports();
});

/* ------------------------------------------------
   SIDEBAR TOGGLE (mobile)
------------------------------------------------- */
function initSidebarToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  if (!menuToggle || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-visible");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", function () {
    const isOpen = sidebar.classList.contains("is-open");
    isOpen ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener("click", closeSidebar);

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      closeSidebar();
    }
  });
}

/* ------------------------------------------------
   NOTIFICATION BUTTON (demo only)
------------------------------------------------- */
function initNotificationButton() {
  const notificationBtn = document.querySelector(".notification-btn");
  if (!notificationBtn) return;

  notificationBtn.addEventListener("click", function () {
    // Frontend demo only — a real implementation would open a
    // notifications panel populated from a backend API.
    alert("You have no new notifications. (Demo placeholder)");
  });
}

/* ------------------------------------------------
   LOGOUT CONFIRMATION
------------------------------------------------- */
function initLogoutConfirm() {
  const logoutLink = document.querySelector(".logout-link");
  if (!logoutLink) return;

  logoutLink.addEventListener("click", function (event) {
    const confirmed = confirm("Are you sure you want to log out?");
    if (!confirmed) {
      event.preventDefault();
    }
    /* --------------------------------------------------------
       TEMPORARY FRONTEND DEMONSTRATION LOGIC ONLY
       When a real backend is connected, logout should call an
       API to end the session/token before redirecting to login.
    -------------------------------------------------------- */
  });
}

/* ------------------------------------------------
   DEMO DATA
   In a real app this would come from a backend API
   (e.g. GET /api/admin/stats, GET /api/admin/reports).
   For this frontend demonstration we use hardcoded data.
------------------------------------------------- */
const DEMO_ADMIN_STATS = {
  totalUsers: 48,
  totalReports: 126,
  pendingReports: 19,
  resolvedReports: 74,
};

const DEMO_ADMIN_REPORTS = [
  { id: "CR-001", title: "Broken Street Light", category: "Electrical Issues", citizen: "Ada Nwosu", status: "pending", date: "Aug 15" },
  { id: "CR-002", title: "Pothole on Main Road", category: "Bad Roads", citizen: "Chidi Okafor", status: "under-review", date: "Aug 13" },
  { id: "CR-003", title: "Overflowing Waste Bin", category: "Waste Management", citizen: "Ifeoma Eze", status: "in-progress", date: "Aug 10" },
  { id: "CR-004", title: "Leaking Water Pipe", category: "Water Problems", citizen: "Emeka Obi", status: "resolved", date: "Aug 07" },
  { id: "CR-005", title: "Damaged Park Bench", category: "Public Facilities", citizen: "Ngozi Umeh", status: "rejected", date: "Aug 02" },
];

const STATUS_LABELS = {
  "pending": "Pending",
  "under-review": "Under Review",
  "in-progress": "In Progress",
  "resolved": "Resolved",
  "rejected": "Rejected",
};

/* ------------------------------------------------
   RENDER STAT CARDS
------------------------------------------------- */
function renderAdminStats() {
  const totalUsersEl = document.getElementById("statTotalUsers");
  if (!totalUsersEl) return;

  document.getElementById("statTotalUsers").textContent = DEMO_ADMIN_STATS.totalUsers;
  document.getElementById("statTotalReports").textContent = DEMO_ADMIN_STATS.totalReports;
  document.getElementById("statPendingReports").textContent = DEMO_ADMIN_STATS.pendingReports;
  document.getElementById("statResolvedReports").textContent = DEMO_ADMIN_STATS.resolvedReports;
}

/* ------------------------------------------------
   RENDER RECENT REPORTS TABLE
------------------------------------------------- */
function renderAdminRecentReports() {
  const tableBody = document.getElementById("adminRecentReportsBody");
  if (!tableBody) return;

  if (DEMO_ADMIN_REPORTS.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No reports submitted yet.</td></tr>';
    return;
  }

  const rowsHtml = DEMO_ADMIN_REPORTS.map(function (report) {
    return (
      "<tr>" +
      '<td class="report-id">' + report.id + "</td>" +
      "<td>" + report.title + "</td>" +
      "<td>" + report.category + "</td>" +
      "<td>" + buildCitizenCell(report.citizen) + "</td>" +
      "<td>" + buildStatusBadge(report.status) + "</td>" +
      "<td>" + report.date + "</td>" +
      "</tr>"
    );
  }).join("");

  tableBody.innerHTML = rowsHtml;
}

/**
 * Builds a small avatar + name cell for the "Citizen" column,
 * using the citizen's initials as a simple placeholder avatar.
 */
function buildCitizenCell(fullName) {
  const initials = fullName
    .split(" ")
    .map(function (part) {
      return part.charAt(0);
    })
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    '<div class="citizen-cell">' +
    '<span class="citizen-avatar" aria-hidden="true">' + initials + "</span>" +
    "<span>" + fullName + "</span>" +
    "</div>"
  );
}

/**
 * Builds a status badge span for a given status key.
 * Shared status keys/classes match style.css (.status-badge, .status-*).
 */
function buildStatusBadge(statusKey) {
  const label = STATUS_LABELS[statusKey] || statusKey;
  return '<span class="status-badge status-' + statusKey + '">' + label + "</span>";
}
