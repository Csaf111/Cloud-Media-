import { BlobServiceClient } from "@azure/storage-blob";
import { useEffect, useState } from "react";
import "./App.css";

const containerName = import.meta.env.VITE_STORAGE_CONTAINER;
const sasToken = import.meta.env.VITE_STORAGE_SAS;
const storageAccountName = import.meta.env.VITE_STORAGE_ACCOUNT;

const blobService = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net${sasToken}`
);

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [blobList, setBlobList] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [folder, setFolder] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sortOption, setSortOption] = useState("date-desc");
  const containerClient = blobService.getContainerClient(containerName);

  useEffect(() => {
    fetchBlobs();
  }, []);

  const fetchBlobs = async () => {
    const list = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      list.push({
        url: `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}${sasToken}`,
        name: blob.name,
        size: blob.properties?.contentLength || 0,
        lastModified: blob.properties?.lastModified || new Date()
      });
    }
    setBlobList(list);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 50 * 1024 * 1024) {
      alert("File size exceeds 50MB limit.");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const blobName = `${folder ? folder + "/" : ""}${Date.now()}-${selectedFile.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    setUploadProgress(0);

    await blockBlobClient.uploadBrowserData(selectedFile, {
      onProgress: (ev) => {
        const percent = Math.round((ev.loadedBytes / selectedFile.size) * 100);
        setUploadProgress(percent);
      }
    });

    setSelectedFile(null);
    setUploadProgress(0);
    fetchBlobs();
  };

  const handleDeleteBlob = async (blobUrl) => {
    const blobName = decodeURIComponent(blobUrl.split("/").pop().split("?")[0]);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
    fetchBlobs();
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop().split("?")[0];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (name) => {
    if (/\.(jpeg|jpg|png|gif)$/i.test(name)) return "🖼";
    if (/\.(mp4|webm|ogg)$/i.test(name)) return "🎬";
    if (/\.(mp3)$/i.test(name)) return "🎵";
    if (/\.(pdf)$/i.test(name)) return "📕";
    if (/\.(doc|docx)$/i.test(name)) return "📄";
    if (/\.(txt)$/i.test(name)) return "📜";
    return "📁";
  };

  const sortFiles = (files) => {
    switch (sortOption) {
      case "size-asc":
        return files.sort((a, b) => a.size - b.size);
      case "size-desc":
        return files.sort((a, b) => b.size - a.size);
      case "date-asc":
        return files.sort((a, b) => new Date(a.lastModified) - new Date(b.lastModified));
      case "date-desc":
      default:
        return files.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    }
  };

  const filteredList = sortFiles(
    blobList.filter((blob) =>
      blob.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const categorizedFiles = {
    images: [],
    videos: [],
    audios: [],
    documents: [],
  };

  filteredList.forEach((file) => {
    const name = file.name.toLowerCase();
    if (/(jpeg|jpg|png|gif)$/i.test(name)) categorizedFiles.images.push(file);
    else if (/(mp4|webm|ogg)$/i.test(name)) categorizedFiles.videos.push(file);
    else if (/(mp3)$/i.test(name)) categorizedFiles.audios.push(file);
    else if (/(pdf|doc|docx|txt)$/i.test(name)) categorizedFiles.documents.push(file);
  });

  const renderFiles = (list) => (
    <div className={viewMode === "grid" ? "media-gallery" : "media-list"}>
      {list.map(({ url, name, size }, index) => (
        <div key={index} className="media-item">
          <span style={{ fontSize: "2rem" }}>{getFileIcon(name)}</span>
          {/\.(jpeg|jpg|png|gif)$/i.test(name) ? (
            <img src={url} alt={name} />
          ) : /\.(mp4|webm|ogg)$/i.test(name) ? (
            <video src={url} controls />
          ) : /\.(mp3)$/i.test(name) ? (
            <audio controls>
              <source src={url} type="audio/mpeg" />
            </audio>
          ) : /\.(pdf|doc|docx|txt)$/i.test(name) ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              📄 {name} (Preview)
            </a>
          ) : (
            <p>Unsupported file type</p>
          )}
          <p>{name}</p>
          <p className="text-sm text-gray-400">{formatSize(size)}</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="delete-btn" onClick={() => handleDeleteBlob(url)}>🗑 Delete</button>
            <button className="delete-btn" onClick={() => handleDownload(url)}>⬇ Download</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="App">
      <h1 className="text-4xl font-bold text-white text-center mb-6">📁 Media Drive</h1>

      <div className="upload-form">
        <input
          type="file"
          accept="image/*,video/*,audio/mpeg,application/pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />
        <input
          type="text"
          placeholder="Optional folder name"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px" }}
        />
        <button onClick={handleUpload}>⬆ Upload</button>
        <input
          type="text"
          placeholder="🔍 Search files"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px" }}
        />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ padding: "0.5rem", borderRadius: "6px" }}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="size-desc">Largest First</option>
          <option value="size-asc">Smallest First</option>
        </select>
        <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>🔁 Toggle View</button>
      </div>

      {uploadProgress > 0 && (
        <div className="upload-progress" style={{ margin: "1rem 0" }}>
          <p>Uploading: {uploadProgress}%</p>
          <div style={{ background: "#333", borderRadius: "8px", overflow: "hidden" }}>
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "8px",
                background: "#4caf50"
              }}
            ></div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-white mt-6">🖼 Images</h2>
      {renderFiles(categorizedFiles.images)}

      <h2 className="text-2xl font-semibold text-white mt-6">🎬 Videos</h2>
      {renderFiles(categorizedFiles.videos)}

      <h2 className="text-2xl font-semibold text-white mt-6">🎵 Audios</h2>
      {renderFiles(categorizedFiles.audios)}

      <h2 className="text-2xl font-semibold text-white mt-6">📄 Documents</h2>
      {renderFiles(categorizedFiles.documents)}
    </div>
  );
}



export default App;
