import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';

import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberTypeId } from './types/memberTypeId.js';
import { UserType, PostType, ProfileType, MemberType } from './queries/scheme.js';
import { RootQuery } from './queries/rootQuery.js';
import { Mutation } from './mutations/mutationRoot.js';

export const prisma = new PrismaClient();

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};





export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation

})