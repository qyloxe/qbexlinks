<template>
  <q-page class="row no-wrap bg-indigo-3 transparent">
    <!-- this sample layout recipe comes from tof06 answer in this thread: https://forum.quasar-framework.org/topic/5466/flexbox-and-q-scroll-area-s-height/2?_=1587303275457 -->
    <!--
    <div class="col q-ma-md bg-indigo-2">
      <h3>actions, info, links</h3>
    </div>
    -->
    <div class="col q-ma-md bg-indigo-1">
      <div class="column full-height">
        <div class="col-auto bg-indigo-2 q-pa-sm">
          <q-btn label="Copy selected links to clipboard" @click="clickCopyToClipboard"></q-btn>
          <q-btn label="Clear all data in localstore" @click="clickClearLinks"></q-btn>
        </div>
        <q-scroll-area class="col q-pa-sm bg-indigo-1" visible>
          <q-table
            dense
            flat
            bordered
            title="Links"
            :data="getData"
            :columns="columns"
            row-key="url"
            :selected-rows-label="getSelectedString"
            selection="multiple"
            :selected.sync="selected"
            :filter="filter"
            :pagination.sync="pagination"
            :rows-per-page-options="[0]"
            @selection="setSelection"
          >
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { copyToClipboard } from 'quasar'

export default {
  name: 'PageIndex',
  data () {
    return {
      selected: [],
      filter: '',
      pagination: {
        rowsPerPage: 0
      },
      columns: [
        { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true, required: true },
        { name: 'url', label: 'URL', field: 'url', align: 'left', sortable: true }
      ]
    }
  },
  computed: {
    ...mapGetters('main', ['getLinks']),
    getData () {
      return Object.values(this.getLinks)
    }
  },
  mounted () {
    // retrieve already selected links from localstorage before display
    this.selected = this.getData.filter(el => el.checked)
  },
  methods: {
    ...mapActions('main', ['clearLinks', 'setLinks', 'setCheckLinks']),
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.getData.length}`
    },
    async clickCopyToClipboard () {
      let text = ''
      for (const link of this.selected) {
        text += link.url + '\n'
      }
      copyToClipboard(text)
        .then(() => {
          this.$q.notify({ message: 'links copied to clipboard', color: 'positive', position: 'top' })
        })
        .catch(() => {
          this.$q.notify({ message: 'error during clipboard access', color: 'negative', position: 'top' })
        })
    },
    async clickClearLinks () {
      await this.clearLinks()
    },
    async setSelection (details) {
      // when row is checked/unchcecked the state is stored in Vuex and in localstorage
      await this.setCheckLinks({ links: details.rows, ischecked: details.added })
    }
  }
}
</script>
