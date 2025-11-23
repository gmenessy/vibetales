# VibeTales 🎭✨

**Die zugängliche Heldenreise** - Verwandle deinen Tag in ein episches Comic-Abenteuer!

VibeTales ist eine innovative Tablet-App, die das passive "Wie war dein Tag?" in ein aktives, kreatives Ritual verwandelt. Kinder (8-13 Jahre) werden zu Helden ihrer eigenen Geschichten, die mit KI-Power in hochwertige Comics verwandelt werden.

## 🎯 Kernkonzept

VibeTales löst das Problem des "leeren Blattes" und macht jeden zum Geschichtenerzähler:

- **Story Sparks** geben Inspiration durch unerwartete, altersgerechte Fragen
- **Voice-First Input** macht Erzählen natürlicher als Tippen
- **Personalisierte Helden** - Du bist visuell erkennbar in jedem Comic
- **Technische Transparenz** - Der Tech-Loader zeigt, wie die Magie entsteht
- **Remix-Power** - Panels einzeln neu generieren für perfekte Ergebnisse

## ✨ Features

### 1. Portal & Helden-Werdung
- **Profilverwaltung** mit persistenten Helden-Attributen
- **Stil-Auswahl** (Anime, Cyberpunk, Comic Noir, Watercolor, Pixel Art, Manga)
- Avatar-Vorschau im gewählten Stil

### 2. Inspiration Engine
- **Story Sparks**: Kuratierte Inspirationsfragen
  - "Was war der 'Cringe-Moment' des Tages?"
  - "Welches Level hast du heute im Real Life gemeistert?"
  - "Wenn dein Tag ein Boss-Fight wäre, wer war der Boss?"
- Altersgerecht für 8-13 Jahre
- Kategorien: Daily, Emotion, Creative, Reflection

### 3. Input & Regie
- **Voice-to-Text**: Hochwertige Spracheingabe
- **Vibe-Slider**: Epic, Chill, Mysterious, Adventure, Funny
- **Stil-Selektor**: 6 verschiedene Comic-Stile
- **Director's Notes**: Optionale Meta-Instruktionen für Power-User

### 4. Transparente KI-Pipeline
- **Tech-Loader** mit echten Prozess-Schritten
- System-Log-Visualisierung
- Fortschrittsanzeige pro Panel

### 5. Comic Viewer & Remix
- **High-Res Viewer** mit Zoom-Funktion
- **Remix per Panel**: Einzelne Panels neu generieren
- **Share & Download**: Comics speichern und teilen
- Metadata-Übersicht (Vibe, Style, Datum)

## 🛠 Tech Stack

- **Framework**: Next.js 14 mit App Router
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS mit Custom Dark Mode Theme
- **Animationen**: Framer Motion
- **State Management**: Zustand mit Persist
- **Icons**: Lucide React

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 20+
- npm oder yarn

### Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App läuft unter `http://localhost:3000`

### Build für Produktion

```bash
# Production Build erstellen
npm run build

# Production Server starten
npm start
```

## 🎨 Design-Philosophie

### Dark Mode First
VibeTales nutzt eine Gaming-inspirierte Dark Mode Ästhetik:
- Keine "kindliche" UI - moderne, respektvolle Gestaltung
- Neon-Akzente (Cyan, Purple, Gold) für Highlights
- Hohe Kontraste für gute Lesbarkeit

### Tablet-Optimiert
- Landscape-Mode als Standard
- Touch-freundliche Buttons (min. 44x44px)
- Gemeinsame Nutzung auf dem Sofa konzipiert

### Transparenz statt "Magie"
- Technische Prozesse werden sichtbar gemacht
- Keine "Loading Spinner" - stattdessen informative Status-Updates
- Respekt vor der technischen Neugier der Zielgruppe

## 🔌 API Integration

### Aktuelle Implementation (MVP)
Die App nutzt aktuell **Mock-Services** für Development:
- Placeholder-Bilder von picsum.photos
- Simulierte Generierungszeiten
- Beispiel-Transkriptionen

### Production-Integration

Für Production müssen folgende APIs integriert werden:

#### 1. Image Generation
Optionen:
- **OpenAI DALL-E 3**: Hochwertig, konsistenter Stil
- **Stable Diffusion**: Open Source, anpassbar
- **Midjourney API**: Premium-Qualität (wenn verfügbar)

```typescript
// Beispiel in src/lib/aiService.ts ersetzen:
async generatePanel(prompt: string, negativePrompt: string, sequence: number) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1792x1024",
  });

  return {
    id: `panel-${Date.now()}-${sequence}`,
    imageUrl: response.data[0].url,
    caption: this.extractCaptionFromPrompt(prompt),
    sequence,
  };
}
```

#### 2. Speech-to-Text
Optionen:
- **OpenAI Whisper API**: Beste Genauigkeit
- **Google Cloud Speech-to-Text**: Echtzeit-Streaming
- **Azure Speech Services**: Enterprise-Option

```typescript
// Beispiel in src/lib/aiService.ts ersetzen:
async transcribeSpeech(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob);
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.apiKey}`,
    },
    body: formData,
  });

  const result = await response.json();
  return result.text;
}
```

## 🔒 Sicherheit & Datenschutz

### Output Safety
- Strikte Server-seitige Filter gegen unangemessene Inhalte
- Negative Prompts blockieren NSFW, Gewalt, etc.
- Empfehlung: Moderations-API von OpenAI nutzen

### Datenspeicherung
- Profile und Comics werden lokal (LocalStorage) gespeichert
- Für Production: Backend mit Datenbank empfohlen
- DSGVO-Konformität beachten bei Bild-Uploads

### Begleitetes Nutzungskonzept
Die App ist für gemeinsame Nutzung mit Eltern konzipiert - kein unbeaufsichtigter Zugang für Kinder.

## 📱 Deployment

### Vercel (Empfohlen)
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel
```

### Netlify
```bash
# Build Command
npm run build

# Publish Directory
.next
```

## 🎯 Roadmap

### Phase 1: MVP (Aktuell) ✅
- [x] Profilverwaltung
- [x] Story Sparks Engine
- [x] Input-Modul mit Vibe/Style-Selektion
- [x] Mock AI-Pipeline
- [x] Comic Viewer mit Remix
- [x] Tech-Loader

### Phase 2: Production-Ready
- [ ] Echte AI-API-Integration
- [ ] Backend mit Datenbank
- [ ] User Authentication (Eltern-Account)
- [ ] PDF-Export für Comics
- [ ] Avatar-Preview-Generierung
- [ ] Performance-Optimierung

### Phase 3: Erweiterte Features
- [ ] Comic-Galerie & Historie
- [ ] Social Features (Teilen, Community)
- [ ] Erweiterte Remix-Optionen
- [ ] Mehr Stile & Vibe-Optionen
- [ ] Multi-Language Support
- [ ] Accessibility-Verbesserungen

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

---

**VibeTales** - Jeder Tag ist ein Abenteuer. Erzähl deine Story! 🚀