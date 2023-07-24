import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createLoaders } from './dataLoader/useDataLoader.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const dataLoader = createLoaders(fastify)
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req, res) {
      const validationErrors = validate(schema, parse(req.body.query), [depthLimit(5)]);
      if (validationErrors.length > 0) {
        return await res.send({ data: null, errors: validationErrors });
      }
      const result = await graphql({
        schema: schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma, dataLoader }
      })
      return result;
    },
  });
};

export default plugin;
