import axios from "axios";

const Axios = axios.create({
baseURL: "https://main.d21yxttbe8c7wa.amplifyapp.com/admin",
 //baseURL: "http://localhost:3001/admin",
});

// Axios.defaults.headers.Accept = "";
// Axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
// Axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
export default Axios;
