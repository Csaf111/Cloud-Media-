const { BlobServiceClient } = require('@azure/storage-blob');
const multipart = require('busboy');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.CONTAINER_NAME;

module.exports = async function (context, req) {
  try {
    const boundary = multipart.getBoundary(req.headers['content-type']);
    const body = multipart.Parse(req.body, boundary);
    const file = body[0]; // File object

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(file.filename);

    await blockBlobClient.uploadData(file.data);

    context.res = {
      status: 200,
      body: `✅ File '${file.filename}' uploaded successfully.`
    };
  } catch (error) {
    context.log.error("❌ Upload failed:", error);
    context.res = {
      status: 500,
      body: `❌ Error uploading file: ${error.message}`
    };
  }
};
