import { z } from 'zod';

export const AuthorScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt']);

export default AuthorScalarFieldEnumSchema;
