import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/context/LanguageContext";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  minHeight = "min-h-[80px]",
}: MarkdownEditorProps) {
  const { language } = useLanguage();
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="w-full">
      {/* Markdown Toolbar - Preview Only */}
      {!disabled && !isPreview && (
        <div className="flex justify-end gap-1 mb-2 border-b pb-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs gap-1"
            onClick={() => setIsPreview(true)}
          >
            <Eye className="h-3 w-3" />
            {language === "vi" ? "Xem trước" : "Preview"}
          </Button>
        </div>
      )}

      {/* Preview Mode Toolbar */}
      {!disabled && isPreview && (
        <div className="flex justify-end gap-1 mb-2 border-b pb-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs gap-1 text-primary"
            onClick={() => setIsPreview(false)}
          >
            <Edit2 className="h-3 w-3" />
            {language === "vi" ? "Sửa" : "Edit"}
          </Button>
        </div>
      )}

      {isPreview ? (
        <div
          className={`${minHeight} prose prose-sm dark:prose-invert max-w-none p-2 border rounded-md bg-muted/20 overflow-y-auto`}
        >
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <span className="text-muted-foreground italic">
              Nothing to preview
            </span>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          className={`w-full bg-transparent border-none resize-none focus:outline-none text-base text-foreground placeholder:text-muted-foreground ${minHeight}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      )}
    </div>
  );
}
