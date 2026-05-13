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
  if (doc.isDeleted) {
    return {
      status: "deleted",
      label: "In Trash",
      icon: "Trash2",
    };
  }

  switch (doc.status) {
    case "EXPIRED":
      return {
        status: "expired",
        label: "Expired",
        icon: "Clock",
      };

    case "REVOKED":
      return {
        status: "rejected",
        label: "Revoked",
        icon: "XCircle",
      };

    case "ARCHIVED":
      return {
        status: "archived",
        label: "Archived",
        icon: "Archive",
      };

    case "ACTIVE":
    default:
      break;
  }

  switch (doc.verificationStatus) {
    case "verified":
      return {
        status: "active",
        label: "Verified",
        icon: "CheckCircle",
      };

    case "pending_review":
      return {
        status: "pending",
        label: "Pending Review",
        icon: "Clock",
      };

    case "rejected":
      return {
        status: "rejected",
        label: "Rejected",
        icon: "XCircle",
      };

    case "unverified":
    default:
      return {
        status: "inactive",
        label: "Unverified",
        icon: "CircleDashed",
      };
  }
}

export const upsertDoc = (list, updated) => {
  const idx = list.findIndex((d) => d._id === updated._id);
  if (idx !== -1) {
    list[idx] = updated;
  } else {
    list.unshift(updated);
  }
};

export const removeDoc = (list, id) => list.filter((d) => d._id !== id);

/**
 * Returns aiExtraction.fields from an already-fetched UserDocument.
 * Used by the reuse-document flow so no extra API call is needed.
 * Returns null if the document hasn't been AI-scanned yet.
 *
 * @param {Array}  userDocuments
 * @param {string} docId
 */
export const getDocAIFields = (userDocuments, docId) => {
  if (!docId || !userDocuments) return null;
  const doc = userDocuments.find((d) => String(d._id) === String(docId));
  if (!doc?.aiExtraction) return null;
  if (doc.aiExtraction.status !== "COMPLETED") return null;
  return doc.aiExtraction.fields ?? null;
};
