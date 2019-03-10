import axios from 'axios';

let base1 = 'http://localhost:8001';
let base = '';

//网络相关请求
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getNetworkList = params => { return axios.get(`${base}/network/list`, { params: params }); };

export const getNetworkTypeList = params => { return axios.get(`${base}/network/type/list`, { params: params }); };

export const getProjectList = params => { return axios.get(`${base}/project/list`, { params: params }); };

export const getRoleList = params => { return axios.get(`${base}/role/list`, { params: params }); };

export const getPhysicalList = params => { return axios.get(`${base}/physical/list`, { params: params }); };

export const addNetwork = params =>{return axios.post(`${base}/network/`,params);};

export const editNetwork = params =>{return axios.put(`${base}/network/`,params);};

export const deleteNetwork = params =>{return axios.delete(`${base}/network/`,{params:params});};


//子网相关请求
export const getSubnetList = params =>{return axios.get(`${base}/subnet/list`,{params: params})};

export const deleteSubnet = params =>{return axios.delete(`${base}/subnet/`,{params:params});};

export const addSubnet = params =>{return axios.post(`${base}/subnet/`,params);};

export const editSubnet = params =>{return axios.put(`${base}/subnet/`,{params:params});};


//主机相关请求
export const getServerList = params =>{return axios.get(`${base}/server/list`,{params: params})};

export const deleteServer = params =>{return axios.delete(`${base}/server/`,{params:params});};

export const addServer = params =>{return axios.post(`${base}/server/`,params);};

export const editServer = params =>{return axios.put(`${base}/server/`,{params:params});};

export const getConsleUrl = params =>{return axios.get(`${base}/server/url`,{params:params});};

//用户相关请求
export const getUserList = params =>{return axios.get(`${base}/user/list`,{params: params})};

export const deleteUser = params =>{return axios.delete(`${base}/user/`,{params:params});};

export const addUser = params =>{return axios.post(`${base}/user/`,params);};

export const editUser = params =>{return axios.put(`${base}/user/`,params);};

export const editPasswordUser = params =>{return axios.put(`${base}/user/password`,params);};

export const enableUser = params =>{return axios.get(`${base}/enable/`,{params:params});};


