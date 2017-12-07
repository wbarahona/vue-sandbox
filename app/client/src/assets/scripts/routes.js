import VueRouter from 'vuerouter';
import Vues from './vue/views';

const routes = [
    {
        path: '/',
        component: Vues.homeview
    }
];

const router = new VueRouter({
    routes,
    linkActiveClass: 'active'
});

export default router;
