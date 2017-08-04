<script type="text/javascript">
import componentView from '../../../views/peoplelist.html';

let component = null;

component = {
    name: 'people-list',
    template: componentView,
    data() {
        return {
            professionFilter: '',
            alertVisible: false
        };
    },
    props: {
        'people': {
            type: Array,
            required: true
        }
    },
    computed: {
        filterPeople() {
            if (this.professionFilter.length > 0) {
                return this.people.filter(person => person.profession.toLowerCase() === this.professionFilter.toLowerCase());
            }

            return this.people;
        }
    },
    methods: {

    },
    watch: {

    }
};

export default component;
</script>
