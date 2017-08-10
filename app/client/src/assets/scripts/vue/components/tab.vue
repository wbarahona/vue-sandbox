<script type="text/javascript">
import componentView from '../../../views/tab.html';

let component = null;

component = {
    name: 'tab',
    template: componentView,
    data() {
        return {
            isactive: false
        };
    },
    props: {
        name: {
            type: String,
            required: true
        },
        selected: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        href() {
            return `#${ this.name.toLowerCase().replace(/ /g, '-') }`;
        }
    },
    methods: {

    },
    watch: {

    },
    mounted() {
        this.isactive = this.selected;
    }
};

export default component;
</script>
