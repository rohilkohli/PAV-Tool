<div align="center">

# 🛠️ PAV Tool - Physical Asset Verification

### _Streamline your asset management with elegance and efficiency_

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success?style=for-the-badge&logo=github)](https://rohilkohli.github.io/PAV-Tool/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

---

</div>

## ✨ Overview

**PAV Tool** is a modern, intuitive web application designed for engineers and asset managers to efficiently verify and manage physical assets. Upload Excel or CSV files, search and filter assets with ease, and perform targeted updates with a beautiful, theme-aware interface.

### 🎯 Key Features

<table>
<tr>
<td width="50%">

#### 📁 **Smart File Handling**
- Upload Excel (.xlsx, .xls) and CSV files
- Automatic data parsing and validation
- Preserve original file structure
- Export verified data seamlessly

</td>
<td width="50%">

#### 🔍 **Advanced Filtering**
- Search by Serial Number or Asset Code
- Filter by Asset Type, Model, and Status
- Real-time search results
- Sort by any column

</td>
</tr>
<tr>
<td width="50%">

#### ✏️ **Intelligent Editing**
- In-line asset updates
- Conditional editing logic
- Bulk verification capabilities
- Engineer name and date tracking

</td>
<td width="50%">

#### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Theme-aware interface
- Smooth animations and transitions
- Intuitive navigation

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/rohilkohli/PAV-Tool.git

# Navigate to project directory
cd PAV-Tool

# Install dependencies
npm install

# Start development server
npm run dev
```

Your application will be running at `http://localhost:5173` 🎉

---

## 🏗️ Tech Stack

<div align="center">

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Local Storage** | Data Persistence |

</div>

---

## 📖 Usage Guide

### 1️⃣ Upload Assets
- Click the **Upload** button
- Select your Excel or CSV file
- Confirm the upload

### 2️⃣ Search & Filter
- Use the search bar to find specific assets
- Apply filters for Asset Type, Model, or PAV Status
- Sort columns by clicking headers

### 3️⃣ Verify Assets
- Click on any asset to edit
- Update PAV Status, Engineer Name, and Date
- Changes are automatically saved

### 4️⃣ Export Data
- Click **Download Verified** to export your updated data
- Maintains original file format and structure

---

## 🌐 Deployment

### GitHub Pages (Automatic)

This project is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Set **Source** to **GitHub Actions**

2. **Deploy**
   - Push changes to the `main` branch
   - GitHub Actions will automatically build and deploy

3. **Access**
   - Visit: `https://rohilkohli.github.io/PAV-Tool/`

### Manual Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Build artifacts will be in the `dist/` directory.

---

## 📂 Project Structure

```
PAV-Tool/
├── components/          # React components
├── utils/              # Utility functions
├── App.tsx             # Main application component
├── types.ts            # TypeScript type definitions
├── index.tsx           # Application entry point
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available for use under the terms specified by the repository owner.

---

## 💬 Support

For questions, issues, or suggestions:
- 🐛 [Report a Bug](https://github.com/rohilkohli/PAV-Tool/issues)
- 💡 [Request a Feature](https://github.com/rohilkohli/PAV-Tool/issues)
- 📧 Contact the maintainer

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for efficient asset management**

</div>
