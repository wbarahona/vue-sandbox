<script type="text/javascript">
import appview from '../../views/appview.html';
import firstcomponent from './components/firstcomponent.vue';
import peoplelist from './components/peoplelist.vue';

export default {
    template: appview,
    data() {
        return {
            msg: 'Welcome to Vue.js World!',
            people: [
                {fname: 'Willmer', lname: 'Barahona', profession: 'Webdeveloper'},
                {fname: 'Tinchun', lname: 'Khanny', profession: 'Xamxun'}
            ],
            singlearr: ['name', 'something']
        };
    },
    components: {
        firstcomponent,
        'people-list': peoplelist
    }
};
</script>

<style>
body {
    font : 100% Helvetica, sans-serif;
    color: #ecf0f1;
    text-align: center;
    background-color: #34495e;
}
.container {
    margin: 0 auto;
    padding-top: 70px;
}
.v-invalid {
    background: #fbd2d2;
    color: red;
    border: 1px solid red;
}
.v-valid {
    background: #d2fbd2;
    color: green;
    border: 1px solid green;
}
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    background-color: transparent!important;
    background-image: none!important;
}
</style>
