import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import { mapWpPostPreviewToSchemaBlogPost } from "../schema-out/mappers/wpPostPreviewToSchemaBlogPost.js";

/**
 * this executes the wpPostPreviewByCategory on the graphql endpoint specified in ENDPOINT.
 * Run in a debugger, since it doesn't do a lot of error handling
 */
async function main() {
	const endpoint = process.env.ENDPOINT;
	if (
		!endpoint ||
		endpoint.indexOf("your-wordpress-blog.orlocalhost") !== -1
	) {
		console.log(
			"please set ENDPOINT environment variable to your graphql endpoint, aborting"
		);
		return;
	}
	const wpPostPreviewByCategory = fs
		.readFileSync("./src/queries/wpPostPreviewByCategory.graphql")
		.toString("utf-8");
	const postPreview = fs
		.readFileSync("./src/fragments/PostPreview.graphql")
		.toString("utf-8");
	const gqlQuery = `${wpPostPreviewByCategory}\n${postPreview}`;
	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ query: gqlQuery }),
	});
	const responseBody = await response.json();
	if (responseBody.errors) {
		console.log("graphql query returned these errors, aborting: ");
		console.log(errors);
		return;
	}
	const mappedJsonLD = mapWpPostPreviewToSchemaBlogPost(responseBody.data.posts.edges[0].node);
	const outputFile = "./json-ld-out/category-blogpostings.json";
	fs.writeFileSync(outputFile, JSON.stringify(mappedJsonLD, null, 2));
}

main();
