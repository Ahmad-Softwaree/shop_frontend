"use client";

import { getLimitFromCookie } from "@/lib/config/pagination.config";
import { ENUMs } from "@/lib/enums";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";

export function useAppQueryParams() {
  const [cookieLimit, setCookieLimit] = useState<number>(100);

  useEffect(() => {
    setCookieLimit(getLimitFromCookie());
  }, []);

  const [queries, setQueries] = useQueryStates(
    {
      [ENUMs.PARAMS.SEARCH]: parseAsString.withDefault(""),
      [ENUMs.PARAMS.PAGE]: parseAsInteger.withDefault(0),
      [ENUMs.PARAMS.LIMIT]: parseAsInteger.withDefault(cookieLimit),
      [ENUMs.PARAMS.EMAIL]: parseAsString.withDefault(""),
    },
    {
      shallow: true,
    }
  );

  return {
    queries,
    setQueries,
  };
}
