import {
  journalPrompts,
  meditations,
  morningTasks,
  podcasts,
  tarotCards,
  weeklyJoyActivities
} from "./data.mjs";
import {
  buildStampSlots,
  getCompletionCount,
  getTodayKey,
  pickByIndex,
  toggleCompletion
} from "./ritual-engine.mjs";
import { createMemoryStorage, loadJson, removeJson, saveJson } from "./storage.mjs";

const storage = safeStorage();
const todayKey = getTodayKey();
const stateKey = `morning-ritual:${todayKey}`;
const weeklyKey = "morning-ritual:weekly-joy";

const defaultState = {
  promptIndex: 0,
  tarotIndex: null,
  tarotShuffleCount: 0,
  meditationId: meditations[0].id,
  podcastId: podcasts[0].id,
  completedTasks: {}
};

let state = {
  ...defaultState,
  ...loadJson(storage, stateKey, defaultState)
};

let weeklyState = loadJson(storage, weeklyKey, {});

const elements = {
  todayLabel: document.querySelector("#today-label"),
  promptCategory: document.querySelector("#prompt-category"),
  promptText: document.querySelector("#prompt-text"),
  newPrompt: document.querySelector("#new-prompt"),
  shuffleTarot: document.querySelector("#shuffle-tarot"),
  pullTarot: document.querySelector("#pull-tarot"),
  tarotResult: document.querySelector("#tarot-result"),
  meditationOptions: document.querySelector("#meditation-options"),
  podcastOptions: document.querySelector("#podcast-options"),
  morningTaskList: document.querySelector("#morning-task-list"),
  morningStamps: document.querySelector("#morning-stamps"),
  joyStamps: document.querySelector("#joy-stamps"),
  resetRitual: document.querySelector("#reset-ritual")
};

function safeStorage() {
  try {
    const testKey = "__morning_ritual_test__";
    window.localStorage.setItem(testKey, "ok");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return createMemoryStorage();
  }
}

function persist() {
  saveJson(storage, stateKey, state);
  saveJson(storage, weeklyKey, weeklyState);
}

function renderPrompt() {
  const prompt = pickByIndex(journalPrompts, state.promptIndex);
  elements.promptCategory.textContent = prompt.category;
  elements.promptText.textContent = prompt.text;
}

function renderTarot() {
  if (state.tarotIndex === null) {
    elements.tarotResult.innerHTML = `
      <p class="tarot-name">Ready to pull</p>
      <p>Shuffle, pull one card, and use it as a reflection question.</p>
    `;
    return;
  }

  const card = pickByIndex(tarotCards, state.tarotIndex);
  elements.tarotResult.innerHTML = `
    <p class="tarot-name">${card.name}</p>
    <p><strong>${card.meaning}</strong></p>
    <p>${card.reflection}</p>
  `;
}

function renderChoices(container, items, selectedId, onSelect) {
  container.innerHTML = "";

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.setAttribute("aria-pressed", String(item.id === selectedId));
    button.textContent = formatChoiceLabel(item);
    button.addEventListener("click", () => onSelect(item.id));
    container.append(button);
  });
}

function formatChoiceLabel(item) {
  if ("durationMinutes" in item) {
    return `${item.durationMinutes} min · ${item.title}`;
  }

  if ("mood" in item) {
    return `${item.title} · ${item.mood}`;
  }

  return item.label;
}

function renderTasks() {
  elements.morningTaskList.innerHTML = "";

  morningTasks.forEach((task) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "task-button";
    button.setAttribute("aria-pressed", String(Boolean(state.completedTasks[task.id])));
    button.textContent = task.label;
    button.addEventListener("click", () => {
      state.completedTasks = toggleCompletion(state.completedTasks, task.id);
      persist();
      render();
    });
    elements.morningTaskList.append(button);
  });
}

function renderStampGrid(container, items, completed, onToggle) {
  container.innerHTML = "";

  buildStampSlots(items, completed).forEach((slot) => {
    const item = items.find((candidate) => candidate.id === slot.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = slot.stamped ? "stamp is-stamped" : "stamp";
    button.setAttribute("aria-pressed", String(slot.stamped));
    button.textContent = slot.stamped ? `${item.label} ✓` : item.label;
    button.addEventListener("click", () => onToggle(item.id));
    container.append(button);
  });
}

function render() {
  elements.todayLabel.textContent = `Morning ritual · ${todayKey}`;
  renderPrompt();
  renderTarot();
  renderChoices(elements.meditationOptions, meditations, state.meditationId, (id) => {
    state.meditationId = id;
    persist();
    render();
  });
  renderChoices(elements.podcastOptions, podcasts, state.podcastId, (id) => {
    state.podcastId = id;
    persist();
    render();
  });
  renderTasks();
  renderStampGrid(elements.morningStamps, morningTasks, state.completedTasks, (id) => {
    state.completedTasks = toggleCompletion(state.completedTasks, id);
    persist();
    render();
  });
  renderStampGrid(elements.joyStamps, weeklyJoyActivities, weeklyState, (id) => {
    weeklyState = toggleCompletion(weeklyState, id);
    persist();
    render();
  });

  document.documentElement.style.setProperty("--completion-count", getCompletionCount(state.completedTasks));
}

elements.newPrompt.addEventListener("click", () => {
  state.promptIndex += 1;
  persist();
  render();
});

elements.shuffleTarot.addEventListener("click", () => {
  state.tarotShuffleCount += 1;
  state.tarotIndex = null;
  elements.tarotResult.classList.add("is-shuffling");
  window.setTimeout(() => {
    elements.tarotResult.classList.remove("is-shuffling");
    persist();
    render();
  }, 300);
});

elements.pullTarot.addEventListener("click", () => {
  state.tarotIndex = state.tarotShuffleCount + new Date().getSeconds();
  persist();
  render();
});

elements.resetRitual.addEventListener("click", () => {
  state = { ...defaultState, completedTasks: {} };
  weeklyState = {};
  removeJson(storage, stateKey);
  removeJson(storage, weeklyKey);
  render();
});

render();
