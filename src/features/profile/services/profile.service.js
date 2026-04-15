import { axiosConfig } from "../../../features/auth/config/axiosConfig";

export const getProfile = async () => {
  const res = await axiosConfig.get("/profile/crew");
  return res.data.data;
};

export const updatePersonalDetails = async (payload) => {
  const res = await axiosConfig.patch(
    "/profile/crew/identity/personal-details",
    payload,
  );
  return res.data.data;
};

export const updateNationalityProof = async (formData) => {
  const res = await axiosConfig.patch(
    "/profile/crew/identity/nationality-proof",
    formData,
  );
  return res.data.data;
};
