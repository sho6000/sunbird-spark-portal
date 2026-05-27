import { useAppI18n } from "@/hooks/useAppI18n";

const SUGGESTIONS = [
  "How to teach fractions to beginners?",
  "Creative writing activities for students",
  "Science experiments for kids at home",
  "Learn programming basics step by step",
  "History of ancient civilizations",
  "Mathematics problem solving strategies",
];

interface SemanticSuggestionsProps {
  onSelect: (query: string) => void;
}

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" />
  </svg>
);

const SemanticSuggestions = ({ onSelect }: SemanticSuggestionsProps) => {
  const { t } = useAppI18n();

  return (
    <div className="flex flex-col items-center gap-5 py-8 px-4">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2 text-sunbird-brick">
          <SparkleIcon className="w-5 h-5 animate-pulse" />
          <span className="font-rubik font-semibold text-base">{t("search.semanticSuggestTitle")}</span>
          <SparkleIcon className="w-5 h-5 animate-pulse" />
        </div>
        <p className="font-rubik text-sm text-gray-400">{t("search.semanticSuggestSubtitle")}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white
              text-sm font-rubik text-gray-600 hover:border-sunbird-brick hover:text-sunbird-brick
              hover:bg-sunbird-brick/5 transition-all duration-150 shadow-sm hover:shadow"
          >
            <SparkleIcon className="w-3 h-3 text-gray-300 group-hover:text-sunbird-brick transition-colors" />
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SemanticSuggestions;
