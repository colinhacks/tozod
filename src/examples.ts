import { z } from "zod";
import { toZod } from ".";

// See https://github.com/colinhacks/zod/issues/372#issuecomment-1280054492
// The one big missing feature is handling default objects
export function implement<Model extends object = never>() {
    return {
        // fails if one doesn't omit "keyof" from z.AnyZodObject
        with: <Schema extends toZod<Model> & Omit<z.AnyZodObject, 'keyof'>>(schema: Schema) => schema,
    };
}

// https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts
type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

describe('toZod', () => {
    it('parses an object', () => {
        type Example = {
            foo: string;
        };

        const zExample = implement<Example>().with(
            z.object({
                foo: z.string(),
            }),
        );

        type _ = Expect<Equal<z.infer<typeof zExample>, Example>>;
    });

    it('supports defaults', () => {
        type Example = {
            n: number;
            s: string;
            b: boolean;
            bi: bigint;
            d: Date;
            a: string[];
        };

        const zExample = implement<Example>().with(
            z.object({
                a: z.array(z.string()).default(['a', 'b', 'c']),
                d: z.date().default(new Date()),
                s: z.string().default('string'),
                n: z.number().default(808),
                b: z.boolean().default(true),
                bi: z.bigint().default(BigInt(100)),
            }),
        );

        type _ = Expect<Equal<z.infer<typeof zExample>, Example>>;
    });

    it('supports optional', () => {
        type Example = {
            foo?: string;
        };

        const zExample = implement<Example>().with(
            z.object({
                foo: z.string().optional(),
            }),
        );

        type _ = Expect<Equal<z.infer<typeof zExample>, Example>>;
    })

    it('supports nullable', () => {
        type Example = {
            foo: string | null;
        };

        const zExample = implement<Example>().with(
            z.object({
                foo: z.string().nullable(),
            }),
        );

        type _ = Expect<Equal<z.infer<typeof zExample>, Example>>;
    })

    it('disallows unknown keys', () => {
        type Example = {
            foo: string;
        };

        const _zExample = implement<Example>().with(
            // @ts-expect-error - unknownKey is not a key of Example
            z.object({
                foo: z.string(),
                unknownKey: z.string(),
            }),
        );
    })
});
