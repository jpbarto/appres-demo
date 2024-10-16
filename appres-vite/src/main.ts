import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import PrimeButton from 'primevue/button';
import './style.css'
import App from './App.vue'

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: 'system',//'none',
        }
    }
});

app.component('PrimeButton', PrimeButton);

app.mount('#app')
