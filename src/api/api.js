import axios from 'axios';

let base1 = 'http://localhost:8001';
let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/network/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/network/list`, { params: params }); };

export const getNetworkTypeList = params => { return axios.get(`${base}/network/type/list`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };


export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

//子网相关请求
export const getSubnetList = params =>{return axios.get(`${base}/subnet/list`,{params: params})};

export const deleteSubnet = params =>{return axios.delete(`${base}/subnet/`,{params:params});};

export const addSubnet = params =>{return axios.post(`${base}/subnet/`,{params:params});};

export const editSubnet = params =>{return axios.put(`${base}/subnet/`,{params:params});};



