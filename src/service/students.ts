import axiosInstance from "./axios";

export const patchStudentStatus = async (id: string | number, status: string) => {
  try {
    const formData = new FormData();
    formData.append("status", status);

    const response = await axiosInstance.patch(
      `${import.meta.env.VITE_API_BASE_URL}/students/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error updating student ${id} status:`, error);
    throw error?.response?.data || error;
  }
};
