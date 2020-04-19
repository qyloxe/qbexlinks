import { LocalStorage } from 'quasar'

export async function initData (context) {
  const links = LocalStorage.getItem('links') || {}
  context.commit('setLinks', links)
}

export async function clearLinks (context) {
  context.commit('setLinks', {})
  LocalStorage.set('links', {})
}

export async function setLinks (context, links) {
  context.commit('setLinks', links)
  LocalStorage.set('links', links)
  return Object.keys(links).length
}

export async function addLinks (context, links) {
  // we can't change (easily) nested objects in VueX so this deep copy works as expected.
  // In production the recommended course of action is to use other datasource or something like vuex-orm or even indexedDB.
  // However, this example should be kept simple and educational, so here we are:
  const olinks = JSON.parse(JSON.stringify(context.state.links))
  let icnt = 0
  for (const [url, link] of Object.entries(links)) {
    if (!(url in olinks)) {
      olinks[url] = link
      icnt += 1
    } else if (link.checked && !olinks[url].checked) { // accept existing link checked state change from our DOM clicker in content-hooks.js
      olinks[url].checked = true
      icnt += 1
    }
  }
  await context.dispatch('setLinks', olinks)
  return icnt
}

export async function setCheckLinks (context, { links, ischecked }) {
  // same as with addLinks
  const olinks = JSON.parse(JSON.stringify(context.state.links))
  let icnt = 0
  for (const link of links) {
    if (link.url in olinks) {
      olinks[link.url].checked = ischecked
      icnt += 1
    }
  }
  await context.dispatch('setLinks', olinks)
  return icnt
}
