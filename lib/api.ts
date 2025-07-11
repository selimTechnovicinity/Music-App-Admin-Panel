import { TResetPasswordData } from "@/app/(auth)/forgot-password/verify/reset-password/page";
import { PasswordFormData, TUpdateData } from "@/app/(withCommonLayout)/admin-profile/page";
import { FAQData } from "@/app/(withCommonLayout)/faq/create/page";
import { UpdateFAQData } from "@/app/(withCommonLayout)/faq/edit/[id]/page";
import { PrivacyData } from "@/app/(withCommonLayout)/privacy/page";
import { TRegisterData } from "@/app/(withCommonLayout)/users/create/page";
import API from "./axios-client";
import { TUser } from "@/types/user";

type forgotPasswordType = { email: string };
type resetPasswordType = { password: string; verificationCode: string };

type LoginType = {
  email: string;
  password: string;
};

type registerType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};


type verifyEmailType = { code: string };

export const loginMutationFn = async (data: LoginType) =>
  await API.post("/auth/login", data);

export const registerMutationFn = async (data: registerType) =>
  await API.post(`/auth/register`, data);

export const verifyEmailMutationFn = async (data: verifyEmailType) =>
  await API.post(`/auth/verify/email`, data);

export const forgotPasswordMutationFn = async (data: forgotPasswordType) =>
  await API.post(`/auth/password/forgot`, data);

export const resetPasswordMutationFn = async (data: resetPasswordType) =>
  await API.post(`/auth/password/reset`, data);

export const logoutMutationFn = async () => await API.post(`/auth/logout`);

// Song

export const getSongFormats = async () => await API.get("/song_formats");

export const updateUser = async (formData: TUpdateData) => {
  const res = await API.post(`/users/user`, formData);

  const userInfo = await res.data;

  return userInfo;
};
export const updatePasswordFn = async (formData: PasswordFormData) => {
  const res = await API.post(`/auth/change-password`, formData);
  const result = await res.data;
  return result;
};

export const getUser = async () => {
  const res = await API.get(`/users/user`);

  return res.data;
};
export const getUserById = async (id: string) => {
  const res = await API.get(`/users/musician/${id}`);

  return res.data;
};

export const getAllUsers = async (
  role: string,
  pageNo?: number,
  limit?: number,
  searchQuery?: string
): Promise<{ data: TUser[]; pagination: { totalPages: number } }> => {
  const res = await API.get(
    `/users?page=${pageNo}&limit=${limit}&role=${role}&search=${searchQuery}`
  );
  const users = res.data;
  return users;
};

export const restoreUser = async (id: { id: string }) => {
  const res = await API.patch(`/users/restore`, id);
  return res.data;
};

export const disableUser = async (id: { id: string }) => {
  const res = await API.delete(`/users`, { data: id });

  const userInfo = await res.data;
  return userInfo;
};

export const userRegister = async (formData: TRegisterData) => {
  const res = await API.post(`/auth/register`, formData);
  const userInfo = await res.data;
  return userInfo;
};

export const updateUserById = async (id: string, formData: TUpdateData) => {
  const res = await API.post(`/users/admin/${id}`, formData);
  const result = await res.data;
  return result;
};

export const createPrivacy = async (privacyData: PrivacyData) => {
  const res = await API.post(`/additonals/privacy_policy`, privacyData);
  const result = await res.data;
  return result;
};

export const createTerms = async (privacyData: PrivacyData) => {
  const res = await API.post(`/additonals/terms_conditions`, privacyData);
  const result = await res.data;
  return result;
};

export const createFAQ = async (updatedFaqData: FAQData) => {
  const res = await API.post(`/additonals/faq`, updatedFaqData);
  const result = await res.data;
  return result;
};

export const updateFAQById = async (id: string, faqData: UpdateFAQData) => {
  const res = await API.put(`/additonals/faq/${id}`, faqData);
  const result = await res.data;
  return result;
};

export const getPrivacy = async () => {
  const res = await API.get(`/additonals/privacy_policy`);
  const result = await res.data;
  return result;
};

export const getTerms = async () => {
  const res = await API.get(`/additonals/terms_conditions`);
  const result = await res.data;
  return result;
};

export const getFAQ = async () => {
  const res = await API.get(`/additonals/faq`);
  const result = res.data;
  return result;
};

export const getPrivacyById = async (id: string) => {
  const res = await API.get(`/additonals/privacy_policy/${id}`);
  const result = res.data;
  return result;
};

export const getTermsById = async (id: string) => {
  const res = await API.get(`/additonals/terms_conditions/${id}`);
  const result = res.data;
  return result;
};

export const getFAQById = async (id: string) => {
  const res = await API.get(`/additonals/faq/${id}`);
  const result = res.data;
  return result;
};

export const deleteFAQById = async (id: string) => {
  const res = await API.delete(`/additonals/faq/${id}`);
  const result = res.data;
  return result;
};

export const getContacts = async () => {
  const res = await API.get(`/contacts`);
  const result = res.data;
  return result;
};

export const getContactsById = async (id: string) => {
  const res = await API.get(`/contacts/${id}`);
  const result = res.data;
  return result;
};

//forgot password

export const forgetPassword = async (email: { email: string }) => {
  const res = await API.post(`/auth/forget-password`, email);

  const result = res.data;
  return result;
};

export const submitOTP = async (otpData: { otp: string; email: string }) => {
  const res = await API.post(`/auth/forget-password/verify-otp`, otpData);

  const result = res.data;
  return result;
};

export const resetPassword = async (formData: TResetPasswordData) => {
  const res = await API.post(`/auth/reset-password`, formData);
  const result = res.data;

  return result;
};
