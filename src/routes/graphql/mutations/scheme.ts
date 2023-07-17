import { GraphQLFloat, GraphQLInputObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const createUserInput = new GraphQLInputObjectType({
    name: "CreateUserInput",
    fields: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    }
})
export const changeUserInput = new GraphQLInputObjectType({
    name: "ChangeUserInput",
    fields: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    }
})

