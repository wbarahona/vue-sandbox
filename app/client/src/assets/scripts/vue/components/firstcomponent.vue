<script type="text/javascript">
import componentView from '../../../views/firstcomponent.html';

let component = null;

component = {
    name: 'firstcomponent',
    template: componentView,
    data() {
        return {
            version: '',
            versionnumber: 0,
            newitem: {
                name: '',
                category: '',
                price: '',
                img: ''
            }
        };
    },
    props: {
        title: {
            type: String,
            required: true,
            default: 'The title'
        },
        text: {
            type: String,
            required: true,
            default: 'this is a default value'
        },
        index: {
            type: Number,
            required: false,
            default: 0
        },
        products: {
            type: Array,
            required: true
        },
        singlearr: {
            type: Array,
            required: true,
            default: []
        }
    },
    computed: {
        transformed() {
            return this.version.split('').reverse().join('');
        }
    },
    methods: {
        changeText() {
            this.version = `${ this.text } is index: ${ this.index }`;
        },
        addPerson() {
            const { Events } = window;
            const { newitem } = this;
            const { name, category, price, img } = newitem;
            const insertperson = {
                name, category, price, img
            };

            this.products.push(insertperson);

            this.newitem.name = '';
            this.newitem.category = '';
            this.newitem.price = '';
            this.newitem.img = '';

            Events.send('userupdated');
            // this.$emit('userupdated');
        }
    },
    watch: {
        'version': function listenText() {
            this.versionnumber = this.index + 1;

            return this.versionnumber;
        }
    }
};

export default component;
</script>

<style lang="css">
</style>
