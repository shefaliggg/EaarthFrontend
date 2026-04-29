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

/** Remove a doc from the array by _id. */
export const removeDoc = (list, id) => list.filter((d) => d._id !== id);
