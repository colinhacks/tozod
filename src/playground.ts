import * as z from 'zod';
import { toZod } from '.';

type Player = {
  name: string;
  age?: number | undefined;
  active: boolean | null;
};

export const Player: toZod<Player> = z.object({
  name: z.string(),
  age: z.number().optional(),
  active: z.boolean().nullable(),
});

type User = {
  name: string;
  age?: number | undefined;
  active: boolean | null;
  posts: Post[];
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
}));

const Post: toZod<Post> = z.late.object(() => ({
  content: z.string(),
  author: User,
}));

console.log(User.shape.posts.element.shape.author);
