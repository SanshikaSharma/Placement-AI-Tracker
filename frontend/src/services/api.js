import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://placement-ai-tracker-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
  Get the latest authentication token before every request.
*/
api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
  Notify the React app whenever a successful data-changing
  API request is completed.

  GET requests are intentionally ignored because they only
  read data.
*/
api.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toLowerCase();

    const dataChangingMethods = ["post", "put", "patch", "delete"];

    if (dataChangingMethods.includes(method)) {
      window.dispatchEvent(
        new CustomEvent("placement-data-updated", {
          detail: {
            method,
            url: response.config?.url || "",
          },
        })
      );
    }

    return response;
  },
  (error) => Promise.reject(error)
);

export default api;