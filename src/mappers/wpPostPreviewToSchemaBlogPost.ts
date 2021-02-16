import { PostPreviewFragment } from "./../generated/wp-graphql";
import { BlogPosting } from "schema-dts";

/**
 * mapper-function to create schema.org/BlogPosting(s) for previews from fragments
 * @param input a fragment of a WordPress blog post
 * @param wpBaseURL the base domain of your wordpress installation. Used to add the slug
 */
export function mapWpPostPreviewToSchemaBlogPost(
	input?: PostPreviewFragment,
	wpBaseURL?: string
): BlogPosting | null {
	if (!input) return null;
	let featuredImgNode = input && input.featuredImage && input.featuredImage.node;
	let thumbnailUrl = featuredImgNode && featuredImgNode
		.srcSet!.split(" ")
		.find((val) => val.startsWith("http"));
	let output: BlogPosting = {
		"@type": "BlogPosting",
		...(wpBaseURL && { "@id": `${wpBaseURL}/${input.slug}` }),
		...(input.title && { name: input.title }),
		...(input && input.excerpt && { abstract: input.excerpt }),
		...(featuredImgNode && {
			image: {
				"@type": "ImageObject",
				...(featuredImgNode.description && {
					description: featuredImgNode.description,
				}),
				...(featuredImgNode.altText && {
					name: featuredImgNode.altText,
				}),
				...(featuredImgNode.sourceUrl && {
					contentUrl: featuredImgNode.sourceUrl,
				}),
				...(thumbnailUrl && { thumbnailUrl }),
			},
		}),
	};
	return output;
}
