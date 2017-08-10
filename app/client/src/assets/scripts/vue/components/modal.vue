<script type="text/javascript">
import componentView from '../../../views/modal.html';

let component = null;

component = {
    name: 'modal',
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
                title: '',
                content: '',
                isdialog: false
            }
        }
    },
    computed: {
        classVisible() {
            return (this.settings.visible) ? 'in visible' : 'out';
        }
    },
    methods: {
        closeModal() {
            this.settings.visible = false;
        }
    },
    watch: {

    }
};

export default component;
</script>
