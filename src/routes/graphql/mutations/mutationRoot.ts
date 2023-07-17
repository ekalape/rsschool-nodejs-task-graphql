import { GraphQLFloat, GraphQLObjectType, GraphQLString } from 'graphql';
import { PostType, UserType } from '../queries/scheme.js';
import { prisma } from '../schemas.js';
import { changePostInput, changeUserInput, createPostInput, createUserInput } from './scheme.js';
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
                /* name: { type: GraphQLString },
                balance: { type: GraphQLFloat }, */
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
            type: UserType,
            args: {
                id: { type: UUIDType }
            },
            async resolve(parent, args) {
                return await prisma.user.delete({
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
            type: PostType,
            args: {
                id: { type: UUIDType }
            },
            async resolve(parent, args) {
                return await prisma.post.delete({
                    where: { id: args.id }
                })
            }
        },
    })
})