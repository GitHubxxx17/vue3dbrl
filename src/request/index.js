import axios from "axios";

let service = axios.create({
    baseURL: 'http://110.41.21.66:8080/ReciteMemory',
    timeout:3000
})

// service.interceptors.request.use(
//     config => {
//         if (config.method === "post") {
//             config.data = { unused: 0 };
//         }
//         config.headers["Content-type"] = 'application/x-www-form-urlencoded';
//         return config;
//     },
//     error => {
//         Promise.reject(error);
//     }
// );
export default service;