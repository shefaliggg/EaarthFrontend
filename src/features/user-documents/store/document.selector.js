export const getDocumentsByType = (documents, type) => {
  if (!documents || !type) return null;
  return documents?.filter((doc) => doc?.documentType === type);
};

export const getPrimaryDocument = (documents, type) => {
  if (!documents || !type) return null;
  return documents?.find((doc) => doc?.documentType === type && doc?.isPrimary);
};

export const getResolvedDocument = (documents, id) => {
  if (!documents || !id) return null;
  return documents?.find((doc) => String(doc?._id) === String(id) ?? null);
};

export const selectDocumentUrlById = (state, docId) => {
  const doc = selectDocumentById(state, docId);
  return doc?.url || null;
};

export const getDisplayDocument = (docId, reuseId, file, docs) => {
  if (file) {
    return {
      originalName: file.name,
      url: null,
      isLocal: true,
    };
  }

  if (reuseId) {
    return docs?.find((d) => String(d._id) === String(reuseId));
  }
  // 3. Existing backend doc
  if (docId) {
    return docs?.find((d) => String(d._id) === String(docId));
  }

  return null;
};
