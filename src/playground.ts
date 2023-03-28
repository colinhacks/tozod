import * as z from 'zod';
import { toZod } from '.';

enum UserType {
  Guest = 'guest',
  Standard = 'standard',
  Admin = 'admin'
}

type User = {
  name: string;
  age?: number | undefined;
  active: boolean | null;
  posts: Post[];
  type: UserType;
};

type Post = {
  content: string;
  author: User;
};

const User: toZod<User> = z.late.object(() => ({
  name: z
    .string()
    .min(5)
    .max(2314)
    .refine(() => false, 'asdf'),
  age: z.number().optional(),
  active: z.boolean().nullable(),
  posts: z.array(Post),
  type: z.nativeEnum(UserType)
}));

const Post: toZod<Post> = z.late.object(() => ({
  content: z.string(),
  author: User,
}));

