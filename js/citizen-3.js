/* ============================================
   CIVIC REPORTING APP — CITIZEN JS
   Handles: mobile sidebar toggle, notification
   button, and DEMO data rendering for the
   citizen dashboard (stats + recent reports).
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initSidebarToggle();
  initNotificationButton();
  initLogoutConfirm();
  renderDashboardStats();
  renderRecentReports();
  initReportForm();
  initMyReportsPage();
  initReportDetailsPage();
  initSuggestionForm();
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
   (e.g. GET /api/reports?userId=...). For this frontend
   demonstration we use a hardcoded array.
------------------------------------------------- */
const DEMO_STATS = {
  total: 12,
  pending: 4,
  inProgress: 3,
  resolved: 5,
};

const DEMO_REPORTS = [
  { id: "CR-001", title: "Broken Street Light", category: "Electrical Issues", location: "Osisioma, Aba", date: "Aug 15", status: "pending", description: "The street light along the main road has been off for over a week, making the area unsafe at night.", image: null },
  { id: "CR-002", title: "Pothole on Main Road", category: "Bad Roads", location: "Ariaria, Aba", date: "Aug 13", status: "under-review", description: "A large pothole has formed near the market entrance and is causing traffic delays.", image: null },
  { id: "CR-003", title: "Overflowing Waste Bin", category: "Waste Management", location: "Ogbor Hill, Aba", date: "Aug 10", status: "in-progress", description: "The public waste bin has not been emptied in two weeks and is now overflowing.", image: null },
  { id: "CR-004", title: "Leaking Water Pipe", category: "Water Problems", location: "Eziama, Aba", date: "Aug 07", status: "resolved", description: "A burst pipe is leaking water continuously onto the street.", image: null },
  { id: "CR-005", title: "Damaged Park Bench", category: "Public Facilities", location: "Enyimba Park, Aba", date: "Aug 02", status: "rejected", description: "One of the benches in the community park is broken and unsafe to sit on.", image: null },
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
function renderDashboardStats() {
  const totalEl = document.getElementById("statTotal");
  const pendingEl = document.getElementById("statPending");
  const progressEl = document.getElementById("statProgress");
  const resolvedEl = document.getElementById("statResolved");

  if (!totalEl) return;

  totalEl.textContent = DEMO_STATS.total;
  pendingEl.textContent = DEMO_STATS.pending;
  progressEl.textContent = DEMO_STATS.inProgress;
  resolvedEl.textContent = DEMO_STATS.resolved;
}

/* ------------------------------------------------
   RENDER RECENT REPORTS TABLE
------------------------------------------------- */
function renderRecentReports() {
  const tableBody = document.getElementById("recentReportsBody");
  if (!tableBody) return;

  if (DEMO_REPORTS.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">No reports submitted yet.</td></tr>';
    return;
  }

  const rowsHtml = DEMO_REPORTS.map(function (report) {
    return (
      "<tr>" +
      '<td class="report-id">' + report.id + "</td>" +
      "<td>" + report.title + "</td>" +
      "<td>" + report.category + "</td>" +
      "<td>" + report.date + "</td>" +
      "<td>" + buildStatusBadge(report.status) + "</td>" +
      "</tr>"
    );
  }).join("");

  tableBody.innerHTML = rowsHtml;
}

/**
 * Builds a status badge span for a given status key.
 * Shared status keys/classes match style.css (.status-badge, .status-*).
 */
function buildStatusBadge(statusKey) {
  const label = STATUS_LABELS[statusKey] || statusKey;
  return '<span class="status-badge status-' + statusKey + '">' + label + "</span>";
}

/* ------------------------------------------------
   SHARED FIELD VALIDATION HELPERS
   (same pattern used in js/auth.js)
------------------------------------------------- */
function validateRequiredField(inputEl, value, message) {
  if (value === "") {
    setFieldError(inputEl, message);
    return false;
  }

  clearFieldError(inputEl);
  return true;
}

function setFieldError(inputEl, message) {
  inputEl.classList.add("has-error");
  inputEl.setAttribute("aria-invalid", "true");

  const errorEl = document.getElementById(inputEl.id + "Error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("is-visible");
  }
}

function clearFieldError(inputEl) {
  inputEl.classList.remove("has-error");
  inputEl.removeAttribute("aria-invalid");

  const errorEl = document.getElementById(inputEl.id + "Error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("is-visible");
  }
}

/* ------------------------------------------------
   REPORT AN ISSUE — FORM VALIDATION, IMAGE PREVIEW,
   AND DEMO SUBMISSION
------------------------------------------------- */
function initReportForm() {
  const form = document.getElementById("reportForm");
  if (!form) return;

  const titleInput = document.getElementById("reportTitle");
  const categoryInput = document.getElementById("reportCategory");
  const descriptionInput = document.getElementById("reportDescription");
  const locationInput = document.getElementById("reportLocation");
  const imageInput = document.getElementById("reportImage");

  const fileUploadLabel = document.getElementById("fileUploadLabel");
  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewImg = document.getElementById("imagePreviewImg");
  const imagePreviewName = document.getElementById("imagePreviewName");
  const removeImageBtn = document.getElementById("removeImageBtn");

  const formCard = document.getElementById("reportFormCard");
  const successPanel = document.getElementById("successPanel");
  const successMessage = document.getElementById("successMessage");

  let selectedImageDataUrl = null;

  /* ---------- Image selection + preview ---------- */
  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      selectedImageDataUrl = event.target.result;
      imagePreviewImg.src = selectedImageDataUrl;
      imagePreviewName.textContent = file.name;
      imagePreview.classList.add("is-visible");
      fileUploadLabel.innerHTML = "<strong>Change photo</strong> or drag a new one here";
    };
    reader.readAsDataURL(file);
  });

  removeImageBtn.addEventListener("click", function () {
    imageInput.value = "";
    selectedImageDataUrl = null;
    imagePreview.classList.remove("is-visible");
    fileUploadLabel.innerHTML = '<strong>Click to upload a photo</strong> (optional)';
  });

  /* ---------- Clear field errors as user types ---------- */
  [titleInput, categoryInput, descriptionInput, locationInput].forEach(function (input) {
    input.addEventListener("input", function () {
      clearFieldError(input);
    });
    input.addEventListener("change", function () {
      clearFieldError(input);
    });
  });

  /* ---------- Submit ---------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const titleValue = titleInput.value.trim();
    const categoryValue = categoryInput.value;
    const descriptionValue = descriptionInput.value.trim();
    const locationValue = locationInput.value.trim();

    const isTitleValid = validateRequiredField(titleInput, titleValue, "Please enter a report title.");
    const isCategoryValid = validateRequiredField(categoryInput, categoryValue, "Please select a category.");
    const isDescriptionValid = validateRequiredField(descriptionInput, descriptionValue, "Please describe the issue.");
    const isLocationValid = validateRequiredField(locationInput, locationValue, "Please enter a location.");

    if (!isTitleValid || !isCategoryValid || !isDescriptionValid || !isLocationValid) {
      return;
    }

    /* --------------------------------------------------------
       TEMPORARY FRONTEND DEMONSTRATION LOGIC ONLY
       --------------------------------------------------------
       There is no backend yet, so nothing is actually sent to a
       server. We generate a temporary, LocalStorage-based report
       ID and save the report so the "My Reports" demo page has
       data to display. The uploaded image is stored as a base64
       data URL purely for demo preview purposes.

       When a real backend is connected, this block should be
       replaced with an API call (e.g. POST /api/reports using
       FormData for the image) and the generated ID/response
       should come from the server instead of being invented here.
    -------------------------------------------------------- */
    const newReportId = generateDemoReportId();

    const newReport = {
      id: newReportId,
      title: titleValue,
      category: categoryValue,
      description: descriptionValue,
      location: locationValue,
      image: selectedImageDataUrl,
      date: formatDemoDate(new Date()),
      status: "pending",
    };

    saveDemoReportToLocalStorage(newReport);

    // Show success panel, hide the form
    successMessage.textContent =
      "Report submitted successfully. Your Report ID is " + newReportId + ".";
    formCard.style.display = "none";
    successPanel.classList.add("is-visible");

    form.reset();
    imagePreview.classList.remove("is-visible");
    selectedImageDataUrl = null;
  });
}

/**
 * Generates a simple sequential demo report ID (CR-001, CR-002, ...)
 * based on how many demo reports already exist in LocalStorage.
 * This is a frontend-only stand-in for an ID a real backend/database
 * would assign.
 */
function generateDemoReportId() {
  const existingReports = getDemoReportsFromLocalStorage();
  const nextNumber = existingReports.length + DEMO_REPORTS.length + 1;
  return "CR-" + String(nextNumber).padStart(3, "0");
}

function formatDemoDate(dateObj) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[dateObj.getMonth()] + " " + String(dateObj.getDate()).padStart(2, "0");
}

function getDemoReportsFromLocalStorage() {
  try {
    const stored = localStorage.getItem("civicReportingReports");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

function saveDemoReportToLocalStorage(report) {
  const existingReports = getDemoReportsFromLocalStorage();
  existingReports.push(report);
  localStorage.setItem("civicReportingReports", JSON.stringify(existingReports));
}

/**
 * Combines the hardcoded DEMO_REPORTS with any reports the citizen
 * has submitted this session (saved in LocalStorage via the Report
 * an Issue page), newest first. This is the single source of truth
 * used by both the My Reports page and the Report Details page.
 */
function getAllReports() {
  const localReports = getDemoReportsFromLocalStorage();
  return localReports.concat(DEMO_REPORTS);
}

/* ------------------------------------------------
   MY REPORTS PAGE — SEARCH + STATUS FILTER
------------------------------------------------- */
function initMyReportsPage() {
  const tableBody = document.getElementById("myReportsBody");
  if (!tableBody) return;

  const searchInput = document.getElementById("reportSearchInput");
  const filterChips = document.querySelectorAll(".filter-chip");

  let currentSearchTerm = "";
  let currentStatusFilter = "all";

  function refreshTable() {
    renderMyReportsTable(tableBody, currentSearchTerm, currentStatusFilter);
  }

  refreshTable();

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      currentSearchTerm = searchInput.value.trim().toLowerCase();
      refreshTable();
    });
  }

  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filterChips.forEach(function (c) {
        c.classList.remove("is-active");
      });
      chip.classList.add("is-active");
      currentStatusFilter = chip.getAttribute("data-status");
      refreshTable();
    });
  });
}

function renderMyReportsTable(tableBody, searchTerm, statusFilter) {
  let reports = getAllReports();

  if (statusFilter && statusFilter !== "all") {
    reports = reports.filter(function (report) {
      return report.status === statusFilter;
    });
  }

  if (searchTerm) {
    reports = reports.filter(function (report) {
      return (
        report.title.toLowerCase().includes(searchTerm) ||
        report.id.toLowerCase().includes(searchTerm)
      );
    });
  }

  if (reports.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No reports match your search or filter.</td></tr>';
    return;
  }

  const rowsHtml = reports.map(function (report) {
    return (
      '<tr class="report-row" data-report-id="' + report.id + '" tabindex="0">' +
      '<td class="report-id">' + report.id + "</td>" +
      "<td>" + report.title + "</td>" +
      "<td>" + report.category + "</td>" +
      "<td>" + report.location + "</td>" +
      "<td>" + report.date + "</td>" +
      "<td>" + buildStatusBadge(report.status) + "</td>" +
      "</tr>"
    );
  }).join("");

  tableBody.innerHTML = rowsHtml;

  // Clicking (or pressing Enter on) a row opens the report details page
  tableBody.querySelectorAll(".report-row").forEach(function (row) {
    row.addEventListener("click", function () {
      goToReportDetails(row.getAttribute("data-report-id"));
    });

    row.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        goToReportDetails(row.getAttribute("data-report-id"));
      }
    });
  });
}

function goToReportDetails(reportId) {
  window.location.href = "report-details.html?id=" + encodeURIComponent(reportId);
}

/* ------------------------------------------------
   REPORT DETAILS PAGE
------------------------------------------------- */

// Ordered stages for the progress stepper. "rejected" is handled
// separately since it's a terminal state outside the normal flow.
const PROGRESS_STEPS = [
  { key: "pending", label: "Submitted" },
  { key: "under-review", label: "Under Review" },
  { key: "in-progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

// Demo administrator response text shown per status, used only when
// a report has no custom "adminResponse" saved to it. Once a real
// backend exists, this text should come from the server instead.
const DEMO_ADMIN_RESPONSES = {
  "pending": "Your report has been received and is pending review.",
  "under-review": "Your report has been received and is currently under review.",
  "in-progress": "Your report has been reviewed and work is currently in progress to resolve this issue.",
  "resolved": "This issue has been resolved. Thank you for helping improve your community.",
  "rejected": "This report was reviewed and could not be processed. Please contact support for more details.",
};

function initReportDetailsPage() {
  const container = document.getElementById("reportDetailsContainer");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const reportId = params.get("id");
  const report = getAllReports().find(function (r) {
    return r.id === reportId;
  });

  if (!report) {
    container.innerHTML =
      '<a href="my-reports.html" class="back-link">&larr; Back to My Reports</a>' +
      '<div class="dashboard-card"><div class="empty-state">' +
      "Report not found. It may have been removed, or the link is invalid." +
      "</div></div>";
    return;
  }

  document.getElementById("detailReportId").textContent = report.id;
  document.getElementById("detailTitle").textContent = report.title;
  document.getElementById("detailCategory").textContent = report.category;
  document.getElementById("detailLocation").textContent = report.location;
  document.getElementById("detailDate").textContent = report.date;
  document.getElementById("detailDescription").textContent = report.description || "No description provided.";
  document.getElementById("detailStatusBadge").innerHTML = buildStatusBadge(report.status);

  const imageWrapper = document.getElementById("detailImageWrapper");
  if (report.image) {
    imageWrapper.innerHTML = '<img src="' + report.image + '" alt="Photo submitted with report ' + report.id + '" />';
  } else {
    imageWrapper.style.display = "none";
  }

  renderProgressStepper(report.status);

  const responseEl = document.getElementById("detailAdminResponse");
  if (responseEl) {
    responseEl.textContent = report.adminResponse || DEMO_ADMIN_RESPONSES[report.status] || "No response yet.";
  }
}

/**
 * Renders the "Submitted → Under Review → In Progress → Resolved"
 * progress stepper and highlights the current stage. If the report
 * was rejected, the stepper is shown in a dimmed/red "rejected" state
 * instead, since rejection falls outside the normal progress flow.
 */
function renderProgressStepper(status) {
  const stepperEl = document.getElementById("progressStepper");
  if (!stepperEl) return;

  if (status === "rejected") {
    stepperEl.classList.add("is-rejected");
    stepperEl.innerHTML = PROGRESS_STEPS.map(function (step, index) {
      return (
        '<div class="progress-step">' +
        '<span class="step-line"></span>' +
        '<div class="step-circle">' + (index + 1) + "</div>" +
        '<div class="step-label">' + step.label + "</div>" +
        "</div>"
      );
    }).join("");
    return;
  }

  const currentIndex = PROGRESS_STEPS.findIndex(function (step) {
    return step.key === status;
  });

  stepperEl.innerHTML = PROGRESS_STEPS.map(function (step, index) {
    let stateClass = "";
    if (index < currentIndex) {
      stateClass = "is-complete";
    } else if (index === currentIndex) {
      stateClass = "is-current";
    }

    return (
      '<div class="progress-step ' + stateClass + '">' +
      '<span class="step-line"></span>' +
      '<div class="step-circle">' + (index + 1) + "</div>" +
      '<div class="step-label">' + step.label + "</div>" +
      "</div>"
    );
  }).join("");
}

/* ------------------------------------------------
   SUBMIT SUGGESTION — FORM VALIDATION + DEMO SUBMIT
------------------------------------------------- */
function initSuggestionForm() {
  const form = document.getElementById("suggestionForm");
  if (!form) return;

  const titleInput = document.getElementById("suggestionTitle");
  const descriptionInput = document.getElementById("suggestionDescription");

  const formCard = document.getElementById("suggestionFormCard");
  const successPanel = document.getElementById("suggestionSuccessPanel");

  [titleInput, descriptionInput].forEach(function (input) {
    input.addEventListener("input", function () {
      clearFieldError(input);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const titleValue = titleInput.value.trim();
    const descriptionValue = descriptionInput.value.trim();

    const isTitleValid = validateRequiredField(titleInput, titleValue, "Please enter a suggestion title.");
    const isDescriptionValid = validateRequiredField(descriptionInput, descriptionValue, "Please describe your suggestion.");

    if (!isTitleValid || !isDescriptionValid) {
      return;
    }

    /* --------------------------------------------------------
       TEMPORARY FRONTEND DEMONSTRATION LOGIC ONLY
       --------------------------------------------------------
       There is no backend yet, so the suggestion is only saved
       to LocalStorage so the frontend has something to display
       or reuse later in the demo. When a real backend exists,
       this should be replaced with an API call (e.g. POST
       /api/suggestions) and the LocalStorage write removed.
    -------------------------------------------------------- */
    saveDemoSuggestionToLocalStorage({
      title: titleValue,
      description: descriptionValue,
      date: formatDemoDate(new Date()),
    });

    formCard.style.display = "none";
    successPanel.classList.add("is-visible");
    form.reset();
  });
}

function saveDemoSuggestionToLocalStorage(suggestion) {
  let existingSuggestions = [];
  try {
    const stored = localStorage.getItem("civicReportingSuggestions");
    existingSuggestions = stored ? JSON.parse(stored) : [];
  } catch (error) {
    existingSuggestions = [];
  }

  existingSuggestions.push(suggestion);
  localStorage.setItem("civicReportingSuggestions", JSON.stringify(existingSuggestions));
}
