import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';

import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

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
      type: new GraphQLList(SubscribersType),
      async resolve(parent, args) {
        return await prisma.subscribersOnAuthors.findMany({
          where: {
            subscriberId: parent.id
          }
        })
      }
    },
    subscribedToUser: {
      type: new GraphQLList(SubscribersType),
      async resolve(parent, args) {
        return prisma.subscribersOnAuthors.findMany({
          where: {
            authorId: parent.id
          }
        })
      }
    },

  })
})
const MemberType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: { type: GraphQLString },
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
  name: "Profile",
  fields: () => ({
    id: { type: GraphQLString },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
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
  name: "SubscribersOnAuthors",
  fields: () => ({
    subsriber: { type: UserType },
    subsriberId: { type: GraphQLString },
    author: { type: UserType },
    authorId: { type: GraphQLString },

  })
})
const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString },
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
    Users: {
      type: new GraphQLList(UserType),
      args: {},
      resolve: async (parent, args) => {
        return await prisma.user.findMany()
      }
    },
    User: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await prisma.user.findUnique({
          where: {
            id: args.id,
          },
        })
      }
    },
    Posts: {
      type: new GraphQLList(PostType),
      args: {},
      resolve: async (parent, args) => {
        return await prisma.post.findMany()
      }
    },
    Post: {
      type: PostType,
      args: { id: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        })
      }
    },

    Profiles: {
      type: new GraphQLList(ProfileType),
      args: {},
      resolve: async (parent, args) => {
        return await prisma.profile.findMany()
      }
    },
    Profile: {
      type: ProfileType,
      args: { id: { type: GraphQLString } },
      resolve: async (parent, args) => {
        return await prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        })
      }
    },

    MemberTypes: {
      type: new GraphQLList(MemberType),
      args: {},
      resolve: async (parent, args) => {
        return await prisma.memberType.findMany()
      }
    },
    MemberType: {
      type: MemberType,
      args: { id: { type: GraphQLString } },
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