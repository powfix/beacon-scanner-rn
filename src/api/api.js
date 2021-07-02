import axios from "axios";
import { create } from "apisauce";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS } from "./endpoints";

const baseURL: string = 'https://api.myservice.com';
// const baseURL: string = 'http://127.0.0.1:3000';

const axiosInstance = axios.create({ timeout: 30000, baseURL, headers: {} });

// Add a request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  // config.headers['User-Agent'] = userAgent;

  // const httpMetric = firebase.perf().newHttpMetric(config.url, config.method.toUpperCase());
  // config.metadata = { httpMetric };

  // add any extra metric attributes if needed
  // await httpMetric.putAttribute('baseURL', config.baseURL);
  // await httpMetric.putAttribute('User-Agent', config.headers['User-Agent']);
  // await httpMetric.start();

  return config;
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  async (response) => {
    // Request was successful, e.g. HTTP code 200
    if (__DEV__) console.log('axios.response:onFulfilled():response', response);
    // const { httpMetric } = response.config.metadata;

    // add any extra metric attributes if needed
    // httpMetric.putAttribute('baseURL', baseURL);

    // await httpMetric.setHttpResponseCode(response.status);
    // await httpMetric.setResponseContentType(response.headers['content-type']);
    // await httpMetric.stop();

    return response;
  },
  async (error) => {
    // Request failed, e.g. HTTP code 500
    if (__DEV__) console.warn('axios.response:onRejected():error', error);
    // const { httpMetric } = error.config.metadata;

    // add any extra metric attributes if needed
    // httpMetric.putAttribute('userId', '12345678');

    // await httpMetric.setHttpResponseCode(error.response.status);
    // await httpMetric.setResponseContentType(error.response.headers['content-type']);
    // await httpMetric.stop();

    return Promise.reject(error);
  },
);

export const api = create({ axiosInstance });

export function signOut(): Promise {
  return new Promise((resolve, reject) => {
    try {
      api.delete(ENDPOINTS.SIGN_OUT).then((r) => {
        api.deleteHeader('Authorization');
        return AsyncStorage.clear().then(resolve).catch(reject);
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}