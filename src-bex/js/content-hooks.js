// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks

// this comes from:
// https://quasar.dev/quasar-cli/developing-browser-extensions/types-of-bex#Web-Page
const
  iFrame = document.createElement('iframe')

const iframeAsMenu = () => {
  iFrame.height = '62px'
  iFrame.width = '35%'
  Object.assign(iFrame.style, {
    left: '55%'
  })
}

const iframeAsPanel = () => {
  Object.assign(iFrame.style, {
    left: '0'
  })
  iFrame.height = '100%'
  iFrame.width = '100%'
}

/**
 * The code below will get everything going. Initialise the iFrame with defaults and add it to the page.
 * @type {string}
 */
iFrame.id = 'bex-app-iframe'

// Assign some styling so it looks seamless
iframeAsMenu()
Object.assign(iFrame.style, {
  position: 'fixed',
  top: '0',
  right: '0',
  bottom: '0',
  border: '0',
  zIndex: '999990', // Make sure it's on top
  overflow: 'visible'
})

;(function () {
  // When the page loads, insert our browser extension app.
  // $$ ESLint - change from docs - strings must use single quote (not backticks)
  iFrame.src = chrome.runtime.getURL('www/index.html')
  document.body.prepend(iFrame)
})()

/**
 *****************************************************************************
 * Content hooks which listen for messages from the BEX in the iFrame
 * @param bridge
 *****************************************************************************
 */
export default function attachContentHooks (bridge) {
  if (document.domain === 'news.ycombinator.com') {
    // insert some DOM elements with click events and send checked status via bridge
    const eltable = document.getElementsByClassName('itemlist')
    const eltdleft = eltable[0].getElementsByClassName('storylink')
    for (let i = 0; i < eltdleft.length; i++) {
      // insert clicker before link:
      const elclicker = document.createElement('span')
      const textnode = document.createTextNode('$ADD$')
      Object.assign(elclicker.style, {
        color: 'yellow',
        backgroundColor: 'blue',
        border: 'thick solid #000000',
        fontSize: 'small',
        cursor: 'pointer',
        marginRight: '8px'
      })
      elclicker.appendChild(textnode)
      // bridge is available as parent scope variable
      // it works, but the question remains if it is a recommended way of event processing from DOM to Quasar webpage
      elclicker.onclick = event => {
        const elanchor = event.target.nextElementSibling
        const url = elanchor.href
        const title = elanchor.innerText
        const ldata = {}
        ldata[url] = { url, title, checked: true }
        bridge.send('webpage.getTable.return', { links: ldata })
      }
      eltdleft[i].parentNode.insertBefore(elclicker, eltdleft[i])
    }
  }

  /**
   * When the drawer is toggled set the iFrame height to take the whole page.
   * Reset when the drawer is closed.
   */
  bridge.on('wb.view.toggle', event => {
    const payload = event.data
    if (payload.open) {
      iframeAsPanel()
    } else {
      iframeAsMenu()
    }
    bridge.send(event.eventResponseKey)
  })

  bridge.on('webpage.getTable', event => {
    const ldata = {}
    if (document.domain === 'news.ycombinator.com') {
      // let's grab some titles and links from this page
      const eltable = document.getElementsByClassName('itemlist')
      const eltdleft = eltable[0].getElementsByClassName('storylink')
      for (let i = 0; i < eltdleft.length; i++) {
        const url = eltdleft[i].href
        const title = eltdleft[i].innerText
        ldata[url] = { url, title, checked: false }
      }
    }
    // should return ldata but it doesnt work, why?
    bridge.send(event.responseKey)
    // needs another event to return data
    bridge.send('webpage.getTable.return', { links: ldata })
  })
}
