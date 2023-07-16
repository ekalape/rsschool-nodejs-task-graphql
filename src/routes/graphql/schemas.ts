import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';

import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
const prisma = new PrismaClient();

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

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  })
})


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: ({
    Users: {
      type: new GraphQLList(UserType),
      args: {},
      resolve: async (parent, args) => {
        return prisma.user.findMany()
      }
    },
    User: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return prisma.user.findUnique({
          where: {
            id: args.id,
          },
        })
      }
    }
  })
})
export const schema = new GraphQLSchema({
  query: RootQuery
})