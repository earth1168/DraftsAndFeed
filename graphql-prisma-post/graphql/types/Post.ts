import { DateTimeResolver } from "graphql-scalars";
import { asNexusMethod, objectType } from "nexus";

export const GQLDate = asNexusMethod(DateTimeResolver, 'date');

export const Post = objectType({
    name: 'Post',
    definition(t) {
        t.int('id');
        t.date('createdAt');
        t.string('title');
        t.nullable.string('content');
        t.boolean('published');
        t.nullable.field('author', {
            type: 'User',
            async resolve(_parent, _args, ctx) {
                return await ctx.prisma.post
                    .findUnique({
                        where: { id: _parent.id }
                    })
                    .author();
            }
        })
    }
});

export const Query = objectType({
    name: 'Query',
    definition(t) {
        t.field('post', {
            type: 'Post',
            args: {
                postId: nonNull(stringArg())
            },
            async resolve(_, args, ctx) {
                return await ctx.prisma.post.findUnique({
                    where: { id: Number(args.postId) }
                })
            }
        });
        t.list.field('feed', {
            type: 'Post',
            async resolve(_parent, _args, ctx) {
                return await ctx.prisma.post.findmany({
                    where: { published: true }
                })
            }
        });

        t.list.field('drafts', {
            type: 'Post',
            async resolve(_parent, _args, ctx) {
                return await ctx.prisma.post.findmany({
                    where: { published: false }
                })
            }
        });

        t.list.field('users', {
            type: 'User',
            async resolve(_parent, _args, ctx) {
                return await ctx.prisma.post.findmany()
            }
        });

        t.list.field('filterPosts', {
            type: 'Post',
            args: {
                searchString: nullable(stringArg())
            },
            async resolve(_parent, _args, ctx) {
                return await ctx.prisma.post.findmany({
                    where: {
                        OR: [{ title: { contains: searchString } }, { content: { contains: searchStrong } }]
                    }
                });
            }
        });


    }
})