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

export function resolveDocStatus(doc) {
  switch (doc.status) {
    case "EXPIRED":
      return { status: "expired", label: "Expired" };
    case "REVOKED":
      return { status: "rejected", label: "Revoked" };
    case "ARCHIVED":
      return { status: "inactive", label: "Archived" };
    case "ACTIVE":
    default:
      break;
  }

  switch (doc.verificationStatus) {
    case "verified":
      return { status: "active", label: "Verified" };
    case "pending_review":
      return { status: "pending", label: "Pending Review" };
    case "rejected":
      return { status: "rejected", label: "Rejected" };
    case "unverified":
    default:
      return { status: "inactive", label: "Unverified" };
  }
}
