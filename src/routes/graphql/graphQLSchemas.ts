import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql'
import { MemberTypeId } from './types/memberTypeId.js'
import { UUIDType } from './types/uuid.js'
import { FieldsByTypeName, ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';


export const UserType = new GraphQLObjectType({
    name: "user",
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        profile: {
            type: ProfileType,
            async resolve(parent, args, context) {
                return await context.dataLoader.profiles.load(parent.id)
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            async resolve(parent, args, context) {
                return await context.dataLoader.posts.load(parent.id)
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            async resolve(parent, args, context, info) {
                /*                 const parsedResolveInfoFragment = parseResolveInfo(info);
                                console.log("parsedResolveInfoFragment userTo >>> ", parsedResolveInfoFragment)
                                const subIds: string[] = parent.subscribedToUser.map((s: { subscriberId: string, authorId: string }) => s.authorId)
                                for (let sub of subIds) {
                                    const subUser = await context.dataLoader.users.load(sub);
                                    context.dataLoader.users.prime(sub, subUser);
                                } */

                return await context.dataLoader.userSubscribedTo.load(parent.id);

            }
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            async resolve(parent, args, context, info) {
                /*                 const parsedResolveInfoFragment = parseResolveInfo(info);
                                const fields = parsedResolveInfoFragment?.fieldsByTypeName
                                console.log("parsedResolveInfoFragment subToUser >>> ", parsedResolveInfoFragment)
                                console.log("fields ---------- ", fields);
                                const subIds: string[] = parent.userSubscribedTo.map((s: { subscriberId: string, authorId: string }) => s.subscriberId)
                                for (let sub of subIds) {
                                    const subUser = await context.dataLoader.users.load(sub);
                                    context.dataLoader.userSubscribedTo.prime(parent.id, parent.userSubscribedTo.push(sub));
                                }
                                console.log("PARENT subsIDs------>>> ", subIds) */


                return await context.dataLoader.subscribedToUser.load(parent.id);
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
                return await context.dataLoader.profiles.load(parent.id)

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
                return await context.dataLoader.users.load(parent.userId)

            }
        },
        memberType: {
            type: MemberType,
            async resolve(parent, args, context) {
                return await context.dataLoader.memberTypes.load(parent.memberTypeId)
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
                return await context.dataLoader.users.load(parent.authorId)

            }
        }
    })
})