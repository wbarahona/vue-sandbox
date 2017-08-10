<script type="text/javascript">
import componentView from '../../../views/messages.html';

let component = null;

component = {
    name: 'messages',
    template: componentView,
    data() {
        return {

        };
    },
    props: {
        settings: {
            type: Object,
            required: false,
            default: {
                type: 'info',
                visible: false,
                message: '',
                timeout: 0
            }
        }
    },
    computed: {
        className() {
            return `alert-${ this.settings.type }`;
        },
        ticker() {
            if (this.settings.visible && this.settings.timeout > 0) {
                const ticker = setInterval(() => {
                    this.closeMessage();

                    clearInterval(ticker);
                }, this.settings.timeout);
            }
        }
    },
    methods: {
        closeMessage() {
            this.settings.visible = false;
        }
    },
    watch: {

    },
    created() {

    },
    mounted() {

    }
};

export default component;
</script>
