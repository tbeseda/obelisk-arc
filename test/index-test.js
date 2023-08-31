import test from "tape";
import Router from "../index.js";
import { router } from "../example/src/http/any-catchall/index.mjs";
import { rootRequest, context } from "./mocks.js";

test("Obelisk Arc", async (t) => {
	t.ok(router instanceof Router, "router is an instance of Router");

	const arcHandler = router.mount();

	t.ok(typeof arcHandler === "function", "router.mount() returns a function");

	const result = await arcHandler(rootRequest, context);

	if (!result) {
		t.fail("arcHandler returned undefined");
		return;
	} else {
		t.ok(
			result.html?.includes("<title>Obelisk Arc</title>"),
			"html includes <title>Obelisk Arc</title>",
		);
	}

	t.end();
});
