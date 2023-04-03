import * as z from 'zod';

type Schema<T> = z.ZodObject<{ [K in keyof T]: z.ZodType<T[K], any> }> & z.ZodSchema<T>;
type Effects<T> = z.ZodEffects<Schema<T>>;

export type toZod<T> = Schema<T> | Effects<T>;
