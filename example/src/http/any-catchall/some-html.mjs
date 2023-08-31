export default /*html*/ `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Obelisk Arc</title>
	<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect style='fill:%23000222;' width='1' height='1'%3E%3C/rect%3E%3C/svg%3E">
	<link rel="stylesheet" href="//unpkg.com/@highlightjs/cdn-assets@11.7.0/styles/github-dark.min.css">
	<script src="//unpkg.com/@highlightjs/cdn-assets@11.7.0/highlight.min.js"></script>
	<style>
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			max-width: 78ch;
			padding: 3rem 1rem;
			margin: auto;
			font-size: 18px;
			line-height: 1.4;
			font-family: Avenir, source-sans-pro, sans-serif;
			color: #00011A;
			background: #EEE;
		}
		a, a:visited {
			color: #00011A;
			text-decoration-color: silver;
			text-decoration-thickness: 0.15rem;
		}
		code, pre {
			font-family: ui-monospace, 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
		}
		pre {
			tab-size: 2;
			font-size: 0.8rem;
			line-height: 1.3;
		}
	</style>
</head>
<body>
	<h1>
		<a href="https://github.com/tbeseda/obelisk-arc">
			Όbelisk Αrchitect
		</a>
	</h1>

	<p>
		<strong><code>obelisk-arc</code></strong> is an HTTP request router for use in a single <a href="https://arc.codes" target="_blank">Architect</a>
		<code>@http</code> function<sup>1</sup>.<br>
		It utilizes Architect's helpers and familiar payload shapes and the power of
		<a href="https://github.com/delvedor/find-my-way" target="_blank"><code>find-my-way</code></a> (used by Fastify and Restify)
		to help create a router in a single AWS Lambda<sup>2</sup>.
	</p>
	<p>
		This web site's routes are handled in a single Lambda by the <code>obelisk-arc</code> router and deployed with Architect.
		Try the links below:
	</p>

	<ul>
		<li><a href="/things/123">/things/123</a> returns the path param as JSON</li>
		<li><a href="/things/near/123-456/radius/789?foo=bar">/things/near/123-456/radius/789?foo=bar</a> returns complex params as JSON<sup>3</sup></li>
		<li><a href="/form">/form</a> a form that POSTs to itself -- been a while since you seen that, eh?</li>
		<li><a href="/router">/router</a> displays the same route map as text/plain</li>
		<li><a href="/silent">/silent</a> a defined route that doesn't return a value. The router's default route picks up</li>
		<li><a href="/not-found">/not-found</a> a route that doesn't exist. The router's default route picks up</li>
		<li><a href="/throw">/throw</a> will throw-throw and does not fall back to the router's default route</li>
	</ul>

	<p>This Lambda's <code>router.prettyPrint()</code>:</p>
	<pre><code class="language-text">$ROUTER</code></pre>
	<p><small>A rad feature of <code>find-my-way</code> ☝️</small></p>

	<hr>

	<p>
		<sup>1</sup>
		This version of Obelisk is only compatible with Architect's Node.js runtime helpers: <a href=""><code>@architect/functions</code></a>.<br>
		For a more generic Lambda version see <a href="https://github.com/tbeseda/obelisk-lambda" target="_blank"><code>obelisk-lambda</code></a>.
	</p>

	<p>
		<sup>2</sup>
		"Monolithic" Lambdas that handle many routes-per-function are not usually recommended.
		Typically, cloud functions should be plentiful and small.
		However, there are some use cases where a "fat" Lambda can remain focused and quick while handling a wide variety of request paths.
	</p>

	<p>
		<sup>3</sup> This is the source for the complex route above:
		<pre><code class="language-javascript">import arc from "@architect/functions";
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

export const handler = arc.http(router.mount());</code></pre>
	</p>

	<p>Docs + Source: <a href="https://github.com/tbeseda/obelisk-arc" target="_blank">github.com/tbeseda/obelisk-arc</a></p>

	<script>hljs.highlightAll();</script>
</body>
</html>
`;
