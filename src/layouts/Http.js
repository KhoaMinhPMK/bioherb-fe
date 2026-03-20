import axios from "axios";

axios.interceptors.response.use(
    (response) => response,
    (error) => {
    }
);
export default axios;
