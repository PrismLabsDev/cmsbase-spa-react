import axios from 'axios';

const getBaseUrl = () => {

  const tld = process.env.REACT_APP_TLD;

  let tenant = null;
  const tenantLocal = localStorage.getItem("tenant");

  if(tenantLocal){
    tenant = JSON.parse(tenantLocal);
  }

  if(tenant){
    if(tld === "localhost"){
      return `http://${tld}/tenant/${tenant}`;
    }
    return `https://${tld}/tenant/${tenant}`;
  }

  if(tld === "localhost"){
    return `http://${tld}/admin`;
  }
  return `https://${tld}/admin`;
}

const generateAxiosInstance = () => {
  let axiosInstance = axios.create({
    baseURL: getBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  axiosInstance.interceptors.request.use((request) => {
    let accessToken = localStorage.getItem("access_token");
    if (accessToken && request.headers) {
      request.headers['Authorization'] = `Bearer ${JSON.parse(accessToken)}`;
    }
    return request;
  });
  
  axiosInstance.interceptors.response.use((response) => { 
    return response;
  }, (error) => {
    if(error.response.status < 200 || error.response.status >= 300){
      switch(error.response.status) {
        case 401:
          document.dispatchEvent(new CustomEvent('response_401', {
            detail: { message: error.response.data.message },
          }));
          break;
        case 500:
          document.dispatchEvent(new CustomEvent('response_401', {
            detail: { message: error.response.data.message },
          }));
          break;
      }
  
      document.dispatchEvent(new CustomEvent('request_error', {
        detail: { 
          message: error.response.data.message 
        },
      }));
  
      return error.response;
    }
  });

  return axiosInstance;
}

const useAxios = () => {
  return generateAxiosInstance();
};

let axiosInstance = generateAxiosInstance();

export { axiosInstance as http };
export { axios };
export { useAxios };
