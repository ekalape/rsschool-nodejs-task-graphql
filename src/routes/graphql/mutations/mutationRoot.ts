import { GraphQLFloat, GraphQLObjectType, GraphQLString } from 'graphql';
import { UserType } from '../queries/scheme.js';
import { prisma } from '../schemas.js';
import { changeUserInput, createUserInput } from './scheme.js';
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
        }
    })
})