import { identity, pickBy } from "lodash-es";
import qs from "qs";

import { QueryState, QueryStateURL } from "./request";

/**
 * It takes a query state object and returns a query string
 * Example: page=1&pageSize=10&sort=id&order=desc&search=a&filter_name=a&filter_online=false
 * @param {QueryState} state - QueryState
 * @returns A function that takes a QueryState object and returns a string.
 */
export const stringifyRequestQuery = <T extends object>(
  state: QueryState<T>,
): string => {
  const pagination = qs.stringify(state, {
    filter: ["page", "pageSize"],
    skipNulls: true,
  });
  const sort = qs.stringify(state, {
    filter: ["column", "kind"],
    skipNulls: true,
  });
  const search = qs.stringify(state, { filter: ["q"], skipNulls: true });
  const filters = qs.stringify(pickBy(state.filters, identity), {
    skipNulls: true,
  });

  return [pagination, sort, search, filters]
    .filter((f) => f)
    .join("&")
    .toLowerCase();
};

export function parseRequestQuery<T extends object>(
  query: string,
): QueryState<T> {
  const cache = qs.parse(query) as unknown as QueryStateURL<T>;
  const { page, pageSize, column, kind, q, ...filters } = cache;

  return { column, filters: filters as T, kind, pageSize, page, q };
}
