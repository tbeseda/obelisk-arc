import arc from "@architect/functions";
import Router from "obelisk-arc";

async function get(req, ctx) {
	const { id } = req.params;
	const router = new Router({ rootPath: `/thing/${id}` });

	router.on("GET", "/", async () => {
		const link = `/thing/${id}/near/123-456/radius/789?foo=bar`;
		return {
			html: /*html*/ `
				<ul>
					<li>
						<a href=${link}>${link}</a>
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
		"/near/:lat-:lng/radius/:r",
		async ({ routeParams, query }) => {
			const { lat, lng, r } = routeParams;

			return {
				json: {
					id,
					lat,
					lng,
					r,
					query,
				},
			};
		},
	);

	const instance = router.mount();
	return instance(req, ctx);
}

export const handler = arc.http(get);
