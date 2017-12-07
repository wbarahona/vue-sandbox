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
                header: '',
                content: '',
                isdialog: false,
                confirm: 'Ok',
                reject: 'Cancel',
                size: 'large'
            }
        }
    },
    computed: {
        classVisible() {
            return (this.settings.visible) ? 'show' : '';
        },
        classSize() {
            let classNamePrefix = 'modal-';

            switch (this.settings.size) {
                case 'large':
                    classNamePrefix += 'lg';
                    break;
                case 'small':
                    classNamePrefix += 'sm';
                    break;
                default:
                    classNamePrefix += 'md';
            }

            return classNamePrefix;
        }
    },
    methods: {
        closeModal() {
            this.settings.visible = false;
        }
    },
    mounted() {
        const doc = document;

        doc.addEventListener('keyup', (e) => {
            if (this.settings.visible && e.keyCode === 27) {
                this.settings.visible = false;
            }
        });
    },
    watch: {

    }
};

export default component;
</script>
