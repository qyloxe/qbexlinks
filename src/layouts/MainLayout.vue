<template>
  <q-layout view="hhh lpr fFf">
    <q-header>
      <q-bar>
        <q-btn flat dense round :icon="toggleIcon" aria-label="Menu" @click="toggleView" />
        <q-btn dense label="Get page data!" aria-label="doWebPageGetTable" @click="doWebPageGetTable" />
        <q-toolbar-title class="text-orange-8">QBEXLinks</q-toolbar-title>
      </q-bar>
    </q-header>
    <q-page-container v-if="viewOpened">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MainLayout',
  data () {
    return {
      viewOpened: false
    }
  },
  async created () {
    // Add our listener
    this.$q.bex.on('webpage.getTable.return', this.doWebPageGetTableReturn)
    // load links data to VueX from localstore
    await this.initData()
  },
  beforeDestroy () {
    // Don't forget to clean it up
    this.$q.bex.off('webpage.getTable.return', this.doWebPageGetTableReturn)
  },
  computed: {
    ...mapGetters('main', ['getLinks']),
    toggleIcon () {
      return this.viewOpened ? 'expand_less' : 'expand_more'
    }
  },
  methods: {
    ...mapActions('main', ['initData', 'addLinks']),
    toggleView () {
      this.viewOpened = !this.viewOpened
    },
    doWebPageGetTable () {
      // call BEX event in content-hooks.js - retrieve links from page
      this.$q.bex.send('webpage.getTable')
    },
    async doWebPageGetTableReturn (event) {
      this.$q.bex.send(event.eventResponseKey)
      const icnt = await this.addLinks(event.data.links)
      this.$q.notify({ message: `${icnt} new links`, color: 'positive', position: 'top' })
    }
  },
  watch: {
    viewOpened: function (val, oldVal) {
      // source from: https://quasar.dev/quasar-cli/developing-browser-extensions/types-of-bex#Web-Page
      this.$q.bex.send('wb.view.toggle', { open: this.viewOpened })
    }
  }
}
</script>
