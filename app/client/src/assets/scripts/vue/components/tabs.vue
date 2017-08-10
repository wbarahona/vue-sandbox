<script type="text/javascript">
import componentView from '../../../views/tabs.html';

let component = null;

component = {
    name: 'tabs',
    template: componentView,
    data() {
        return {
            tabs: []
        };
    },
    props: {

    },
    computed: {

    },
    methods: {
        changeTab(currentTab) {
            // e.preventDefault();
            this.tabs.forEach(tab => {
                tab.isactive = (tab.name === currentTab.name);
            });
        }
    },
    watch: {

    },
    created() {
        this.tabs = this.$children;
    },
    mounted() {

    }
};

export default component;
</script>
