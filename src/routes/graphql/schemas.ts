import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';

import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberTypeId } from './types/memberTypeId.js';

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
  name: "user",
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      async resolve(parent, args) {
        return await prisma.profile.findUnique({
          where: {
            userId: parent.id
          }
        })
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(parent, args) {
        return await prisma.post.findMany({
          where: {
            authorId: parent.id
          }
        })
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        return await prisma.user.findMany({
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
      async resolve(parent, args) {
        return prisma.user.findMany({
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
const MemberType = new GraphQLObjectType({
  name: "memberType",
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(ProfileType),
      async resolve(parent, args) {
        return await prisma.profile.findMany({
          where: {
            memberTypeId: parent.id
          }
        })
      }
    }
  })
})
const ProfileType = new GraphQLObjectType({
  name: "profile",
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    user: {
      type: UserType,
      async resolve(parent) {
        return await prisma.user.findUnique({
          where: {
            id: parent.userId,
          },
        })
      }
    },
    memberType: {
      type: MemberType,
      async resolve(parent) {
        return await prisma.memberType.findUnique({
          where: {
            id: parent.memberTypeId,
          },
        })
      }
    }

  })
})
const SubscribersType = new GraphQLObjectType({
  name: "subscribersOnAuthors",
  fields: () => ({
    subsriber: { type: UserType },
    subsriberId: { type: UUIDType },
    author: { type: UserType },
    authorId: { type: UUIDType },

  })
})
const PostType = new GraphQLObjectType({
  name: "post",
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
    author: {
      type: UserType,
      async resolve(parent) {
        return await prisma.user.findUnique({
          where: {
            id: parent.authorId,
          },
        })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: ({
    users: {
      type: new GraphQLList(UserType),
      args: {},
      resolve: async (parent, args) => {
        return await prisma.user.findMany()
      }
    },
    user: {
      type: UserType,
      args: { id: { type: UUIDType } },
      resolve: async (parent, args) => {
        return await prisma.user.findUnique({
          where: {
            id: args.id,
          },
        })
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      args: {},
      resolve: async (parent, args) => {
        return await prisma.post.findMany()
      }
    },
    post: {
      type: PostType,
      args: { id: { type: UUIDType } },
      resolve: async (parent, args) => {
        return await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        })
      }
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      args: {},
      resolve: async (parent, args) => {
        return await prisma.profile.findMany()
      }
    },
    profile: {
      type: ProfileType,
      args: { id: { type: UUIDType } },
      resolve: async (parent, args) => {
        return await prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        })
      }
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      args: {},
      resolve: async (parent, args) => {
        return await prisma.memberType.findMany()
      }
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeId } },
      resolve: async (parent, args) => {
        return await prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        })
      }
    },
  })
})
export const schema = new GraphQLSchema({
  query: RootQuery,

})