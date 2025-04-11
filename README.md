## 🚀 Tech Stack

- **Next.js**: Used for its **server-side rendering (SSR)** capabilities, image optimization, and built-in API routes. It allows for server-side fetch logic without a separate backend.
- **Fuzzy Search Library**: Handles fuzzy search logic, enabling users to search by **title, co-actors, or genre** with tolerance for typos and approximate matches.
- **React Player**: Used on the movie player page to **embed video playback with controls**.
- **Google Colab**: Data was preprocessed using [this Colab notebook](https://colab.research.google.com/drive/10xm_d--qbRYUmkDCMCj_d_6h3RVMBXjL?usp=sharing) to clean and organize movie data.

---

## ⚙️ Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/nelsonfai/cageflix
   cd cageflix
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Data Handling

- **Data Source**: Movies data is processed and cleaned using Google Colab. Fields include:
  - Movie name
  - Runtime
  - Release year
  - Co-stars
  - Rating
- **Storage**: Cleaned data is stored in `data.json` and served like a database.
- **API**: All server-side logic (fetching, filtering, search) is handled in `api/**/route.js` endpoints.

---

## 🔍 Features

- **Home Page**:
  - Displays movies grouped by categories.
  - Only categories with **8+ items** are shown.
  - Implements **infinite scroll**: loads more movies as you scroll.
  - Option to view **all movies in a category**.

- **Search Page**:
  - Accepts a search term and queries `api/search`.
  - Returns **paginated results** using fuzzy search.
  - Provides **related search terms** for better discovery.

- **Movie Player Page**:
  - Uses `react-player` to play videos with playback controls.

---

## 🛠 Known Issues / Limitations

- No persistent backend; all logic is handled server-side within the Next.js app.
- Data is static and does not reflect real-time updates unless manually modified in `data.json`.
- Search results are based on fuzzy matching, which might occasionally return irrelevant results.

---

## 🌱 Future Enhancements

- Develop a dedicated **backend** for:
  - More complex filtering
  - User authentication
  - Tracking and storing most-searched keywords
- Add **user preferences** to personalize homepage content (e.g., show genres related to previously watched movies).
- Optimize performance for large data sets.
- Integrate an external API (optional) for real-time updates or additional metadata.

---

## 🌐 Live Application

You can view the live version of the application here: [CageFlix - Live](https://cageflix-fai.vercel.app/)

---

## 📊 Data Processing Notebook

The data was preprocessed and cleaned using this [Google Colab notebook](https://colab.research.google.com/drive/10xm_d--qbRYUmkDCMCj_d_6h3RVMBXjL?usp=sharing), where you can review and modify the data structure as needed.

---

## 💻 Repository

You can find the source code for this project on GitHub: [https://github.com/nelsonfai/cageflix](https://github.com/nelsonfai/cageflix)

