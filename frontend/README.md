# Onboarding System – modernisierte Web-App

Eine moderne, responsive und barrierefreie React-Oberfläche für das bestehende
Node.js-Onboarding-Backend. Die ursprüngliche `login.html` + `script.js` wurden
in eine saubere Komponentenarchitektur überführt — Funktionalität und
API-Aufrufe blieben dabei **vollständig kompatibel** zum bestehenden Server.

## Features

- **Login** an `POST /login`
- **Meine Aufgaben** mit Fortschrittsbalken (`GET /tasks/:userid`,
  `GET /tasks/progress/:userid`, `PUT /tasks/:userid/:taskid`)
- **Adminbereich** (nur Rolle `admin`):
  - Nutzer:in anlegen (`POST /users`)
  - Aufgabe anlegen (`POST /tasks`)
  - Aufgabe zuweisen mit Live-Suche (`GET /users`, `GET /tasks`,
    `POST /tasks/assign`)
- Responsive Design (Mobil / Tablet / Desktop)
- Barrierefrei: semantisches HTML, ARIA-Attribute, Tastaturbedienung,
  Fokus-Indikatoren, ausreichende Kontraste, klare Fehlermeldungen

## Projektstruktur

```
src/
├── routes/
│   └── index.tsx              # Einstieg: schaltet zwischen Login & Dashboard
├── components/
│   ├── onboarding/
│   │   ├── LoginCard.tsx      # Login-Formular
│   │   ├── Dashboard.tsx      # Header + User-Info + Layout
│   │   ├── TaskList.tsx       # Aufgaben + Fortschritt
│   │   ├── AdminPanel.tsx     # Tabs: Nutzer / Aufgabe / Zuweisen
│   │   ├── CreateUserForm.tsx # POST /users
│   │   ├── CreateTaskForm.tsx # POST /tasks
│   │   └── AssignTaskPanel.tsx# Suche + POST /tasks/assign
│   └── ui/                    # shadcn/ui-Komponenten
├── lib/
│   ├── api.ts                 # zentrale API-Service-Schicht (fetch-Wrapper)
│   └── types.ts               # gemeinsame TypeScript-Typen
└── styles.css                 # Design System "Emerald Prestige" (oklch)
```

## Installation

```bash
bun install        # oder: npm install
```

## Starten (Entwicklung)

```bash
bun run dev        # oder: npm run dev
```

Die App läuft standardmäßig auf `http://localhost:5173`.

> Stelle sicher, dass dein bestehender **Node.js-Server** parallel auf
> `http://localhost:3000` läuft.

## Verbindung zum Node.js-Backend

Alle HTTP-Aufrufe sind in **`src/lib/api.ts`** zentralisiert. Die Basis-URL
kommt aus der Umgebungsvariable `VITE_API_URL`. Standardwert: `http://localhost:3000`.

```env
# .env (im Projekt-Root)
VITE_API_URL=http://localhost:3000
```

Für Produktion oder einen anderen Host einfach die `.env` anpassen — die
Komponenten müssen **nicht** geändert werden.

### Übernommene Endpunkte (1:1 zum Originalskript)

| Methode | Pfad                              | Verwendung                       |
| ------- | --------------------------------- | -------------------------------- |
| POST    | `/login`                          | Anmeldung                        |
| GET     | `/tasks/:userid`                  | Aufgaben eines Users laden       |
| GET     | `/tasks/progress/:userid`         | Fortschritt laden                |
| PUT     | `/tasks/:userid/:taskid`          | Aufgabe als erledigt markieren   |
| POST    | `/tasks`                          | Neue Aufgabe anlegen             |
| GET     | `/tasks`                          | Aufgabenkatalog für Zuweisung    |
| POST    | `/tasks/assign`                   | Aufgabe einem User zuweisen      |
| GET     | `/users`                          | Nutzerliste für Mitarbeitersuche |
| POST    | `/users`                          | Neuen Nutzer anlegen             |

### Wo API-Endpunkte angepasst werden

- **Basis-URL:** `.env` → `VITE_API_URL`
- **Einzelne Pfade / Payloads:** `src/lib/api.ts` (jede Funktion ist klar
  benannt und dokumentiert)
- **Typen:** `src/lib/types.ts`

## CORS-Hinweis

Falls der Browser CORS-Fehler zeigt, muss der Node.js-Server `cors` für den
Frontend-Origin aktivieren:

```js
import cors from "cors";
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
```

## Hinweise zur Weiterentwicklung

- **Echte Authentifizierung:** aktuell wird der eingeloggte User nur im
  React-State gehalten (wie im Originalskript). Sinnvolle nächste Schritte:
  JWT/Session-Cookies im Backend, persistente Session im Client.
- **Routing:** Bei wachsendem Funktionsumfang Login/Dashboard/Admin auf
  separate Routen (`/login`, `/dashboard`, `/admin`) aufteilen.
- **Schutz Admin-Endpunkte:** Backend sollte Admin-Berechtigung serverseitig
  prüfen (nicht nur über `requestingRole` aus dem Body).
- **Validierung:** Eingaben zusätzlich mit Zod o.ä. validieren.
- **Mehrsprachigkeit:** Texte aktuell auf Deutsch — bei Bedarf in i18n-Layer
  auslagern.
- **Tests:** Vitest + Testing Library lassen sich direkt ergänzen.
