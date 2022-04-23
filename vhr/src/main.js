import Vue from 'vue'

import Cookies from 'js-cookie'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'

import router from './router'
import store from './store'
import axios from 'axios'

import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {initMenu} from "./utils/menus";
import 'font-awesome/css/font-awesome.min.css'

Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;

Vue.config.productionTip = false

Vue.prototype.axios = axios


Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next();
    } else {
        if (window.sessionStorage.getItem("user")) {
            initMenu(router, store);
            next();
        } else {
            next('/?redirect=' + to.path);
        }
    }
})


Vue.config.productionTip = false
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})

