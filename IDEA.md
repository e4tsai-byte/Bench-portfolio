# IDEA.md: the original idea doc (archival)

> **Status: superseded source material, not a governing document.** This is the original design plan the project grew out of, preserved verbatim below the rule. It is kept because `PRODUCT.md`, `DESIGN.md`, and `CLAUDE.md` all cite it, and because the reasoning behind several binding decisions only makes sense when you can see what they were reacting to.
>
> **Do not implement from this file.** Where it disagrees with a governing document, the governing document wins, without exception. Every known disagreement is already resolved:
>
> | This doc says | Resolved to | Recorded in |
> |---|---|---|
> | "Midnight Command Center", near-black background, iridescent neon highlights | High-key only. Luminous white consoles, no dark surface anywhere | `CLAUDE.md` 1.1 and D3, `DESIGN.md` 1 |
> | "dark-mode modal" for the calendar deep dives | High-key glass-morphism pop-out | `CLAUDE.md` 1.1, `PRODUCT.md` 11 |
> | "stark black-and-white with bio-green highlights" for the computer | Luminous console, single cold mint accent | `DESIGN.md` 2.3, `CLAUDE.md` D9 |
> | "photorealistic", live 3D engine, Spline or Three.js at runtime | Pre-baked stylized stills, transitions faked in 2D | `CLAUDE.md` 1.2 and D2 |
> | "Zoom-to-Black" transition into a micro-world | Crossfade plus scale. There is no black frame | `CLAUDE.md` 1.1, D6 |
> | Focus knob, equalizer-style metric bars, sound design | Deferred out of Phase 1 to the backlog | `PRODUCT.md` 11 |
>
> The doc's own Theme paragraph already instructs this inversion. The contradictions are inherited from the borrowed reference sites, not from the theme.
>
> **This file contains no portfolio content.** No research abstract, no publication list, no patent numbers. `src/content/*.ts` cannot be sourced from here.

---

## Overview

### Interactive 3D Bench Strategy

# **Interactive 3D Lab Bench — Design Plan**

## **Theme (canonical — everything below inherits from this)**

A pristine, near-monochrome lab bench in **cool blues and sterile whites**. Everything is sharp, precise, and slightly alien. The aesthetic is clinical and futuristic — objects feel like **specimens under glass**. Behind the bench sits a clean lab environment, held out of focus and non-interactive.

**One rule governs every screen: the experience is high-key.** There is no dark mode anywhere in this project. Contrast comes from near-black ink on luminous white, never from inverting the ground. "Glow" means an element becomes *brighter and whiter* with a cold rim — not a neon emission against black. Any reference below is borrowed for its *structure, rhythm, or interaction logic*; its value scheme is inverted to match this theme.

* Microscope (Research Experience): Use a "zoom-to-macro" transition. When clicked, the camera should fly into the lens, transitioning the 3D environment into a microscopic view where project cards float like specimens. Look at [Vectary’s scene hierarchy](https://refero.design/pages/341605f1-4578-4583-a302-fbd6d4201c26) for how to organize complex 3D assets into a navigable list.  
* Notebook (Publications & Patents): Treat this as a high-fidelity physics object. Clicking it should trigger a "top-down" camera angle, opening the book to reveal a clean, editorial layout. Borrow the [Julia Krantz archive rhythm](https://styles.refero.design/style/dfa3ad81-0d1e-447f-b171-2b871cbb27ab), which uses thin dividers and edge-to-edge grids to feel like a professional contact sheet or lab journal.  
* Computer (AI Projects): The computer screen should be a functional "sub-interface." When the user clicks the monitor, the camera locks to the screen, and the UI shifts to a terminal-inspired layout. Use the [Integrated Biosciences](https://styles.refero.design/style/32add4f9-59b6-4672-acf3-70b0d379dfac) aesthetic—stark black-and-white with "bio-green" highlights—to present your AI code and results.

### Implementation Patterns

To ensure the 3D space feels interactive rather than just a static image, implement these UX patterns:

* Hover States as Lighting: When a user hovers over the Microscope or Notebook, trigger a subtle "point light" or glow effect on that object. This provides immediate feedback that the object is interactive without needing a "Click Here" button.  
* Spatial Onboarding: Since 3D navigation can be confusing, use a guided tour. [Bezi’s onboarding flow](https://refero.design/flows/1024) shows how to use tooltips anchored to 3D coordinates to teach users how to orbit, zoom, and interact with the environment.  
* Diegetic UI Labels: Instead of floating text, place labels on the bench itself (e.g., a small brass plaque next to the microscope). This maintains the photorealistic immersion.

## Transition 

For a photorealistic lab bench, the transition should feel like a physical movement through space rather than a digital jump. A camera fly-through is superior for immersion, but it requires careful "easing" to prevent motion sickness and maintain focus.

### The "Macro-Zoom" Fly-through

When a user clicks an object (like the Microscope), the camera should not just move; it should accelerate and decelerate into a specific "macro" framing.

* The Move: Use a "Fast-In, Slow-Out" easing curve. The camera starts moving quickly to create a sense of travel, then slows down significantly as it approaches the object to let the details of the 3D model (the lens, the textures) resolve.  
* The Diegetic Reveal: As the camera enters the "zoom" state, the UI shouldn't just pop in. It should be part of the environment. For example, clicking the Microscope could transition the screen into a "viewfinder" overlay, where project details appear as if they are being viewed through the lens.  
* Reference: [Spline’s camera framing flow](https://refero.design/flows/256) demonstrates how to switch between perspective and orthographic views to finalize a composition. You can use this logic to transition from a 3D perspective (the bench) to a flat, readable "document" view (the research papers).

### The "Sub-Interface" Lock (Computer/Calendar)

For the Computer and Calendar, a full fly-through might be too much movement. Instead, use a Camera Lock with UI Overlay.

* The Move: The camera orbits and tilts to face the screen or calendar directly.  
* The Transition: Once the camera is locked, the 3D environment can subtly blur (Depth of Field effect), and the interactive 2D UI elements (AI terminal or timeline) become active.  
* Reference: [Bezi’s state transition setup](https://refero.design/flows/193) shows how to trigger specific camera states based on "pointer-down" events. You can map each bench object to a "State" in your 3D engine (like Spline or Three.js) that defines the camera's X, Y, Z coordinates and rotation.

### When to use Cross-Fade (The "Safety Valve")

Cross-fades should be reserved for loading states or context shifts that are too complex for a single camera move.

* The "Micro-World": If clicking the microscope takes the user to a completely different 3D environment (e.g., inside a cell), use a "Zoom-to-Black" transition. The camera flies into the lens until the screen is 100% black, then fades into the new environment.  
* Reference: [Womp’s loading screen](https://refero.design/pages/2afaef75-35eb-4ebe-a895-259606e87c8d) uses a minimal 3D object and progress bar. This is a great pattern to use if your "fly-through" requires loading new high-res assets for the detailed view.

### UX Recommendations

1. Maintain a "Home" Button: Always keep a small, persistent "Back to Bench" icon in the corner so users don't feel trapped in a zoomed-in state.  
2. Depth of Field: Use a shallow depth of field during the fly-through. Blur the background as you zoom into the microscope to keep the user's eye on the target.  
3. Sound Design: A subtle mechanical "whir" or "click" during the camera move reinforces the photorealistic, physical nature of the lab.

## Microscope example

For the Microscope research view, the UI should transition from a 3D environment into a "diegetic" data overlay. This means the interface should look like a digital readout projected onto the microscope's lens or a high-tech laboratory console.

### The "Viewfinder" Layout

Instead of a standard full-screen dashboard, use a circular or "lens-shaped" mask for the main content to maintain the illusion of looking through a microscope.

### Visual Language: "Midnight Command Center"

To match the photorealistic 3D bench, the UI overlay should feel like a premium developer tool—precise, technical, and luminous.

* Atmospheric Depth: Use the [Active Theory](https://styles.refero.design/style/9d795615-79d0-4544-ac5e-2858971c3b3b) aesthetic. Keep the background near-black and use iridescent neon highlights (violet or mint) for active states. This makes the UI feel like it's glowing within the dark lab.  
* Technical Typography: Follow the [Warp.dev](https://styles.refero.design/style/3aff8b9c-ac69-4392-9862-c82e9db2dec7) approach. Use a clean, compact sans-serif for headlines and a monospace font for data points like patent numbers or publication dates to reinforce the "research" feel.  
* Data Visualization: Incorporate "equalizer-like" bars or data streams, similar to the [Vapi](https://styles.refero.design/style/11db6cab-35f4-43bb-9ec3-053523f6b531) style, to represent research metrics or project impact.

### Interactive Elements

* The Focus Knob: Instead of a scrollbar, place a 3D "knob" at the bottom of the screen. Dragging it could scroll through the research text or zoom in on images, mimicking the physical act of focusing a microscope.  
* Floating "Specimen" Cards: Present individual research papers as floating glass cards with thin, luminous borders. When hovered, they should subtly "pulse" or glow, as seen in the [Dovetail](https://styles.refero.design/style/b0ec8a0f-ee66-4ad3-a934-451db854f625) command-center layout.  
* HUD Overlays: Add "crosshairs" or "coordinate markers" in the corners of the viewfinder. These don't need to be functional; they serve as "flavor" to make the interface feel like a piece of scientific equipment.

## Notebook example

For the Notebook section, you should move away from standard "web pages" and adopt a Digital Archive aesthetic. The goal is to make the publications feel like physical documents stored in a high-end research library.

### Visual Direction: The "Archival Grid"

Use a disciplined, high-contrast layout that emphasizes structure and metadata. This reinforces the "Notebook" concept as a professional record of patents and publications.

### The "Notebook" Layout Strategy

When the user clicks the physical notebook on the bench, the camera should transition to a top-down "spread" view.

* The Table of Contents (Left Page): Use a vertical list with oversized, serif-like numerals for years (e.g., "2024", "2023"), similar to the [Gustavo Faria](https://styles.refero.design/style/14c1ab6c-8462-43a1-a112-af9e07d78085) style. This gives the notebook a fashion-editorial feel.  
* The Document Viewer (Right Page): When a publication is selected, display it in a centered, narrow reading column. Use a layout similar to [DoorDash’s legal terms](https://refero.design/pages/6df0274c-65c2-4cf2-b8e5-1d2bdeb6df39), which uses a clean, single-column vertical stack with a clear table of contents for long-form text.  
* Embedded PDF Interaction: For patents, use an embedded viewer like [Handshake’s resume view](https://refero.design/pages/50705def-38a4-4bc2-af4f-303e2e387434). This allows users to scroll through the actual document without leaving the 3D environment.

### UX Details for "Scientific" Immersion

* Monochrome Palette: Keep the UI layer strictly black and white, as seen in [Bibliothèque](https://styles.refero.design/style/aab168d5-0658-459f-a7e5-23982b58a876). This lets the diagrams and figures in your publications provide the only color, making them pop.  
* Technical Typography: Pair a clean sans-serif for navigation with a compact monospace font for citations. [Fonts In Use](https://styles.refero.design/style/470e5fb7-8e29-4b30-acc5-fb2907d86b51) shows how to use condensed display lettering to make section labels feel authoritative and academic.  
* Interactive "Specimen" Tags: Use small, rectangular tags or "checkbox" markers (like those in [Nofilter.space](https://styles.refero.design/style/d2639b27-614d-45cf-b048-6bb76e67159e)) to categorize publications by field (e.g., "AI", "Biotech", "Patents").

## Calender example

For the Calendar timeline, you should avoid a standard grid. Instead, treat it as a Spatial Chronology—a physical object on the bench that expands into a navigable history of your career.

### Visual Direction: The "Linear Progress" Aesthetic

To maintain the lab's technical feel, the timeline should look like a high-precision instrument or a data stream.

### The "Expanding Calendar" Interaction

When the user clicks the physical calendar on the bench, it should "unfold" into a horizontal or vertical data stream.

* The "Scrubbable" Axis: Instead of clicking "Next Month," use a horizontal scrollbar that feels like a radio dial or a ruler. As the user scrubs, the 3D camera moves laterally across the bench, revealing different "era" cards.  
* The Milestone "Pulse": Use a layout similar to [Chronicle’s presentation slides](https://refero.design/pages/a7268808-1649-430c-8717-578d38403333). Each experience is a vertical "block" with a clear title, date range, and a few bullet points.  
* Interactive "Deep Dives": When a user clicks a milestone on the timeline, trigger a "pop-out" card. Use the [Raycast Store](https://refero.design/pages/09c737f7-b45d-426b-9524-73d12659e51c) pattern: a clean, dark-mode modal with a sidebar for quick stats (Location, Role, Tech Stack) and a main area for the description.

### UX Details for a "Scientific" Timeline

* The "Current State" Marker: Use a glowing vertical line to represent "Today." This line should be the brightest element on the timeline, acting as a visual anchor.  
* Non-Linear Scaling: Consider a "logarithmic" scale where recent years take up more space (allowing for more detail), while older experiences are compressed into smaller, clickable "nodes."  
* Diegetic Integration: Keep the timeline "resting" on the surface of the 3D bench. Use a glass-morphism effect (blurred background) for the timeline UI so it feels like a holographic projection coming out of the physical calendar.

