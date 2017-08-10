<script type="text/javascript">
import componentView from '../../../views/coupon.html';

let component = null;

component = {
    name: 'coupon',
    template: componentView,
    data() {
        return {
            couponnumber: ''
        };
    },
    props: {

    },
    computed: {

    },
    methods: {
        onCouponApplied() {
            const { Events } = window;
            // this.$emit('applied', this.couponnumber);
            Events.send('applied', this.couponnumber);
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
