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

export const getMasterData = async () => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_BASE_URL}/schools/master-data/`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching master data:", error);
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

const dataURLtoBlob = (dataUrl: string) => {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
};

export const createStudent = async (studentData: {
  full_name: string;
  teacher_name?: string;
  admission_no?: string;
  school: string | number;
  guardian_phone: string;
  parent_name?: string;
  class_name: string;
  division: string;
  date_of_birth?: string;
  blood_group?: string;
  gender?: string;
  address?: string;
  emergency_contact?: string;
  status: string;
  photo?: string | null;
}) => {
  try {
    const formData = new FormData();
    formData.append("full_name", studentData.full_name);
    if (studentData.teacher_name) formData.append("teacher_name", studentData.teacher_name);
    if (studentData.admission_no) formData.append("admission_no", studentData.admission_no);
    formData.append("school", String(studentData.school));
    formData.append("guardian_phone", studentData.guardian_phone);
    if (studentData.parent_name) formData.append("parent_name", studentData.parent_name);
    formData.append("class_name", studentData.class_name);
    formData.append("division", studentData.division);
    if (studentData.date_of_birth) formData.append("date_of_birth", studentData.date_of_birth);
    if (studentData.blood_group) formData.append("blood_group", studentData.blood_group);
    if (studentData.gender) formData.append("gender", studentData.gender);
    if (studentData.address) formData.append("address", studentData.address);
    if (studentData.emergency_contact) formData.append("emergency_contact", studentData.emergency_contact);
    formData.append("status", studentData.status);

    if (studentData.photo) {
      if (studentData.photo.startsWith("data:")) {
        const blob = dataURLtoBlob(studentData.photo);
        formData.append("photo", blob, "photo.png");
      } else {
        formData.append("photo", studentData.photo as any);
      }
    }

    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_BASE_URL}/students/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating student:", error);
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