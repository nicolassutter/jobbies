/**
 * Infers the return type of a query function
 * @example InferQueryFnType<typeof applicationsQueryOptions.queryFn>
 */
export type InferQueryFnType<T> =
  NonNullable<T> extends (...args: any[]) => infer R ? Awaited<R> : unknown;
