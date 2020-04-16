<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleDrawer" />
        <q-toolbar-title>QBexLinks</q-toolbar-title>
        <q-space />
        <q-btn dense label="Get page data!" aria-label="doWebPageGetTable" @click="doWebPageGetTable" />
        <q-separator vertical inset class="q-ml-md q-mr-md"/>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">Essential Links</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container v-if="leftDrawerOpen">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'

export default {
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Docs',
          caption: 'quasar.dev',
          icon: 'school',
          link: 'https://quasar.dev'
        },
        {
          title: 'Github',
          caption: 'github.com/quasarframework',
          icon: 'code',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'Discord Chat Channel',
          caption: 'chat.quasar.dev',
          icon: 'chat',
          link: 'https://chat.quasar.dev'
        },
        {
          title: 'Forum',
          caption: 'forum.quasar.dev',
          icon: 'record_voice_over',
          link: 'https://forum.quasar.dev'
        },
        {
          title: 'Twitter',
          caption: '@quasarframework',
          icon: 'rss_feed',
          link: 'https://twitter.quasar.dev'
        },
        {
          title: 'Facebook',
          caption: '@QuasarFramework',
          icon: 'public',
          link: 'https://facebook.quasar.dev'
        },
        {
          title: 'Quasar Awesome',
          caption: 'Community Quasar projects',
          icon: 'favorite',
          link: 'https://awesome.quasar.dev'
        }
      ]
    }
  },
  created () {
    // Add our listener
    this.$q.bex.on('webpage.getTable.return', this.doWebPageGetTableReturn)
  },
  beforeDestroy () {
    // Don't forget to clean it up
    this.$q.bex.off('webpage.getTable.return', this.doWebPageGetTableReturn)
  },
  methods: {
    toggleDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    doWebPageGetTable () {
      this.$q.bex.send('webpage.getTable')
    },
    doWebPageGetTableReturn (event) {
      console.log('$$ webpage.getTable.return', event.data)
      this.$q.bex.send(event.eventResponseKey)
    }
  },
  watch: {
    leftDrawerOpen: function (val, oldVal) {
      // source from: https://quasar.dev/quasar-cli/developing-browser-extensions/types-of-bex#Web-Page
      this.$q.bex.send('wb.drawer.toggle', { open: this.leftDrawerOpen })
    }
  }
}
</script>
