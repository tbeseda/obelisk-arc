import arc from '@architect/functions'
import Router from 'obelisk-arc'

const router = new Router({ rootPath: '/api' })

router.on('GET', '/', async () => {
  const link = '/api/things/near/123-456/radius/789?foo=bar'
  return {
    html: /* html */ `
      <ul>
        <li>
          <a href="${link}">${link}</a>
        </li>
        <li>
          <a href="/">/</a>
        </li>
      </ul>
    `,
  }
})

router.on(
  'GET',
  '/things/near/:lat-:lng/radius/:r',
  async ({ routeParams, query }) => {
    const { lat, lng, r } = routeParams

    // do something with route and query params

    return {
      json: {
        lat,
        lng,
        r,
        query,
      },
    }
  },
)

async function middleware () {
  console.log('Doing middleware things')
}

export const handler = arc.http(middleware, router.mount())
