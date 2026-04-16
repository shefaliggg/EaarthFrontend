// export const downloadFileFromUrl = async (signedUrl, fileName = "document.pdf") => {
//   const response = await fetch(signedUrl);

//   if (!response.ok) throw new Error("Failed to fetch file for download");

//   const blob = await response.blob();
//   const blobUrl = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = blobUrl;
//   link.download = fileName;
//   document.body.appendChild(link);
//   link.click();

//   // Cleanup
//   document.body.removeChild(link);
//   URL.revokeObjectURL(blobUrl);
// };

export const downloadFileFromUrl = (signedUrl, fileName) => {
  const link = document.createElement("a");
  link.href = signedUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
