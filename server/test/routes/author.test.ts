import { test } from "node:test";
import assert from "node:assert";
import { build } from "../helper";
import { AuthorSchema } from "../../src/types/zod-schemas";
import z from "zod";

test("Author Routes", async (t) => {
  const app = await build(t);
  let createdAuthorId: string;

  await t.test("GET /author", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: "/author?limit=2&page=1",
    });

    assert.strictEqual(response.statusCode, 200);
    const data = JSON.parse(response.payload);
    const paginatedResponseSchema = z.object({
      result: AuthorSchema.extend({
        booksCount: z.number(),
      }).array(),
      totalPages: z.number(),
      hasNextPage: z.boolean(),
      hasPrevPage: z.boolean(),
      count: z.number(),
    });
    assert.doesNotThrow(() => paginatedResponseSchema.parse(data));
    assert(Array.isArray(data.result));
    assert(data.result.length <= 2);
    data.result.forEach(
      (author: z.infer<typeof AuthorSchema> & { booksCount: number }) => {
        assert.doesNotThrow(() =>
          AuthorSchema.extend({
            booksCount: z.number(),
          }).parse(author)
        );
      }
    );
  });

  await t.test("GET /author/:id", async (t) => {
    const listResponse = await app.inject({
      method: "GET",
      url: "/author",
    });
    const authors = JSON.parse(listResponse.payload);

    if (authors.length > 0) {
      const authorId = authors[0].id;
      const response = await app.inject({
        method: "GET",
        url: `/author/${authorId}`,
      });

      assert.strictEqual(response.statusCode, 200);
      const author = JSON.parse(response.payload);
      assert.doesNotThrow(() => AuthorSchema.parse(author));
      assert.strictEqual(author.id, authorId);
    }
  });

  await t.test("POST /author", async (t) => {
    const response = await app.inject({
      method: "POST",
      url: "/author",
      payload: {
        name: "Test Author",
      },
    });

    assert.strictEqual(response.statusCode, 201);
    const author = JSON.parse(response.payload);
    assert.doesNotThrow(() => AuthorSchema.parse(author));
    assert.strictEqual(author.name, "Test Author");
    createdAuthorId = author.id;
  });

  await t.test("PATCH /author/:id", async (t) => {
    const response = await app.inject({
      method: "PATCH",
      url: `/author/${createdAuthorId}`,
      payload: {
        name: "Patched Test Author",
      },
    });

    assert.strictEqual(response.statusCode, 200);
    const author = JSON.parse(response.payload);
    assert.doesNotThrow(() => AuthorSchema.parse(author));
    assert.strictEqual(author.name, "Patched Test Author");
  });

  await t.test("DELETE /author/:id", async (t) => {
    const response = await app.inject({
      method: "DELETE",
      url: `/author/${createdAuthorId}`,
    });

    assert.strictEqual(response.statusCode, 204);

    const getResponse = await app.inject({
      method: "GET",
      url: `/author/${createdAuthorId}`,
    });

    assert.strictEqual(getResponse.statusCode, 404);
  });
});
