import axios from "axios";

const instance = axios.create({
  baseURL: `http://182.77.62.52:3001/api/`,
//  baseURL: `http://localhost:3001/api/`
});

export default instance;
