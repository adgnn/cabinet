import Sign from '../src/views/sign.vue';
import Manager from '../src/views/manager.vue';
import User from '../src/views/user.vue'

import hello from '../src/views/hello.vue'

import m_accessLogs from '../src/components/manager/accessLogs.vue'
import m_cabinetDoor from '../src/components/manager/cabinetDoor.vue'
import m_checkUser from '../src/components/manager/checkUser.vue'
import m_feedback from '../src/components/manager/feedback.vue'
import m_thingSet from '../src/components/manager/thingSet.vue'
import m_thingStatus from '../src/components/manager/thingStatus.vue'

import u_addUser from '../src/components/user/addUser.vue'
import u_checkDevice from '../src/components/user/checkDevice.vue'
import u_checkRepair from '../src/components/user/checkRepair.vue'
import u_checkUser from '../src/components/user/checkUser.vue'
import u_parameterSet from '../src/components/user/parameterSet.vue'
import u_userSet from '../src/components/user/userSet.vue'


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