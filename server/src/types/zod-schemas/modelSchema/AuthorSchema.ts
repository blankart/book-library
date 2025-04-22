import { z } from 'zod';

/////////////////////////////////////////
// AUTHOR SCHEMA
/////////////////////////////////////////

export const AuthorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  // omitted: deleted: z.boolean(),
  // omitted: deletedAt: z.coerce.date().nullable(),
})

export type Author = z.infer<typeof AuthorSchema>

export default AuthorSchema;
