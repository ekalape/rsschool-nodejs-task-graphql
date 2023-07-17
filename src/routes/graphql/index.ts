import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      validationRules: [depthLimit(5)],
      response: {
        200: gqlResponseSchema,
      },

    },

    async handler(req) {
      const res = await graphql({
        schema: schema,
        source: req.body.query
      })
      return res;

    },
  });
};

export default plugin;


//validationRules: [depthLimit(5)]