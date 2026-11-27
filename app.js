const $ = (selector) => document.querySelector(selector);
const panel = $("#panel");
const panelBody = $("#panelBody");

const storage = {
  get(key, fallback) {
    try { return localStorage.getItem(key) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); return true; }
    catch { return false; }
  }
};

const state = {
  time: storage.get("doudouTime", "07:00"),
  on: storage.get("doudouOn", "true") !== "false",
  room: storage.get("doudouRoom", "温馨卧室")
};

function refresh() {
  $("#alarmText").textContent = state.time;
  $("#alarmOn").checked = state.on;
  $("#repeatText").textContent = state.on
    ? "已启用 · 仅保存设置，不会实际响铃"
    : "闹钟设置已关闭";
}

function show(html) {
  panelBody.innerHTML = html;
  if (typeof panel.showModal === "function") panel.showModal();
  else panel.setAttribute("open", "");
}

function closePanel() {
  if (typeof panel.close === "function") panel.close();
  else panel.removeAttribute("open");
}

function setMood(message, short = "开心") {
  $("#mood").textContent = message;
  $("#moodShort").textContent = short;
  const feedback = $("#tabFeedback"); if (feedback) feedback.textContent = message;
}

function openAlarm() {
  show(`
    <h2>设置闹钟</h2>
    <p>选择希望豆豆叫醒你的时间</p>
    <label for="time">起床时间</label>
    <input id="time" type="time" value="${state.time}" required>
    <p class="hint">当前版本只保存闹钟时间和开关，不会在后台准时响铃。</p>
    <button id="saveAlarm" class="dialog-primary">保存设置</button>
  `);
}

function openDecorate() {
  show(`
    <h2>布置房间</h2>
    <p>选择当前房间主题</p>
    <div class="choices">
      <button data-room="温馨卧室" ${state.room === "温馨卧室" ? "aria-pressed='true'" : ""}>温馨卧室</button>
    </div>
    <p class="hint">家具摆放、拖拽和更多房间主题尚未实现。当前先保留已确认的卧室原稿。</p>
  `);
}

function openDog() {
  show(`
    <h2>豆豆</h2>
    <p>豆豆今天心情不错，正在等你陪它玩。</p>
    <button data-play="摸摸豆豆">♡ 摸摸豆豆</button>
    <button data-play="陪睡觉">☾ 陪睡觉</button>
  `);
}

const main = document.querySelector("main");
const homeSections = Array.from(main.children);
const tabPage = document.createElement("section");
tabPage.className = "info";
tabPage.style.cssText = "margin:16px 0;min-height:240px;padding:20px";
tabPage.hidden = true;
main.append(tabPage);
const hiddenStyle = document.createElement("style"); hiddenStyle.textContent = "main [hidden]{display:none!important}"; document.head.append(hiddenStyle);
let currentTab = "home";
function navigate(tab) {
  currentTab = tab;
  document.querySelectorAll(".nav button").forEach(item => {
    item.classList.toggle("active", item.dataset.tab === tab);
    if(item.dataset.tab === tab) item.setAttribute("aria-current","page");
    else item.removeAttribute("aria-current");
  });
  homeSections.forEach((section,index) => section.hidden = tab !== "home" && !(tab === "decorate" && index === 0));
  tabPage.hidden = tab === "home";
  if(tab === "alarm") tabPage.innerHTML = `<h2>闹钟</h2><p>明天起床</p><strong>${state.time}</strong><p><label>起床时间 <input id="time" type="time" value="${state.time}"></label></p><p><label><input type="checkbox" id="pageAlarmOn" ${state.on?"checked":""}> 启用闹钟</label></p><button id="saveAlarm" class="dialog-primary">保存设置</button><p class="hint">目前仅保存设置，尚不支持实际响铃。</p><p id="tabFeedback" role="status"></p>`;
  if(tab === "decorate") tabPage.innerHTML = '<h2>布置房间</h2><p>当前房间：温馨卧室</p><button data-room="温馨卧室" aria-pressed="true">温馨卧室</button><p>家具选择与拖拽尚未实现。</p><p id="tabFeedback" role="status"></p>';
  if(tab === "dog") tabPage.innerHTML = '<h2>豆豆</h2><p id="tabFeedback" role="status">豆豆正在等你陪它玩。</p><div class="chips"><button data-play="摸摸豆豆">♡ 摸摸豆豆</button><button data-play="陪玩球">⚽ 陪玩球</button><button data-play="喂零食">🦴 喂零食</button><button data-play="陪睡觉">☾ 陪睡觉</button></div>';
  window.scrollTo(0,0);
}
document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    navigate(button.dataset.tab);
  });
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.id === "saveAlarm") {
    const input = $("#time");
    if (!input || !input.value) {
      input?.focus();
      return;
    }
    state.time = input.value;
    const toggle = $("#pageAlarmOn"); if(toggle) { state.on = toggle.checked; storage.set("doudouOn", String(state.on)); }
    storage.set("doudouTime", state.time);
    refresh();
    closePanel();
    if(currentTab === "alarm") navigate("alarm");
    setMood("豆豆记住了你的起床时间。", "准备好了");
  }

  if (target.dataset.room) {
    state.room = target.dataset.room;
    storage.set("doudouRoom", state.room);
    $(".room-label span").textContent = state.room + "⌄";
    if($("#tabFeedback")) $("#tabFeedback").textContent = "已选择温馨卧室";
    closePanel();
  }

  if (target.dataset.play) {
    setMood("豆豆很开心！" + target.dataset.play + "成功～", "超开心");
    closePanel();
  }
});

$("#alarmOn").addEventListener("change", (event) => {
  state.on = event.target.checked;
  storage.set("doudouOn", String(state.on));
  refresh();
});

$("#dog").addEventListener("click", () => {
  setMood("汪！豆豆蹭了蹭你的手～", "超开心");
});

$("#reminderButton").addEventListener("click", () => {
  show("<h2>提醒</h2><p>当前版本尚未接入系统通知。闹钟页面可以保存起床时间，但不会主动推送提醒。</p>");
});

$("#settingsButton").addEventListener("click", () => {
  show("<h2>设置</h2><p>豆豆的家 · 第一阶段交互原型</p><p class='hint'>设置保存在当前浏览器本地。清除 Safari 网站数据后会被清除。</p>");
});

$("#closePanel").addEventListener("click", closePanel);
panel.addEventListener("click", (event) => {
  if (event.target === panel) closePanel();
});

refresh();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
