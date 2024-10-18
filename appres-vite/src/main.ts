import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import PrimeButton from 'primevue/button';
import PrimeTabs from 'primevue/tabs';
import PrimeTabList from 'primevue/tablist';
import PrimeTab from 'primevue/tab';
import PrimeTabPanels from 'primevue/tabpanels';
import PrimeTabPanel from 'primevue/tabpanel';

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
app.component('PrimeTabs', PrimeTabs);
app.component('PrimeTabList', PrimeTabList);
app.component('PrimeTab', PrimeTab);
app.component('PrimeTabPanels', PrimeTabPanels);
app.component('PrimeTabPanel', PrimeTabPanel);

app.mount('#app')
