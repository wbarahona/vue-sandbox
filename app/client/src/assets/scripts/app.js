import Vue from 'vue';
import vueApp from './vue/app.vue';

// console.log(Vue);

// const app = new Vue({
//     el: '#vue-app',
//     data: {
//         message: 'Hello Vue!',
//         revision: 0
//     },
//     computed: {
//         someComputed: function someComputed() {
//             return this.message.split('').reverse().join('');
//         }
//     },
//     methods: {
//         versionMessage: function displayMessage() {
//             this.message = `${ this.message } revision: ${ this.revision }`;
//         }
//     },
//     watch: {
//         'message': function messageChange() {
//             return this.revision++;
//         }
//     }
// });

const app = new Vue({
    el: '#vue-app',
    render: h => h(vueApp)
});

export default app;
