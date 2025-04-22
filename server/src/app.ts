import { join } from "node:path";
import fastifySwagger from "@fastify/swagger";
import cors from "@fastify/cors";
import fastifySwaggerUi from "@fastify/swagger-ui";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  fastify.register(cors, {
    methods: "*",
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      try {
        const hostname = new URL(origin).hostname;
        if (hostname === "localhost") {
          cb(null, true);
          return;
        }
      } catch (e) {
        return cb(e as Error, false);
      }
    },
  });
  void fastify.setValidatorCompiler(validatorCompiler);
  void fastify.setSerializerCompiler(serializerCompiler);

  void fastify.register(fastifySwagger, {
    mode: "dynamic",
    openapi: {
      info: {
        title: "Book Club Library",
        description: "API documentation for the book club library app",
        version: "1.0.0",
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  });

  void fastify.register(fastifySwaggerUi, {
    routePrefix: "/swagger",
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });
};

export default app;
export { app, options };
