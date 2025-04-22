import { z } from 'zod';

export const BookScalarFieldEnumSchema = z.enum(['id','title','authorId','createdAt','updatedAt','deleted','deletedAt']);

export default BookScalarFieldEnumSchema;
