# ፩ ፪ ፫ — Ge'ez ↔ Arabic Numeral Converter

A fully self-contained web app that converts between **Ge'ez (Ethiopic) numerals** and **Arabic integers** in both directions — no server, no build step, no dependencies.

> **Challenge 2** · AASTU · Group 7, Section C

---

## 📁 Files

| File | Purpose |
|------|---------|
| `index.html` | Complete web app — HTML, CSS, and JS in one file. Open directly in any browser. |
| `ethiopiannumberconverter.js` | ES module with the pure conversion logic and a self-test suite. Import or run with Node.js. |

---

## 🔢 The Ge'ez Numeral System

Ge'ez numerals are **not** a simple character substitution. They use a **multiplicative-additive** structure with two special multiplier characters:

| Character | Value | Behaviour |
|-----------|-------|-----------|
| ፻ | 100 | Multiplier — ፪፻ = 200, ፻ alone = 100 |
| ፼ | 10,000 | Multiplier — ፪፼ = 20,000, ፼ alone = 10,000 |

**Supported range:** 1 – 99,999,999

### Character Reference

| Ge'ez | ፩ | ፪ | ፫ | ፬ | ፭ | ፮ | ፯ | ፰ | ፱ |
|-------|---|---|---|---|---|---|---|---|---|
| Arabic | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |

| Ge'ez | ፲ | ፳ | ፴ | ፵ | ፶ | ፷ | ፸ | ፹ | ፺ |
|-------|---|---|---|---|---|---|---|---|---|
| Arabic | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 |

---

## ⚙️ How the Conversion Works

### Arabic → Ge'ez

1. Split the number into an **upper group** (÷ 10,000) and a **lower group** (remainder 0–9,999)
2. If upper group > 1 → encode it, then append **፼** as a ×10,000 marker
3. If upper group = 1 → omit the prefix; **፼** alone means 10,000
4. Encode each group into hundreds, tens, and ones characters
5. If hundreds > 1 → prefix digit + **፻**; if hundreds = 1 → **፻** alone

### Ge'ez → Arabic

1. Split on **፼** to get upper and lower segments
2. Within each segment, split on **፻** to extract the hundreds multiplier
3. Sum all character values to reconstruct the integer
4. An empty prefix before **፻** or **፼** defaults to multiplier = 1

### Examples

| Arabic | Ge'ez | Breakdown |
|--------|-------|-----------|
| 1 | ፩ | ones only |
| 100 | ፻ | hundreds multiplier alone |
| 200 | ፪፻ | 2 × 100 |
| 1995 | ፲፱፻፺፭ | (10+9)×100 + 90+5 |
| 10,000 | ፼ | ten-thousands multiplier alone |
| 20,000 | ፪፼ | 2 × 10,000 |

---


## 🌐 Web App Features

- **Direction toggle** — switch between Arabic→Ge'ez and Ge'ez→Arabic with one click
- **Live error messages** — range enforcement (1 – 99,999,999) and invalid character detection
- **Copy to clipboard** — one-click copy on any result
- **Clickable reference table** — tap any Ge'ez character to type it into the input field
- **Authentic rendering** — Noto Serif Ethiopic font loaded from Google Fonts
- **Fully offline** — no build step, no bundler, no server required
- **Ge'ez numerals (Ethiopic script) · Supported range 1 – 99,999,999**

