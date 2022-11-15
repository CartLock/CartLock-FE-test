import axios from "axios";

const instance = axios.create({
  baseURL: `http://107.20.167.172:3001/api/`,
//  baseURL: `http://localhost:3001/api/`
});

export default instance;
