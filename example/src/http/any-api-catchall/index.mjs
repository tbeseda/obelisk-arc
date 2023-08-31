import arc from "@architect/functions";
import Router from "obelisk-arc";

const router = new Router({ rootPath: "/api" });

router.on("GET", "/", async () => {
	return {
		html: /*html*/ `
<ul>
	<li>
		<a href="/api/things/near/123-456/radius/789?foo=bar">/api/things/near/123-456/radius/789?foo=bar</a>
	</li>
	<li>
		<a href="/">/</a>
	</li>
</ul>
		`,
	};
});

router.on(
	"GET",
	"/things/near/:lat-:lng/radius/:r",
	async ({ routeParams, query }) => {
		const { lat, lng, r } = routeParams;
		const { foo } = query;

		// do something with route and query params

		return { json: { routeParams, query } };
	},
);

async function middleware() {
	console.log("Doing middleware things");
}

export const handler = arc.http(middleware, router.mount());
