import Sign from '../src/views/sign.vue';
import Manager from '../src/views/manager.vue';

import hello from '../src/views/hello.vue'

const m_accessLogs = () => import('../src/components/manager/accessLogs.vue');
const  m_cabinetDoor= () => import('../src/components/manager/cabinetDoor.vue');
const  m_checkUser= () => import('../src/components/manager/checkUser.vue');
const  m_feedback= () => import('../src/components/manager/feedback.vue');
const  m_thingSet= () => import('../src/components/manager/thingSet.vue');
const  m_thingStatus= () => import('../src/components/manager/thingStatus.vue');

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
        path: '/manager',
        component: Manager,
        children: [
            {
                path: '/',
                component: hello
            },
            {
                path: 'checkUser',
                component: m_checkUser
            },
            {
                path: 'accessLogs',
                component: m_accessLogs
            },
            {
                path: 'cabinetDoor',
                component: m_cabinetDoor
            },
            {
                path: 'feedback',
                component: m_feedback
            },
            {
                path: 'thingSet',
                component: m_thingSet
            },
            {
                path: 'thingStatus',
                component: m_thingStatus
            },
        ]
    },
]