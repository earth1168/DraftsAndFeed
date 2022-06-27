import { connectionPlugin, makeSchema } from "nexus";

export const schema = makeSchema({
    plugins: [connectionPlugin()],
    types
})