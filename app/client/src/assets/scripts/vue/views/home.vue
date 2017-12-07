<script type="text/javascript">
import compVue from '../../../views/home.html';
import firstcomponent from '../components/firstcomponent.vue';
import tablelist from '../components/tablelist.vue';
import tabs from '../components/tabs.vue';
import tab from '../components/tab.vue';
import coupon from '../components/coupon.vue';
import progressbar from '../components/progressbar.vue';

let component = null;

component = {
    name: 'HomeView',
    template: compVue,
    data() {
        return {
            msg: 'Welcome to Vue.js World!',
            people: [
                {fname: 'Willmer', lname: 'Barahona', profession: 'Webdeveloper'},
                {fname: 'Tinchun', lname: 'Khanny', profession: 'Xamxun'}
            ],
            products: [],
            singlearr: ['name', 'something'],
            ratio: 0
        };
    },
    props: {

    },
    computed: {

    },
    methods: {
        showModal() {
            window.Events.send('showModal', {
                type: 'warning',
                visible: true,
                header: '<strong>Agree?</strong>',
                content: 'To our demonstrations for what we claim to be <strong>absolute truth?</strong>',
                isdialog: false,
                confirm: '<strong>I have to!</strong>',
                size: 'small'
            });
        }
    },
    components: {
        firstcomponent,
        'table-list': tablelist,
        tabs,
        tab,
        coupon,
        'progress-bar': progressbar
    },
    watch: {

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

        window.axios.get('https://www.guaroexpress.com/api/v1/items/').then((resp) => {
            const { data } = resp;
            const { content } = data;

            this.products = content;
        }, (err) => {
            console.warn(err);
        });
    },
    created() {

    }
};

export default component;
</script>
