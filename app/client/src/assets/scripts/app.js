import Vue from 'vue';
import axios from 'axios';
import VueRouter from 'vuerouter';
import vueApp from './vue/app.vue';
import router from './routes';

Vue.config.productionTip = false;
Vue.use(VueRouter);

window.axios = axios;

window.axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest'
};

window.Events = new class {
    constructor() {
        this.vue = new Vue();
    }
    send(name, data = null) {
        this.vue.$emit(name, data);
    }
    listen(name, cb) {
        this.vue.$on(name, cb);
    }
};

const app = new Vue({
    el: '#vue-app',
    render: h => h(vueApp),
    router
});

export default app;
