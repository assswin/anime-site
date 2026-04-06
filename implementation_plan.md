# Anime Parallax Scroll Website

This project involves creating a high-performance, visually stunning React web application with modern aesthetics. It will feature smooth parallax scrolling, scroll-triggered text reveals, and a card-based vertical layout showcasing anime characters, their quotes, and background videos.

## User Review Required

> [!IMPORTANT]
> - The new React project will be created in `c:\Users\aswin\Desktop\website 2\anime-site`. Is this directory name acceptable?
> - The application will copy the `Anime Background`, `Anime Chracters`, and `Anime quotes` directories into a `public/assets` folder so they can be loaded by the site. 
> - I will be using `Vite` for the fast build tool, `React` for the framework, `Tailwindcss` for responsive styling, and `Framer Motion` for all the beautiful 3D-like scroll and reveal animations. Does this stack work for you?

## Proposed Changes

### 1. Project Initialization & Dependencies
- Create a new React application using Vite (`npm create vite@latest anime-site -- --template react`).
- Install dependencies: `framer-motion`, `tailwindcss`, `postcss`, `autoprefixer`, `@studio-freight/lenis` (for buttery smooth scrolling).

### 2. Asset Management
- Create `public/assets/videos`, `public/assets/characters`, and `public/assets/quotes` directories within the project.
- Copy the respective `.mp4` and `.jpg` files from your desktop directories into these organized asset folders.

### 3. Application Architecture

#### [NEW] `src/data/characters.js`
- Will contain a structured array of character objects, linking each character's name to their respective video, character image, and quote image paths. Includes Eren, Erwin, Gojo, Levi, Luffy, Rengoku, Rin, Sanji, Toji, and Zoro.

#### [NEW] `src/components/SmoothScroll.jsx`
- A wrapper component utilizing `@studio-freight/lenis` to provide a premium, smooth scrolling experience globally across the site, essential for perfect parallax effects.

#### [NEW] `src/components/HeroSection.jsx`
- The landing section with a full-screen minimalistic design, featuring a large text reveal animation introducing the site (e.g., "Anime Legends").

#### [NEW] `src/components/CharacterCard.jsx`
- The core vertical scrolling component. Each character will be displayed here using a grid layout. 
- The background of the card will be the character's video playing silently in a loop.
- The character image will have a floating parallax effect as the user scrolls.
- The quote image will fade in and reveal based on scroll triggers.

#### [NEW] `src/App.jsx`
- Will assemble the `HeroSection` and map through the characters using the `CharacterCard` component.

#### [NEW] `tailwind.config.js` & `src/index.css`
- Setting up the design system, likely leaning into a cinematic dark mode with subtle glows, glassmorphism over the videos, and sleek modern typography to give that 3D-like, minimalist premium feel.

## Open Questions

> [!WARNING]
> - Do you want the character background videos to play automatically as you scroll to them or should they all be playing at once? (Playing as you scroll might be better for performance).
> - Should we include any background audio/music, or just visuals?

## Verification Plan

### Automated/Manual Tests
- I will run the dev server (`npm run dev`), build the application files, and launch a browser subagent (or ask you to open it) to verify the visual fidelity:
  - Check that all character assets load correctly.
  - Test the parallax scrolling and scroll-triggered fade/reveal animations.
  - Verify that the layout is responsive and provides a premium "3D-like" feel on both desktop and mobile resolutions.
