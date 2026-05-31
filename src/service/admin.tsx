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