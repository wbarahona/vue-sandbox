<script type="text/javascript">
import appview from '../../views/appview.html';
import firstcomponent from './components/firstcomponent.vue';
import peoplelist from './components/peoplelist.vue';
import tabs from './components/tabs.vue';
import tab from './components/tab.vue';
import coupon from './components/coupon.vue';
import messages from './components/messages.vue';
import modal from './components/modal.vue';

export default {
    template: appview,
    data() {
        return {
            msg: 'Welcome to Vue.js World!',
            people: [
                {fname: 'Willmer', lname: 'Barahona', profession: 'Webdeveloper'},
                {fname: 'Tinchun', lname: 'Khanny', profession: 'Xamxun'}
            ],
            singlearr: ['name', 'something'],
            msgsettings: {
                type: 'info',
                visible: false,
                message: '',
                timeout: 0
            },
            modalsettings: {
                type: 'info',
                visible: false,
                title: '',
                content: '',
                isdialog: false
            }
        };
    },
    methods: {
        onCouponApplied(val) {
            this.msgsettings.type = 'success';
            this.msgsettings.visible = true;
            this.msgsettings.message = `Coupon applied: ${ val }`;
            this.msgsettings.timeout = 3000;
        },
        userUpdated() {
            this.msgsettings.type = 'info';
            this.msgsettings.visible = true;
            this.msgsettings.message = 'Person added successfully!';
            this.msgsettings.timeout = 3000;
        },
        showModal() {
            this.modalsettings.type = 'info';
            this.modalsettings.visible = true;
            this.modalsettings.title = 'Modal title';
            this.modalsettings.content = '<p>some stuff here</p>';
        }
    },
    components: {
        firstcomponent,
        'people-list': peoplelist,
        tabs,
        tab,
        coupon,
        messages,
        modal
    },
    created() {
        const { Events } = window;

        Events.listen('userupdated', () => this.userUpdated());
        Events.listen('applied', (val) => this.onCouponApplied(val));
    }
};
</script>

<style>
</style>
