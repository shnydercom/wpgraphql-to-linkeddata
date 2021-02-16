import { PostPreviewFragment } from "./../generated/wp-graphql";
import { BlogPosting } from "schema-dts";

/**
 * mapper-function to create schema.org/BlogPosting(s) for previews from fragments
 * @param input a fragment of a WordPress blog post
 * @param wpBaseURL the base domain of your wordpress installation. Used to add the slug
 */
export function mapWpPostPreviewToSchemaBlogPost(
	input: PostPreviewFragment,
	wpBaseURL?: string
): BlogPosting | null {
	let previewNode = input!.preview!.node;
	let featuredImgNode = previewNode!.featuredImage!.node;
	let thumbnailUrl = featuredImgNode!
		.srcSet!.split(" ")
		.find((val) => val.startsWith("http://"));
	if (!previewNode || !thumbnailUrl) return null;
	let output: BlogPosting = {
		"@type": "BlogPosting",
		...(wpBaseURL && {
			"@id": `${wpBaseURL}/${input.slug}`,
		}),
		...(input.title && {
			name: input.title,
		}),
		...(previewNode.excerpt && {
			abstract: previewNode.excerpt,
		}),
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
				thumbnailUrl,
			},
		}),
		thumbnailUrl,
	};
	return output;
}
