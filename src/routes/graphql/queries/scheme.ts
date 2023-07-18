import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql'
import { MemberTypeId } from '../types/memberTypeId.js'
import { UUIDType } from '../types/uuid.js'



export const UserType = new GraphQLObjectType({
    name: "user",
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        profile: {
            type: ProfileType,
            async resolve(parent, args, context) {
                return await context.prisma.profile.findUnique({
                    where: {
                        userId: parent.id
                    }
                })
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            async resolve(parent, args, context) {
                return await context.prisma.post.findMany({
                    where: {
                        authorId: parent.id
                    }
                })
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            async resolve(parent, args, context) {
                return await context.prisma.user.findMany({
                    where: {
                        subscribedToUser: {
                            some: {
                                subscriberId: parent.id,
                            },
                        },
                    },
                })
            }
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            async resolve(parent, args, context) {
                return context.prisma.user.findMany({
                    where: {
                        userSubscribedTo: {
                            some: {
                                authorId: parent.id,
                            },
                        }
                    }
                })
            }
        },

    })
})
export const MemberType = new GraphQLObjectType({
    name: "memberType",
    fields: () => ({
        id: { type: MemberTypeId },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
        profiles: {
            type: new GraphQLList(ProfileType),
            async resolve(parent, args, context) {
                return await context.prisma.profile.findMany({
                    where: {
                        memberTypeId: parent.id
                    }
                })
            }
        }
    })
})
export const ProfileType = new GraphQLObjectType({
    name: "profile",
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        userId: { type: UUIDType },
        memberTypeId: { type: MemberTypeId },
        user: {
            type: UserType,
            async resolve(parent, args, context) {
                return await context.prisma.user.findUnique({
                    where: {
                        id: parent.userId,
                    },
                })
            }
        },
        memberType: {
            type: MemberType,
            async resolve(parent, args, context) {
                return await context.prisma.memberType.findUnique({
                    where: {
                        id: parent.memberTypeId,
                    },
                })
            }
        }

    })
})
export const SubscribersType = new GraphQLObjectType({
    name: "subscribersOnAuthors",
    fields: () => ({
        subsriber: { type: UserType },
        subsriberId: { type: UUIDType },
        author: { type: UserType },
        authorId: { type: UUIDType },

    })
})
export const PostType = new GraphQLObjectType({
    name: "post",
    fields: () => ({
        id: { type: UUIDType },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: UUIDType },
        author: {
            type: UserType,
            async resolve(parent, context) {
                return await context.prisma.user.findUnique({
                    where: {
                        id: parent.authorId,
                    },
                })
            }
        }
    })
})