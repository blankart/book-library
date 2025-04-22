import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { AuthorSchema } from "../../types/zod-schemas";
import z from "zod";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        tags: ["Author"],
        description: "Gets all the available authors",
        querystring: z.object({
          limit: z.number({ coerce: true }).min(1).optional(),
          page: z.number({ coerce: true }).min(1).optional(),
          q: z.string().optional(),
        }),
        response: {
          200: z.object({
            result: AuthorSchema.extend({ booksCount: z.number() }).array(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPrevPage: z.boolean(),
            count: z.number(),
          }),
        },
      },
    },
    async function (request, response) {
      const { limit = 50, page = 1, q = "" } = request.query;
      const { result, totalPages, hasNextPage, hasPrevPage, count } =
        await fastify.prisma.author.paginate({
          limit,
          page,
          ...(q
            ? {
                where: {
                  name: { contains: q, mode: "insensitive" },
                },
              }
            : {}),
          include: {
            _count: { select: { Book: true } },
          },
        });

      return {
        result: result.map(({ _count, ...author }) => {
          return { ...author, booksCount: _count.Book };
        }),
        totalPages,
        hasNextPage,
        hasPrevPage,
        count,
      };
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        tags: ["Author"],
        description: "Gets an author by ID",
        params: AuthorSchema.pick({ id: true }),
        response: {
          200: AuthorSchema.extend({ booksCount: z.number() }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async function (request, response) {
      const { id } = request.params;
      const _author = await fastify.prisma.author.findFirst({
        where: { id },
        include: {
          _count: { select: { Book: true } },
        },
      });

      if (!_author) {
        return response.status(404).send({ error: "Author not found" });
      }

      const { _count, ...author } = _author;

      return { ...author, booksCount: _count.Book };
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        tags: ["Author"],
        description: "Creates a new author",
        body: AuthorSchema.pick({ name: true }),
        response: {
          201: AuthorSchema,
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async function (request, response) {
      try {
        const author = await fastify.prisma.author.create({
          data: {
            name: request.body.name,
          },
        });
        return response.status(201).send(author);
      } catch (error) {
        return response.status(400).send({ error: "Failed to create author" });
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().patch(
    "/:id",
    {
      schema: {
        tags: ["Author"],
        description: "Partially updates an author by ID",
        params: AuthorSchema.pick({ id: true }),
        body: AuthorSchema.pick({ name: true }).partial(),
        response: {
          200: AuthorSchema,
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async function (request, response) {
      const { id } = request.params;
      try {
        const author = await fastify.prisma.author.update({
          where: { id },
          data: request.body,
        });
        return author;
      } catch (error) {
        return response.status(404).send({ error: "Author not found" });
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        tags: ["Author"],
        description: "Deletes an author by ID",
        params: AuthorSchema.pick({ id: true }),
        response: {
          204: z.void(),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async function (request, response) {
      const { id } = request.params;
      try {
        await fastify.prisma.author.delete({
          where: { id },
        });
        return response.status(204).send();
      } catch (error) {
        return response.status(404).send({ error: "Author not found" });
      }
    }
  );
};

export default root;
