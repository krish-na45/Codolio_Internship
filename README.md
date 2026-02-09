# Interactive Question Management Sheet

A production-ready single-page React application for managing a hierarchical question sheet with topics, sub-topics, and questions. Built with React, TypeScript, Tailwind CSS, Zustand, and @dnd-kit.

## Features

- CRUD Operations on Topics, Sub-topics, and Questions
- Drag & Drop Reordering at all levels
- Inline Editing with click-to-edit
- Delete Confirmation Modal
- Real-time Question Search
- Progress Tracking with Checkboxes
- Export to JSON
- Duplicate Topics/Sub-topics
- Modern Tailwind CSS UI
- API Integration with Fallback Mock Data

## Tech Stack

- React 19 + TypeScript
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Zustand (State Management)
- @dnd-kit (Drag & Drop)
- Axios (HTTP Client)
- UUID (ID Generation)
- Lucide React (Icons)

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build
```

Navigate to `http://localhost:5173` to see the app.

## Project Structure

```
src/
├── components/
│   ├── TopicCard.tsx
│   ├── SubTopicItem.tsx
│   ├── QuestionItem.tsx
│   └── modals/ConfirmModal.tsx
├── store/sheetStore.ts
├── api/sheetApi.ts
├── utils/reorder.ts
├── pages/SheetPage.tsx
├── App.tsx
└── main.tsx
```

## All Mandatory Features Implemented

✅ Create, Edit, Delete Topics, Sub-topics, Questions
✅ Drag & Drop Reordering
✅ Clean Intuitive UI
✅ Expand/Collapse
✅ Inline Editing
✅ Confirmation Modals
✅ Search Functionality
✅ Progress Tracking
✅ Export to JSON
✅ Duplicate Items

---

Built as part of Codolio Internship. Version: 1.0.0

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
