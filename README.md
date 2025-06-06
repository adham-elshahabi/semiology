# Semiology Atlas

An interactive 3D brain viewer for visualizing seizure semiology by region, using React, Three.js, and GLB models.

## 🧠 Features

- 💡 Clickable brain regions with tooltip hover
- 🎯 Region-specific semiology, function, and reference info
- 🌒 Dark/light mode toggle
- 🧭 Camera controls with zoom & reset
- 🧩 Toggle visibility by hemisphere and subcortical/cerebellar structures
- 📺 Embedded videos per region

## 🚀 Getting Started

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/adham-elshahabi/semiology.git
cd semiology
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Then open your browser at [http://localhost:5173](http://localhost:5173)

> Uses [Vite](https://vitejs.dev) for fast development.

---

## 🗂️ Project Structure

\`\`\`
.
├── public/
│   └── data/
│       ├── regions_whole_brain.json
│       └── *.glb                   # 3D brain region files
├── src/
│   ├── components/
│   │   ├── BrainRegionViewer.jsx
│   │   ├── RegionMesh.jsx
│   │   ├── ControlsOverlay.jsx
│   │   └── TooltipOverlay.jsx
│   └── main.jsx
├── .gitignore
├── index.html
└── README.md
\`\`\`

---

## 🧾 License

MIT © [Adham Elshahabi](https://elshahabi.com)

---

## 📬 Contact

Got feedback or ideas? Feel free to open an issue or contact me at [adham.elshahabi@gmail.com](mailto:adham.elshahabi@gmail.com)
