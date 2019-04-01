import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './src/views/app.vue';
import axios from 'axios';
import qs from 'qs';
import {get, post, put, deleteDate,success, fail} from './utils/http.js'

Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$put = put;
Vue.prototype.$delete = deleteDate;
Vue.prototype.$qs = qs;
Vue.prototype.$success = success;
Vue.prototype.$fail = fail;

import './font-awesome/css/font-awesome.min.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


import createVuex from './store/index.js';
import createRouter from './vue-router/router.js'

Vue.use(Vuex);
Vue.use(VueRouter);
const router = createRouter();
const store = createVuex();

new Vue({
    el: "#root",
    router,
    store,
    render: (h) => h(App)
});



