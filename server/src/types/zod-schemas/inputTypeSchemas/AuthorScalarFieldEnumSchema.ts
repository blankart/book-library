import { z } from 'zod';

export const AuthorScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt','deleted','deletedAt']);

export default AuthorScalarFieldEnumSchema;
