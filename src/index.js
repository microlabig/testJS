// --------------------------- 
// основной файл (точка входа)
// ---------------------------

// JS
import './js/common';

// CSS
//import 'normalize.css';
//import './assets/css/main.css';

// SCSS
import './assets/scss/main.scss';

// способы импортирования vue.js:

//1
//import 'vue';

//2
window.Vue = require('vue');
import store from './store';

Vue.component('example-component', require('./components/Example.vue').default);

const app = new Vue({
    el: "#app",
    store,
    data() {
        return {
            component: false
        }
    },
    methods: {
        showComponent() {
            this.component = !this.component;
        }
    }
});

//3
/* import Vue from 'vue';
import Example from './components/Example.vue';

new Vue({
    el: "#app",
    render: h => h(Example)
});
 */
