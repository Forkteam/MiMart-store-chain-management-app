import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';
import {history} from '../../index';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';

//section 6 axios xử lý khi user edit, create, delete sẽ lưu xuống db

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use((config) =>{
    const token = window.localStorage.getItem('jwt');
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error =>{
    return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error =>{
    if(error.message === 'Network Error' && !error.respone){
        toast.error('Network error - make sure API is running!');
    }
    const{status, data, config} = error.response;
    if(status === 404){
        history.push('/notfound');
    }
    if(status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')){
        history.push('/notfound');
    }
    if(status === 500){
        toast.error('Server error - check the terminal for more infor!');
    }
    throw error.response;
    
})

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const request = {
    
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body:{}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body:{}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
}

const Activities = {
    list: (): Promise<IActivity[]> => request.get('/activities'),
    details: (id:string) => request.get(`/activities/${id}`),
    create: (activity:IActivity) => request.post('/activities', activity),
    update: (activity:IActivity) => request.put(`/activities/${activity.id}`, activity),
    delete: (id:string) => request.del(`/activities/${id}`)
}

const User = {
    currentUser: (): Promise<IUser> => request.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => request.post(`/user/login`, user),
    register: (user: IUserFormValues): Promise<IUser> => request.post(`/user/register`, user),
}
export default{
    Activities, User
}