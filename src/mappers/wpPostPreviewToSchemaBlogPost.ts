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
): BlogPosting {
	let previewNode = input.preview.node;
	let featuredImgNode = previewNode.featuredImage.node;
	let thumbnailUrl = featuredImgNode.srcSet
		.split(" ")
		.find((val) => val.startsWith("http://"));
	let output: BlogPosting = {
        "@type": "BlogPosting",
        ...() => {wpBaseURL ? {"@id":`${wpBaseURL}/${input.slug}`} : undefined},
		name: input.title,
		abstract: previewNode.excerpt,
		image: {
			"@type": "ImageObject",
			description: featuredImgNode.description,
            name: featuredImgNode.altText,
            contentUrl: featuredImgNode.sourceUrl,
            thumbnailUrl
		},
		thumbnailUrl,
	};
	return output;
}
