import test from 'tape'
import { router as apiRouter } from '../example/src/http/any-api-catchall/index.mjs'
import { router } from '../example/src/http/any-catchall/index.mjs'
import Router from '../index.js'
import { apiReq, context, rootRequest } from './mocks.js'

test('Obelisk Arc', async (t) => {
  t.ok(router instanceof Router, 'router is an instance of Router')

  const arcHandler = router.mount()

  t.ok(typeof arcHandler === 'function', 'router.mount() returns a function')

  const result = await arcHandler(rootRequest, context)

  if (!result) {
    t.fail('arcHandler returned undefined')
  } else {
    t.ok(
      result.html?.includes('<title>Obelisk Arc</title>'),
      'html includes <title>Obelisk Arc</title>',
    )
  }

  t.end()
})

test('Obelisk Arc, mounted', async (t) => {
  const arcHandler = apiRouter.mount({ rootPath: '/api' })

  t.ok(typeof arcHandler === 'function', 'router.mount() returns a function')

  const result = await arcHandler(apiReq, context)

  if (!result) {
    t.fail('arcHandler returned undefined')
  } else {
    t.ok(result.json?.lat, 'json.lat exists')
    t.ok(result.json?.lng, 'json.lng exists')
    t.ok(result.json?.r, 'json.r exists')
    t.ok(result.json?.query, 'json.query exists')
  }

  const badHandler = apiRouter.mount({ rootPath: '/bad' })
  const badResult = await badHandler(apiReq, context)
  t.ok(badResult?.status === 404, 'badHandler returns 404')

  t.end()
})
