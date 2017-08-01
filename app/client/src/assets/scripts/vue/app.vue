<template>
    <div>
        <h1>{{ msg }}</h1>
        <firstcomponent></firstcomponent>
    </div>
</template>

<script>
import firstcomponent from './components/firstcomponent.vue';

export default {
    data() {
        return {
            msg: 'Welcome to Vue.js World!'
        };
    },
    components: {
        firstcomponent
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
</style>
