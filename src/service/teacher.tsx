
import axios from "axios";
import axiosInstance from "./axios";

export const teacherRegistration = async (teacherData: any) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/otp/register/`,
      {
        phone: teacherData.phone,
        first_name: teacherData.first_name,
        last_name: teacherData.last_name,
        email: teacherData.email,
        role: "TEACHER",
        school: teacherData.school || "",
        division: teacherData.division || "",
        class_name: teacherData.class || "",
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Teacher Registration Error:", error);
    throw error?.response?.data || error;
  }
}; 



export const handleGetSchoolNames = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schools/lookup/`);
    return response.data;           
    } catch (error: any) {  
        console.error('Error fetching school names:', error);
        throw error?.response?.data || error;
    }   
}

export const getTeacherStudents = async () => {
  try {
    const response = await axiosInstance.get(`${import.meta.env.VITE_API_BASE_URL}/students/`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching teacher students:", error);
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
  school: string | number;
  guardian_phone: string;
  class_name: string;
  division: string;
  status: string;
  photo?: string | null;
}) => {
  try {
    const formData = new FormData();
    formData.append("full_name", studentData.full_name);
    formData.append("school", String(studentData.school));
    formData.append("guardian_phone", studentData.guardian_phone);
    formData.append("class_name", studentData.class_name);
    formData.append("division", studentData.division);
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

export const updateStudent = async (
  id: string | number,
  studentData: {
    full_name: string;
    school: string | number;
    guardian_phone: string;
    class_name: string;
    division: string;
    status?: string;
    photo?: string | null;
  }
) => {
  try {
    const formData = new FormData();
    formData.append("full_name", studentData.full_name);
    formData.append("school", String(studentData.school));
    formData.append("guardian_phone", studentData.guardian_phone);
    formData.append("class_name", studentData.class_name);
    formData.append("division", studentData.division);
    if (studentData.status) {
      formData.append("status", studentData.status);
    }

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
    console.error(`Error updating student ${id}:`, error);
    throw error?.response?.data || error;
  }
};

export const handleVerifyOTP = async (phone: string, code: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/otp/register/verify/`, {
        phone,
        code,        
    });     
    return response.data;                                               

    } catch (error: any) {
        console.error('Error verifying OTP:', error);
        throw error?.response?.data || error;
  }
}


export const handleGetTeacherDetails = async () => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_BASE_URL}/auth/me/`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching teacher details:", error);
    throw error;
  }
};
