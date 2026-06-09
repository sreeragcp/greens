
import axios from "axios";
import axiosInstance from "./axios";

export const teacherRegistration = async (teacherData: any) => {
  try {
    const payload: any = {
      phone: teacherData.phone,
      first_name: teacherData.first_name,
      last_name: teacherData.last_name,
      email: teacherData.email,
      role: "TEACHER",
      school: teacherData.school || "",
      division: teacherData.division || "",
      class_name: teacherData.class || "",
    };

    if (teacherData.password) {
      payload.password = teacherData.password;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/register/`,
      payload
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
  teacher_name?: string;
  admission_no?: string;
  school: string | number;
  guardian_phone: string;
  guardian_name?: string;
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
    if (studentData.guardian_name) formData.append("guardian_name", studentData.guardian_name);
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

export const updateStudent = async (
  id: string | number,
  studentData: {
    full_name: string;
    teacher_name?: string;
    admission_no?: string;
    school: string | number;
    guardian_phone: string;
    guardian_name?: string;
    class_name: string;
    division: string;
    date_of_birth?: string;
    blood_group?: string;
    gender?: string;
    address?: string;
    emergency_contact?: string;
    status?: string;
    photo?: string | null;
  }
) => {
  try {
    const formData = new FormData();
    formData.append("full_name", studentData.full_name);
    if (studentData.teacher_name) formData.append("teacher_name", studentData.teacher_name);
    if (studentData.admission_no) formData.append("admission_no", studentData.admission_no);
    formData.append("school", String(studentData.school));
    formData.append("guardian_phone", studentData.guardian_phone);
    if (studentData.guardian_name) formData.append("guardian_name", studentData.guardian_name);
    formData.append("class_name", studentData.class_name);
    formData.append("division", studentData.division);
    if (studentData.date_of_birth) formData.append("date_of_birth", studentData.date_of_birth);
    if (studentData.blood_group) formData.append("blood_group", studentData.blood_group);
    if (studentData.gender) formData.append("gender", studentData.gender);
    if (studentData.address) formData.append("address", studentData.address);
    if (studentData.emergency_contact) formData.append("emergency_contact", studentData.emergency_contact);
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
