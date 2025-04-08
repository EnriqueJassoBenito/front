import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor de respuesta para refrescar el token si es necesario
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si da 401, intentamos refrescar el token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${API_BASE}/users/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem("accessToken", response.data.access);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
        originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;
        return axiosInstance(originalRequest); // Reintenta la petición original
      } catch (refreshError) {
        console.error("Error refrescando token", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
