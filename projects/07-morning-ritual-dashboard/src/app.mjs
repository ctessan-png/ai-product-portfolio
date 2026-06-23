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
  getWeekKey,
  pickByIndex,
  toggleCompletion
} from "./ritual-engine.mjs";
import { createMemoryStorage, loadJson, removeJson, saveJson } from "./storage.mjs";

const storage = safeStorage();
const todayKey = getTodayKey();
const weekKey = getWeekKey();
const stateKey = `morning-ritual:${todayKey}`;
const weeklyKey = `morning-ritual:weekly-joy:${weekKey}`;

const defaultState = {
  promptIndex: 0,
  tarotIndex: null,
  tarotShuffleCount: 0,
  meditationId: getInitialId(meditations),
  podcastId: getInitialId(podcasts),
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
  meditationDetail: document.querySelector("#meditation-detail"),
  podcastOptions: document.querySelector("#podcast-options"),
  podcastDetail: document.querySelector("#podcast-detail"),
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

function getInitialId(items) {
  return Array.isArray(items) && items.length > 0 ? items[0].id : null;
}

function renderEmptyState(container, message) {
  container.innerHTML = "";
  const fallback = document.createElement("p");
  fallback.className = "empty-state";
  fallback.textContent = message;
  container.append(fallback);
}

function getSelectedItem(items, selectedId) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return items.find((item) => item.id === selectedId) ?? items[0];
}

function persist() {
  saveJson(storage, stateKey, state);
  saveJson(storage, weeklyKey, weeklyState);
}

function renderPrompt() {
  if (journalPrompts.length === 0) {
    elements.promptCategory.textContent = "No prompts";
    elements.promptText.textContent = "Add journal prompts to the local data file to draw one here.";
    return;
  }

  const prompt = pickByIndex(journalPrompts, state.promptIndex);
  elements.promptCategory.textContent = prompt.category;
  elements.promptText.textContent = prompt.text;
}

function renderTarot() {
  if (tarotCards.length === 0) {
    elements.tarotResult.innerHTML = `
      <p class="tarot-name">No tarot cards</p>
      <p>Add reflective tarot cards to the local data file to pull one here.</p>
    `;
    return;
  }

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

  if (!Array.isArray(items) || items.length === 0) {
    renderEmptyState(container, "No options are available yet.");
    return;
  }

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

  if (morningTasks.length === 0) {
    renderEmptyState(elements.morningTaskList, "No morning tasks are available yet.");
    return;
  }

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

  if (!Array.isArray(items) || items.length === 0) {
    renderEmptyState(container, "No stamps are available yet.");
    return;
  }

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

function renderMeditationDetail() {
  const meditation = getSelectedItem(meditations, state.meditationId);

  if (!meditation) {
    renderEmptyState(elements.meditationDetail, "No meditation instructions are available yet.");
    return;
  }

  elements.meditationDetail.innerHTML = "";
  const title = document.createElement("p");
  title.innerHTML = `<strong>${meditation.durationMinutes} min · ${meditation.title}</strong>`;
  const instruction = document.createElement("p");
  instruction.textContent = meditation.instruction;
  elements.meditationDetail.append(title, instruction);
}

function renderPodcastDetail() {
  const podcast = getSelectedItem(podcasts, state.podcastId);

  if (!podcast) {
    renderEmptyState(elements.podcastDetail, "No podcast notes are available yet.");
    return;
  }

  elements.podcastDetail.innerHTML = "";
  const title = document.createElement("p");
  title.innerHTML = `<strong>${podcast.title} · ${podcast.mood}</strong>`;
  const note = document.createElement("p");
  note.textContent = podcast.note;
  elements.podcastDetail.append(title, note);
}

function render() {
  elements.todayLabel.textContent = `Morning ritual · ${todayKey} · ${weekKey}`;
  renderPrompt();
  renderTarot();
  renderChoices(elements.meditationOptions, meditations, state.meditationId, (id) => {
    state.meditationId = id;
    persist();
    render();
  });
  renderMeditationDetail();
  renderChoices(elements.podcastOptions, podcasts, state.podcastId, (id) => {
    state.podcastId = id;
    persist();
    render();
  });
  renderPodcastDetail();
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
  const confirmed = window.confirm("Reset today's ritual and this week's joy stamps?");

  if (!confirmed) {
    return;
  }

  state = { ...defaultState, completedTasks: {} };
  weeklyState = {};
  removeJson(storage, stateKey);
  removeJson(storage, weeklyKey);
  render();
});

render();
