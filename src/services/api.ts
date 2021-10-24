import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000'
});

export const setToken = (token: string) => {
  api.defaults.headers.common.authorization = `Bearer ${token}`;
}