import arc from '@architect/functions'
import Router from 'obelisk-arc'

const router = new Router()

router.on('GET', '/', async ({ params }) => {
  const { id } = params
  const link = `/thing/${id}/near/123-456/radius/789?foo=bar`
  return {
    html: /* html */ `
        <ul>
          <li>
            <a href=${link}>${link}</a>
          </li>
          <li>
            <a href="/">/</a>
          </li>
        </ul>
      `,
  }
})

router.on('GET', '/near/:lat-:lng/radius/:r', async ({ params, routeParams, query }) => {
  const { id } = params
  const { lat, lng, r } = routeParams

  return {
    json: {
      id,
      lat,
      lng,
      r,
      query,
    },
  }
})

export const handler = arc.http.async(async (req, ctx) => {
  const { id } = req.params
  const instance = router.mount({ rootPath: `/thing/${id}` })

  return instance(req, ctx)
})
