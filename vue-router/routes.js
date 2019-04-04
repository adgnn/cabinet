import Sign from '../src/views/sign.vue';
import User from '../src/views/user.vue'

import hello from '../src/views/hello.vue'

const  u_addUser= () => import('../src/components/user/addUser.vue');
const  u_checkDevice= () => import('../src/components/user/checkDevice.vue');
const  u_checkRepair= () => import('../src/components/user/checkRepair.vue');
const  u_checkUser= () => import('../src/components/user/checkUser.vue');
const  u_parameterSet= () => import('../src/components/user/parameterSet.vue');
const  u_userSet= () => import('../src/components/user/userSet.vue');

export default [
    {
        path: '',
        redirect: '/sign'
    },
    {
        path: '/sign',
        component: Sign
    },
    {
        path: '/user',
        component: User,
        children: [
            {
                path: '/',
                component: hello
            },
            {
                path: 'addUser',
                component: u_addUser
            },
            {
                path: 'checkDevice',
                component: u_checkDevice
            },
            {
                path: 'checkRepair',
                component: u_checkRepair
            },
            {
                path: 'checkUser',
                component: u_checkUser
            },
            {
                path: 'parameterSet',
                component: u_parameterSet
            },
            {
                path: 'userSet',
                component: u_userSet
            },
        ]
    },
]