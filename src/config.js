export const LANGUAGES = [
  { id: "en", label: "English", dir: "ltr" },
  { id: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", dir: "rtl" },
];

export const FONTS_EN = [
  { name: "Homemade Apple", label: "Cursive", url: "https://fonts.googleapis.com/css2?family=Homemade+Apple&display=swap" },
  { name: "Caveat", label: "Casual", url: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap" },
  { name: "Dancing Script", label: "Elegant", url: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap" },
  { name: "Satisfy", label: "Flowing", url: "https://fonts.googleapis.com/css2?family=Satisfy&display=swap" },
  { name: "Indie Flower", label: "Playful", url: "https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap" },
  { name: "Kalam", label: "Natural", url: "https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap" },
  { name: "Shadows Into Light", label: "Light", url: "https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap" },
  { name: "Patrick Hand", label: "Clean", url: "https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" },
];

export const FONTS_AR = [
  { name: "Aref Ruqaa", label: "\u0631\u0642\u0639\u0629 \u00B7 \u064A\u062F\u0648\u064A", url: "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&display=swap", desc: "Everyday handwriting" },
  { name: "Vibes", label: "\u062D\u064A\u0648\u064A \u00B7 \u0633\u0631\u064A\u0639", url: "https://fonts.googleapis.com/css2?family=Vibes&display=swap", desc: "Quick flowing pen" },
  { name: "Mirza", label: "\u0645\u064A\u0631\u0632\u0627 \u00B7 \u0646\u0633\u062A\u0639\u0644\u064A\u0642", url: "https://fonts.googleapis.com/css2?family=Mirza:wght@400;500;600;700&display=swap", desc: "Persian calligraphy" },
  { name: "Gulzar", label: "\u06AF\u0644\u0632\u0627\u0631 \u00B7 \u0646\u0633\u062A\u0639\u0644\u064A\u0642", url: "https://fonts.googleapis.com/css2?family=Gulzar&display=swap", desc: "Graceful Nastaliq" },
  { name: "Scheherazade New", label: "\u0634\u0647\u0631\u0632\u0627\u062F \u00B7 \u0642\u0631\u0622\u0646\u064A", url: "https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap", desc: "Quranic Naskh" },
  { name: "Amiri", label: "\u0623\u0645\u064A\u0631\u064A \u00B7 \u0643\u0644\u0627\u0633\u064A\u0643", url: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap", desc: "Classic calligraphy" },
  { name: "Harmattan", label: "\u062D\u0631\u0645\u062A\u0627\u0646 \u00B7 \u0648\u0631\u0634", url: "https://fonts.googleapis.com/css2?family=Harmattan:wght@400;700&display=swap", desc: "North African Quran" },
  { name: "Rakkas", label: "\u0631\u0642\u0651\u0627\u0635 \u00B7 \u0641\u0646\u064A", url: "https://fonts.googleapis.com/css2?family=Rakkas&display=swap", desc: "Artistic brush" },
];

export const PAPER_STYLES = [
  { id: "ruled", label: "Ruled", labelAr: "\u0645\u0633\u0637\u0631", lineColor: "#b8d4e8", bg: "#fffef9", margin: true },
  { id: "college", label: "College", labelAr: "\u062C\u0627\u0645\u0639\u064A", lineColor: "#a8c8e0", bg: "#f8f6f0", margin: true },
  { id: "grid", label: "Grid", labelAr: "\u0645\u0631\u0628\u0639\u0627\u062A", lineColor: "#d0d8e0", bg: "#fafafa", margin: false },
  { id: "blank", label: "Blank", labelAr: "\u0641\u0627\u0631\u063A", lineColor: "transparent", bg: "#fffdf7", margin: false },
  { id: "aged", label: "Aged", labelAr: "\u0642\u062F\u064A\u0645", lineColor: "#c8b898", bg: "#f4e8d0", margin: false },
  { id: "dark", label: "Dark", labelAr: "\u062F\u0627\u0643\u0646", lineColor: "#3a3a4a", bg: "#2a2a35", margin: false, inkColor: "#d8d8e8" },
];

export const INK_COLORS = [
  { id: "blue", color: "#1a3a6a", label: "Blue" },
  { id: "black", color: "#1a1a2e", label: "Black" },
  { id: "darkblue", color: "#0d2147", label: "Navy" },
  { id: "red", color: "#8b1a1a", label: "Red" },
  { id: "green", color: "#1a5c2a", label: "Green" },
  { id: "purple", color: "#4a1a6a", label: "Purple" },
];

export const SAMPLE_EN =
  "The quick brown fox jumps over the lazy dog.\n\nThis is a demonstration of the Text to Handwriting converter. Type or paste your text on the left panel, and watch it transform into realistic handwriting on this paper.\n\nYou can customize the font style, ink color, paper type, and many other settings to get the perfect handwritten look.";

export const SAMPLE_AR =
  "\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0631\u062D\u064A\u0645\n\n\u0647\u0630\u0627 \u0639\u0631\u0636 \u062A\u0648\u0636\u064A\u062D\u064A \u0644\u0645\u062D\u0648\u0644 \u0627\u0644\u0646\u0635 \u0625\u0644\u0649 \u062E\u0637 \u0627\u0644\u064A\u062F. \u0627\u0643\u062A\u0628 \u0623\u0648 \u0627\u0644\u0635\u0642 \u0627\u0644\u0646\u0635 \u0641\u064A \u0627\u0644\u0644\u0648\u062D\u0629 \u0627\u0644\u064A\u0633\u0631\u0649 \u0648\u0634\u0627\u0647\u062F\u0647 \u064A\u062A\u062D\u0648\u0644 \u0625\u0644\u0649 \u062E\u0637 \u064A\u062F \u0648\u0627\u0642\u0639\u064A \u0639\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0648\u0631\u0642\u0629.\n\n\u064A\u0645\u0643\u0646\u0643 \u062A\u062E\u0635\u064A\u0635 \u0646\u0645\u0637 \u0627\u0644\u062E\u0637 \u0648\u0644\u0648\u0646 \u0627\u0644\u062D\u0628\u0631 \u0648\u0646\u0648\u0639 \u0627\u0644\u0648\u0631\u0642 \u0648\u0627\u0644\u0639\u062F\u064A\u062F \u0645\u0646 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0623\u062E\u0631\u0649 \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u0627\u0644\u0645\u0638\u0647\u0631 \u0627\u0644\u0645\u062B\u0627\u0644\u064A \u0628\u062E\u0637 \u0627\u0644\u064A\u062F.";

export const DEFAULTS = {
  en: { fontSize: 18, lineHeight: 1.5, letterSpacing: 0, wordSpacing: 0 },
  ar: { fontSize: 20, lineHeight: 1.5, letterSpacing: 0, wordSpacing: 0 },
};

export const UI_FONT_AR = "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap";
