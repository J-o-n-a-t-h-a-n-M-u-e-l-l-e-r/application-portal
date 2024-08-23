const runtimeConfig = useRuntimeConfig()
const apiUrl = runtimeConfig.public.api_url
export const APPLICATIONS_ENDPOINT = `${apiUrl}/applications/`
export const STUDENTS_ENDPOINT = `${apiUrl}/applications/students/`
export const STUDENT_APPLICATIONS_ENDPOINT = (student: number) => `${apiUrl}/applications/students/${student}/applications/`
export const APPLICATION_COMMENTS_ENDPOINT = (application: number) => `${apiUrl}/applications/${application}/comments/`
export const REGISTER_ENDPOINT = `${apiUrl}/auth/register/`
export const LOGIN_ENDPOINT = `${apiUrl}/auth/login/`
export const LOGOUT_ENDPOINT = `${apiUrl}/auth/logout/`
export const PROFILE_ENDPOINT = `${apiUrl}/auth/profile/`
export const LOGOUT_ALL_ENDPOINT = `${apiUrl}/auth/logoutall/`
