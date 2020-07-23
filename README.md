<p align="center">
  <h3>toZod</h3>
</p>

`toZod` is a utility for defining Zod schemas that agree with a TypeScript type.

This it the inverse how Zod typically works. By chaining and composing its built-in methods, Zod is able to build up an inferred static type for your schema. This is the opposite: `toZod` "infers" the structure of a Zod schema from a TS type.

## Installation

```ts
yarn add tozod
```

⚠ Requires TypeScript 3.9+ and `"strictNullChecks": true` ⚠

## Usage

```ts
import { toZod } from 'tozod';

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
```

Getting rid of any of these method calls will throw a TypeError.

![tozod type error screenshot](https://i.imgur.com/XWdXWRw.png)

This gets extremely exciting when you start using it on recursive or mutually recursive types.

```ts
type User = {
  id: string;
  name: string;
  age?: number | undefined;
  active: boolean | null;
  posts: Post[];
};

type Post = {
  content: string;
  author: User;
};

export const User: toZod<User> = z.late.object(() => ({
  id: z.string().uuid(), // refinements are fine
  name: z.string(),
  age: z.number().optional(),
  active: z.boolean().nullable(),
  posts: z.array(Post),
}));

export const Post: toZod<Post> = z.late.object(() => ({
  content: z.string(),
  author: User,
}));
```

> The above uses a z.late.object method that is currently implemented but undocumented.

You've just implemented two mutually recursive validatators with accurate static and runtime type information. So you can use Zod's built-in object methods to derive variants of these schemas:

```ts
const CreateUserInput = User.omit({ id: true, posts: true });
const PostIdOnly = Post.pick({ id: true });
const UpdateUserInput = User.omit({ id: true }).partial().extend({ id: z.string()u });
```

And because the TypeScript engine knows the exact shape of the Zod schema internally, you can access its internals like so:

```ts
User.shape.posts.element.shape.author;
```

<!-- As far as I know this is the first time any validation library has supported a recursive object schema that still gives you access to all the methods you'd want. -->
