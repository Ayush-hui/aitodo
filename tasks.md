Act as a Principal Frontend Architect specializing in React, Next.js (App Router), and enterprise-grade migrations. 

I have an existing web application built using Vite with vanilla HTML, CSS, and JavaScript. I want to completely remove Vite and rebuild this application from the ground up using Next.js. 

### 🚨 Critical Constraints:
1. Pixel-Perfect UI/UX: Do NOT change, alter, or "improve" the visual design, layouts, responsiveness, animations, or styling. The UI/UX must remain 100% identical to the original version.
2. Feature Parity: Do NOT lose or alter any existing functionality, interactive behaviors, event listeners, state tracking, or business logic. 
3. Code Quality: Act like a seasoned professional. Write clean, modular, typed (or well-documented) React components. Avoid messy workarounds.

### Current Tech Stack Details:
- Source Setup: read the contextmd file for what this project is and then review all the folder structure every file and code files and then understand the codebase and sourse setup and for this also read README.md fle too.
- Target Setup: Next.js (Latest version with App Router)
- CSS Strategy: [INSERT HERE: e.g., Global CSS files, Tailwind, or CSS Modules. Note: Standard vanilla CSS can be imported globally in Next.js layout.js, or converted to CSS Modules for scoping].

### Migration Strategy & Implementation Rules:
1. Componentization: Break down the raw HTML files into semantic, reusable Next.js page files and layout components inside the `app/` directory.
2. State & Logic Migration: Translate vanilla DOM manipulations (e.g., `document.getElementById`, `addEventListener`) into native React paradigms using state (`useState`), side effects (`useEffect`), and references (`useRef`). 
3. Client vs. Server Components: By default, use Next.js Server Components for static layouts. Explicitly mark interactive blocks (like headers, forms, or animated logos) with the `"use client";` directive at the top of the file.
4. Asset Optimization: Move all images and SVGs into the `/public` directory. Migrate standard `<img>` tags to the optimized Next.js `<Image />` component or handle them as optimized static imports to preserve layout stability (prevent CLS).
5. Clean Up: Ensure no remnants of the Vite configuration (`vite.config.js`, `dist/`, etc.) exist in the final codebase. Deliver a clean, production-ready Next.js repository structure.

### Please Provide Your Response In These Steps:
- Step 1: The recommended target folder structure for my new Next.js project.
- Step 2: The updated `package.json` with the required Next.js dependencies.
- Step 3: The complete, rewritten code for the components, showing exactly how the HTML/JS logic was converted to React/Next.js.
- Step 4: Step-by-step instructions on how I should safely move my files over and spin up the local development server (`npm run dev`).
