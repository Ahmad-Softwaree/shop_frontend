"use client";

import { ENUMs } from "@/lib/enums";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useAppQueryParams } from "@/hooks/useAppQuery";

const Search = ({
  className,
  placeholder,
  ...props
}: React.PropsWithChildren<React.ComponentProps<"input">>) => {
  const { t } = useTranslation();

  const { queries, setQueries } = useAppQueryParams();
  const search = queries.search || "";

  return (
    <div className="relative w-full">
      <Input
        onChange={(e) =>
          setQueries((prev) => ({
            ...prev,
            [ENUMs.PARAMS.SEARCH]: e.target.value,
          }))
        }
        value={search}
        placeholder={placeholder ?? t("common.search")}
        className={cn(className, "pe-10")}
        type="text"
        {...props}
      />

      {search === "" && (
        <Button
          variant="link"
          className="absolute top-1/2 transform -translate-y-1/2 text-muted-foreground end-0">
          <SearchIcon />
        </Button>
      )}

      {search !== "" && (
        <Button
          onClick={() =>
            setQueries((prev) => ({
              ...prev,
              [ENUMs.PARAMS.SEARCH]: "",
            }))
          }
          variant="ghost"
          className="absolute top-1/2 transform -translate-y-1/2 text-muted-foreground end-0">
          <X />
        </Button>
      )}
    </div>
  );
};

export default Search;
