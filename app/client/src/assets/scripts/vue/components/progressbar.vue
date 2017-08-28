<script type="text/javascript">
let component = null;

component = {
    name: 'progressbar',
    data() {
        return {

        };
    },
    props: {
        ratio: {
            type: Number,
            default: 0
        }
    },
    computed: {
        calcWidth() {
            return `width: ${ this.ratio }%`;
        }
    },
    methods: {

    },
    mounted() {

    },
    watch: {

    }
};

export default component;
</script>
