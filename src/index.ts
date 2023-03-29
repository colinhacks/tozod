import * as z from 'zod';

export type toZod<T> = z.ZodObject<{ [K in keyof T]: z.ZodType<T[K], any> }> & z.ZodSchema<T>;
