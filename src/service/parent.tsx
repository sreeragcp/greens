import axiosInstance from "./axios";

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

export const getParentStudents = async () => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_BASE_URL}/students/`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching parent students:", error);
    throw error?.response?.data || error;
  }
};

export const patchParentStudent = async (
  id: string | number,
  studentData: {
    full_name?: string;
    date_of_birth?: string;
    blood_group?: string;
    gender?: string;
    parent_name?: string;
    guardian_phone?: string;
    address?: string;
    emergency_contact?: string;
    photo?: string | null;
  }
) => {
  try {
    const formData = new FormData();
    if (studentData.full_name) formData.append("full_name", studentData.full_name);
    if (studentData.date_of_birth) formData.append("date_of_birth", studentData.date_of_birth);
    if (studentData.blood_group) formData.append("blood_group", studentData.blood_group);
    if (studentData.gender) formData.append("gender", studentData.gender);
    if (studentData.parent_name) formData.append("parent_name", studentData.parent_name);
    if (studentData.guardian_phone) formData.append("guardian_phone", studentData.guardian_phone);
    if (studentData.address) formData.append("address", studentData.address);
    if (studentData.emergency_contact) formData.append("emergency_contact", studentData.emergency_contact);

    if (studentData.photo) {
      if (studentData.photo.startsWith("data:")) {
        const blob = dataURLtoBlob(studentData.photo);
        formData.append("photo", blob, "photo.png");
      } else {
        formData.append("photo", studentData.photo as any);
      }
    }

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
    console.error(`Error patching parent student ${id}:`, error);
    throw error?.response?.data || error;
  }
};
