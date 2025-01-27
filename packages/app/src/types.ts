/**
 * Infers the return type of a query function
 * @example InferQueryFnType<typeof applicationsQueryOptions.queryFn>
 */
export type InferQueryFnType<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NonNullable<T> extends (...args: any[]) => infer R ? Awaited<R> : unknown;
