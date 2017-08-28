<script type="text/javascript">
import componentView from '../../../views/tablelist.html';

let component = null;

component = {
    name: 'table-list',
    template: componentView,
    data() {
        return {
            itemFilter: '',
            filterExcemptions: ['profession']
        };
    },
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    computed: {
        filteredItems() {
            const { items, itemFilter, filterExcemptions } = this;
            let parts = null;
            let numericPart = 0;
            let keySearch = false;
            let keys = null;

            if (items.length > 0 && itemFilter.length > 0) {
                parts = itemFilter && itemFilter.trim().split(/\s+/);
                keys = Object.keys(items[0]);

                keys = keys.filter(key => !filterExcemptions.includes(key));

                if (!parts || !parts.length) { return items; }

                return items.filter((person) => {
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

            return items;
        }
    },
    methods: {

    },
    watch: {

    }
};

export default component;
</script>
