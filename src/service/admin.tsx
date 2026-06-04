import axiosInstance from "./axios";

export const getAdminDashboard = async () => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_BASE_URL}/students/admin/dashboard/`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching admin dashboard:", error);
    throw error?.response?.data || error;
  }
};

export const getStudents = async (params?: { school?: number; class_name?: string; division?: string }) => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_BASE_URL}/students/`,
      { params }
    );
    return response.data; 
  } catch (error: any) {
    console.error("Error fetching students:", error);
    throw error?.response?.data || error;
  }
};

export const getSchools = async () => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_BASE_URL}/schools/`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching schools:", error);
    throw error?.response?.data || error;
  }
};
export const getSchoolClasses = async (schoolId: number) => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_BASE_URL}/schools/${schoolId}/classes/`
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching classes for school ${schoolId}:`, error);
    throw error?.response?.data || error;
  }
};

export const getTemplates = async () => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_BASE_URL}/templates/`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    throw error?.response?.data || error;
  }
};

export const getTemplateById = async (id: string | number) => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_BASE_URL}/templates/${id}/`
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching template ${id}:`, error);
    throw error?.response?.data || error;
  }
};

export const uploadTemplate = async (file: File, name: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_BASE_URL}/templates/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error uploading template:", error);
    throw error?.response?.data || error;
  }
};

export const updateTemplate = async (
  id: string | number,
  payload: Record<string, unknown>
) => {
  try {
    const response = await axiosInstance.patch(
      `${import.meta.env.VITE_API_BASE_URL}/templates/${id}/`,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error updating template ${id}:`, error);
    throw error?.response?.data || error;
  }
};

export { patchStudentStatus } from "./students";

export const deleteTemplate = async (id: string | number) => {
  try {
    const response = await axiosInstance.delete(
      `${import.meta.env.VITE_API_BASE_URL}/templates/${id}/`
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting template ${id}:`, error);
    throw error?.response?.data || error;
  }
};