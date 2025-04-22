import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import { extension } from "prisma-paginate";
import { createSoftDeleteExtension } from "prisma-extension-soft-delete";

declare module "fastify" {
  interface FastifyInstance {
    prisma: ReturnType<typeof createPrismaClient>;
  }
}

const createPrismaClient = () => {
  const prisma = new PrismaClient().$extends(extension).$extends(
    createSoftDeleteExtension({
      models: {
        Author: true,
        Book: true,
      },
    })
  );

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
