import arc from '@architect/functions'
import Router from 'obelisk-arc'
import someHtml from './some-html.mjs'

// exported for testing purposes, not required
export const router = new Router({
  defaultRoute: ({ path }) => {
    console.log('defaultRoute', path)

    return {
      status: 404,
      text: 'not found. this is a custom handler',
    }
  },
})

router.on('GET', '/', async () => {
  return {
    html: someHtml.replace('$ROUTER', router.router.prettyPrint()),
  }
})

router.on('GET', '/async', async () => {
  // sleep for 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { text: 'waited 1 second' }
})

router.on('GET', '/router', async () => {
  return { text: router.router.prettyPrint() }
})

router.on('GET', '/silent', async () => {
  // since no value is returned, the router's defaultRoute will be called
  console.log('shhhh')
})

const theForm = /* html */ `
  <form method="POST">
    <label for="foo">foo</label>
    <input type="text" name="foo" placeholder="bar" />
    <input type="submit" />
  </form>
  <p><a href="/">home</a></p>
`

router.on('GET', '/form', async () => {
  return { html: theForm }
})

router.on('POST', '/form', async ({ body }) => {
  return {
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf8' },
    body: /* html */ `
<p>
  Posted:
  <code>${JSON.stringify(body, null, 2)}</code>
</p>
${theForm}`,
  }
})

router.on('GET', '/throw', () => {
  // this will not trigger defaultRoute
  throw new Error('doh')
})

router.on('GET', '/things/:id', async ({ routeParams }) => {
  const { id } = routeParams
  return { json: { thingId: id } }
})

router.on('GET', '/things/near/:lat-:lng/radius/:r', async ({ routeParams, query }) => {
  const { lat, lng, r } = routeParams
  const { foo } = query

  // do something with route and query params

  return { json: { lat, lng, r, foo } }
})

export const handler = arc.http(router.mount())
