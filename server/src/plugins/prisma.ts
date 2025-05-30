import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import { extension as extensionPaginate } from "prisma-paginate";
import { createSoftDeleteExtension } from "prisma-extension-soft-delete";

declare module "fastify" {
  interface FastifyInstance {
    prisma: ReturnType<typeof createPrismaClient>;
  }
}

const createPrismaClient = () => {
  const prisma = new PrismaClient({
    ...(process.env.NODE_ENV === "test" && {
      datasources: { db: { url: process.env.TEST_DATABASE_URL } },
    }),
  })
    .$extends(
      createSoftDeleteExtension({
        models: {
          Author: true,
          Book: {
            field: "deletedAt",
            createValue(deleted) {
              if (deleted) return new Date();
              return null;
            },
          },
        },
      })
    )
    .$extends(extensionPaginate);

  return prisma;
};

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const prisma = createPrismaClient();
  await prisma.$connect();

  server.decorate("prisma", prisma);

  server.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
});

export default prismaPlugin;
