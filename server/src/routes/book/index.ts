import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { AuthorSchema, BookSchema } from "../../types/zod-schemas";
import z from "zod";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        tags: ["Book"],
        description: "Gets all the available books",
        querystring: z.object({
          limit: z.number({ coerce: true }).min(1).optional(),
          page: z.number({ coerce: true }).min(1).optional(),
          q: z.string().optional(),
        }),
        response: {
          200: z.object({
            result: BookSchema.extend({
              author: AuthorSchema.pick({ name: true }),
            }).array(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPrevPage: z.boolean(),
            count: z.number(),
          }),
        },
      },
    },
    async function (request) {
      const { limit = 50, page = 1, q = "" } = request.query;
      const { result, totalPages, hasNextPage, hasPrevPage, count } =
        await fastify.prisma.book.paginate({
          limit,
          page,
          ...(q
            ? {
                where: {
                  title: { contains: q, mode: "insensitive" },
                },
              }
            : {}),
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        });

      return {
        result,
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
        tags: ["Book"],
        description: "Gets a book by ID",
        params: BookSchema.pick({ id: true }),
        response: {
          200: BookSchema.extend({
            author: AuthorSchema.pick({ name: true }),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async function (request, response) {
      const { id } = request.params;
      const book = await fastify.prisma.book.findFirst({
        where: { id },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!book) {
        return response.status(404).send({ error: "Book not found" });
      }

      return book;
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        tags: ["Book"],
        description: "Creates a new book",
        body: BookSchema.pick({ title: true, authorId: true }),
        response: {
          201: BookSchema.extend({ author: AuthorSchema.pick({ name: true }) }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async function (request, response) {
      try {
        const author = await fastify.prisma.author.findUnique({
          where: { id: request.body.authorId },
        });

        if (!author) {
          return response.status(400).send({ error: "Author not found" });
        }

        const book = await fastify.prisma.book.create({
          data: {
            title: request.body.title,
            authorId: request.body.authorId,
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        });
        return response.status(201).send(book);
      } catch (error) {
        return response.status(400).send({ error: "Failed to create book" });
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().patch(
    "/:id",
    {
      schema: {
        tags: ["Book"],
        description: "Partially updates a book by ID",
        params: BookSchema.pick({ id: true }),
        body: BookSchema.pick({ title: true, authorId: true }).partial(),
        response: {
          200: BookSchema.extend({ author: AuthorSchema.pick({ name: true }) }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async function (request, response) {
      const { id } = request.params;
      try {
        if (request.body.authorId) {
          const author = await fastify.prisma.author.findUnique({
            where: { id: request.body.authorId },
          });

          if (!author) {
            return response.status(400).send({ error: "Author not found" });
          }
        }

        const book = await fastify.prisma.book.update({
          where: { id },
          data: request.body,
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        });
        return book;
      } catch (error) {
        return response.status(404).send({ error: "Book not found" });
      }
    }
  );

  fastify.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        tags: ["Book"],
        description: "Deletes a book by ID",
        params: BookSchema.pick({ id: true }),
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
        await fastify.prisma.book.delete({
          where: { id },
        });
        return response.status(204).send();
      } catch (error) {
        return response.status(404).send({ error: "Book not found" });
      }
    }
  );
};

export default root;
