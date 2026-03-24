# Text to Handwriting

Convert digital text into realistic handwritten pages. Supports English (LTR) and Arabic (RTL) with authentic handwriting fonts, multiple paper styles, and customizable ink colors.

## Features

- 6 English handwriting fonts + 8 Arabic calligraphy fonts
- Right-to-left rendering with proper Arabic ligature preservation
- 6 paper styles: ruled, college, grid, blank, aged, dark
- 6 ink colors with realistic opacity variation
- Per-character randomization: size, position, rotation, opacity
- Adjustable wobble, spacing, font size, and line height
- PNG export

## Quick Start

```bash
git clone https://github.com/FixFips/text-to-handwriting.git
cd text-to-handwriting
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

The output goes to the `dist/` folder, ready to deploy anywhere (Vercel, Netlify, GitHub Pages).

## Project Structure

```
text-to-handwriting/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx        # Entry point
    ├── App.jsx         # Main component, controls + canvas
    ├── config.js       # Fonts, paper styles, ink colors, defaults
    ├── renderer.js     # Canvas drawing logic (paper + text)
    └── index.css       # Styles
```

## How It Works

Text is rendered character-by-character onto an HTML canvas using Google Fonts. Each character gets randomized variations in size, vertical offset, rotation, and opacity to simulate natural handwriting. A seeded random number generator keeps the output deterministic (same text always looks the same).

For Arabic text, words are rendered as whole units instead of individual characters to preserve the ligature connections that are essential to Arabic script.

Paper backgrounds are drawn with texture noise, ruled lines, margin lines, and hole punch marks depending on the selected style.

## Fonts

**English:** Caveat, Dancing Script, Indie Flower, Kalam, Shadows Into Light, Patrick Hand

**Arabic:** Aref Ruqaa, Vibes, Mirza, Gulzar, Scheherazade New, Amiri, Harmattan, Rakkas

All fonts are loaded from Google Fonts CDN at runtime.

## Roadmap

- PDF export with multi-page support
- Ink bleed and pressure simulation
- Custom handwriting upload (scan your own writing)
- More languages (Urdu, Persian, Hindi)
- Backend API for batch conversion

## License

MIT
