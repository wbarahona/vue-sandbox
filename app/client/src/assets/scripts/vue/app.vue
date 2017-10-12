<script type="text/javascript">
import axios from 'axios';
import appview from '../../views/appview.html';
import firstcomponent from './components/firstcomponent.vue';
import tablelist from './components/tablelist.vue';
import tabs from './components/tabs.vue';
import tab from './components/tab.vue';
import coupon from './components/coupon.vue';
import messages from './components/messages.vue';
import modal from './components/modal.vue';
import progressbar from './components/progressbar.vue';
// import getdata from './components/getdata.vue';

export default {
    name: 'appcomponent',
    template: appview,
    data() {
        return {
            msg: 'Welcome to Vue.js World!',
            people: [
                {fname: 'Willmer', lname: 'Barahona', profession: 'Webdeveloper'},
                {fname: 'Tinchun', lname: 'Khanny', profession: 'Xamxun'}
            ],
            products: [],
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
            },
            ratio: 0
        };
    },
    methods: {
        onCouponApplied(val) {
            this.msgsettings.type = 'success';
            this.msgsettings.visible = true;
            this.msgsettings.message = `Coupon applied: ${ val }`;
            this.msgsettings.timeout = 3000;
        },
        itemupdated() {
            this.msgsettings.type = 'info';
            this.msgsettings.visible = true;
            this.msgsettings.message = 'Item added successfully!';
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
        'table-list': tablelist,
        tabs,
        tab,
        coupon,
        messages,
        modal,
        'progress-bar': progressbar
    },
    mounted() {
        let rnd = 0;

        this.ratio = 55;

        const ticker = setInterval(() => {
            rnd = Math.floor(Math.random() * 100) + this.ratio;
            this.ratio += rnd;
            if (this.ratio > 100) {
                this.ratio = 100;
                clearInterval(ticker);
            }
        }, 1000);

        axios.get('https://www.guaroexpress.com/api/v1/items/').then((resp) => {
            const { data } = resp;
            const { content } = data;

            this.products = content;
        }, (err) => {
            console.warn(err);
        });
    },
    created() {
        const { Events } = window;

        Events.listen('itemupdated', () => this.itemupdated());
        Events.listen('applied', (val) => this.onCouponApplied(val));
    }
};
</script>

<style>
</style>
