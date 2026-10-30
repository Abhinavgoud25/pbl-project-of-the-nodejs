/**
 * Public Cleanliness Reporter - Core Application Logic
 * PBL Mini Project
 */

// Application State
const AppState = {
  currentView: "landing", // 'landing', 'wizard', 'success', 'reports', 'admin'
  wizardStep: 1, // 1: State, 2: District, 3: Mandal, 4: Village, 5: Problem Form
  selectedState: null,
  selectedDistrict: null,
  selectedMandal: null,
  selectedVillage: null,
  uploadedPhotoBase64: null,
  lastSubmittedReport: null,
  isAdminAuthenticated: false,
  reportsFilter: {
    search: "",
    status: "all",
    problem: "all",
    state: "all",
    district: "all"
  }
};

// ==========================================================================
// Initialization & Lifecycle
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // Ensure storage is initialized with demo data
  getStoredReports();

  // Setup navigation events
  setupNavigation();

  // Setup wizard handlers
  setupWizardEvents();

  // Setup problem form & photo upload
  setupProblemForm();

  // Setup view reports filters
  setupReportsView();

  // Setup admin panel
  setupAdminPanel();

  // Set initial view based on hash or default to landing
  const hash = window.location.hash.replace("#", "");
  if (["landing", "wizard", "reports", "admin"].includes(hash)) {
    navigateToView(hash);
  } else {
    navigateToView("landing");
  }

  // Update navbar on scroll
  window.addEventListener("scroll", () => {
    const nav = document.querySelector(".site-navbar");
    if (nav) {
      if (window.scrollY > 20) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }
  });
}

// ==========================================================================
// View Routing & Navigation
// ==========================================================================
function navigateToView(viewName) {
  AppState.currentView = viewName;
  window.location.hash = viewName;

  // Hide all view sections
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });

  // Activate target section
  const targetSection = document.getElementById(`view-${viewName}`);
  if (targetSection) {
    targetSection.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Update active navbar button
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-view") === viewName) {
      btn.classList.add("active");
    }
  });

  // Special triggers per view
  if (viewName === "wizard") {
    setupLocationDropdowns();
  } else if (viewName === "reports") {
    renderReportsFeed();
  } else if (viewName === "admin") {
    renderAdminDashboard();
  }
}

function setupNavigation() {
  // Nav buttons
  document.querySelectorAll("[data-nav-target]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const target = el.getAttribute("data-nav-target");
      if (target === "wizard-start") {
        startFreshReport();
      } else {
        navigateToView(target);
      }
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "72px";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "#ffffff";
      navLinks.style.padding = "1.5rem";
      navLinks.style.boxShadow = "var(--shadow-lg)";
    });
  }
}

function startFreshReport() {
  resetDropdowns();
  
  // Reset form
  const form = document.getElementById("cleanliness-report-form");
  if (form) form.reset();
  
  const preview = document.getElementById("image-preview-box");
  if (preview) preview.style.display = "none";
  
  const dropzone = document.getElementById("photo-dropzone");
  if (dropzone) dropzone.style.display = "block";

  const otherContainer = document.getElementById("other-problem-container");
  if (otherContainer) otherContainer.style.display = "none";

  AppState.uploadedPhotoBase64 = null;

  navigateToView("wizard");
}

// ==========================================================================
// Single-Page Location Dropdowns Logic
// ==========================================================================
function setupLocationDropdowns() {
  const selectState = document.getElementById("select-state");
  const selectDistrict = document.getElementById("select-district");
  const selectMandal = document.getElementById("select-mandal");
  const selectVillage = document.getElementById("select-village");
  const problemSection = document.getElementById("problem-reporting-section");

  if (!selectState) return;

  // Populate States if not already populated
  if (selectState.options.length <= 1) {
    let stateOptions = `<option value="">-- Choose State --</option>`;
    Object.keys(LOCATION_DATA).forEach(stateName => {
      stateOptions += `<option value="${stateName}">${stateName}</option>`;
    });
    selectState.innerHTML = stateOptions;
  }

  // Handle State Change
  selectState.onchange = () => {
    const chosenState = selectState.value;
    AppState.selectedState = chosenState || null;
    AppState.selectedDistrict = null;
    AppState.selectedMandal = null;
    AppState.selectedVillage = null;

    // Reset District, Mandal, Village
    selectDistrict.innerHTML = `<option value="">-- Choose District --</option>`;
    selectMandal.innerHTML = `<option value="">-- Choose District First --</option>`;
    selectVillage.innerHTML = `<option value="">-- Choose Mandal First --</option>`;

    selectMandal.disabled = true;
    selectVillage.disabled = true;
    if (problemSection) problemSection.style.display = "none";
    hideActivePathBanner();

    if (chosenState && LOCATION_DATA[chosenState]) {
      selectDistrict.disabled = false;
      const districts = Object.keys(LOCATION_DATA[chosenState].districts);
      let distOptions = `<option value="">-- Choose District in ${chosenState} --</option>`;
      districts.forEach(d => {
        distOptions += `<option value="${d}">${d}</option>`;
      });
      selectDistrict.innerHTML = distOptions;
      updateLocationBreadcrumb(`State: ${chosenState}`);
      updateStatusPill("Step 2: Choose District");
    } else {
      selectDistrict.disabled = true;
      updateLocationBreadcrumb("Select Location");
      updateStatusPill("Step 1: Choose State");
    }
  };

  // Handle District Change
  selectDistrict.onchange = () => {
    const chosenDistrict = selectDistrict.value;
    AppState.selectedDistrict = chosenDistrict || null;
    AppState.selectedMandal = null;
    AppState.selectedVillage = null;

    selectMandal.innerHTML = `<option value="">-- Choose Mandal / Tehsil --</option>`;
    selectVillage.innerHTML = `<option value="">-- Choose Mandal First --</option>`;
    selectVillage.disabled = true;
    if (problemSection) problemSection.style.display = "none";
    hideActivePathBanner();

    if (chosenDistrict && AppState.selectedState && LOCATION_DATA[AppState.selectedState].districts[chosenDistrict]) {
      selectMandal.disabled = false;
      const mandals = Object.keys(LOCATION_DATA[AppState.selectedState].districts[chosenDistrict].mandals);
      let mandalOptions = `<option value="">-- Choose Mandal in ${chosenDistrict} --</option>`;
      mandals.forEach(m => {
        mandalOptions += `<option value="${m}">${m}</option>`;
      });
      selectMandal.innerHTML = mandalOptions;
      updateLocationBreadcrumb(`${AppState.selectedState} › ${chosenDistrict}`);
      updateStatusPill("Step 3: Choose Mandal");
    } else {
      selectMandal.disabled = true;
      updateStatusPill("Step 2: Choose District");
    }
  };

  // Handle Mandal Change
  selectMandal.onchange = () => {
    const chosenMandal = selectMandal.value;
    AppState.selectedMandal = chosenMandal || null;
    AppState.selectedVillage = null;

    selectVillage.innerHTML = `<option value="">-- Choose Village / Ward --</option>`;
    if (problemSection) problemSection.style.display = "none";
    hideActivePathBanner();

    if (chosenMandal && AppState.selectedState && AppState.selectedDistrict) {
      selectVillage.disabled = false;
      const villages = LOCATION_DATA[AppState.selectedState].districts[AppState.selectedDistrict].mandals[chosenMandal] || [];
      let villageOptions = `<option value="">-- Choose Village / Ward in ${chosenMandal} --</option>`;
      villages.forEach(v => {
        villageOptions += `<option value="${v}">${v}</option>`;
      });
      selectVillage.innerHTML = villageOptions;
      updateLocationBreadcrumb(`${AppState.selectedState} › ${AppState.selectedDistrict} › ${chosenMandal}`);
      updateStatusPill("Step 4: Choose Village / Ward");
    } else {
      selectVillage.disabled = true;
      updateStatusPill("Step 3: Choose Mandal");
    }
  };

  // Handle Village Change -> REVEALS QUESTION TEXT BOX & SUBMIT BUTTON!
  selectVillage.onchange = () => {
    const chosenVillage = selectVillage.value;
    AppState.selectedVillage = chosenVillage || null;

    if (chosenVillage) {
      // Show problem reporting section
      if (problemSection) {
        problemSection.style.display = "block";
      }

      // Update question text to include selected village
      const displayVillage = document.getElementById("display-selected-village");
      if (displayVillage) {
        displayVillage.innerText = chosenVillage;
      }

      // Show active path banner
      showActivePathBanner();

      // Update breadcrumbs and status pill
      updateLocationBreadcrumb(`${AppState.selectedState} › ${AppState.selectedDistrict} › ${AppState.selectedMandal} › ${chosenVillage}`);
      updateStatusPill("Ready to Report Cleanliness Problem");

      // Smoothly scroll down to the problem question
      setTimeout(() => {
        if (problemSection) {
          problemSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      if (problemSection) problemSection.style.display = "none";
      hideActivePathBanner();
      updateStatusPill("Step 4: Choose Village / Ward");
    }
  };
}

function updateLocationBreadcrumb(pathText) {
  const currentLocEl = document.getElementById("breadcrumb-current-loc");
  if (currentLocEl) {
    currentLocEl.innerText = pathText;
  }
}

function updateStatusPill(text) {
  const statusEl = document.getElementById("location-status-text");
  if (statusEl) {
    statusEl.innerText = text;
  }
}

function showActivePathBanner() {
  const banner = document.getElementById("active-path-banner");
  const pathDisplay = document.getElementById("path-display-text");
  if (banner && pathDisplay) {
    pathDisplay.innerText = `${AppState.selectedState} › ${AppState.selectedDistrict} › ${AppState.selectedMandal} › ${AppState.selectedVillage}`;
    banner.style.display = "flex";
  }
}

function hideActivePathBanner() {
  const banner = document.getElementById("active-path-banner");
  if (banner) {
    banner.style.display = "none";
  }
}

function resetDropdowns() {
  AppState.selectedState = null;
  AppState.selectedDistrict = null;
  AppState.selectedMandal = null;
  AppState.selectedVillage = null;

  const selectState = document.getElementById("select-state");
  const selectDistrict = document.getElementById("select-district");
  const selectMandal = document.getElementById("select-mandal");
  const selectVillage = document.getElementById("select-village");
  const problemSection = document.getElementById("problem-reporting-section");

  if (selectState) selectState.value = "";
  if (selectDistrict) {
    selectDistrict.innerHTML = `<option value="">-- Choose State First --</option>`;
    selectDistrict.disabled = true;
  }
  if (selectMandal) {
    selectMandal.innerHTML = `<option value="">-- Choose District First --</option>`;
    selectMandal.disabled = true;
  }
  if (selectVillage) {
    selectVillage.innerHTML = `<option value="">-- Choose Mandal First --</option>`;
    selectVillage.disabled = true;
  }

  if (problemSection) problemSection.style.display = "none";
  hideActivePathBanner();
  updateLocationBreadcrumb("Select Location");
  updateStatusPill("Step 1: Choose State");
}

function setupWizardEvents() {
  // Retained for backward compatibility
}

function setupProblemForm() {
  const form = document.getElementById("cleanliness-report-form");
  const otherContainer = document.getElementById("other-problem-container");
  const otherRadio = document.querySelector('input[name="problemType"][value="other"]');
  const allRadios = document.querySelectorAll('input[name="problemType"]');

  // Toggle 'Other' input
  allRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "other" && radio.checked) {
        if (otherContainer) otherContainer.style.display = "block";
        const otherInput = document.getElementById("other-problem-input");
        if (otherInput) otherInput.focus();
      } else {
        if (otherContainer) otherContainer.style.display = "none";
      }
    });
  });

  // Setup photo upload & compression
  setupPhotoUpload();

  // Setup GPS mock detector
  const btnGps = document.getElementById("btn-mock-gps");
  if (btnGps) {
    btnGps.addEventListener("click", () => {
      btnGps.innerHTML = `⏳ Acquiring GPS...`;
      setTimeout(() => {
        const descField = document.getElementById("report-description");
        if (descField) {
          const coords = `[GPS Pinned: ${ (17.3850 + (Math.random() - 0.5) * 0.05).toFixed(4) }° N, ${ (78.4867 + (Math.random() - 0.5) * 0.05).toFixed(4) }° E] `;
          if (!descField.value.includes("GPS Pinned")) {
            descField.value = coords + descField.value;
          }
        }
        btnGps.innerHTML = `✅ Location Attached`;
        showToast("Precise GPS coordinates attached to report!", "info");
      }, 600);
    });
  }

  // Form submit handler
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleFormSubmit();
    });
  }
}

function setupPhotoUpload() {
  const fileInput = document.getElementById("photo-file-input");
  const dropzone = document.getElementById("photo-dropzone");
  const previewBox = document.getElementById("image-preview-box");
  const previewImg = document.getElementById("preview-img");
  const removeBtn = document.getElementById("btn-remove-photo");

  if (!fileInput || !dropzone) return;

  // Drag and drop handlers
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    });
  });

  dropzone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      processPhotoFile(files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processPhotoFile(e.target.files[0]);
    }
  });

  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      AppState.uploadedPhotoBase64 = null;
      fileInput.value = "";
      if (previewBox) previewBox.style.display = "none";
      if (dropzone) dropzone.style.display = "block";
    });
  }
}

// Compress image via HTML5 Canvas to safely store in localStorage without quota issues
function processPhotoFile(file) {
  if (!file.type.match(/image.*/)) {
    showToast("Please select a valid image file (PNG, JPG, WEBP).", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = (readerEvent) => {
    const image = new Image();
    image.onload = () => {
      // Resize to max 800px width/height
      const canvas = document.createElement("canvas");
      let width = image.width;
      let height = image.height;
      const maxDim = 800;

      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);

      // Quality 0.72 compression
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.72);
      AppState.uploadedPhotoBase64 = compressedDataUrl;

      // Update UI
      const previewBox = document.getElementById("image-preview-box");
      const previewImg = document.getElementById("preview-img");
      const dropzone = document.getElementById("photo-dropzone");

      if (previewImg) previewImg.src = compressedDataUrl;
      if (previewBox) previewBox.style.display = "block";
      if (dropzone) dropzone.style.display = "none";
      showToast("Photo attached and compressed successfully!");
    };
    image.src = readerEvent.target.result;
  };
  reader.readAsDataURL(file);
}

function handleFormSubmit() {
  if (!AppState.selectedVillage) {
    showToast("Please select your State, District, Mandal, and Village first.", "error");
    const selectVillage = document.getElementById("select-village");
    if (selectVillage) selectVillage.focus();
    return;
  }

  const selectedProblemRadio = document.querySelector('input[name="problemType"]:checked');
  if (!selectedProblemRadio) {
    showToast("Please choose a problem type.", "error");
    return;
  }

  const problemId = selectedProblemRadio.value;
  let problemLabel = "";
  let customText = "";

  if (problemId === "other") {
    const otherInput = document.getElementById("other-problem-input");
    customText = (otherInput ? otherInput.value.trim() : "");
    if (!customText) {
      showToast("Please specify the problem in the text box.", "error");
      if (otherInput) otherInput.focus();
      return;
    }
    problemLabel = `Other: ${customText}`;
  } else {
    const cat = PROBLEM_CATEGORIES.find(c => c.id === problemId);
    problemLabel = cat ? cat.label : problemId;
  }

  const reporterNameInput = document.getElementById("reporter-name");
  const reporterPhoneInput = document.getElementById("reporter-phone");
  const reporterEmailInput = document.getElementById("reporter-email");
  const descInput = document.getElementById("report-description");
  const severityRadio = document.querySelector('input[name="severity"]:checked');

  const reporterName = reporterNameInput ? reporterNameInput.value.trim() : "";
  const reporterPhone = reporterPhoneInput ? reporterPhoneInput.value.trim() : "";
  const reporterEmail = reporterEmailInput ? reporterEmailInput.value.trim() : "";
  const description = descInput ? descInput.value.trim() : "";
  const severity = severityRadio ? severityRadio.value : "Medium";

  if (!description) {
    showToast("Please describe the problem or landmark in the text box.", "error");
    if (descInput) descInput.focus();
    return;
  }

  if (!reporterName) {
    showToast("Please enter your name.", "error");
    if (reporterNameInput) reporterNameInput.focus();
    return;
  }

  if (!reporterPhone || reporterPhone.length < 10) {
    showToast("Please provide a valid 10-digit phone number.", "error");
    if (reporterPhoneInput) reporterPhoneInput.focus();
    return;
  }

  // Generate Report ID
  const timestamp = Date.now().toString().slice(-5);
  const randomNum = Math.floor(10 + Math.random() * 89);
  const reportId = `PCR-2026-${timestamp}${randomNum}`;

  const catObj = PROBLEM_CATEGORIES.find(c => c.id === problemId);
  const icon = catObj ? catObj.icon : "⚠️";

  const newReport = {
    id: reportId,
    createdAt: new Date().toISOString(),
    state: AppState.selectedState,
    district: AppState.selectedDistrict,
    mandal: AppState.selectedMandal,
    village: AppState.selectedVillage,
    problem: problemLabel,
    problemId: problemId,
    customProblemText: customText,
    severity: severity,
    description: description || "No detailed description provided.",
    reporterName: reporterName,
    reporterPhone: reporterPhone,
    reporterEmail: reporterEmail,
    status: "Pending",
    photoData: AppState.uploadedPhotoBase64,
    photoPlaceholderIcon: icon,
    officialRemark: "",
    resolvedAt: null
  };

  // Save to database
  const reports = getStoredReports();
  reports.unshift(newReport);
  saveStoredReports(reports);

  AppState.lastSubmittedReport = newReport;

  // Render success view
  renderSuccessView(newReport);
  navigateToView("success");
  showToast("Cleanliness report registered successfully!");
}

// ==========================================================================
// Success / Thank You Confirmation View
// ==========================================================================
function renderSuccessView(report) {
  const idEl = document.getElementById("success-report-id");
  const codeEl = document.getElementById("success-code-text");
  const detailsEl = document.getElementById("success-details-content");

  if (idEl) idEl.innerText = report.id;
  if (codeEl) codeEl.innerText = report.id;

  if (detailsEl) {
    const formattedDate = new Date(report.createdAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    detailsEl.innerHTML = `
      <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value" style="color: var(--status-pending);">🟡 Pending Verification</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Problem Category</span>
        <span class="detail-value">${report.photoPlaceholderIcon} ${report.problem}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Location</span>
        <span class="detail-value">${report.village}, ${report.mandal}, ${report.district}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Reported By</span>
        <span class="detail-value">${report.reporterName} (${report.reporterPhone})</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Submitted On</span>
        <span class="detail-value">${formattedDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Severity Level</span>
        <span class="detail-value">${report.severity}</span>
      </div>
      ${report.photoData ? `
        <div class="detail-row">
          <span class="detail-label">Evidence Photo</span>
          <span class="detail-value">Attached (1 photo)</span>
        </div>
      ` : ''}
    `;
  }

  // Setup copy ID button
  const btnCopy = document.getElementById("btn-copy-report-id");
  if (btnCopy) {
    btnCopy.onclick = () => {
      navigator.clipboard.writeText(report.id).then(() => {
        showToast("Report ID copied to clipboard!");
      }).catch(() => {
        showToast(`Report ID: ${report.id}`);
      });
    };
  }

  // Setup print / save slip button
  const btnPrint = document.getElementById("btn-print-receipt");
  if (btnPrint) {
    btnPrint.onclick = () => {
      window.print();
    };
  }
}

// ==========================================================================
// View Reports Feed (Search & Filter)
// ==========================================================================
function setupReportsView() {
  const searchInput = document.getElementById("reports-search-input");
  const filterState = document.getElementById("filter-report-state");
  const filterDistrict = document.getElementById("filter-report-district");
  const filterProblem = document.getElementById("filter-report-problem");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      AppState.reportsFilter.search = e.target.value.toLowerCase().trim();
      renderReportsFeed();
    });
  }

  // Populate state dropdown in filter
  if (filterState) {
    let opts = `<option value="all">All States</option>`;
    Object.keys(LOCATION_DATA).forEach(st => {
      opts += `<option value="${st}">${st}</option>`;
    });
    filterState.innerHTML = opts;

    filterState.addEventListener("change", (e) => {
      AppState.reportsFilter.state = e.target.value;
      // Update district dropdown
      if (filterDistrict) {
        if (e.target.value === "all") {
          filterDistrict.innerHTML = `<option value="all">All Districts</option>`;
          AppState.reportsFilter.district = "all";
        } else {
          const dists = Object.keys(LOCATION_DATA[e.target.value].districts);
          let dOpts = `<option value="all">All Districts in ${e.target.value}</option>`;
          dists.forEach(d => {
            dOpts += `<option value="${d}">${d}</option>`;
          });
          filterDistrict.innerHTML = dOpts;
        }
      }
      renderReportsFeed();
    });
  }

  if (filterDistrict) {
    filterDistrict.addEventListener("change", (e) => {
      AppState.reportsFilter.district = e.target.value;
      renderReportsFeed();
    });
  }

  if (filterProblem) {
    let pOpts = `<option value="all">All Problems</option>`;
    PROBLEM_CATEGORIES.forEach(cat => {
      pOpts += `<option value="${cat.id}">${cat.label}</option>`;
    });
    filterProblem.innerHTML = pOpts;

    filterProblem.addEventListener("change", (e) => {
      AppState.reportsFilter.problem = e.target.value;
      renderReportsFeed();
    });
  }

  // Status Filter Tabs
  document.querySelectorAll(".status-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".status-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      AppState.reportsFilter.status = btn.getAttribute("data-status");
      renderReportsFeed();
    });
  });
}

function renderReportsFeed() {
  const container = document.getElementById("reports-cards-container");
  const countBadge = document.getElementById("reports-count-badge");
  if (!container) return;

  const allReports = getStoredReports();
  const f = AppState.reportsFilter;

  const filtered = allReports.filter(rep => {
    // Status filter
    if (f.status !== "all" && rep.status.toLowerCase().replace(" ", "-") !== f.status.toLowerCase()) {
      return false;
    }

    // Problem filter
    if (f.problem !== "all" && rep.problemId !== f.problem) {
      return false;
    }

    // State filter
    if (f.state !== "all" && rep.state !== f.state) {
      return false;
    }

    // District filter
    if (f.district !== "all" && rep.district !== f.district) {
      return false;
    }

    // Keyword search
    if (f.search) {
      const q = f.search;
      const matchId = rep.id.toLowerCase().includes(q);
      const matchVillage = rep.village.toLowerCase().includes(q);
      const matchMandal = rep.mandal.toLowerCase().includes(q);
      const matchDistrict = rep.district.toLowerCase().includes(q);
      const matchReporter = rep.reporterName.toLowerCase().includes(q);
      const matchProblem = rep.problem.toLowerCase().includes(q);
      const matchDesc = rep.description.toLowerCase().includes(q);

      if (!matchId && !matchVillage && !matchMandal && !matchDistrict && !matchReporter && !matchProblem && !matchDesc) {
        return false;
      }
    }

    return true;
  });

  if (countBadge) {
    countBadge.innerHTML = `Showing <strong>${filtered.length}</strong> public reports`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-reports-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">No Reports Found</h3>
        <p class="empty-state-desc">Try clearing your filters or search term to see more reports.</p>
        <button class="btn-change-loc" onclick="resetReportFilters()" style="margin-top: 15px;">Reset All Filters</button>
      </div>
    `;
    return;
  }

  let html = "";
  filtered.forEach(rep => {
    const formattedDate = new Date(rep.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const statusClass = rep.status.toLowerCase().replace(" ", "-");
    const statusLabel = rep.status === "In Progress" ? "In Progress" : rep.status;

    html += `
      <div class="report-feed-card">
        <div class="report-card-header">
          <span class="report-tag-id">${rep.id}</span>
          <span class="badge-status ${statusClass}">
            <span class="status-pulse-dot"></span>
            ${statusLabel}
          </span>
        </div>

        <h4 class="report-problem-title">
          <span>${rep.photoPlaceholderIcon || "⚠️"}</span>
          <span>${rep.problem}</span>
        </h4>

        <div class="report-location-pill">
          <span>📍 ${rep.village}, ${rep.mandal}, ${rep.district}</span>
        </div>

        <p class="report-desc-preview">${rep.description}</p>

        <div class="report-card-media">
          ${rep.photoData ? `
            <img src="${rep.photoData}" alt="Evidence of ${rep.problem}" loading="lazy" />
          ` : `
            <div class="no-photo-badge">${rep.photoPlaceholderIcon || "📷"}</div>
          `}
        </div>

        <div class="report-card-footer">
          <span>📅 ${formattedDate}</span>
          <button class="btn-card-details" onclick="openReportDetailModal('${rep.id}')">View Details →</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function resetReportFilters() {
  AppState.reportsFilter = {
    search: "",
    status: "all",
    problem: "all",
    state: "all",
    district: "all"
  };
  const searchInput = document.getElementById("reports-search-input");
  const filterState = document.getElementById("filter-report-state");
  const filterDistrict = document.getElementById("filter-report-district");
  const filterProblem = document.getElementById("filter-report-problem");

  if (searchInput) searchInput.value = "";
  if (filterState) filterState.value = "all";
  if (filterDistrict) filterDistrict.value = "all";
  if (filterProblem) filterProblem.value = "all";

  document.querySelectorAll(".status-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-status") === "all");
  });

  renderReportsFeed();
}

// ==========================================================================
// Report Detail Inspection Modal
// ==========================================================================
function openReportDetailModal(reportId) {
  const reports = getStoredReports();
  const report = reports.find(r => r.id === reportId);
  if (!report) return;

  const modalBackdrop = document.getElementById("report-modal-backdrop");
  const modalContent = document.getElementById("report-modal-body");
  if (!modalBackdrop || !modalContent) return;

  const formattedDate = new Date(report.createdAt).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short"
  });

  const resolvedDate = report.resolvedAt ? new Date(report.resolvedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }) : null;

  const statusClass = report.status.toLowerCase().replace(" ", "-");

  modalContent.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
      <span class="report-tag-id" style="font-size: 1.1rem; padding: 6px 12px;">${report.id}</span>
      <span class="badge-status ${statusClass}" style="font-size: 0.95rem; padding: 6px 14px;">
        <span class="status-pulse-dot"></span>
        ${report.status}
      </span>
    </div>

    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
      <span>${report.photoPlaceholderIcon}</span>
      <span>${report.problem}</span>
    </h3>

    <div style="background: var(--bg-alt); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--border-light);">
      <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Location Breadcrumb</div>
      <div style="font-weight: 700; color: var(--primary-deep); font-size: 1rem;">
        ${report.state} › ${report.district} › ${report.mandal} › ${report.village}
      </div>
    </div>

    ${report.photoData ? `
      <div style="margin-bottom: 1.5rem; border-radius: var(--radius-md); overflow: hidden; max-height: 320px; border: 1px solid var(--border-light);">
        <img src="${report.photoData}" alt="Report photo" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
    ` : ''}

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1rem; margin-bottom: 6px;">Problem Description</h4>
      <p style="background: var(--bg-main); padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-light); font-size: 0.95rem; color: var(--text-main); line-height: 1.5;">
        ${report.description}
      </p>
    </div>

    <div class="success-details-list" style="margin-bottom: 1.5rem;">
      <div class="detail-row">
        <span class="detail-label">Reported By</span>
        <span class="detail-value">${report.reporterName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Contact Phone</span>
        <span class="detail-value">${report.reporterPhone ? report.reporterPhone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : 'Confidential'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date Submitted</span>
        <span class="detail-value">${formattedDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Severity Level</span>
        <span class="detail-value" style="font-weight: 800;">${report.severity}</span>
      </div>
      ${resolvedDate ? `
        <div class="detail-row">
          <span class="detail-label">Resolved At</span>
          <span class="detail-value" style="color: var(--primary);">${resolvedDate}</span>
        </div>
      ` : ''}
    </div>

    ${report.officialRemark ? `
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary-deep); margin-bottom: 4px;">
          🏛️ Official Municipal Action Remark:
        </div>
        <p style="font-size: 0.92rem; color: #065f46; margin: 0;">
          "${report.officialRemark}"
        </p>
      </div>
    ` : ''}

    <div style="display: flex; justify-content: flex-end; gap: 10px;">
      <button class="btn-change-loc" onclick="closeReportDetailModal()">Close</button>
    </div>
  `;

  modalBackdrop.classList.add("open");
}

function closeReportDetailModal() {
  const modalBackdrop = document.getElementById("report-modal-backdrop");
  if (modalBackdrop) modalBackdrop.classList.remove("open");
}

// ==========================================================================
// Admin Panel Logic & Operations
// ==========================================================================
function setupAdminPanel() {
  const loginForm = document.getElementById("admin-login-form");
  const btnQuickLogin = document.getElementById("btn-quick-admin-demo");
  const btnLogout = document.getElementById("btn-admin-logout");
  const btnExportCsv = document.getElementById("btn-export-csv");
  const btnResetData = document.getElementById("btn-reset-demo-data");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pinInput = document.getElementById("admin-pin-input");
      if (pinInput && pinInput.value.trim() === "admin123") {
        AppState.isAdminAuthenticated = true;
        renderAdminDashboard();
        showToast("Authenticated as Municipal Sanitation Admin");
      } else {
        showToast("Invalid admin passcode! Hint: admin123", "error");
      }
    });
  }

  if (btnQuickLogin) {
    btnQuickLogin.addEventListener("click", () => {
      AppState.isAdminAuthenticated = true;
      renderAdminDashboard();
      showToast("Logged in via PBL Quick Access!");
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      AppState.isAdminAuthenticated = false;
      renderAdminDashboard();
      showToast("Logged out from Admin Portal.");
    });
  }

  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", () => {
      exportReportsToCSV();
    });
  }

  if (btnResetData) {
    btnResetData.addEventListener("click", () => {
      if (confirm("Reset database to initial demo complaints? Any newly submitted test reports will be replaced with fresh demo data.")) {
        localStorage.setItem("PCR_REPORTS_DATABASE", JSON.stringify(INITIAL_DEMO_REPORTS));
        renderAdminDashboard();
        renderReportsFeed();
        showToast("Demo data reseeded successfully!");
      }
    });
  }
}

function renderAdminDashboard() {
  const authShield = document.getElementById("admin-auth-shield");
  const dashboard = document.getElementById("admin-dashboard-view");

  if (!authShield || !dashboard) return;

  if (!AppState.isAdminAuthenticated) {
    authShield.style.display = "block";
    dashboard.style.display = "none";
    return;
  }

  authShield.style.display = "none";
  dashboard.style.display = "block";

  const reports = getStoredReports();

  // Compute Metrics
  const total = reports.length;
  const pending = reports.filter(r => r.status.toLowerCase() === "pending").length;
  const progress = reports.filter(r => r.status.toLowerCase().includes("progress")).length;
  const resolved = reports.filter(r => r.status.toLowerCase() === "resolved").length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Render KPI values
  const totalEl = document.getElementById("kpi-total-reports");
  const pendingEl = document.getElementById("kpi-pending-reports");
  const progressEl = document.getElementById("kpi-progress-reports");
  const resolvedEl = document.getElementById("kpi-resolved-reports");
  const scoreEl = document.getElementById("kpi-resolution-rate");

  if (totalEl) totalEl.innerText = total;
  if (pendingEl) pendingEl.innerText = pending;
  if (progressEl) progressEl.innerText = progress;
  if (resolvedEl) resolvedEl.innerText = resolved;
  if (scoreEl) scoreEl.innerText = `${resolutionRate}%`;

  // Render Reports Table
  const tableBody = document.getElementById("admin-table-tbody");
  if (!tableBody) return;

  if (reports.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem;">No reports registered in the database.</td></tr>`;
    return;
  }

  let html = "";
  reports.forEach(rep => {
    const formattedDate = new Date(rep.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const statusClass = rep.status.toLowerCase().replace(" ", "-");

    html += `
      <tr>
        <td><strong>${rep.id}</strong></td>
        <td>${formattedDate}</td>
        <td>
          <div style="font-weight: 600;">${rep.village}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${rep.mandal}, ${rep.district}</div>
        </td>
        <td>
          <span style="font-size: 1.1rem; margin-right: 4px;">${rep.photoPlaceholderIcon || "⚠️"}</span>
          <span>${rep.problem}</span>
        </td>
        <td>
          <span class="badge-status ${statusClass}">
            <span class="status-pulse-dot"></span>
            ${rep.status}
          </span>
        </td>
        <td>
          <div>${rep.reporterName}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${rep.reporterPhone}</div>
        </td>
        <td>
          <div class="action-btn-group">
            ${rep.status !== "Resolved" ? `
              <button class="btn-admin-action resolve" onclick="adminMarkResolved('${rep.id}')">✓ Resolve</button>
            ` : `
              <span style="font-size: 0.8rem; color: var(--primary); font-weight: 700;">✓ Done</span>
            `}

            ${rep.status === "Pending" ? `
              <button class="btn-admin-action progress" onclick="adminMarkInProgress('${rep.id}')">⚡ In Progress</button>
            ` : ''}

            <button class="btn-admin-action" style="background: var(--bg-alt); color: var(--text-main);" onclick="openReportDetailModal('${rep.id}')">Inspect</button>
            <button class="btn-admin-action delete" onclick="adminDeleteReport('${rep.id}')">✕</button>
          </div>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;
}

// Admin Operations
function adminMarkResolved(reportId) {
  const remark = prompt("Enter official resolution remark (e.g. Sanitation team cleared garbage and sprayed disinfectant):", "Sanitation team visited the spot and resolved the issue.");
  if (remark === null) return; // User cancelled

  const reports = getStoredReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index !== -1) {
    reports[index].status = "Resolved";
    reports[index].officialRemark = remark.trim() || "Cleaned and resolved by municipal sanitation crew.";
    reports[index].resolvedAt = new Date().toISOString();
    saveStoredReports(reports);

    renderAdminDashboard();
    renderReportsFeed();
    showToast(`Report ${reportId} marked as RESOLVED!`);
  }
}

function adminMarkInProgress(reportId) {
  const reports = getStoredReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index !== -1) {
    reports[index].status = "In Progress";
    reports[index].officialRemark = "Sanitation task force deployed to the location.";
    saveStoredReports(reports);

    renderAdminDashboard();
    renderReportsFeed();
    showToast(`Report ${reportId} moved to IN PROGRESS!`);
  }
}

function adminDeleteReport(reportId) {
  if (confirm(`Are you sure you want to delete report ${reportId}? This action cannot be undone.`)) {
    let reports = getStoredReports();
    reports = reports.filter(r => r.id !== reportId);
    saveStoredReports(reports);

    renderAdminDashboard();
    renderReportsFeed();
    showToast(`Report ${reportId} deleted.`);
  }
}

// Export Reports to CSV
function exportReportsToCSV() {
  const reports = getStoredReports();
  if (reports.length === 0) {
    showToast("No reports to export.", "error");
    return;
  }

  const headers = ["Report ID", "Created At", "State", "District", "Mandal", "Village", "Problem", "Severity", "Reporter Name", "Reporter Phone", "Status", "Official Remark", "Resolved At"];
  
  const csvRows = [headers.join(",")];

  reports.forEach(r => {
    const row = [
      `"${r.id}"`,
      `"${r.createdAt}"`,
      `"${r.state}"`,
      `"${r.district}"`,
      `"${r.mandal}"`,
      `"${r.village}"`,
      `"${(r.problem || '').replace(/"/g, '""')}"`,
      `"${r.severity}"`,
      `"${(r.reporterName || '').replace(/"/g, '""')}"`,
      `"${r.reporterPhone}"`,
      `"${r.status}"`,
      `"${(r.officialRemark || '').replace(/"/g, '""')}"`,
      `"${r.resolvedAt || ''}"`
    ];
    csvRows.push(row.join(","));
  });

  const csvString = "\uFEFF" + csvRows.join("\r\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Public_Cleanliness_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("CSV file exported and downloaded!");
}

// ==========================================================================
// Toast Notification Utility
// ==========================================================================
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const icon = type === "error" ? "⚠️" : (type === "info" ? "ℹ️" : "✅");
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
