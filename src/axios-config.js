import axios from "axios";

const instance = axios.create({
  baseURL: `https://main.d21yxttbe8c7wa.amplifyapp.com/api/`,
//  baseURL: `http://localhost:3001/api/`
});

export default instance;
