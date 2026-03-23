import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon,
  Heading1, Heading2, Heading3, Palette, Highlighter, Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const FONT_FAMILIES = [
  { label: "Default", value: "default" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Sans-serif", value: "Arial, sans-serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Garamond", value: "'EB Garamond', serif" },
  { label: "Times", value: "'Times New Roman', serif" },
];

const COLORS = [
  "#000000", "#374151", "#6B7280", "#DC2626", "#EA580C",
  "#CA8A04", "#16A34A", "#2563EB", "#7C3AED", "#DB2777",
];

const ToolbarButton = ({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    title={title}
    className={cn(
      "h-7 w-7 p-0",
      active && "bg-accent text-accent-foreground"
    )}
  >
    {children}
  </Button>
);

const RichTextEditor = ({ content, onChange, placeholder, className }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExtension.configure({ openOnClick: false }),
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] px-3 py-2 text-sm focus:outline-none text-foreground",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("URL del link:", editor.getAttributes("link").href || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <div className={cn("rounded-md border border-input bg-background", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
        {/* Font family */}
        <Select
          value={editor.getAttributes("textStyle").fontFamily || "default"}
          onValueChange={(v) => {
            if (v === "default") {
              editor.chain().focus().unsetFontFamily().run();
            } else {
              editor.chain().focus().setFontFamily(v).run();
            }
          }}
        >
          <SelectTrigger className="h-7 w-28 text-xs border-none shadow-none">
            <Type className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((f) => (
              <SelectItem key={f.value} value={f.value} className="text-xs">
                <span style={{ fontFamily: f.value === "default" ? undefined : f.value }}>
                  {f.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Titolo 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Titolo 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Titolo 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Grassetto">
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Corsivo">
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Sottolineato">
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Barrato">
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Allinea a sinistra">
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Centra">
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Allinea a destra">
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Giustifica">
          <AlignJustify className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista puntata">
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerata">
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citazione">
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Link */}
        <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Link">
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarButton>

        {/* Color */}
        <div className="relative group">
          <ToolbarButton onClick={() => {}} title="Colore testo">
            <Palette className="h-3.5 w-3.5" />
          </ToolbarButton>
          <div className="absolute top-full left-0 z-50 hidden group-hover:flex flex-wrap gap-1 p-2 bg-popover border border-border rounded-md shadow-md w-[120px]">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className="h-5 w-5 rounded-sm border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
              />
            ))}
            <button
              type="button"
              className="h-5 w-5 rounded-sm border border-border text-[8px] hover:scale-110 transition-transform"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Highlight */}
        <div className="relative group">
          <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Evidenzia">
            <Highlighter className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Annulla">
          <Undo className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Ripeti">
          <Redo className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {!content && placeholder && (
        <style>{`
          .ProseMirror p.is-editor-empty:first-child::before {
            content: '${placeholder}';
            float: left;
            color: hsl(var(--muted-foreground));
            pointer-events: none;
            height: 0;
          }
        `}</style>
      )}
    </div>
  );
};

export default RichTextEditor;
