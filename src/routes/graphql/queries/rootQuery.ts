import { GraphQLObjectType, GraphQLList } from 'graphql'
import { MemberTypeId } from '../types/memberTypeId.js'
import { UUIDType } from '../types/uuid.js'
import { UserType, PostType, ProfileType, MemberType } from './scheme.js'


export const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: ({
        users: {
            type: new GraphQLList(UserType),
            args: {},
            resolve: async (parent, args, context) => {

                return await context.prisma.user.findMany()
            }
        },
        user: {
            type: UserType,
            args: { id: { type: UUIDType } },
            resolve: async (parent, args, context) => {
                return await context.prisma.user.findUnique({
                    where: {
                        id: args.id,
                    },
                })
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            args: {},
            resolve: async (parent, args, context) => {
                return await context.prisma.post.findMany()
            }
        },
        post: {
            type: PostType,
            args: { id: { type: UUIDType } },
            resolve: async (parent, args, context) => {
                return await context.prisma.post.findUnique({
                    where: {
                        id: args.id,
                    },
                })
            }
        },

        profiles: {
            type: new GraphQLList(ProfileType),
            args: {},
            resolve: async (parent, args, context) => {
                return await context.prisma.profile.findMany()
            }
        },
        profile: {
            type: ProfileType,
            args: { id: { type: UUIDType } },
            resolve: async (parent, args, context) => {
                return await context.prisma.profile.findUnique({
                    where: {
                        id: args.id,
                    },
                })
            }
        },

        memberTypes: {
            type: new GraphQLList(MemberType),
            args: {},
            resolve: async (parent, args, context) => {
                return await context.prisma.memberType.findMany()
            }
        },
        memberType: {
            type: MemberType,
            args: { id: { type: MemberTypeId } },
            resolve: async (parent, args, context) => {
                return await context.prisma.memberType.findUnique({
                    where: {
                        id: args.id,
                    },
                })
            }
        },
    })
})