import { useRef, forwardRef, type RefObject } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import { SearchMode } from "@/types/workspaceTypes";
import { useAppI18n } from "@/hooks/useAppI18n";

interface SearchModeToggleProps {
  query: string;
  onQueryChange: (value: string) => void;
  searchMode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  placeholder?: string;
  className?: string;
}

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" />
  </svg>
);

const SearchModeToggle = forwardRef<HTMLInputElement, SearchModeToggleProps>(
  ({ query, onQueryChange, searchMode, onModeChange, placeholder, className = "" }, ref) => {
    const { t } = useAppI18n();
    const localRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as RefObject<HTMLInputElement>) ?? localRef;

    const isSemantic = searchMode === "semantic";

    return (
      <div className={`flex items-center gap-2 w-full ${className}`}>
        {/* Left icon — magnifying glass for keyword, sparkle for semantic */}
        <span
          className={`flex-shrink-0 w-5 h-5 ${isSemantic ? "text-sunbird-brick animate-pulse" : "text-gray-400"}`}
          aria-hidden="true"
        >
          {isSemantic ? <SparkleIcon className="w-5 h-5" /> : <FiSearch className="w-5 h-5" />}
        </span>

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder ?? t("search_for_content_placeholder")}
          className="flex-1 min-w-0 outline-none font-rubik text-base text-gray-700 placeholder-gray-400 bg-transparent"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t("clear_search")}
          >
            <FiX className="w-4 h-4" />
          </button>
        )}

        {/* Mode toggle pills */}
        <div className="flex-shrink-0 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onModeChange("keyword")}
            className={`flex items-center px-3 py-1 rounded-full text-sm font-rubik font-medium transition-colors whitespace-nowrap ${
              !isSemantic
                ? "bg-gray-100 text-gray-700 border border-gray-300"
                : "text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
            aria-pressed={!isSemantic}
          >
            {t("search.keywordMode")}
          </button>

          <button
            type="button"
            onClick={() => onModeChange("semantic")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-rubik font-medium transition-colors whitespace-nowrap ${
              isSemantic
                ? "bg-sunbird-brick text-white"
                : "text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
            aria-pressed={isSemantic}
          >
            <SparkleIcon className="w-3.5 h-3.5" />
            {t("search.semanticMode")}
          </button>
        </div>

      </div>
    );
  }
);

SearchModeToggle.displayName = "SearchModeToggle";

export default SearchModeToggle;
