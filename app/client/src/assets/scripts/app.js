import Vue from 'vue';
import vueApp from './vue/app.vue';

Vue.config.productionTip = false;

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
    render: h => h(vueApp)
});

export default app;
