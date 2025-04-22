import { test } from "node:test";
import assert from "node:assert";
import { build } from "../helper";
import { BookSchema, AuthorSchema } from "../../src/types/zod-schemas";
import z from "zod";

test("Book Routes", async (t) => {
  const app = await build(t);
  let createdBookId: string;
  let createdAuthorId: string;

  await t.test("Setup", async (t) => {
    const response = await app.inject({
      method: "POST",
      url: "/author",
      payload: {
        name: "Test Author for Books",
      },
    });

    assert.strictEqual(response.statusCode, 201);
    const author = JSON.parse(response.payload);
    assert.doesNotThrow(() => AuthorSchema.parse(author));
    createdAuthorId = author.id;
  });

  await t.test("GET /book", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: "/book?limit=2&page=1",
    });

    assert.strictEqual(response.statusCode, 200);
    const data = JSON.parse(response.payload);
    const paginatedResponseSchema = z.object({
      result: BookSchema.extend({
        author: AuthorSchema.pick({ name: true }),
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
      (book: z.infer<typeof BookSchema> & { author: { name: string } }) => {
        assert.doesNotThrow(() =>
          BookSchema.extend({
            author: AuthorSchema.pick({ name: true }),
          }).parse(book)
        );
      }
    );
  });

  await t.test("POST /book", async (t) => {
    const response = await app.inject({
      method: "POST",
      url: "/book",
      payload: {
        title: "Test Book",
        authorId: createdAuthorId,
      },
    });

    assert.strictEqual(response.statusCode, 201);
    const book = JSON.parse(response.payload);
    assert.doesNotThrow(() =>
      BookSchema.extend({
        author: AuthorSchema.pick({ name: true }),
      }).parse(book)
    );
    assert.strictEqual(book.title, "Test Book");
    assert.strictEqual(book.authorId, createdAuthorId);
    createdBookId = book.id;
  });

  await t.test("GET /book/:id", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: `/book/${createdBookId}`,
    });

    assert.strictEqual(response.statusCode, 200);
    const book = JSON.parse(response.payload);
    assert.doesNotThrow(() =>
      BookSchema.extend({
        author: AuthorSchema.pick({ name: true }),
      }).parse(book)
    );
    assert.strictEqual(book.id, createdBookId);
  });

  await t.test("PATCH /book/:id", async (t) => {
    const response = await app.inject({
      method: "PATCH",
      url: `/book/${createdBookId}`,
      payload: {
        title: "Patched Test Book",
      },
    });

    assert.strictEqual(response.statusCode, 200);
    const book = JSON.parse(response.payload);
    assert.doesNotThrow(() =>
      BookSchema.extend({
        author: AuthorSchema.pick({ name: true }),
      }).parse(book)
    );
    assert.strictEqual(book.title, "Patched Test Book");
  });

  await t.test("DELETE /book/:id", async (t) => {
    const response = await app.inject({
      method: "DELETE",
      url: `/book/${createdBookId}`,
    });

    assert.strictEqual(response.statusCode, 204);

    const getResponse = await app.inject({
      method: "GET",
      url: `/book/${createdBookId}`,
    });

    assert.strictEqual(getResponse.statusCode, 404);
  });

  await t.test("Cleanup", async (t) => {
    const response = await app.inject({
      method: "DELETE",
      url: `/author/${createdAuthorId}`,
    });

    assert.strictEqual(response.statusCode, 204);
  });
});
