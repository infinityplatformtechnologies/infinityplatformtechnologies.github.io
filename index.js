const APP_CATALOG = [
  {
    id: "android",
    name: "Android",
    status: "Live",
    summary: "Practical mobile utilities available on Google Play.",
    storeLabel: "View on Google Play",
    availability: "Available on Google Play",
    apps: [
      {
        name: "QR Barcode ScanMaster",
        type: "QR & Barcode Scanner",
        description: "Scan QR codes and barcodes quickly with a clean and simple scanner experience.",
        icon: "/qr-barcode-scanmaster/app-icon.png",
        storeUrl: "https://play.google.com/store/apps/details?id=com.qrbarcodescanmaster.app",
        privacyUrl: "/qr-barcode-scanmaster/privacy-policy.html"
      },
      {
        name: "Secure Status Saver",
        type: "Status Saver",
        description: "Save, view, and manage image and video statuses in one organized mobile app.",
        icon: "/secure-status-saver/app-icon.png",
        storeUrl: "https://play.google.com/store/apps/details?id=com.securestatussaver.app",
        privacyUrl: "/secure-status-saver/privacy-policy.html"
      },
      {
        name: "Clipboard History Manager",
        type: "Clipboard Tool",
        description: "Manage copied text and clipboard history with a focused and easy-to-use interface.",
        icon: "/clipboard-history-manager/app-icon.png",
        storeUrl: "https://play.google.com/store/apps/details?id=com.clipboardhistorymanager.app",
        privacyUrl: "/clipboard-history-manager/privacy-policy.html"
      },
      {
        name: "Compress Image",
        type: "Image Compressor",
        description: "Compress photos, reduce image file size, and save storage with a simple workflow.",
        icon: "/compress-image/app-icon.png",
        storeUrl: "https://play.google.com/store/apps/details?id=com.compressimage.app",
        privacyUrl: "/compress-image/privacy-policy.html"
      },
      {
        name: "Flash Alerts",
        type: "Flash Notifications",
        description: "Get flashlight alerts for calls, SMS, and app notifications with simple controls.",
        icon: "/flash-alerts/app-icon.png",
        storeUrl: "https://play.google.com/store/apps/details?id=com.flashalertss.app",
        privacyUrl: "/flash-alerts/privacy-policy.html"
      }
    ]
  }
];

async function loadPartial(targetId, filePath) {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}`);
    }

    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem("site-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  const root = document.documentElement;
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  root.setAttribute("data-theme", theme);
  localStorage.setItem("site-theme", theme);

  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19";
  }

  if (themeText) {
    themeText.textContent = theme === "dark" ? "Light" : "Dark";
  }
}

function setupThemeToggle() {
  const toggleButton = document.getElementById("themeToggle");

  if (!toggleButton) {
    return;
  }

  toggleButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
  });
}

function getPrimaryPlatform() {
  return APP_CATALOG.find((platform) => platform.apps.length > 0) || APP_CATALOG[0];
}

function getTotalApps() {
  return APP_CATALOG.reduce((count, platform) => count + platform.apps.length, 0);
}

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

function renderHeroAppList() {
  const totalApps = document.getElementById("totalApps");
  const heroAppList = document.getElementById("heroAppList");
  const platform = getPrimaryPlatform();

  if (totalApps) {
    const count = getTotalApps();
    totalApps.textContent = `${count} ${count === 1 ? "app" : "apps"}`;
  }

  if (!heroAppList || !platform) {
    return;
  }

  heroAppList.innerHTML = "";

  platform.apps.forEach((app) => {
    const item = createElement("a", "hero-app-item");
    item.href = app.storeUrl;
    item.target = "_blank";
    item.rel = "noopener noreferrer";
    item.innerHTML = `
      <img src="${app.icon}" width="512" height="512" alt="${app.name} app icon" loading="lazy" />
      <span>
        <strong>${app.name}</strong>
        <small>${app.type}</small>
      </span>
    `;

    heroAppList.appendChild(item);
  });
}

function renderApps() {
  const platform = getPrimaryPlatform();
  const grid = document.getElementById("appsGrid");
  const title = document.getElementById("activePlatformTitle");
  const meta = document.getElementById("activePlatformMeta");

  if (title && platform) {
    title.textContent = `${platform.name} apps`;
  }

  if (meta && platform) {
    meta.textContent = platform.availability;
  }

  if (!grid || !platform) {
    return;
  }

  grid.innerHTML = "";

  platform.apps.forEach((app) => {
    const card = createElement("article", "app-card");
    card.innerHTML = `
      <div class="app-header">
        <img class="app-icon" src="${app.icon}" width="512" height="512" alt="${app.name} app icon" loading="lazy" />
        <div class="app-info">
          <h3>${app.name}</h3>
          <span>${app.type}</span>
        </div>
      </div>
      <p>${app.description}</p>
      <div class="app-actions">
        <a class="store-btn" href="${app.storeUrl}" target="_blank" rel="noopener noreferrer">${platform.storeLabel}</a>
        <a class="policy-link" href="${app.privacyUrl}">Privacy details</a>
      </div>
    `;

    grid.appendChild(card);
  });
}

function initCatalog() {
  renderHeroAppList();
  renderApps();
}

async function initPage() {
  applyTheme(getInitialTheme());
  initCatalog();

  await Promise.all([
    loadPartial("site-header", "/header.html"),
    loadPartial("site-footer", "/footer.html")
  ]);

  setupThemeToggle();
  applyTheme(document.documentElement.getAttribute("data-theme") || getInitialTheme());
}

initPage();
