const ideas = {
  restaurants: {
    data: {
      title: "Restaurant Decision Helper",
      summary: "Build a recommendation widget that helps someone choose where to order from based on cuisine, cost, rating, and delivery speed.",
      skill: "Data filtering, ranking logic, and business explanation",
      ai: "Use AI to brainstorm decision criteria and challenge whether the final recommendation is supported by the data."
    },
    ai: {
      title: "Restaurant Prompt Companion",
      summary: "Create prompts that turn restaurant preferences into clear recommendations with tradeoffs.",
      skill: "Prompt design and output evaluation",
      ai: "Use AI to generate recommendation wording, then validate claims against available inputs."
    },
    product: {
      title: "Food Choice Product Concept",
      summary: "Design a mini product that reduces decision fatigue when choosing a restaurant.",
      skill: "User problem framing and feature prioritization",
      ai: "Use AI to identify user needs, edge cases, and success metrics."
    },
    storytelling: {
      title: "Favorite Meals Storyboard",
      summary: "Turn restaurant preferences into a visual story about taste, budget, and convenience.",
      skill: "Data storytelling and audience communication",
      ai: "Use AI to draft captions and simplify insights for a non-technical audience."
    }
  },
  travel: {
    data: {
      title: "Trip Comparison Dashboard",
      summary: "Compare destinations by budget, activities, trip length, and travel style.",
      skill: "Decision modeling and comparison tables",
      ai: "Use AI to suggest variables, then keep the scoring logic transparent."
    },
    ai: {
      title: "AI Itinerary Prompt Builder",
      summary: "Generate structured prompts for travel planning based on constraints and preferences.",
      skill: "Prompt structure and constraint handling",
      ai: "Use AI to draft itineraries and ask follow-up questions when inputs are missing."
    },
    product: {
      title: "Weekend Trip Planner",
      summary: "Design a tool that helps someone choose a realistic weekend trip.",
      skill: "Product scoping and user flow design",
      ai: "Use AI to generate feature ideas and identify planning risks."
    },
    storytelling: {
      title: "Travel Mood Board",
      summary: "Create a visual planning board that connects destination ideas to mood, budget, and activities.",
      skill: "Narrative organization and visual planning",
      ai: "Use AI to turn preferences into themes and content sections."
    }
  },
  music: {
    data: {
      title: "Playlist Mood Dashboard",
      summary: "Categorize songs or playlists by mood, activity, and listening context.",
      skill: "Categorization, tagging, and summary metrics",
      ai: "Use AI to propose categories, then review whether the categories make sense."
    },
    ai: {
      title: "Playlist Summary Prompts",
      summary: "Create prompts that summarize playlists for focus, workouts, relaxing, or commuting.",
      skill: "Personalization and prompt iteration",
      ai: "Use AI to draft summaries and compare versions for clarity."
    },
    product: {
      title: "Mood-Based Music Finder",
      summary: "Design a simple product concept that recommends music by current mood or task.",
      skill: "Recommendation logic and user experience design",
      ai: "Use AI to identify matching rules and user edge cases."
    },
    storytelling: {
      title: "Soundtrack Of A Week",
      summary: "Turn a week of listening into a short narrative about mood and routines.",
      skill: "Data storytelling and reflection",
      ai: "Use AI to draft a story, then edit it to match the evidence."
    }
  },
  fitness: {
    data: {
      title: "Habit Progress Tracker",
      summary: "Track weekly habits and summarize progress by consistency, goal type, and reflection notes.",
      skill: "Metrics design and progress tracking",
      ai: "Use AI to suggest metrics while keeping goals realistic and measurable."
    },
    ai: {
      title: "Wellness Reflection Assistant",
      summary: "Create prompts that turn weekly habit notes into useful reflections and next steps.",
      skill: "Reflection design and responsible AI use",
      ai: "Use AI to summarize patterns without giving medical advice."
    },
    product: {
      title: "Personal Goal Planner",
      summary: "Design a lightweight tool for setting, tracking, and reviewing wellness goals.",
      skill: "Product design and feedback loops",
      ai: "Use AI to brainstorm features and identify accountability moments."
    },
    storytelling: {
      title: "Progress Story Cards",
      summary: "Turn habit progress into simple cards that show wins, barriers, and next actions.",
      skill: "Clear communication and visual summarization",
      ai: "Use AI to turn notes into concise summaries."
    }
  },
  reading: {
    data: {
      title: "Learning Tracker",
      summary: "Track books, articles, or courses by topic, status, and key takeaways.",
      skill: "Knowledge organization and tagging",
      ai: "Use AI to suggest categories and discussion questions."
    },
    ai: {
      title: "Reading Prompt Library",
      summary: "Create prompts that summarize readings, extract themes, and generate reflection questions.",
      skill: "Summarization and prompt evaluation",
      ai: "Use AI to compare summaries against original notes."
    },
    product: {
      title: "Personal Knowledge Base Concept",
      summary: "Design a tool that helps organize what someone reads and turn it into action.",
      skill: "Information architecture and product thinking",
      ai: "Use AI to propose retrieval and organization workflows."
    },
    storytelling: {
      title: "What I Learned This Month",
      summary: "Turn reading notes into a monthly learning summary.",
      skill: "Synthesis and communication",
      ai: "Use AI to draft themes, then edit for accuracy and personal voice."
    }
  }
};

const form = document.querySelector("#hobby-form");
const title = document.querySelector("#idea-title");
const summary = document.querySelector("#idea-summary");
const skill = document.querySelector("#skill-output");
const ai = document.querySelector("#ai-output");
const artifact = document.querySelector("#artifact-output");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const hobby = formData.get("hobby");
  const goal = formData.get("goal");
  const idea = ideas[hobby][goal];

  title.textContent = idea.title;
  summary.textContent = idea.summary;
  skill.textContent = idea.skill;
  ai.textContent = idea.ai;
  artifact.textContent = "Interactive HTML widget, project README, and short reflection.";
});

