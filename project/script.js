// ========== CONFIG ==========
const API_BASE_URL = "http://localhost:8080";


// ========== UTILITY: NOTIFICATIONS ==========
function showNotification(message, type = "info", duration = 4000) {
  const container = document.getElementById("notifications");

  const notif = document.createElement("div");
  notif.className = `notification ${type}`;

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️"
  };

  notif.textContent = `${icons[type] || ""} ${message}`;

  container.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("removing");

    setTimeout(() => {
      notif.remove();
    }, 300);
  }, duration);
}


// ========== UTILITY: API FETCH ==========
async function apiFetch(url, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json"
  };

  options.headers = {
    ...defaultHeaders,
    ...options.headers
  };

  if (options.body && typeof options.body === "object") {
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, options);

  return response;
}


// ========== ERROR HANDLING ==========
async function getErrorMessage(response) {
  let detail = "";

  try {
    const text = await response.text();

    try {
      const json = JSON.parse(text);

      detail =
        json.message ||
        json.error ||
        json.errors ||
        (Array.isArray(json) ? json.join(", ") : text);

    } catch {
      detail = text;
    }

  } catch {
    // Ignore
  }

  switch (response.status) {
    case 400:
      return detail || "Bad request – please check your input.";

    case 404:
      return detail || "Not found – the requested resource does not exist.";

    case 500:
      return detail || "Server error – please try again later.";

    default:
      return detail || `Request failed (HTTP ${response.status}).`;
  }
}


// ========== UTILITY: DATES ==========
function formatDate(value) {
  if (!value) return "—";

  const d = new Date(value);

  if (isNaN(d)) return value;

  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}


// ========== MONTH NAMES ==========
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function monthName(n) {
  return MONTH_NAMES[n - 1] || "—";
}


// ========== TABLE BUILDERS ==========
function buildTable(headers, rows) {

  if (!rows || rows.length === 0) {
    return '<p class="empty-text">No data available.</p>';
  }

  const thead = `
    <thead>
      <tr>
        ${headers.map((h) => `<th>${h}</th>`).join("")}
      </tr>
    </thead>
  `;

  const tbody = `
    <tbody>
      ${rows
        .map(
          (row) =>
            `<tr>${row
              .map((cell) => `<td>${cell}</td>`)
              .join("")}</tr>`
        )
        .join("")}
    </tbody>
  `;

  return `<table>${thead}${tbody}</table>`;
}


function statusBadge(status) {

  const cls = `status-${status || "AVAILABLE"}`;

  return `
    <span class="${cls}">
      ${status || "—"}
    </span>
  `;
}


// ========== NAVIGATION ==========
function switchView(viewName) {

  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));

  const target = document.getElementById(`view-${viewName}`);

  if (target) {
    target.classList.add("active");
  }


  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));

  const navItem = document.querySelector(
    `.nav-item[data-view="${viewName}"]`
  );

  if (navItem) {
    navItem.classList.add("active");
  }


  // Close sidebar on mobile
  const sidebar = document.getElementById("sidebar");

  if (sidebar) {
    sidebar.classList.remove("open");
  }


  // Load data for selected page
  switch (viewName) {

    case "dashboard":
      loadDashboard();
      break;

    case "donors":
      loadDonors();
      break;

    case "listings":
      loadFoodListings();
      break;

    case "claims":
      loadClaims();
      break;

    case "statistics":
      loadStatistics();
      break;
  }
}


// ========== MODALS ==========
function openModal(id) {

  const modal = document.getElementById(id);

  if (modal) {
    modal.classList.add("active");
  }
}


function closeModal(id) {

  const modal = document.getElementById(id);

  if (modal) {
    modal.classList.remove("active");

    const form = modal.querySelector("form");

    if (form) {
      form.reset();
    }
  }
}


// ========== DOM READY ==========
document.addEventListener("DOMContentLoaded", () => {

  // Close modal when clicking outside
  document
    .querySelectorAll(".modal-overlay")
    .forEach((overlay) => {

      overlay.addEventListener("click", (e) => {

        if (e.target === overlay) {

          overlay.classList.remove("active");

          const form = overlay.querySelector("form");

          if (form) {
            form.reset();
          }
        }
      });

    });


  // Sidebar toggle
  const sidebarToggle =
    document.getElementById("sidebarToggle");

  if (sidebarToggle) {

    sidebarToggle.addEventListener("click", () => {

      document
        .getElementById("sidebar")
        .classList.toggle("open");

    });

  }


  // Navigation
  document
    .querySelectorAll(".nav-item")
    .forEach((item) => {

      item.addEventListener("click", (e) => {

        e.preventDefault();

        switchView(item.dataset.view);

      });

    });


  // Forms
  const donorForm =
    document.getElementById("donorForm");

  if (donorForm) {
    donorForm.addEventListener("submit", addDonor);
  }


  const listingForm =
    document.getElementById("listingForm");

  if (listingForm) {
    listingForm.addEventListener(
      "submit",
      addFoodListing
    );
  }


  const claimForm =
    document.getElementById("claimForm");

  if (claimForm) {
    claimForm.addEventListener(
      "submit",
      claimFood
    );
  }


  // Load dashboard
  loadDashboard();

});


// ========== API STATUS ==========
async function checkApiStatus() {

  const badge =
    document.getElementById("apiStatus");

  if (!badge) return;

  try {

    const res = await fetch(
      `${API_BASE_URL}/donors`
    );

    if (res.ok || res.status === 404) {

      badge.textContent = "API Online";

      badge.className =
        "header-badge online";

    } else {

      badge.textContent = "API Issues";

      badge.className =
        "header-badge offline";
    }

  } catch {

    badge.textContent = "API Offline";

    badge.className =
      "header-badge offline";
  }
}


// ========== DASHBOARD ==========
async function loadDashboard() {

  checkApiStatus();


  // Load donors
  loadDonors();


  // Load food listings
  loadFoodListings();


  // Load claims
  loadClaims();


  // Statistics
  try {

    const res = await apiFetch(
      `${API_BASE_URL}/statistics/monthly`
    );

    if (res.ok) {

      const data = await res.json();

      const totalDiverted =
        Array.isArray(data)
          ? data.reduce(
              (sum, s) =>
                sum +
                (s.totalFoodDivertedKg || 0),
              0
            )
          : data.totalFoodDivertedKg || 0;


      const element =
        document.getElementById(
          "dashTotalDiverted"
        );

      if (element) {

        element.textContent =
          `${totalDiverted.toFixed(1)} kg`;
      }

    } else {

      const element =
        document.getElementById(
          "dashTotalDiverted"
        );

      if (element) {
        element.textContent = "0 kg";
      }
    }

  } catch {

    const element =
      document.getElementById(
        "dashTotalDiverted"
      );

    if (element) {
      element.textContent = "—";
    }
  }


  // Recent listings
  try {

    const res = await apiFetch(
      `${API_BASE_URL}/food-listings`
    );

    const el =
      document.getElementById(
        "recentListings"
      );

    if (res.ok) {

      const data = await res.json();

      const arr =
        Array.isArray(data) ? data : [];

      const recent =
        arr.slice(0, 5);


      const headers = [
        "ID",
        "Food Type",
        "Qty (kg)",
        "Status"
      ];


      const rows = recent.map((f) => [

        f.id,

        f.foodType || "—",

        f.quantity ?? "—",

        statusBadge(f.status)

      ]);


      el.innerHTML =
        buildTable(headers, rows);


      const availableElement =
        document.getElementById(
          "dashAvailable"
        );

      if (availableElement) {

        availableElement.textContent =
          arr.filter(
            (f) =>
              f.status === "AVAILABLE"
          ).length;
      }


      const expiredElement =
        document.getElementById(
          "dashExpired"
        );

      if (expiredElement) {

        expiredElement.textContent =
          arr.filter(
            (f) =>
              f.status === "EXPIRED"
          ).length;
      }

    } else {

      el.innerHTML =
        '<p class="empty-text">Unable to load food listings.</p>';
    }

  } catch {

    const element =
      document.getElementById(
        "recentListings"
      );

    if (element) {

      element.innerHTML =
        '<p class="empty-text">Could not reach the server.</p>';
    }
  }


  // Recent claims
  try {

    const res = await apiFetch(
      `${API_BASE_URL}/claims`
    );

    const el =
      document.getElementById(
        "recentClaims"
      );

    if (res.ok) {

      const data = await res.json();

      const arr =
        Array.isArray(data) ? data : [];

      const recent =
        arr.slice(0, 5);


      const headers = [
        "Claim ID",
        "NGO Name",
        "Food ID",
        "Claimed At"
      ];


      const rows = recent.map((c) => [

        c.id,

        c.ngoName || "—",

        // FIXED: foodListing is nested
        c.foodListing?.id || "—",

        formatDate(c.claimedAt)

      ]);


      el.innerHTML =
        buildTable(headers, rows);


      const claimsElement =
        document.getElementById(
          "dashClaims"
        );

      if (claimsElement) {

        claimsElement.textContent =
          arr.length;
      }

    } else {

      el.innerHTML =
        '<p class="empty-text">Unable to load claims.</p>';

    }

  } catch {

    const element =
      document.getElementById(
        "recentClaims"
      );

    if (element) {

      element.innerHTML =
        '<p class="empty-text">Could not reach the server.</p>';
    }
  }
}


// ========== DONORS ==========
async function loadDonors() {

  const el =
    document.getElementById(
      "donorsTable"
    );

  if (!el) return;


  el.innerHTML =
    '<p class="loading-text">Loading donors…</p>';


  try {

    const res = await apiFetch(
      `${API_BASE_URL}/donors`
    );


    if (res.ok) {

      const data = await res.json();

      const arr =
        Array.isArray(data)
          ? data
          : [];


      const headers = [
        "ID",
        "Name",
        "Contact",
        "Email"
      ];


      const rows = arr.map((d) => [

        d.id,

        d.name || "—",

        d.contact || "—",

        d.email || "—"

      ]);


      el.innerHTML =
        buildTable(headers, rows);

    } else {

      const msg =
        await getErrorMessage(res);

      el.innerHTML =
        `<p class="empty-text">${msg}</p>`;
    }

  } catch {

    el.innerHTML =
      '<p class="empty-text">Could not reach the server at ' +
      API_BASE_URL +
      ".</p>";
  }
}


// ========== FOOD LISTINGS ==========
async function loadFoodListings() {

  const el =
    document.getElementById(
      "listingsTable"
    );

  if (!el) return;


  el.innerHTML =
    '<p class="loading-text">Loading food listings…</p>';


  try {

    const res = await apiFetch(
      `${API_BASE_URL}/food-listings`
    );


    if (res.ok) {

      const data = await res.json();

      const arr =
        Array.isArray(data)
          ? data
          : [];


      const headers = [
        "ID",
        "Food Type",
        "Qty (kg)",
        "Safe To Eat Until",
        "Status",
        "Donor"
      ];


      const rows = arr.map((f) => [

        f.id,

        f.foodType || "—",

        f.quantity ?? "—",

        formatDate(
          f.safeToEatUntil
        ),

        statusBadge(f.status),

        // FIXED: donor is nested
        f.donor?.name || "—"

      ]);


      el.innerHTML =
        buildTable(headers, rows);

    } else {

      const msg =
        await getErrorMessage(res);

      el.innerHTML =
        `<p class="empty-text">${msg}</p>`;
    }

  } catch {

    el.innerHTML =
      '<p class="empty-text">Could not reach the server at ' +
      API_BASE_URL +
      ".</p>";
  }
}


// ========== CLAIMS ==========
async function loadClaims() {

  const el =
    document.getElementById(
      "claimsTable"
    );

  if (!el) return;


  el.innerHTML =
    '<p class="loading-text">Loading claims…</p>';


  try {

    const res = await apiFetch(
      `${API_BASE_URL}/claims`
    );


    if (res.ok) {

      const data = await res.json();

      const arr =
        Array.isArray(data)
          ? data
          : [];


      const headers = [
        "Claim ID",
        "NGO Name",
        "Food ID",
        "Food Type",
        "Quantity",
        "Claimed At"
      ];


      const rows = arr.map((c) => [

        c.id,

        c.ngoName || "—",

        // FIXED: foodListing is nested
        c.foodListing?.id || "—",

        // FIXED: foodType is inside foodListing
        c.foodListing?.foodType || "—",

        // FIXED: quantity is inside foodListing
        c.foodListing?.quantity ?? "—",

        formatDate(c.claimedAt)

      ]);


      el.innerHTML =
        buildTable(headers, rows);

    } else {

      const msg =
        await getErrorMessage(res);

      el.innerHTML =
        `<p class="empty-text">${msg}</p>`;
    }

  } catch {

    el.innerHTML =
      '<p class="empty-text">Could not reach the server at ' +
      API_BASE_URL +
      ".</p>";
  }
}


// ========== STATISTICS ==========
async function loadStatistics() {

  const el =
    document.getElementById(
      "statisticsContent"
    );

  if (!el) return;


  el.innerHTML =
    '<p class="loading-text">Loading statistics…</p>';


  try {

    const res = await apiFetch(
      `${API_BASE_URL}/statistics/monthly`
    );


    if (res.ok) {

      const data = await res.json();

      const arr =
        Array.isArray(data)
          ? data
          : [data];


      if (
        arr.length === 0 ||
        (arr.length === 1 && !arr[0])
      ) {

        el.innerHTML =
          '<p class="empty-text">No statistics available yet.</p>';

        return;
      }


      const cards = arr
        .map((s) => {

          const diverted =
            (s.totalFoodDivertedKg || 0)
              .toFixed(1);


          return `
            <div class="stat-info-card">

              <p class="period">
                ${s.year || "—"} ·
                ${monthName(s.month)}
              </p>

              <p class="big-number">
                ${diverted} kg
              </p>

              <p class="sub-label">
                Total Food Diverted
              </p>

              <div class="claims-row">

                <span class="sub-label">
                  Number of Claims
                </span>

                <span class="claims-num">
                  ${s.numberOfClaims ?? 0}
                </span>

              </div>

            </div>
          `;

        })
        .join("");


      el.innerHTML =
        `<div class="stat-grid">${cards}</div>`;

    } else {

      const msg =
        await getErrorMessage(res);

      el.innerHTML =
        `<p class="empty-text">${msg}</p>`;
    }

  } catch {

    el.innerHTML =
      '<p class="empty-text">Could not reach the server at ' +
      API_BASE_URL +
      ".</p>";
  }
}


// ========== ADD DONOR ==========
async function addDonor(e) {

  e.preventDefault();

  const form = e.target;


  const body = {

    name:
      form.name.value.trim(),

    contact:
      form.contact.value.trim(),

    email:
      form.email.value.trim()

  };


  const submitBtn =
    form.querySelector(
      'button[type="submit"]'
    );


  submitBtn.disabled = true;

  submitBtn.textContent =
    "Registering…";


  try {

    const res = await apiFetch(
      `${API_BASE_URL}/donors`,
      {
        method: "POST",
        body
      }
    );


    if (
      res.ok ||
      res.status === 201
    ) {

      showNotification(
        "Donor registered successfully!",
        "success"
      );


      closeModal("donorModal");

      loadDonors();

      loadDashboard();

    } else {

      const msg =
        await getErrorMessage(res);

      showNotification(
        msg,
        "error"
      );
    }

  } catch {

    showNotification(
      "Could not connect to the server. Is the backend running at " +
        API_BASE_URL +
        "?",
      "error",
      6000
    );

  } finally {

    submitBtn.disabled = false;

    submitBtn.textContent =
      "Register";
  }
}


// ========== ADD FOOD LISTING ==========
async function addFoodListing(e) {

  e.preventDefault();

  const form = e.target;


  const donorId =
    form.donorId.value.trim();


  const body = {

    foodType:
      form.foodType.value.trim(),

    quantity:
      parseFloat(
        form.quantity.value
      ),

    safeToEatUntil:
      form.safeToEatUntil.value

  };


  const submitBtn =
    form.querySelector(
      'button[type="submit"]'
    );


  submitBtn.disabled = true;

  submitBtn.textContent =
    "Adding…";


  try {

    const res = await apiFetch(
      `${API_BASE_URL}/food-listings/donor/${donorId}`,
      {
        method: "POST",
        body
      }
    );


    if (
      res.ok ||
      res.status === 201
    ) {

      showNotification(
        "Food listing added successfully!",
        "success"
      );


      closeModal("listingModal");

      loadFoodListings();

      loadDashboard();

    } else {

      const msg =
        await getErrorMessage(res);

      showNotification(
        msg,
        "error"
      );
    }

  } catch {

    showNotification(
      "Could not connect to the server. Is the backend running at " +
        API_BASE_URL +
        "?",
      "error",
      6000
    );

  } finally {

    submitBtn.disabled = false;

    submitBtn.textContent =
      "Add Listing";
  }
}


// ========== CLAIM FOOD ==========
async function claimFood(e) {

  e.preventDefault();

  const form = e.target;


  const foodListingId =
    form.foodListingId.value.trim();


  const body = {

    ngoName:
      form.ngoName.value.trim()

  };


  const submitBtn =
    form.querySelector(
      'button[type="submit"]'
    );


  submitBtn.disabled = true;

  submitBtn.textContent =
    "Claiming…";


  try {

    const res = await apiFetch(
      `${API_BASE_URL}/claims/food/${foodListingId}`,
      {
        method: "POST",
        body
      }
    );


    if (
      res.ok ||
      res.status === 201
    ) {

      showNotification(
        "Food claimed successfully!",
        "success"
      );


      closeModal("claimModal");

      loadClaims();

      loadDashboard();

      loadStatistics();

    } else {

      const msg =
        await getErrorMessage(res);

      showNotification(
        msg,
        "error",
        6000
      );
    }

  } catch {

    showNotification(
      "Could not connect to the server. Is the backend running at " +
        API_BASE_URL +
        "?",
      "error",
      6000
    );

  } finally {

    submitBtn.disabled = false;

    submitBtn.textContent =
      "Submit Claim";
  }
}