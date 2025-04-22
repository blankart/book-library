import { z } from 'zod';

/////////////////////////////////////////
// BOOK SCHEMA
/////////////////////////////////////////

export const BookSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  authorId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  // omitted: deleted: z.boolean(),
  // omitted: deletedAt: z.coerce.date().nullable(),
})

export type Book = z.infer<typeof BookSchema>

export default BookSchema;
