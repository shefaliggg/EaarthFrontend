import { axiosConfig } from "../config/axiosConfig";

// UPDATE PROFILE
export const updateUserProfile = async (payload) => {
  const { data } = await axiosConfig.patch("/user/profile", payload);
  return data?.data?.user || data?.user || data;
};

// UPDATE USER TYPE (SAFE)
export const updateUserType = async (userType) => {
  let normalizedUserType = userType;

  if (Array.isArray(userType)) {
    normalizedUserType = userType[0];
  }

  if (!normalizedUserType || typeof normalizedUserType !== "string") {
    throw new Error("Invalid user type");
  }

  const { data } = await axiosConfig.patch("/user/type", {
    userType: normalizedUserType,
  });

  return data?.data || data;
};

// ACTIVITY LOG
export const getUserActivityLog = async () => {
  const { data } = await axiosConfig.get("/user/activity");
  return data?.data?.activityLog || data;
};

// STUDIOS
export const getUserStudios = async () => {
  const { data } = await axiosConfig.get("/user/studios");
  return data?.data?.studios || data;
};

// AGENCIES
export const getUserAgencies = async () => {
  const { data } = await axiosConfig.get("/user/agencies");
  return data?.data?.agencies || data;
};

// DOCUMENT UPLOAD
export const updateVerificationDocuments = async (formData) => {
  const { data } = await axiosConfig.post(
    "/user/verification/upload",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data?.data?.verification || data;
};
