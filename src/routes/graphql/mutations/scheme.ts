import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeId } from '../types/memberTypeId.js';

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
export const createPostInput = new GraphQLInputObjectType({
    name: "CreatePostInput",
    fields: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: UUIDType }
    }
})
export const changePostInput = new GraphQLInputObjectType({
    name: "ChangePostInput",
    fields: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: UUIDType }
    }
})
export const createProfileInput = new GraphQLInputObjectType({
    name: "CreateProfileInput",
    fields: {
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeId },
        userId: { type: UUIDType },
    }
})
export const changeProfileInput = new GraphQLInputObjectType({
    name: "ChangeProfileInput",
    fields: {
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeId }
    }
})

