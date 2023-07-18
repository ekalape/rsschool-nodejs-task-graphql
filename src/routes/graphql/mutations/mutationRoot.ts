import { GraphQLFloat, GraphQLObjectType, GraphQLString } from 'graphql';
import { PostType, ProfileType, UserType } from '../queries/scheme.js';
import { prisma } from '../schemas.js';
import { changePostInput, changeProfileInput, changeUserInput, createPostInput, createProfileInput, createUserInput } from './scheme.js';
import { UUIDType } from '../types/uuid.js';

export const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: ({
        createUser: {
            type: UserType,
            args: {
                dto: {
                    type: createUserInput
                }
            },
            async resolve(parent, args) {
                return await prisma.user.create({ data: { name: args.dto.name, balance: args.dto.balance } })
            }
        },
        changeUser: {
            type: UserType,
            args: {
                id: { type: UUIDType },
                dto: {
                    type: changeUserInput
                }
            },
            async resolve(parent, args) {
                return await prisma.user.update({
                    where: { id: args.id },
                    data: { name: args.dto.name, balance: args.dto.balance }
                })
            }
        },
        deleteUser: {
            type: GraphQLString,
            args: {
                id: { type: UUIDType }
            },
            async resolve(parent, args) {
                await prisma.user.delete({
                    where: { id: args.id }
                })
            }
        },

        createPost: {
            type: PostType,
            args: {
                dto: {
                    type: createPostInput
                }
            },
            async resolve(parent, args) {
                return await prisma.post.create({ data: { title: args.dto.title, content: args.dto.content, authorId: args.dto.authorId } })
            }
        },
        changePost: {
            type: PostType,
            args: {
                id: { type: UUIDType },
                dto: {
                    type: changePostInput
                }
            },
            async resolve(parent, args) {
                return await prisma.post.update({
                    where: { id: args.id },
                    data: { title: args.dto.title, content: args.dto.content, authorId: args.dto.authorId }
                })
            }
        },
        deletePost: {
            type: GraphQLString,
            args: {
                id: { type: UUIDType }
            },
            async resolve(parent, args) {
                await prisma.post.delete({
                    where: { id: args.id }
                })
            }
        },

        createProfile: {
            type: ProfileType,
            args: {
                dto: {
                    type: createProfileInput
                }
            },
            async resolve(parent, args) {
                return await prisma.profile.create({ data: { isMale: args.dto.isMale, yearOfBirth: args.dto.yearOfBirth, memberTypeId: args.dto.memberTypeId, userId: args.dto.userId } })
            }
        },
        changeProfile: {
            type: ProfileType,
            args: {
                id: { type: UUIDType },
                dto: {
                    type: changeProfileInput
                }
            },
            async resolve(parent, args) {
                return await prisma.profile.update({
                    where: { id: args.id },
                    data: { isMale: args.dto.isMale, yearOfBirth: args.dto.yearOfBirth, memberTypeId: args.dto.memberTypeId }
                })
            }
        },
        deleteProfile: {
            type: GraphQLString,
            args: {
                id: { type: UUIDType }
            },
            async resolve(parent, args) {
                await prisma.profile.delete({
                    where: { id: args.id }
                })
            }
        },

        subscribeTo: {
            type: UserType,
            args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
            async resolve(parent, args) {
                return await prisma.user.update({
                    where: { id: args.userId },
                    data: {
                        userSubscribedTo: {
                            create: {
                                authorId: args.authorId,
                            },
                        },
                    },
                })
            }
        },

        unsubscribeFrom: {
            type: GraphQLString,
            args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
            async resolve(parent, args) {
                await prisma.subscribersOnAuthors.delete({
                    where: {
                        subscriberId_authorId: {
                            subscriberId: args.userId,
                            authorId: args.authorId,
                        },
                    },
                });

            }
        }
    })
})