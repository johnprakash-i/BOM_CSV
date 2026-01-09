/**
 * Utility types for enhanced type safety
 */

/**
 * Make specific properties required
 */
export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type PartialField<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extract property types from an object
 */
export type ValueOf<T> = T[keyof T];

/**
 * Create a type-safe pick that ensures at least one property
 */
export type AtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Readonly deeply nested objects
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Type guard helper
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * Async function type
 */
export type AsyncFunction<T = void> = (...args: any[]) => Promise<T>;

/**
 * Event handler type
 */
export type EventHandler<T = void> = (event: React.SyntheticEvent) => T;