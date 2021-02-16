# wpgraphql-to-linkeddata
Converter from [WPGraphQL](https://www.wpgraphql.com/) to [schema.org](https://schema.org/BlogPosting) [json-ld](https://json-ld.org/), written in typescript

This can be useful if you're using wordpress with wpgraphql as a headless CMS

## how to use with wpgraphql
- put your query in a file with a *.graphql-ending
- run the `gen-gql` script
- import the query's types `from "./../generated/wp-graphql";`
- import the types for schema.org's vocabulary with: `import { BlogPosting } from "schema-dts";`
- run the `build` script
- find your output in the /schema-out folder

## how to extend or use your own endpoint graphql
- replace the "schema" field in the codegen.yml file
> there are many options for this, you can use .graphql-file(s), URLs, or an introspection query's json-output. The `./schema-in/wpgraphql-schema.gql` - file is the result of such a query. [Here's the documentation of the schema-field](https://graphql-code-generator.com/docs/getting-started/schema-field)
> If you have a working endpoint, you can modify the `get-introspection` script to create a schema from your endpoint. Please note that introspection queries can pose a security risk if you leave them publicly accessible 
- follow the steps in "how to use with wpgraphql"