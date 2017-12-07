<script type="text/javascript">
import appview from '../../views/appview.html';
import messages from './components/messages.vue';
import modal from './components/modal.vue';

export default {
    name: 'appcomponent',
    template: appview,
    data() {
        return {
            msgsettings: {
                type: 'info',
                visible: false,
                message: '',
                timeout: 0
            },
            modalsettings: {
                type: 'info',
                visible: false,
                header: '',
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
        itemupdated() {
            this.msgsettings.type = 'info';
            this.msgsettings.visible = true;
            this.msgsettings.message = 'Item added successfully!';
            this.msgsettings.timeout = 3000;
        },
        showModal(settings) {
            this.modalsettings = settings;
        }
    },
    components: {
        messages,
        modal
    },
    mounted() {

    },
    created() {
        window.Events.listen('itemupdated', () => this.itemupdated());
        window.Events.listen('applied', (val) => this.onCouponApplied(val));
        window.Events.listen('showModal', (settings) => this.showModal(settings));
    }
};
</script>

<style>
</style>
