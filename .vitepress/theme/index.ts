import DefaultTheme from 'vitepress/theme'
import './custom.css'
import landing from './components/landing.vue'
import layout from './layouts/layout.vue'
import privacy from "./components/privacy.vue";

export default {
    ...DefaultTheme,
    Layout: layout,
    enhanceApp({ app }) {
        app.component('landing', landing)
        app.component('privacy', privacy)
    }
}