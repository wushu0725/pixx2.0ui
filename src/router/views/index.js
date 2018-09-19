import Layout from '@/page/index/'
export default [{
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [{
        path: 'index',
        name: '首页',
        component: () =>
            import ( /* webpackChunkName: "views" */ '@/views/admin/user/info')
    }]
}, {
    path: '/crud',
    component: Layout,
    redirect: '/crud/index',
    children: [{
        path: 'index',
        name: 'CRUD例子',
        component: () =>
            import ( /* webpackChunkName: "views" */ '@/views/crud/index')
    }]
}]