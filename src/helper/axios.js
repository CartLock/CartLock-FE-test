import axios from "axios";

const Axios = axios.create({
baseURL: "http://107.20.167.172:3001/admin",
 //baseURL: "http://localhost:3001/admin",
});

// Axios.defaults.headers.Accept = "";
// Axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
// Axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
export default Axios;
