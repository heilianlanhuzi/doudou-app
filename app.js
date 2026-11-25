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

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav button").forEach((item) =>
      item.classList.toggle("active", item === button)
    );
    const tab = button.dataset.tab;
    if (tab === "alarm") openAlarm();
    if (tab === "decorate") openDecorate();
    if (tab === "dog") openDog();
    if (tab === "home") closePanel();
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
    storage.set("doudouTime", state.time);
    refresh();
    closePanel();
    setMood("豆豆记住了你的起床时间。", "准备好了");
  }

  if (target.dataset.room) {
    state.room = target.dataset.room;
    storage.set("doudouRoom", state.room);
    $(".room-label span").textContent = state.room + "⌄";
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
