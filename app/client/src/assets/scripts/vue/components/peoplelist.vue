<script type="text/javascript">
import componentView from '../../../views/peoplelist.html';

let component = null;

component = {
    name: 'people-list',
    template: componentView,
    data() {
        return {
            personFilter: '',
            filterExcemptions: ['profession']
        };
    },
    props: {
        people: {
            type: Array,
            required: true
        }
    },
    computed: {
        filterPeople() {
            const { people, personFilter, filterExcemptions } = this;
            let parts = null;
            let numericPart = 0;
            let keySearch = false;
            let keys = null;

            if (people.length > 0 && personFilter.length > 0) {
                parts = personFilter && personFilter.trim().split(/\s+/);
                keys = Object.keys(people[0]);

                keys = keys.filter(key => !filterExcemptions.includes(key));

                if (!parts || !parts.length) { return people; }

                return people.filter((person) => {
                    return parts.every((part) => {
                        numericPart = parseFloat(part);

                        return keys.some((key) => {
                            switch (typeof person[key]) {
                                case 'string':
                                    keySearch = String(person[key]).toLowerCase().indexOf(part.toLowerCase()) > -1;
                                    break;
                                case 'number':
                                    if (!isNaN(numericPart)) {
                                        keySearch = person[key] >= numericPart;
                                    }
                                    break;
                                default:
                                    return false;
                            }

                            return keySearch;
                        });
                    });
                });
            }

            return people;
        }
    },
    methods: {

    },
    watch: {

    }
};

export default component;
</script>
