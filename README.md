# Όbelisk Αrchitect

Extend an [Architect](https://arc.codes) `@http` function with a powerful request router.

Obelisk Arc is powered by [`find-my-way`](https://github.com/delvedor/find-my-way) - used by Fastify and Restify. Obelisk adopts route-matching from `find-my-way` and maintains handler compatibility with [`@architect/functions`](https://arc.codes/docs/en/reference/runtime-helpers/node.js), specifically `arc.http`.

**Try the [DEMO application](https://fvlnhrawzd.execute-api.us-west-2.amazonaws.com/).**

## Install

Make sure you actually want a "fat function", then:

```
npm i obelisk-arc
```

Requires Node.js v18+ (v16 works, but isn't recommended).  
Not tested in a live CommonJS Node Lambda.

## Usage

src/http/any-some-catchall/index.mjs:
```js
import arc from "@architect/functions";
import Router from "obelisk-arc";

const router = new Router();

router.on(
  "GET",
  "/things/near/:lat-:lng/radius/:r",
  async ({ routeParams, query }) => {
    const { lat, lng, r } = routeParams;
    const { foo } = query;

    // do something with route and query params

    return {
      json: { routeParams, query },
    };
  },
);

export const handler = arc.http(router.mount());
```

A more elaborate router can be found in `./example/src/http/any-catchall/index.mjs`

## Deployment

Deploy with [Architect](https://arc.codes) -- see `./example` for a sample Arc project.

## API

### Constructor

Create a new Obelisk router.

#### `defaultRoute` is optional

Specify a default handler that will be invoked when no route is matched or a matched route does not return.

```js
function defaultRoute ({ method, path }) {
  // event and context are always available
  // params, searchParams, and store are only available if a route was matched
  console.log("defaultRoute", method, path);

  return {
    statusCode: 404,
    text: "not found.",
  };
}

const router = new Router({ defaultRoute });
```

#### `rootPath` is optional

Describe the path where the router is mounted. Use a leading slash but not a trailing.

```js
const router = new Router({ rootPath: "/api" });
```

### Instance Methods

#### `on(method, path, handler)`

Add a route to a router instance. See `find-my-way`'s [docs on `method` and `path`](https://github.com/delvedor/find-my-way#onmethods-path-opts-handler-store).

Note that handler functions are _mostly_ Architect Functions handlers. See [Handlers API](#handlers-api) below.

```js
router.on("GET", "/things/:id", ({ routeParams }) => {
  const { id } = params;

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ thingId: id }),
  };
});
```

#### `mount()`

Mount to router to Architect's `http` helper which is in turn returned as the Lambda handler.

```js
import arc from "@architect/functions";
import Router from "obelisk-arc";

const router = new Router();

router.on(
	"GET",
	"/",
	async () => {
		return { text: "hello, world" };
	},
);

export const handler = arc.http(router.mount());
```

### Instance Properties

These are mostly used internally and likely not helpful to developers at runtime. They are exposed for debugging purposes.

#### `defaultRoute`

The original `defaultRoute` passed into the constructor.

#### `handlers`

A `Map` of registered routes keyed by the value returned when registering a route.

#### `router`

The internal `FindMyWay` router instance.  
Note: provided route handlers are not actually registered with `router.router` and are managed in `router.handlers`.

## Handlers API

The third argument when registering a route is the handler function. It must be async.

```js
async function handler(request, context) { /*...*/ }
```

### `request` request object from `arc.http`

The request object provided by Architect Functions. It is unmodified except the addition of one key: `routeParams`.

Reference: [`arc.http` Requests](https://arc.codes/docs/en/reference/runtime-helpers/node.js#requests)

#### `routeParams` FindMyWay parsed path params

`arc.http` already uses the `params` key to express _Architect route parameters_, so `routeParams` is added to track parameters from the Obelisk Arc router as they are parsed by `find-my-way`

This is the only modification made to the `request` payload.

```js
router.on(
  "GET",
  "/things/near/:lat-:lng/radius/:r",
  async ({ routeParams }) => {
    const { lat, lng, r } = routeParams;
    const thing = await things.geoFind({ lat, lng }, r);
    
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ thing }),
    };
  },
);
```

### `context` Lambda Context

Reference: [AWS Lambda context object in Node.js](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html)

## FAQ

<details>
<summary>Why rely on Architect + <code>arc.http()</code>?</summary>

1. Arc Functions provides a ton of valuable parsing: sessions, body, query, etc.
1. There's a more vanilla flavor: [`obelisk-lambda`](https://github.com/tbeseda/obelisk-lambda), if you'd like to remove that peer dependency

Also, technically, you can use `@architect/functions` without `@architect/architect` in a Lambda.

</details>

<details>
<summary><code>defaultRoute</code> isn't getting some `routeParams`, what gives?</summary>

If the original request doesn't match a route, `defaultRoute` is invoked with the original `request` from Arc Functions and the Lambda `context` args.

</details>
