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

// native enum
enum UserType {
  Admin = 'admin',
  Standard = 'standard'
}

// zod enum
const StatusType = z.enum(['active', 'inactive', 'pending']);

type User = {
  name: string;
  age?: number | undefined;
  active: boolean | null;
  posts: Post[];
  type: UserType;
  status: z.infer<typeof StatusType>;
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
  type: z.nativeEnum(UserType),
  status: StatusType,
}));

const Post: toZod<Post> = z.late.object(() => ({
  content: z.string(),
  author: User,
}));

