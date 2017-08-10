<script type="text/javascript">
import componentView from '../../../views/firstcomponent.html';

let component = null;

component = {
    name: 'firstcomponent',
    template: componentView,
    data() {
        return {
            title: 'This is a title',
            version: '',
            versionnumber: 0,
            newperson: {
                fname: '',
                lname: '',
                profession: ''
            }
        };
    },
    props: {
        text: {
            type: String,
            required: true,
            default: 'this is a default value'
        },
        index: {
            type: Number,
            required: false,
            default: 0
        },
        people: {
            type: Array,
            required: true
        },
        singlearr: {
            type: Array,
            required: true,
            default: []
        }
    },
    computed: {
        transformed() {
            return this.version.split('').reverse().join('');
        }
    },
    methods: {
        changeText() {
            this.version = `${ this.text } is index: ${ this.index }`;
        },
        addPerson() {
            const { Events } = window;
            const { newperson } = this;
            const { fname, lname, profession } = newperson;
            const insertperson = {
                fname, lname, profession
            };

            this.people.push(insertperson);

            this.newperson.fname = '';
            this.newperson.lname = '';
            this.newperson.profession = '';

            Events.send('userupdated');
            // this.$emit('userupdated');
        }
    },
    watch: {
        'version': function listenText() {
            this.versionnumber = this.index + 1;

            return this.versionnumber;
        }
    }
};

export default component;
</script>

<style lang="css">
</style>
