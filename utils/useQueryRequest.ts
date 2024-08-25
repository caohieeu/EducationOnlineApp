"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash-es";

import { parseRequestQuery, stringifyRequestQuery } from "./query";
import { QueryState } from "./request";

/**
 * It provides a set of hooks and functions to manage the query state of a table
 * @param [defaultState] - The default state for the query.
 * @param [onGlobalSearchChange] - A callback function that will be called when the global search is
 * updated.
 * @param [isSyncQueryStringToUrl=true] - Whether to sync the query string to the URL.
 */
function useQueryRequest<T extends object>(
  defaultState?: Partial<QueryState<T>>,
  onGlobalSearchChange?: (search: string) => void,
  isSyncQueryStringToUrl = true,
) {
  const [queryState, setQueryState] =
    useState<QueryState<T>>(getInitialQueryState);

  // current string version of queryState
  const queryStateStringified = useMemo(
    () => stringifyRequestQuery(queryState),
    [queryState],
  );

  // old string version of queryState
  const [queryString, setQueryString] = useState<string>(queryStateStringified);

  // if queryString !== queryStateStringified => set queryString = queryStateStringified => sync to url if allowed
  useEffect(() => {
    if (queryString === queryStateStringified) return;
    setQueryString(queryStateStringified);
    if (isSyncQueryStringToUrl) {
      // const newUrl = new URL(window.location.href);

      // newUrl.search = queryStateStringified;
      // window.history.replaceState({}, "", newUrl.toString());
    }
  }, [queryStateStringified, isSyncQueryStringToUrl]);

  function getInitialQueryState(): QueryState<T> {
    return { pageSize: 8, page: 1, ...defaultState };
  }

  // set state is asynchronous so if call multiple func in one time => on has effect at latest call
  function updateQueryState(updates: Partial<QueryState<T>>) {
    const updatedState = { ...queryState, ...updates };

    setQueryState(updatedState);
  }

  // HANDLE FILTERS
  function updateFiltersState(updates: Partial<T>) {
    updateQueryState({ filters: { ...queryState.filters!, ...updates } });
  }

  // HANDLE GLOBAL SEARCH
  const [globalSearch, setGlobalSearch] = useState(
    () => getInitialQueryState().q || "",
  );

  const debounceSearch = useCallback(
    debounce((search: string) => {
      updateQueryState({ q: search });
      onGlobalSearchChange?.(search);
    }, 300),
    [],
  );

  function handleUpdateGlobalSearch(e: string) {
    setGlobalSearch(e);
    debounceSearch(e);
  }

  return {
    globalSearch,
    handleUpdateGlobalSearch,
    queryState,
    queryString,
    updateFiltersState,
    updateQueryState,
  };
}

export { useQueryRequest };
