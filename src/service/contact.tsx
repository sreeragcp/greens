import axiosInstance from "./axios";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const sendContactMessage = async (payload: ContactPayload) => {
  const response = await axiosInstance.post("/contact/", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
