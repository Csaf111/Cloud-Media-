# 🌐 Azure Media Drive

A full-featured, cloud-native media-sharing platform built with **React** and **Azure Blob Storage**. Users can upload, view, and manage images, videos, audios, PDFs, and document files — just like Google Drive.

---

## 🚀 Features

- ✅ Upload files to Azure Blob Storage using SAS tokens
- ✅ Folder-based file organization
- ✅ Real-time **upload progress** indicator
- ✅ Smart file **categorization** (Images, Videos, Audio, Documents)
- ✅ **Previews** for:
  - Images (JPG, PNG, GIF)
  - Videos (MP4, WebM)
  - Audios (MP3)
  - Documents (PDF, DOCX, TXT)
- ✅ Icons for file types (🖼️, 🎬, 🎵, 📄)
- ✅ Sort files by:
  - Size (Smallest/Largest)
  - Upload Date (Newest/Oldest)
- ✅ Toggle between **grid view** and **list view**
- ✅ Search bar for filtering files
- ✅ Download & delete functionality

---

## 🧠 Tech Stack

| Frontend        | Backend         | Cloud Storage        |
|-----------------|-----------------|-----------------------|
| React + Vite    | Azure Functions (optional) | Azure Blob Storage   |
| Tailwind CSS    | GitHub Actions (optional) | Azure Static Web App |

---

## 📂 Folder Structure
/src
/components # React UI components
/functions # Optional Azure Functions backend
.env # Environment variables (DO NOT COMMIT THIS)
public/ # Static assets


---

## 📦 Getting Started Locally

### 1️⃣ Clone the Repository


git clone https://github.com/Csaf111/Cloud-Media.git
cd Cloud-Media

### 2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables
Create a .env file with the following:

env
Copy
Edit
VITE_STORAGE_ACCOUNT=your-storage-account-name
VITE_STORAGE_SAS=?yourSASToken
VITE_STORAGE_CONTAINER=your-container-name

4️⃣ Run Locally
bash
Copy
Edit
npm run dev

☁️ Hosting on Azure
This app is optimized for Azure Static Web Apps.

You can deploy it directly from GitHub using Azure’s CI/CD or with:

bash
Copy
Edit
npm run build

Then upload /dist folder contents to Azure Static Web App or any static hosting provider.

📸 Demo Preview
![image](https://github.com/user-attachments/assets/a3c64438-7d38-47b3-a18a-e6c35aa71ce5)





