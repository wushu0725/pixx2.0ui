import Layout from '@/page/index/'
export default [{
    path: '/wel',
    component: Layout,
    redirect: '/wel/index',
    children: [{
        path: 'index',
        name: '首页',
        component: () =>
            import ( /* webpackChunkName: "views" */ '@/page/wel')
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
}, {
    path: '/activti',
    component: Layout,
    redirect: '/activti/detail',
    children: [{
        path: 'detail/:id',
        component: () =>
            import ( /* webpackChunkName: "views" */ '@/views/admin/activiti/detail')
    }]

}]