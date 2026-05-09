const STORE_KEY = "stress-release-dog-app-v3";

const triggers = [
  { id: "siren", label: "אזעקה או רעש פתאומי", icon: "siren", load: 28 },
  { id: "guests", label: "אורחים נכנסו", icon: "users", load: 18 },
  { id: "walk", label: "טיול עמוס בגירויים", icon: "route", load: 16 },
  { id: "alone", label: "נשאר לבד", icon: "home", load: 16 },
  { id: "dog", label: "כלב נבח מאחורי גדר", icon: "dog", load: 14 },
  { id: "panting", label: "התנשפות במנוחה", icon: "alert", load: 28, medical: true }
];

const releases = [
  { id: "sniff", label: "הליכת הרחה", icon: "nose", relief: 18 },
  { id: "lick", label: "ליקוק או קונג", icon: "kong", relief: 16 },
  { id: "tear", label: "קריעת גליל קרטון", icon: "roll", relief: 16 },
  { id: "search", label: "פיזור מזון וחיפוש", icon: "spark", relief: 14 },
  { id: "play", label: "משחק רגוע", icon: "ball", relief: 8 },
  { id: "rest", label: "מנוחה שקטה", icon: "moon", relief: 12 }
];

const protocols = [
  {
    id: "sniff",
    title: "פרוטוקול הליכת הרחה",
    time: "20-30 דקות",
    when: "אחרי טיול עמוס, מפגש מתוח או יום עם הרבה גירויים.",
    steps: ["בחרו מסלול שקט ורגוע.", "השתמשו ברצועה ארוכה יחסית.", "תנו לכלב להוביל את הקצב ולהריח בלי לזרז.", "אל תמשכו אותו מתוך ריח שהוא חוקר."]
  },
  {
    id: "lick",
    title: "פרוטוקול רוגע מנטלי",
    time: "10-20 דקות",
    when: "כשקשה לכלב לשכב, אחרי אורחים או לפני זמן מנוחה.",
    steps: ["מרחו מזון רטוב על משטח ליקוק או מלאו קונג.", "אפשר להקפיא כדי להאריך את משך הפעולה.", "הניחו במקום שקט בלי דרישות ובלי פקודות.", "חפשו נשימה איטית וגוף רך יותר."]
  },
  {
    id: "tear",
    title: "פרוטוקול פירוק וקריעה",
    time: "5-10 דקות",
    when: "אחרי אזעקה, תסכול, רעש חזק או התרגשות.",
    steps: ["הכניסו חטיפים ריחניים לגליל נייר טואלט ריק.", "קפלו את הקצוות פנימה.", "תנו לכלב לקרוע ולחלץ את האוכל בצורה בטוחה.", "אספו חתיכות אם הכלב נוטה לבלוע קרטון."]
  }
];

const signals = [
  ["ליקוק שפתיים", "תנועת לשון מהירה כשהאוכל אינו חלק מהסיטואציה."],
  ["פיהוק שאינו מעייפות", "פיהוק בסיטואציה חברתית מתוחה יכול להיות סימן לחץ."],
  ["הסטת מבט או סיבוב ראש", "הכלב מנסה להימנע מקונפליקט ומבקש מרחב."],
  ["עיני לוויתן", "רואים את הלבן של העין בזמן דריכות או קיפאון."],
  ["ניעור הגוף", "התנערות אחרי התרחקות מאירוע מתוח היא פריקת אדרנלין טבעית."]
];

const questions = [
  { id: "recovery", q: "כמה זמן לוקח לו להירגע אחרי אירוע מסעיר?", options: [["פחות מ-20 דקות", 4], ["עד שעה", 10], ["כמה שעות", 20]] },
  { id: "signals", q: "כמה סימני לחץ מוקדמים אתם רואים ביום רגיל?", options: [["כמעט לא", 3], ["כמה פעמים", 10], ["הרבה", 18]] },
  { id: "rest", q: "האם הוא מצליח לשכב ולנוח מעצמו?", options: [["כן", 2], ["לפעמים", 10], ["כמעט לא", 18]] },
  { id: "alarms", q: "האם היו היום אזעקות או רעשים פתאומיים?", options: [["לא", 0], ["אירוע אחד", 16], ["יותר מאחד", 26]] }
];

let state = loadState();

function loadState() {
  const fallback = {
    tab: "home",
    logMode: "trigger",
    selectedProtocol: "sniff",
    dogName: "לולי",
    answers: { recovery: 10, signals: 10, rest: 10, alarms: 0 },
    events: [
      { id: 1, time: "07:30", type: "release", key: "sniff", note: "הליכת הרחה שקטה" },
      { id: 2, time: "11:00", type: "trigger", key: "guests", note: "אורחים נכנסו הביתה" },
      { id: 3, time: "11:20", type: "release", key: "lick", note: "קונג קפוא בסלון" }
    ]
  };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") };
  } catch {
    return fallback;
  }
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function now() {
  return new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

function icon(name) {
  const paths = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M10 20v-6h4v6"/>',
    dog: '<path d="M5 11c0-2 1.5-4 4-4h4c2.5 0 5 2.5 5 5v3"/><path d="M7 11v7"/><path d="M15 12v6"/><path d="M8 7 6 4"/><path d="M14 7l2-3"/><circle cx="10" cy="10" r=".4"/>',
    route: '<path d="M5 18c3-5 11 1 14-7"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="11" r="2"/>',
    nose: '<path d="M7 14c0-4 3-8 7-8 3 0 5 2 5 5 0 4-3 7-7 7H7z"/><path d="M4 18h8"/><path d="M16 11h.01"/>',
    kong: '<path d="M10 4h4l1 5-1.5 2 2.5 5-2 4h-4l-2-4 2.5-5L9 9z"/><path d="M10 9h5M9 16h6"/>',
    roll: '<path d="M7 7h9a4 4 0 0 1 0 8H7z"/><ellipse cx="7" cy="11" rx="3" ry="4"/><path d="M7 9v4"/>',
    ball: '<circle cx="12" cy="12" r="8"/><path d="M5 10c5 1 8 4 10 9"/><path d="M13 4c1 5 4 8 8 10"/>',
    moon: '<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 7 7 0 1 0 20 15.5z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.8"/>',
    siren: '<path d="M7 18v-5a5 5 0 0 1 10 0v5"/><path d="M5 18h14"/><path d="M12 3v2M4 6l2 2M20 6l-2 2"/><path d="M9 13h6"/>',
    alert: '<path d="M12 3 2.8 20h18.4z"/><path d="M12 9v5M12 17h.01"/>',
    spark: '<path d="m12 3 1.7 5.2L19 10l-5.3 1.8L12 17l-1.7-5.2L5 10l5.3-1.8z"/>',
    cup: '<path d="M7 4h10l-1.2 16H8.2z"/><path d="M7.6 8h8.8"/><path d="M8.4 16h7.2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'
  };
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;
}

function score() {
  const questionnaire = Object.values(state.answers).reduce((sum, value) => sum + Number(value), 0);
  const events = state.events.reduce((sum, event) => {
    if (event.type === "trigger") return sum + (triggers.find((item) => item.id === event.key)?.load || 10);
    return sum - (releases.find((item) => item.id === event.key)?.relief || 8);
  }, 0);
  return Math.max(0, Math.min(100, 32 + questionnaire + events));
}

function advice(value) {
  if (state.events.some((event) => event.key === "panting")) return "יש סימן חריג כמו התנשפות במנוחה. קודם כל שוללים כאב או בעיה רפואית אצל וטרינר.";
  if (state.events.some((event) => event.key === "siren")) return "אחרי אזעקה הגוף מלא אדרנלין. צאו לסיבוב צרכים קצר ושקט, אפשרו רחרוח ואז תנו גליל קרטון או ליקוק.";
  if (value >= 75) return "הכוס כמעט מלאה. היום לא מוסיפים משמעת. קודם מורידים עומס עם הרחה, ליקוק ומנוחה.";
  if (value >= 45) return "זה יום בינוני. בחרו פריקה איטית אחת עכשיו ועוד נקודת התאוששות אחרי הטריגר הבא.";
  return "המערכת פנויה יותר ללמידה. עדיין שומרים על פריקה יזומה כדי שהכוס לא תתמלא מחדש.";
}

function itemByEvent(event) {
  return event.type === "trigger" ? triggers.find((item) => item.id === event.key) : releases.find((item) => item.id === event.key);
}

function addEvent(key) {
  const source = state.logMode === "trigger" ? triggers : releases;
  const item = source.find((entry) => entry.id === key);
  state.events = [{ id: Date.now(), time: now(), type: state.logMode, key, note: item.label }, ...state.events].slice(0, 10);
  save();
  render();
}

function renderHeader() {
  const nav = [["home", "דף הבית", "home"], ["learn", "מה זה מתח", "info"], ["signals", "סימני לחץ", "spark"], ["protocols", "פרוטוקולים", "route"], ["emergency", "אחרי אזעקה", "siren"], ["log", "מעקב", "cup"]];
  return `<header class="topbar"><div class="brand"><span class="mark">${icon("dog")}</span><div><h1>פריקת מתח לכלבים</h1><p>קודם מורידים עומס, אחר כך מחנכים</p></div></div><nav class="nav">${nav.map(([id, label, glyph]) => `<button class="${state.tab === id ? "active" : ""}" data-tab="${id}">${icon(glyph)}<span>${label}</span></button>`).join("")}</nav><div class="dog-pill"><strong>${state.dogName}</strong><span>תוכנית מותאמת להיום</span></div></header>`;
}

function renderCup(value) {
  return `<div class="cup-widget"><div class="cup" style="--fill:${value}%"><span></span></div><div class="cup-score"><small>כוס המתח</small><strong>${value}%</strong><em>${value >= 75 ? "עומס גבוה" : value >= 45 ? "בינוני" : "רגוע יחסית"}</em></div></div>`;
}

function renderPlanner() {
  const value = score();
  const plan = value >= 75
    ? [["עכשיו", "מרחב שקט והרחקה מהגורם המלחיץ"], ["עוד 20 דקות", "ליקוק או גליל קרטון עם חטיפים"], ["ערב", "הליכת הרחה קצרה בלי מפגשים צפופים"]]
    : value >= 45
      ? [["עכשיו", "חיפוש חטיפים איטי בבית"], ["אחרי טריגר", "עצירת רחרוח ארוכה"], ["לפני שינה", "קונג או משטח ליקוק"]]
      : [["בוקר", "טיול הרחה חופשי"], ["צהריים", "מנוחה ללא דרישות"], ["ערב", "משחק רגוע ותרגול קצר"]];
  return `<section class="panel planner"><span class="label">האלון היומי</span><h3>תוכנית מותאמת לעומס הנוכחי</h3>${plan.map(([time, text]) => `<div class="plan-row"><b>${time}</b><p>${text}</p></div>`).join("")}</section>`;
}

function renderAssessment() {
  return `<section class="panel"><span class="label">אבחון עומס מצטבר</span><h3>ארבע שאלות שמעדכנות את ההמלצה</h3><div class="questions">${questions.map((q) => `<article><p>${q.q}</p><div class="segments">${q.options.map(([label, value]) => `<button class="${state.answers[q.id] === value ? "selected" : ""}" data-answer="${q.id}" data-value="${value}">${label}</button>`).join("")}</div></article>`).join("")}</div></section>`;
}

function renderHome() {
  const value = score();
  return `<section class="panel hero"><div><span class="label">מערכת חכמה לפי המדריך</span><h2>כוס המתח של ${state.dogName} נמצאת עכשיו ב-${value}%</h2><p>${advice(value)}</p><div class="actions"><button class="btn primary" data-tab="protocols">${icon("route")}בחר פריקה מתאימה</button><button class="btn ghost" data-tab="log">${icon("plus")}רשום אירוע</button></div></div>${renderCup(value)}</section><section class="notice">${icon("check")}<p>מתח הוא מצב שבו הגוף מוכן להתמודד עם רעש, כלב, יציאה משגרה או אירוע מאיים. כשהדריכות הופכת ליומיומית בלי מנוחה, הכוס מתמלאת והכלב פועל מתוך הישרדות.</p></section><section class="grid">${renderPlanner()}${renderAssessment()}</section><section class="panel"><span class="label">כלים טבעיים להורדת דופק</span><h3>בחרו פעולה איטית: הרחה, ליקוק, לעיסה, קריעה או משחק רגוע</h3><div class="cards">${releases.slice(0, 5).map((item) => `<article><span>${icon(item.icon)}</span><h4>${item.label}</h4><p>פעולה שמרוקנת עומס בלי להוסיף אדרנלין.</p><button data-tab="protocols" data-protocol="${item.id === "tear" ? "tear" : item.id === "lick" ? "lick" : "sniff"}">פתח</button></article>`).join("")}</div></section>`;
}

function renderLearn() {
  return `<section class="panel article"><span class="label">הבסיס המקצועי</span><h2>מהי פריקת מתח?</h2><p>פריקת מתח היא עזרה יזומה למערכת העצבים לחזור למצב שבו הכלב מסוגל לנוח, ללמוד ולהקשיב. כלב מוצף לא עושה דווקא; ההתנהגות שלו היא שפה שמספרת על עומס רגשי.</p><div class="text-grid"><article><h3>כוס המתח</h3><p>חשיפות תכופות ממלאות את הכוס טיפה אחר טיפה: משאית אשפה, ריצה לממ"ד, אורחים בערב או כלב שנובח מאחורי גדר.</p></article><article><h3>לא רק להוציא מרץ</h3><p>כדור וריצה מעלים דופק ואדרנלין. להרגעה נעדיף פעולות איטיות: הרחה, ליקוק, לעיסה, פירוק ומשחק רגוע.</p></article><article><h3>איך יודעים שזה עובד?</h3><p>קצב הנשימה יורד, הגוף נהיה רך, יש פחות תנועה חסרת שקט והכלב מתחיל לשכב ולנוח מעצמו.</p></article><article><h3>מתי קודם וטרינר?</h3><p>חוסר שקט חריג, התנשפות במנוחה או מתח פתאומי מחייבים שלילה רפואית. כאב יכול להיראות כמו סטרס.</p></article></div></section>`;
}

function renderSignals() {
  return `<section class="panel"><span class="label">קריאת שפת גוף</span><h2>סימנים מוקדמים לפני הצפה</h2><div class="signal-list">${signals.map(([title, body]) => `<article><h3>${title}</h3><p>${body}</p></article>`).join("")}</div></section>`;
}

function renderProtocols() {
  const selected = protocols.find((p) => p.id === state.selectedProtocol) || protocols[0];
  return `<section class="panel"><span class="label">תרגילים ליישום מידי</span><h2>פרוטוקולים להורדת עומס</h2><div class="protocol-layout"><div class="protocol-menu">${protocols.map((p) => `<button class="${selected.id === p.id ? "active" : ""}" data-protocol="${p.id}">${p.title}</button>`).join("")}</div><article class="protocol"><h3>${selected.title}</h3><p><strong>${selected.time}</strong> · ${selected.when}</p><ol>${selected.steps.map((step) => `<li>${step}</li>`).join("")}</ol><button class="btn primary" data-complete="${selected.id}">${icon("check")}סמן שבוצע עכשיו</button></article></div></section><section class="notice amber">${icon("alert")}<p>אל תעשו את כל התרגילים ביום אחד. בחרו כלי אחד או שניים ותנו לכלב זמן לנוח ולעכל.</p></section>`;
}

function renderEmergency() {
  return `<section class="panel emergency"><span class="label">התאוששות חירום</span><h2>איך לעזור לכלב אחרי אזעקה</h2><div class="steps"><article><b>1</b><h3>סיבוב צרכים קצר</h3><p>קרוב לבית, שקט, בלי מפגשים מיותרים.</p></article><article><b>2</b><h3>רחרוח בלי לזרז</h3><p>ההרחה מורידה דופק ומחזירה את הכלב לכאן ועכשיו.</p></article><article><b>3</b><h3>קריעה או ליקוק</h3><p>גליל קרטון עם חטיפים, קונג או משטח ליקוק לפריקה בטוחה.</p></article></div><button class="btn danger" data-siren>${icon("siren")}הפעל פרוטוקול אחרי אזעקה</button></section>`;
}

function renderLog() {
  const items = state.logMode === "trigger" ? triggers : releases;
  return `<section class="grid log-grid"><section class="panel"><span class="label">רישום אירוע</span><h2>מה קרה עכשיו?</h2><div class="mode"><button class="${state.logMode === "trigger" ? "active" : ""}" data-mode="trigger">טריגר עומס</button><button class="${state.logMode === "release" ? "active" : ""}" data-mode="release">פריקה מרגיעה</button></div><div class="event-grid">${items.map((item) => `<button class="${item.medical ? "medical" : ""}" data-add="${item.id}">${icon(item.icon)}<span>${item.label}</span></button>`).join("")}</div></section><section class="panel"><span class="label">מעקב אחרון</span><h2>איך הכוס התמלאה והתרוקנה</h2><div class="timeline">${state.events.map((event) => { const item = itemByEvent(event); return `<article class="${event.type}"><time>${event.time}</time><span>${icon(item.icon)}</span><div><strong>${item.label}</strong><p>${event.type === "trigger" ? "הוסיף עומס לכוס" : "עזר לרוקן את הכוס"}</p></div></article>`; }).join("")}</div></section></section>`;
}

function renderContent() {
  if (state.tab === "learn") return renderLearn();
  if (state.tab === "signals") return renderSignals();
  if (state.tab === "protocols") return renderProtocols();
  if (state.tab === "emergency") return renderEmergency();
  if (state.tab === "log") return renderLog();
  return renderHome();
}

function render() {
  document.getElementById("app").innerHTML = `<div class="app-shell">${renderHeader()}<main class="layout"><section class="main">${renderContent()}</section><aside class="side">${renderPlanner()}<section class="panel mistakes"><span class="label">טעויות נפוצות</span><h3>מה לא לעשות?</h3><details open><summary>לזרוק כדור שוב ושוב לכלב לחוץ</summary><p>זה עלול להעלות אדרנלין. העדיפו עבודת אף, ליקוק ולעיסה.</p></details><details><summary>להעמיס תרגילים</summary><p>מערכת העצבים צריכה זמן. פעולה אחת טובה עדיפה על הרבה גירויים.</p></details><details><summary>להתעלם מעומס מצטבר</summary><p>מתח כרוני מוריד סף תגובה, פוגע בלמידה ועלול להשפיע על הבריאות.</p></details></section><section class="panel contact"><h3>הכלב מתקשה להירגע?</h3><p>אם יש נביחות רבות, פאניקה בטיול או קושי להישאר לבד, כדאי לבנות תוכנית אישית.</p><a class="btn primary" href="https://wa.me/972" target="_blank" rel="noreferrer">שליחת הודעת וואטסאפ לשימי</a></section></aside></main></div>`;
  bind();
}

function bind() {
  document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => {
    state.tab = button.dataset.tab;
    if (button.dataset.protocol) state.selectedProtocol = button.dataset.protocol;
    save();
    render();
  }));
  document.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => {
    state.answers[button.dataset.answer] = Number(button.dataset.value);
    save();
    render();
  }));
  document.querySelectorAll("[data-protocol]").forEach((button) => button.addEventListener("click", () => {
    state.selectedProtocol = button.dataset.protocol;
    state.tab = "protocols";
    save();
    render();
  }));
  document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => {
    state.logMode = button.dataset.mode;
    save();
    render();
  }));
  document.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () => addEvent(button.dataset.add)));
  document.querySelectorAll("[data-complete]").forEach((button) => button.addEventListener("click", () => {
    state.logMode = "release";
    addEvent(button.dataset.complete === "tear" ? "tear" : button.dataset.complete === "lick" ? "lick" : "sniff");
  }));
  document.querySelectorAll("[data-siren]").forEach((button) => button.addEventListener("click", () => {
    state.events = [
      { id: Date.now(), time: now(), type: "trigger", key: "siren", note: "אזעקה" },
      { id: Date.now() + 1, time: now(), type: "release", key: "sniff", note: "סיבוב צרכים ורחרוח" },
      { id: Date.now() + 2, time: now(), type: "release", key: "tear", note: "גליל קרטון עם חטיפים" },
      ...state.events
    ].slice(0, 10);
    state.tab = "log";
    save();
    render();
  }));
}

render();
