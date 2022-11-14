import axios from "axios";

const instance = axios.create({
  baseURL: `http://54.167.47.89:3001/api/`,
//  baseURL: `http://localhost:3001/api/`
});

export default instance;
