import axios from "axios";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
//axios.defaults.headers["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem('token')}`;



export const baseUrl = axios.create({
  baseURL: "https://panel.farostaha.net/"
});


