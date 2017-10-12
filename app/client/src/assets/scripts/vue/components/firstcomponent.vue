<script type="text/javascript">
import componentView from '../../../views/firstcomponent.html';


// TODO:
// 1. make this a directive to access the value and other input attributes, perhaps the form scope to hold more control over the form and the model
//   1.a. not depending on class binding yet access to it and manipulate the class name
// 2. validations defined by input attributes
// 3. more grammatical validations
class Validations {
    constructor() {
        this.validations = {};
    }

    logicalAssert(post, operator, value) {
        let resp = false;

        switch (operator) {
            case '>':   resp = (post > value); break;
            case '<':   resp = (post < value); break;
            case '>=':  resp = (post >= value); break;
            case '<=':  resp = (post <= value); break;
            case '===':  resp = (post === value); break;
            case '!==':  resp = (post !== value); break;
            default: resp = false; break;
        }

        return resp;
    }

    grammaticalvalidation(word, post, value) {
        const { logicalAssert } = this;
        let resp = false;

        switch (word) {
            case 'length':
                resp = logicalAssert(value.length, '===', post);
                break;
            case 'minlength':
                resp = logicalAssert(value.length, '>=', post);
                break;
            case 'maxlength':
                resp = logicalAssert(value.length, '<=', post);
                break;
            case 'min':
                resp = logicalAssert(value, '>=', post);
                break;
            case 'max':
                resp = logicalAssert(value, '<=', post);
                break;
            case 'regex':
                resp = post.test(value);
                break;
            case 'required':
                if (post) {
                    resp = logicalAssert(value, '!==', '');
                } else {
                    resp = true;
                }
                break;
            default:
                resp = false;
                break;
        }

        return resp;
    }

    savesettings(settings) {
        this.validations.rules = settings;
    }

    get(field, val) {
        let resp = true;
        const { validations } = this;
        const { rules } = validations;
        const thisField = (rules) ? rules[field] : {};

        for (const rule in thisField) {
            if (thisField.hasOwnProperty(rule)) {
                resp = this.grammaticalvalidation(rule, thisField[rule], val);

                if (!resp) {return resp;}
            }
        }

        return resp;
    }
}

class Form {
    constructor(data) {
        this.model = data;
        this.validations  = new Validations();

        this.setupForm(data);
        this.setupModel();
    }

    //
    // Public methods
    // -------------------------------------------------------
    savesettings(settings) {
        this.rules = settings;

        this.validations.savesettings(this.rules);
    }

    reset() {
        for (const field in this.model) {
            if (this.model.hasOwnProperty(field)) {
                this[field] = '';

                this.initModel(field);
            }
        }

        this.resetForm();
    }

    //
    // Private Methods
    // -------------------------------------------------------
    setupForm(data) {
        for (const field in data) {
            if (data.hasOwnProperty(field) && field !== 'model') {
                this[field] = data[field];
            }
        }

        this.resetForm();
    }

    resetForm() {
        this.$valid = () => this.validateModel();
        this.$invalid = () => !this.validateModel();
        this.$pristine = () => true;
        this.$dirty = () => false;
    }

    setupModel() {
        for (const field in this.model) {
            if (this.model.hasOwnProperty(field)) {
                this.model[field] = {};

                this.initModel(field);
            }
        }
    }

    initModel(field) {
        this.model[field].$valid = () => this.validate(field);
        this.model[field].$invalid = () => !this.validate(field);
        this.model[field].$dirty = () => false;
        this.model[field].$pristine = () => true;
        this.model[field].$value = () => this[field];
    }

    validate(field) {
        if (this[field] !== '' && this.model[field].$pristine()) {
            this.model[field].$dirty = () => true;
            this.model[field].$pristine = () => false;
            this.$pristine = () => false;
            this.$dirty = () => true;
        }

        return this.validations.get(field, this[field]);
    }

    validateModel() {
        let resp = false;

        for (const field in this.model) {
            if (this.model.hasOwnProperty(field)) {
                resp = this.validate(field);

                if (!resp) {return resp;}
            }
        }

        return resp;
    }
}

let component = null;

component = {
    name: 'firstcomponent',
    template: componentView,
    data() {
        return {
            version: '',
            versionnumber: 0,
            itemsForm: new Form({
                name: '',
                category: '',
                price: '',
                img: ''
            })
        };
    },
    props: {
        title: {
            type: String,
            required: true,
            default: 'The title'
        },
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
        products: {
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
        addItem() {
            const { Events } = window;
            const { itemsForm } = this;
            const { name, category, price, img } = itemsForm;
            const insertItem = {
                name, category, price, img
            };

            this.products.push(insertItem);
            this.itemsForm.reset();

            Events.send('itemupdated');
            // this.$emit('itemupdated');
        },
        validation(input) {
            let validClass = '';

            if (this.itemsForm.model[input].$pristine()) {
                validClass = '';
            }

            if (this.itemsForm.model[input].$dirty() && this.itemsForm.model[input].$valid()) {
                validClass = 'is-valid';
            } else if (this.itemsForm.model[input].$dirty() && this.itemsForm.model[input].$invalid()) {
                validClass = 'is-invalid';
            }

            return validClass;
        },
        formValid() {
            return this.itemsForm.$invalid();
        }
    },
    watch: {
        'version': function listenText() {
            this.versionnumber = this.index + 1;

            return this.versionnumber;
        }
    },
    created() {
        this.itemsForm.savesettings({
            name: {
                minlength: 2,
                maxlength: 32,
                required: true
            },
            category: {
                minlength: 2,
                maxlength: 32,
                required: true
            },
            price: {
                min: 1,
                max: 10.5,
                required: true
            },
            img: {
                minlength: 2,
                maxlength: 32,
                required: true
            }
        });
    }
};

export default component;
</script>

<style lang="css">
</style>
