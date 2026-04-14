import MarkdownIt from "markdown-it";
import { computed, toRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

export interface ArticleHeadingAnchor {
  id: string;
  href: string;
  title: string;
  level: number;
}

interface RenderedArticleMarkdown {
  html: string;
  headings: ArticleHeadingAnchor[];
}

const markdown = new MarkdownIt({
  breaks: true,
  linkify: true,
  html: false,
});
const markdownRuntime = markdown as MarkdownIt & {
  parse: (source: string, env: Record<string, unknown>) => Array<{
    type: string;
    tag: string;
    content: string;
    attrSet: (name: string, value: string) => void;
  }>;
  renderer: {
    render: (tokens: unknown[], options: unknown, env: Record<string, unknown>) => string;
  };
  options: unknown;
};

function createHeadingId(title: string, serial: number, usedIds: Map<string, number>) {
  const normalized = title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\u4e00-\u9fa5]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  const base = normalized || `section-${serial}`;
  const currentCount = usedIds.get(base) || 0;
  usedIds.set(base, currentCount + 1);
  return currentCount === 0 ? base : `${base}-${currentCount + 1}`;
}

function renderArticleMarkdown(source: string): RenderedArticleMarkdown {
  if (!source.trim()) {
    return {
      html: "<p>暂无正文内容。</p>",
      headings: [],
    };
  }

  const tokens = markdownRuntime.parse(source, {});
  const headings: ArticleHeadingAnchor[] = [];
  const usedIds = new Map<string, number>();
  let headingSerial = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token) {
      continue;
    }
    if (token.type !== "heading_open") {
      continue;
    }

    const inlineToken = tokens[index + 1];
    if (!inlineToken || inlineToken.type !== "inline") {
      continue;
    }

    headingSerial += 1;
    const level = Number(token.tag.slice(1));
    const title = inlineToken.content.trim() || `章节 ${headingSerial}`;
    const id = createHeadingId(title, headingSerial, usedIds);
    token.attrSet("id", id);

    if (level >= 1 && level <= 4) {
      headings.push({
        id,
        href: `#${id}`,
        title,
        level,
      });
    }
  }

  return {
    html: markdownRuntime.renderer.render(tokens, markdownRuntime.options, {}),
    headings,
  };
}

export function useArticleMarkdown(source: MaybeRefOrGetter<string | null | undefined>) {
  const sourceRef = toRef(source);

  const parsed = computed(() => renderArticleMarkdown(toValue(sourceRef) || ""));

  return {
    renderedHtml: computed(() => parsed.value.html),
    headings: computed(() => parsed.value.headings),
  };
}
