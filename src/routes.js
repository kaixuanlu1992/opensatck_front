import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import User from './views/nav1/User.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
//import SubnetTable from './views/nav1/SubnetTable'
import Network from './views/nav1/Network'
import ServerTable from './views/nav1/ServerTable'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-user',
        leaf: false,//只有一个节点
        children: [
            { path: '/user', component: User, name: '用户管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '项目管理',
        iconCls: 'fa fa-address-card',
        leaf: false,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '项目管理' }
        ]
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '网络管理',
        iconCls: 'fa fa-cloud',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: '网络' },
            { path: '/form', component: Form, name: '路由' },
           // { path: '/user', component: User, name: '用户' },
            { path: '/subnet', component: Network, name: '子网', hidden: true},
           // { path: '/server', component: ServerTable, name: '主机' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '实例管理',
        iconCls: 'fa fa-desktop',
        children: [
            { path: '/server', component: ServerTable, name: '实例' },
            { path: '/page5', component: Page5, name: '实例类型' }
        ]
    },
    
    {
        path: '/',
        component: Home,
        name: '镜像管理',
        iconCls: 'fa fa-image',
        children: [
            { path: '/echarts', component: echarts, name: '镜像管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '使用统计',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: '镜像管理' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;