import Vue from 'vue';
import vueApp from './vue/app.vue';

const app = new Vue({
    el: '#vue-app',
    render: h => h(vueApp)
});

export default app;
