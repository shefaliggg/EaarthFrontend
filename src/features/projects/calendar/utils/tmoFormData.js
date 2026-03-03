export function buildTmoFormData(data, attachments = []) {
  const formData = new FormData();

  formData.append("projectId", data.projectId);
  formData.append("name", data.name);
  formData.append("department", data.department || "");
  formData.append("status", data.status || "DRAFT");

  attachments.forEach((att) => {
    formData.append("attachments", att.file);
  });

  if (data.sections) {
    formData.append("sections", JSON.stringify(data.sections));
  }

  if (data.contacts) {
    formData.append("contacts", JSON.stringify(data.contacts));
  }

  return formData;
}