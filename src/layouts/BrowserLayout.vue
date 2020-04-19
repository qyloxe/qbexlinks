<template>
  <q-layout view="hhh lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          QBexLinks
        </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'BrowserLayout',
  data () {
    return {
    }
  }
}
</script>
