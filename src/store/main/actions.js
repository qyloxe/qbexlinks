export async function initData (context) {
  const links = []
  context.commit('setLinks', links)
}

export async function setLinks (context, links) {
  context.commit('setLinks', links)
  return 10
}

export async function addLinks (context, links) {
  context.commit('setLinks', links)
  return 20
}
