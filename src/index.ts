import * as z from 'zod';

type Matches<T> = {
  [K in keyof T]: z.ZodType<T[K], any>
};

type ZodMatches<T> = z.ZodObject<Matches<T>> & z.ZodSchema<T>;

export type toZod<T> = ZodMatches<T>;
