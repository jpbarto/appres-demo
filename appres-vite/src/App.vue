<script setup>
import { ref } from "vue";
import LoadStats from './components/LoadStats.vue'

import * as jsNetwork from './assets/js/Network.js';
import * as StatsMan from './assets/js/StatsMan.js';

const items = ref([])
const altitems=    [{
        label: 'Resilience ',
        root: true,
        items: [
            [
                {
                    items: [
                        { label: 'Features', icon: 'pi pi-list', subtext: 'Subtext of item' },
                        { label: 'Customers', icon: 'pi pi-users', subtext: 'Subtext of item' },
                        { label: 'Case Studies', icon: 'pi pi-file', subtext: 'Subtext of item' }
                    ]
                }
            ],
            [
                {
                    items: [
                        { label: 'Solutions', icon: 'pi pi-shield', subtext: 'Subtext of item' },
                        { label: 'Faq', icon: 'pi pi-question', subtext: 'Subtext of item' },
                        { label: 'Library', icon: 'pi pi-search', subtext: 'Subtext of item' }
                    ]
                }
            ],
            [
                {
                    items: [
                        { label: 'Community', icon: 'pi pi-comments', subtext: 'Subtext of item' },
                        { label: 'Rewards', icon: 'pi pi-star', subtext: 'Subtext of item' },
                        { label: 'Investors', icon: 'pi pi-globe', subtext: 'Subtext of item' }
                    ]
                }
            ],
            [
                {
                    items: [{ image: 'https://primefaces.org/cdn/primevue/images/uikit/uikit-system.png', label: 'GET STARTED', subtext: 'Build spectacular apps in no time.' }]
                }
            ]
        ]
    },
    {
        label: 'Resources',
        root: true
    },
    {
        label: 'Contact',
        root: true
    }
];

const network = new jsNetwork.Network(1, 1);

const datasvr = new Worker(new URL('./assets/js/DataServer.js', import.meta.url));
datasvr.nodeDisplayName = 'Data Server';
datasvr.nodeName = 'data-server';
const appsvr = new Worker(new URL('./assets/js/AppServer.js', import.meta.url));
appsvr.nodeDisplayName = 'App Server';
appsvr.nodeName = 'app-server';
const websvr = new Worker(new URL('./assets/js/WebServer.js', import.meta.url));
websvr.nodeDisplayName = 'Web Server';
websvr.nodeName = 'web-server';
const gateway = new Worker(new URL('./assets/js/GatewayServer.js', import.meta.url));
gateway.nodeDisplayName = 'Gateway';
gateway.nodeName = 'gateway';
const loadGen = new Worker(new URL('./assets/js/LoadGenerator.js', import.meta.url));
loadGen.nodeDisplayName = 'Load Generator';
loadGen.nodeName = 'load-generator';

network.addNode(datasvr.nodeName, datasvr);
network.addNode(appsvr.nodeName, appsvr);
network.addNode(websvr.nodeName, websvr);
network.addNode(gateway.nodeName, gateway);
network.addNode(loadGen.nodeName, loadGen);

const statsMan = new StatsMan.StatsMan();
statsMan.addNode(datasvr);
statsMan.addNode(appsvr);
statsMan.addNode(websvr);
statsMan.addNode(gateway);
statsMan.addNode(loadGen);
const loadStatsBoard = statsMan.loadStatsBoard;
// const dataStatsBoard = statsMan.nodeStats[datasvr.nodeName];
// const appStatsBoard = statsMan.nodeStats[appsvr.nodeName];
// const webStatsBoard = statsMan.nodeStats[websvr.nodeName];
// const gwStatsBoard = statsMan.nodeStats[gateway.nodeName];
// const loadStatsBoard = statsMan.nodeStats[loadGen.nodeName];
</script>

<template>
        <header style="border-radius: 3rem">Resilience Playground</header>

  <div id="dashboard">
    <LoadStats worker="loadGen" stats-board="loadStatsBoard"/>
  </div>

  <PrimeDivider />

  <div class="card">
    <PrimeTabs value="0">
      <PrimeTabList>
        <PrimeTab value="0">Steady State</PrimeTab>
        <PrimeTab value="1">Experiment 1</PrimeTab>
        <PrimeTab value="2">Experiment 2</PrimeTab>
      </PrimeTabList>
      <PrimeTabPanels>
        <PrimeTabPanel value="0">
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
            est laborum.
          </p>
        </PrimeTabPanel>
        <PrimeTabPanel value="1">
          <p class="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim
            ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
            qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
          </p>
        </PrimeTabPanel>
        <PrimeTabPanel value="2">
          <p class="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
            sunt in culpa
            qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
            expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
          </p>
        </PrimeTabPanel>
      </PrimeTabPanels>
    </PrimeTabs>
  </div>
</template>

<style scoped>
header {
  border: 1px solid white;
  padding: 5px;
}
</style>
