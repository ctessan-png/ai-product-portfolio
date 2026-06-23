# Morning Ritual Dashboard Design

## Summary

Build a mobile-first Morning Ritual dashboard that helps start the day without opening multiple distracting apps. The first phase is a phone-friendly web app that can be opened on an iPhone and saved to the Home Screen. The second phase is a focused native iPhone stamp-card widget built after the dashboard flow is proven.

The design combines a soft Pinterest-style ritual board with playful punch-card tracking. It should feel personal, calm, and useful: a single home screen for journaling, tarot reflection, meditation, body care, dog walking, and weekly non-work activities.

## Goals

- Create one mobile-first place for the morning routine.
- Keep all morning ritual options visible without forced locking or sequencing.
- Reduce the urge to open separate apps during the morning.
- Include a journal prompt library, tarot pull, meditation picker, checklist, and stamp cards.
- Use the provided punch-card style tokens as the visual foundation.
- Keep the first version simple enough to run as a static portfolio artifact.
- Preserve a clean path toward a native iPhone WidgetKit stamp-card widget later.

## Non-Goals

- Do not build a native iPhone app in phase one.
- Do not require login, accounts, cloud sync, or a backend.
- Do not integrate with real podcast, meditation, or tarot APIs in phase one.
- Do not lock or hide any activity based on sequence completion.
- Do not turn tarot into predictive fortune-telling. Treat it as reflective journaling support.

## Phase 1: Mobile Web Dashboard

The first build is a mobile-first static web dashboard inside the portfolio. It should work well at iPhone screen sizes and still be usable on desktop for review.

### Primary Screen

The dashboard is a single scrollable home screen. It should show the whole morning system as a calm ritual board, not as a multi-page app.

Core sections:

- Opening card with today’s intention and a reminder to stay off other apps.
- Journal prompt card with a built-in prompt library and a button to draw a new prompt.
- Tarot card with shuffle and pull behavior.
- Meditation picker with 5-minute and 10-minute options.
- Podcast card for choosing a walk companion.
- Morning checklist with tappable completion states.
- Stamp card tracker for morning rituals.
- Weekly joy stamp card for non-work activities.

### Morning Checklist Items

The initial checklist includes:

- No app opening
- Gua sha / face routine
- Vibration plate
- Journal
- Meditate
- Red light during meditation
- Walk dog
- Skin again

The interface may visually suggest the preferred flow, but every item stays available from the start.

### Journal Prompt Library

The journal prompt card stores prompts locally in JavaScript. A user can tap a control to receive a new prompt.

Prompt categories should support the tone of the project:

- grounding
- self-trust
- body check-in
- gratitude
- clarity
- protection from app distraction
- weekly reflection

The prompt card should make the selected prompt easy to read and copy into a physical or digital journal.

### Tarot Pull

The tarot feature should behave like a reflective card draw:

- A shuffle action creates a brief sense of ritual.
- A pull action selects one card from a local deck list.
- The result shows the card name, a short meaning, and a morning reflection question.

The first version can use a concise curated deck list rather than a full 78-card deck. The structure should allow more cards later.

### Meditation Picker

The meditation card lets the user choose a 5-minute or 10-minute meditation. The first version does not need audio playback. It can provide a selected meditation type and a short instruction.

Initial meditation types:

- body scan
- breath reset
- self-trust
- calm focus
- gratitude

### Podcast Pick

The podcast card suggests a walk companion. The first version can use a curated local list with title, mood, and why it fits the morning.

The podcast section is visible from the start. It does not unlock after journaling or meditation.

### Stamp Cards

The dashboard includes two stamp-card experiences:

- Morning ritual stamp card: tracks completion of morning checklist items.
- Weekly joy stamp card: tracks non-work activities during the week.

The stamp card should feel playful and tactile, using punch-card visual language from the provided style reference. A completed item should receive a visual stamp or punched state.

### Persistence

The phase-one web dashboard stores local state in browser `localStorage`.

Persisted data:

- checklist completion for the current day
- selected journal prompt
- selected tarot card
- selected meditation
- stamp-card completion
- weekly joy activity stamps

The first version can include a reset control for demo and testing.

## Phase 2: Native iPhone Stamp-Card Widget

After the web dashboard is reviewed and refined, build a focused native iPhone widget around the stamp-card experience.

The native widget should not try to reproduce the entire dashboard. Its job is glanceable progress.

Potential widget content:

- today’s completed ritual count
- weekly stamp-card progress
- one small affirmation or reminder
- a visual punch-card row or grid

Native implementation target:

- Xcode
- SwiftUI
- WidgetKit
- App Intents if interactive behavior is needed and feasible

The native phase should happen only after the mobile web dashboard confirms which rituals and stamp-card interactions feel useful.

## Visual Direction

Use the provided punch-card style tokens as the design foundation.

Token reference:

- cream and vanilla paper backgrounds
- blush, petal, lilac, periwinkle, sky, mint, sage, butter, coral, tomato, and berry accents
- warm ink color
- rounded cards
- soft shadows
- tactile border treatment
- `DM Serif Display` for expressive headings
- `Nunito` for readable body text
- `Caveat` for handwritten ritual notes

The visual tone should be a hybrid:

- soft Pinterest ritual board for the overall dashboard
- playful punch-card tracker for completion states

The design should avoid feeling like a generic productivity dashboard. It should feel like a personal morning ritual surface.

## Architecture

Phase one can remain static and dependency-free:

- `index.html` for markup
- `styles.css` for the mobile-first visual system
- `script.js` for local interactions and state
- optional `data.js` if prompt, tarot, meditation, and podcast content needs separation

Recommended module boundaries:

- journal prompt selection
- tarot shuffle and draw
- meditation selection
- checklist state
- stamp-card state
- localStorage helpers

Each unit should be understandable without reading the whole app.

## Data Model

Example local data structures:

- `journalPrompts`: list of prompt objects with category and text
- `tarotCards`: list of card objects with name, meaning, and reflection question
- `meditations`: list of objects with duration, type, and instruction
- `podcasts`: list of objects with title, mood, and note
- `morningTasks`: list of checklist items
- `weeklyJoyActivities`: list of non-work activity labels

State keys should be date-aware so daily ritual progress can reset without erasing weekly progress.

## Error Handling

The app should handle:

- missing `localStorage` support by still allowing interactions during the session
- empty data arrays by showing a clear fallback message
- reset actions with a clear confirmation or plainly labeled reset button

No network connection should be required for the core dashboard.

## Accessibility

- Buttons must use clear labels.
- Interactive cards must be keyboard accessible.
- Text contrast must be readable on pastel backgrounds.
- Motion from shuffle or stamp effects should respect reduced-motion preferences.
- The dashboard should work at narrow mobile widths without text overlap.

## Testing

Manual checks for phase one:

- Open on an iPhone-sized viewport.
- Tap each checklist item and confirm state changes.
- Refresh and confirm saved state returns.
- Draw journal prompts repeatedly.
- Shuffle and pull tarot cards.
- Select 5-minute and 10-minute meditations.
- Add and clear stamp-card completions.
- Confirm no text overlaps on mobile.
- Confirm the app still works without external network dependencies except optional fonts.

## Success Criteria

The first version is successful when:

- the dashboard works well on a phone-sized screen
- all key morning ritual pieces are visible in one home screen flow
- it supports the desired routine without forcing lock-step completion
- the stamp cards feel rewarding and visually connected to the style reference
- it reduces the need to open separate apps during the morning
- it still reads as a polished portfolio artifact

## Open Decisions For Implementation Planning

- Exact journal prompt list
- Exact curated tarot card list
- Exact meditation options
- Exact podcast suggestions
- Whether to place this inside `projects/05-personal-hobby-widgets/` or create a new `projects/07-morning-ritual-dashboard/`

Recommended implementation location: create `projects/07-morning-ritual-dashboard/` so this becomes a distinct portfolio project rather than an extension of the earlier generic hobby widget.

