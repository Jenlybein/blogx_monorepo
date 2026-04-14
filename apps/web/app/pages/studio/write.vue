<script setup lang="ts">
import type { Component } from "vue";
import { computed, nextTick, reactive, ref } from "vue";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBlockquote,
  IconBold,
  IconCodeDots,
  IconColumns1,
  IconColumns2,
  IconHeading,
  IconHighlight,
  IconItalic,
  IconLink,
  IconList,
  IconListDetails,
  IconListNumbers,
  IconPhoto,
  IconStrikethrough,
  IconTable,
  IconTopologyStar3,
} from "@tabler/icons-vue";
import { NAvatar, NButton, NInput, NModal, NPopover, NSelect, NSwitch, NTooltip, useMessage } from "naive-ui";
import { useArticleMarkdown } from "~/composables/useArticleMarkdown";
import { generateArticleMetainfo } from "~/services/ai";
import { createArticle } from "~/services/article";
import { getCategoryOptions, getTagOptions } from "~/services/search";
import "github-markdown-css/github-markdown-light.css";

definePageMeta({
  layout: "write",
  middleware: "auth",
});

type ToolOption = {
  key: string;
  label: string;
  icon?: Component;
};

type ToolItem = {
  key: string;
  label: string;
  icon: Component;
  options?: ToolOption[];
};

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();
const editorTextareaRef = ref<HTMLTextAreaElement | null>(null);
const previewPaneRef = ref<HTMLElement | null>(null);

if (!authStore.profileId) {
  await authStore.fetchCurrentUser();
}

const form = reactive({
  title: "",
  abstract: "",
  content: "",
  category_id: null as string | null,
  tag_ids: [] as string[],
  cover: "",
  comments_toggle: true,
});

const pendingState = reactive({
  draft: false,
  publish: false,
  ai: false,
});

const showToc = ref(true);
const viewMode = ref<"split" | "editor" | "preview">("split");
const publishVisible = ref(false);

const currentUserId = computed(() => authStore.profileId || "");
const currentUserInitial = computed(() => authStore.profileName.slice(0, 1).toUpperCase() || "ME");

const { data: tagOptions } = await useAsyncData("studio-write-tag-options", () => getTagOptions().catch(() => []));
const { data: categoryOptions } = await useAsyncData(
  () => `studio-write-category-options:${currentUserId.value || "guest"}`,
  () => (currentUserId.value ? getCategoryOptions(currentUserId.value).catch(() => []) : Promise.resolve([])),
  {
    watch: [currentUserId],
  },
);

const { renderedHtml, headings } = useArticleMarkdown(computed(() => form.content));

const writeBodyClass = computed(() => ({
  "write-page__body--hide-toc": !showToc.value,
  "write-page__body--editor-only": viewMode.value === "editor",
  "write-page__body--preview-only": viewMode.value === "preview",
}));

const contentStats = computed(() => ({
  raw: form.content.length,
  pure: form.content.replace(/\s/g, "").length,
  lines: form.content ? form.content.split("\n").length : 1,
}));

const tocItems = computed(() => {
  if (headings.value.length) {
    return headings.value.map((item) => ({
      id: item.id,
      label: item.title,
      level: item.level,
    }));
  }

  return [
    { id: "", label: "从正文里的 H1-H4 标题自动生成目录", level: 1 },
    { id: "", label: "比如：# 接口能力梳理", level: 2 },
  ];
});

const canSubmit = computed(() => Boolean(form.title.trim() && form.content.trim()));

const leftTools: ToolItem[] = [
  {
    key: "title",
    label: "标题",
    icon: IconHeading,
    options: [
      { key: "h1", label: "H1 一级标题" },
      { key: "h2", label: "H2 二级标题" },
      { key: "h3", label: "H3 三级标题" },
      { key: "h4", label: "H4 四级标题" },
      { key: "h5", label: "H5 五级标题" },
      { key: "h6", label: "H6 六级标题" },
    ],
  },
  { key: "bold", label: "加粗", icon: IconBold },
  { key: "italic", label: "斜体", icon: IconItalic },
  { key: "quote", label: "引用", icon: IconBlockquote },
  { key: "link", label: "链接", icon: IconLink },
  { key: "image", label: "图片", icon: IconPhoto },
  { key: "highlight", label: "高亮", icon: IconHighlight },
  { key: "code", label: "代码块", icon: IconCodeDots },
  { key: "ul", label: "无序列表", icon: IconList },
  { key: "ol", label: "有序列表", icon: IconListNumbers },
  { key: "strike", label: "删除线", icon: IconStrikethrough },
  { key: "table", label: "表格", icon: IconTable },
  {
    key: "align",
    label: "对齐",
    icon: IconAlignLeft,
    options: [
      { key: "align-left", label: "左对齐", icon: IconAlignLeft },
      { key: "align-center", label: "居中对齐", icon: IconAlignCenter },
      { key: "align-right", label: "右对齐", icon: IconAlignRight },
    ],
  },
  {
    key: "mermaid",
    label: "Mermaid 图",
    icon: IconTopologyStar3,
    options: [
      { key: "flowchart", label: "流程图" },
      { key: "sequence", label: "时序图" },
      { key: "class", label: "类图" },
      { key: "state", label: "状态图" },
      { key: "er", label: "关系图" },
      { key: "journey", label: "旅程图" },
      { key: "gantt", label: "甘特图" },
      { key: "pie", label: "饼状图" },
    ],
  },
];

function focusEditor(selectionStart?: number, selectionEnd?: number) {
  nextTick(() => {
    const textarea = editorTextareaRef.value;
    if (!textarea) {
      return;
    }
    textarea.focus();
    if (typeof selectionStart === "number" && typeof selectionEnd === "number") {
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }
  });
}

function replaceSelection(transform: (selectedText: string) => { content: string; start: number; end: number }) {
  const textarea = editorTextareaRef.value;
  const fallbackSelection = form.content.length;
  const selectionStart = textarea?.selectionStart ?? fallbackSelection;
  const selectionEnd = textarea?.selectionEnd ?? fallbackSelection;
  const selectedText = form.content.slice(selectionStart, selectionEnd);
  const nextSelection = transform(selectedText);

  form.content = `${form.content.slice(0, selectionStart)}${nextSelection.content}${form.content.slice(selectionEnd)}`;
  focusEditor(selectionStart + nextSelection.start, selectionStart + nextSelection.end);
}

function insertSnippet(snippet: string) {
  replaceSelection((selectedText) => {
    const content = selectedText ? `${snippet}${selectedText}` : snippet;
    const offset = content.length;
    return { content, start: offset, end: offset };
  });
}

function wrapSelection(prefix: string, suffix: string, placeholder: string) {
  replaceSelection((selectedText) => {
    const value = selectedText || placeholder;
    return {
      content: `${prefix}${value}${suffix}`,
      start: prefix.length,
      end: prefix.length + value.length,
    };
  });
}

function handleToolOption(toolKey: string, optionKey: string) {
  if (toolKey === "title") {
    const level = Number(optionKey.slice(1)) || 2;
    insertSnippet(`${"#".repeat(level)} 标题\n`);
    return;
  }

  if (toolKey === "align") {
    const alignMap = {
      "align-left": "<div align=\"left\">\n内容\n</div>\n",
      "align-center": "<div align=\"center\">\n内容\n</div>\n",
      "align-right": "<div align=\"right\">\n内容\n</div>\n",
    } as const;

    insertSnippet(alignMap[optionKey as keyof typeof alignMap] || "<div align=\"left\">\n内容\n</div>\n");
    return;
  }

  if (toolKey === "mermaid") {
    const mermaidMap = {
      flowchart: "flowchart TD\n  A[开始] --> B[继续创作]",
      sequence: "sequenceDiagram\n  participant U as User\n  participant A as API\n  U->>A: 请求数据\n  A-->>U: 返回结果",
      class: "classDiagram\n  class Article {\n    +string title\n    +string content\n  }",
      state: "stateDiagram-v2\n  [*] --> Draft\n  Draft --> Published",
      er: "erDiagram\n  USER ||--o{ ARTICLE : writes",
      journey: "journey\n  title 创作流程\n  section 写作\n    起草: 5: 作者\n    发布: 4: 作者",
      gantt: "gantt\n  title 发布计划\n  dateFormat  YYYY-MM-DD\n  section Draft\n  写初稿 :2026-04-14, 2d",
      pie: "pie title 标签占比\n  \"Nuxt\" : 40\n  \"OpenAPI\" : 30\n  \"TypeScript\" : 30",
    } as const;

    insertSnippet(`\`\`\`mermaid\n${mermaidMap[optionKey as keyof typeof mermaidMap] || mermaidMap.flowchart}\n\`\`\`\n`);
  }
}

function handleToolClick(tool: ToolItem) {
  switch (tool.key) {
    case "bold":
      wrapSelection("**", "**", "加粗内容");
      break;
    case "italic":
      wrapSelection("*", "*", "斜体内容");
      break;
    case "quote":
      insertSnippet("> 引用内容\n");
      break;
    case "link":
      wrapSelection("[", "](https://example.com)", "链接文本");
      break;
    case "image":
      insertSnippet("![图片描述](https://example.com/image.png)\n");
      break;
    case "highlight":
      wrapSelection("==", "==", "高亮内容");
      break;
    case "code":
      replaceSelection((selectedText) => {
        const value = selectedText || "const answer = true;";
        return {
          content: `\`\`\`ts\n${value}\n\`\`\`\n`,
          start: 6,
          end: 6 + value.length,
        };
      });
      break;
    case "ul":
      insertSnippet("- 列表项\n- 列表项\n");
      break;
    case "ol":
      insertSnippet("1. 列表项\n2. 列表项\n");
      break;
    case "strike":
      wrapSelection("~~", "~~", "删除线内容");
      break;
    case "table":
      insertSnippet("| 列1 | 列2 |\n| --- | --- |\n| 内容 | 内容 |\n");
      break;
    default:
      break;
  }
}

function handleRightToolClick(key: "toc" | "editor" | "preview") {
  if (key === "toc") {
    showToc.value = !showToc.value;
    return;
  }

  const nextMode = key === "editor" ? "editor" : "preview";
  viewMode.value = viewMode.value === nextMode ? "split" : nextMode;
}

function handleTocJump(id: string) {
  if (!id) {
    focusEditor();
    return;
  }

  const target = previewPaneRef.value?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function matchOptionByText(options: Array<{ label: string; value: string }>, target?: { id?: string; title?: string } | null) {
  if (!target) return null;
  const byId = options.find((item) => item.value === target.id);
  if (byId) return byId.value;
  const normalizedTitle = target.title?.trim().toLowerCase();
  const byTitle = options.find((item) => item.label.trim().toLowerCase() === normalizedTitle);
  return byTitle?.value ?? null;
}

async function handleAiAssist() {
  if (!form.content.trim()) {
    message.warning("先写一点正文，再让 AI 帮你补标题和摘要。");
    return;
  }

  pendingState.ai = true;
  try {
    const result = await generateArticleMetainfo(form.content);
    form.title = result.title?.trim() || form.title;
    form.abstract = result.abstract?.trim() || form.abstract;

    const matchedCategoryId = matchOptionByText(categoryOptions.value || [], result.category);
    if (matchedCategoryId) {
      form.category_id = matchedCategoryId;
    }

    const nextTagIds = (result.tags || [])
      .map((item) => matchOptionByText(tagOptions.value || [], item))
      .filter((item): item is string => Boolean(item));

    if (nextTagIds.length) {
      form.tag_ids = Array.from(new Set(nextTagIds));
    }

    message.success("AI 已根据正文补全元信息建议");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "AI 元信息生成失败");
  } finally {
    pendingState.ai = false;
  }
}

async function submitArticle(status: 1 | 2) {
  if (!canSubmit.value) {
    message.warning("标题和正文是必填项。");
    return;
  }

  const key = status === 1 ? "draft" : "publish";
  pendingState[key] = true;

  try {
    const payload = await createArticle({
      title: form.title.trim(),
      abstract: form.abstract.trim() || undefined,
      content: form.content,
      category_id: form.category_id || null,
      tag_ids: form.tag_ids,
      cover: form.cover.trim() || undefined,
      comments_toggle: form.comments_toggle,
      status,
    });

    publishVisible.value = false;
    message.success(status === 1 ? "草稿已保存" : "文章已提交发布");
    await router.push(`/article/${payload.id}`);
  } catch (error) {
    message.error(error instanceof Error ? error.message : "文章提交失败");
  } finally {
    pendingState[key] = false;
  }
}

useSeoMeta({
  title: "创作系统 - 写文章",
  description: "对齐原型工作台结构的正式创作页面。",
});
</script>

<template>
  <div class="write-page">
    <header class="write-page__header">
      <div class="write-page__topbar">
        <NInput
          v-model:value="form.title"
          class="write-title-input"
          size="large"
          maxlength="120"
          placeholder="输入文章标题..."
          :bordered="false"
        />

        <div class="write-page__actions">
          <span class="muted">支持保存草稿，再补全发布信息</span>
          <NButton quaternary :loading="pendingState.draft" @click="submitArticle(1)">保存草稿</NButton>
          <NButton quaternary @click="navigateTo('/studio/profile')">草稿箱</NButton>
          <NButton type="primary" @click="publishVisible = true">发布</NButton>
          <NuxtLink :to="authStore.profileId ? `/users/${authStore.profileId}` : '/studio/profile'" class="write-avatar-link">
            <NAvatar round :src="authStore.currentUser?.avatar || undefined">
              {{ currentUserInitial }}
            </NAvatar>
          </NuxtLink>
        </div>
      </div>

      <div class="write-page__toolbar">
        <div class="write-page__toolbar-group">
          <template v-for="tool in leftTools" :key="tool.key">
            <NPopover v-if="tool.options" trigger="hover" placement="bottom-start">
              <template #trigger>
                <button type="button" class="write-tool-button" :aria-label="tool.label">
                  <component :is="tool.icon" class="write-tool-button__icon" :size="18" :stroke-width="1.9" />
                </button>
              </template>

              <div class="write-tool-popover">
                <button
                  v-for="option in tool.options"
                  :key="option.key"
                  type="button"
                  class="write-tool-option"
                  @click="handleToolOption(tool.key, option.key)"
                >
                  <component
                    v-if="option.icon"
                    :is="option.icon"
                    class="write-tool-option__icon"
                    :size="16"
                    :stroke-width="1.9"
                  />
                  {{ option.label }}
                </button>
              </div>
            </NPopover>

            <NTooltip v-else trigger="hover" placement="bottom">
              <template #trigger>
                <button type="button" class="write-tool-button" :aria-label="tool.label" @click="handleToolClick(tool)">
                  <component :is="tool.icon" class="write-tool-button__icon" :size="18" :stroke-width="1.9" />
                </button>
              </template>
              {{ tool.label }}
            </NTooltip>
          </template>
        </div>

        <div class="write-page__toolbar-group">
          <NTooltip trigger="hover" placement="bottom">
            <template #trigger>
              <button
                type="button"
                class="write-tool-button"
                :class="{ 'write-tool-button--active': showToc }"
                aria-label="目录"
                @click="handleRightToolClick('toc')"
              >
                <IconListDetails class="write-tool-button__icon" :size="18" :stroke-width="1.9" />
              </button>
            </template>
            目录
          </NTooltip>

          <NTooltip trigger="hover" placement="bottom">
            <template #trigger>
              <button
                type="button"
                class="write-tool-button"
                :class="{ 'write-tool-button--active': viewMode === 'editor' }"
                aria-label="仅显示编辑区"
                @click="handleRightToolClick('editor')"
              >
                <IconColumns1 class="write-tool-button__icon" :size="18" :stroke-width="1.9" />
              </button>
            </template>
            仅显示编辑区
          </NTooltip>

          <NTooltip trigger="hover" placement="bottom">
            <template #trigger>
              <button
                type="button"
                class="write-tool-button"
                :class="{ 'write-tool-button--active': viewMode === 'preview' }"
                aria-label="仅显示预览区"
                @click="handleRightToolClick('preview')"
              >
                <IconColumns2 class="write-tool-button__icon" :size="18" :stroke-width="1.9" />
              </button>
            </template>
            仅显示预览区
          </NTooltip>
        </div>
      </div>
    </header>

    <main class="write-page__body" :class="writeBodyClass">
      <aside v-show="showToc" class="write-page__toc">
        <div class="write-page__toc-header">目录</div>
        <nav class="write-page__toc-list">
          <button
            v-for="item in tocItems"
            :key="`${item.level}-${item.label}`"
            type="button"
            class="write-page__toc-item"
            :class="[`write-page__toc-item--level-${Math.min(item.level, 4)}`]"
            @click="handleTocJump(item.id)"
          >
            {{ item.label }}
          </button>
        </nav>
      </aside>

      <section class="write-page__pane write-page__pane--editor">
        <textarea
          ref="editorTextareaRef"
          v-model="form.content"
          class="write-page__textarea"
          placeholder="从这里开始写作，把 API 能力、页面结构和组件关系整理清楚。"
        />
      </section>

      <aside ref="previewPaneRef" class="write-page__pane write-page__pane--preview">
        <div v-if="form.content.trim()" class="write-page__preview-shell">
          <article class="write-page__markdown markdown-body" v-html="renderedHtml" />
        </div>

        <div v-else class="write-page__preview-empty">
          <p>预览区</p>
          <span>先输入标题或正文，这里会实时显示正式渲染结果。</span>
        </div>
      </aside>
    </main>

    <footer class="write-page__statusbar">
      <span>字符数: {{ contentStats.raw }}</span>
      <span>正文字符数: {{ contentStats.pure }}</span>
      <span>行数: {{ contentStats.lines }}</span>
      <span>目录项: {{ headings.length }}</span>
      <span>视图: {{ viewMode === 'split' ? '双栏' : viewMode === 'editor' ? '仅编辑区' : '仅预览区' }}</span>
    </footer>

    <NModal v-model:show="publishVisible" preset="card" class="publish-modal" title="发布文章">
      <div class="publish-form">
        <div class="publish-form__row">
          <label class="publish-form__label">分类</label>
          <NSelect
            v-model:value="form.category_id"
            clearable
            filterable
            :options="categoryOptions || []"
            placeholder="请选择分类"
            class="publish-form__control"
          />
        </div>

        <div class="publish-form__row">
          <label class="publish-form__label">添加标签</label>
          <NSelect
            v-model:value="form.tag_ids"
            multiple
            clearable
            filterable
            max-tag-count="responsive"
            :options="tagOptions || []"
            placeholder="请选择已有标签"
            class="publish-form__control"
          />
        </div>

        <div class="publish-form__row publish-form__row--top">
          <label class="publish-form__label">文章封面</label>
          <div class="publish-cover">
            <div class="publish-cover__picker">
              <span class="publish-cover__plus">+</span>
              <span>封面 URL</span>
            </div>
            <p class="muted">当前正式链路先支持写入封面 URL，文件上传任务链会再补齐。</p>
            <NInput
              v-model:value="form.cover"
              placeholder="https://example.com/article-cover.png"
              class="publish-form__control"
            />
          </div>
        </div>

        <div class="publish-form__row publish-form__row--top">
          <label class="publish-form__label">编辑摘要</label>
          <div class="publish-summary">
            <NInput
              v-model:value="form.abstract"
              type="textarea"
              maxlength="180"
              :autosize="{ minRows: 5, maxRows: 8 }"
              placeholder="请输入文章摘要"
            />
            <span class="publish-summary__count">{{ form.abstract.length }}/180</span>
          </div>
        </div>

        <div class="publish-form__row">
          <label class="publish-form__label">评论开关</label>
          <div class="publish-form__switch">
            <span class="muted">{{ form.comments_toggle ? "文章发布后允许评论" : "文章发布后将关闭评论区" }}</span>
            <NSwitch v-model:value="form.comments_toggle" />
          </div>
        </div>

        <div class="publish-form__note">
          <p>当前优先打通新建文章主链路，编辑态的 `status/category/tag` 完整回填仍依赖后端补齐契约。</p>
        </div>
      </div>

      <template #footer>
        <div class="publish-modal__footer">
          <NButton quaternary @click="publishVisible = false">取消</NButton>
          <NButton secondary :loading="pendingState.ai" @click="handleAiAssist()">AI 填入</NButton>
          <NButton quaternary :loading="pendingState.draft" @click="submitArticle(1)">保存草稿</NButton>
          <NButton type="primary" :loading="pendingState.publish" @click="submitArticle(2)">确定并发布</NButton>
        </div>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
.write-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.write-page__header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(18px);
  background: rgba(255, 251, 245, 0.9);
  border-bottom: 1px solid rgba(217, 226, 236, 0.92);
}

.write-page__topbar,
.write-page__toolbar,
.write-page__statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 24px;
}

.write-page__toolbar,
.write-page__statusbar {
  border-top: 1px solid rgba(217, 226, 236, 0.72);
}

.write-title-input {
  flex: 1;
}

.write-title-input :deep(.n-input) {
  background: transparent;
}

.write-title-input :deep(.n-input__input-el) {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.write-page__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}

.write-avatar-link {
  display: inline-flex;
}

.write-page__toolbar-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.write-tool-button {
  min-width: 34px;
  min-height: 34px;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 6px 8px;
  background: transparent;
  color: #334155;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.write-tool-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  font-size: 16px;
  line-height: 1;
}

.write-tool-button:hover {
  background: rgba(15, 118, 110, 0.08);
  border-color: rgba(15, 118, 110, 0.12);
  color: #0f766e;
}

.write-tool-button--active {
  background: rgba(15, 118, 110, 0.12);
  border-color: rgba(15, 118, 110, 0.2);
  color: #0f766e;
}

.write-tool-popover {
  min-width: 148px;
  max-height: 340px;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  overflow: auto;
}

.write-tool-option {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  padding: 10px 14px;
  text-align: left;
  background: transparent;
  color: #334155;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.write-tool-option:hover {
  background: rgba(15, 118, 110, 0.08);
  color: #0f766e;
}

.write-page__body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr) minmax(340px, 1fr);
}

.write-page__body--hide-toc {
  grid-template-columns: minmax(0, 1fr) minmax(340px, 1fr);
}

.write-page__body--editor-only {
  grid-template-columns: 200px minmax(0, 1fr);
}

.write-page__body--editor-only.write-page__body--hide-toc,
.write-page__body--preview-only.write-page__body--hide-toc {
  grid-template-columns: minmax(0, 1fr);
}

.write-page__body--preview-only {
  grid-template-columns: 200px minmax(0, 1fr);
}

.write-page__pane {
  min-height: 0;
  overflow: auto;
}

.write-page__toc {
  border-right: 1px solid rgba(217, 226, 236, 0.92);
  background:
    linear-gradient(180deg, rgba(245, 248, 252, 0.96) 0%, rgba(241, 245, 249, 0.86) 100%);
}

.write-page__toc-header {
  padding: 18px 16px 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #475569;
}

.write-page__toc-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 10px 14px;
}

.write-page__toc-item {
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 8px 10px;
  text-align: left;
  color: #334155;
  background: rgba(255, 255, 255, 0.62);
  cursor: pointer;
  font-size: 13px;
  line-height: 1.35;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.write-page__toc-item:hover {
  transform: translateX(1px);
  background: rgba(15, 118, 110, 0.1);
  border-color: rgba(15, 118, 110, 0.18);
  color: #0f766e;
}

.write-page__toc-item--level-2 {
  padding-left: 24px;
  color: #475569;
}

.write-page__toc-item--level-3 {
  padding-left: 36px;
  color: #64748b;
}

.write-page__toc-item--level-4 {
  padding-left: 48px;
  color: #94a3b8;
}

.write-page__pane--editor {
  border-right: 1px solid rgba(217, 226, 236, 0.92);
}

.write-page__body--editor-only .write-page__pane--preview,
.write-page__body--preview-only .write-page__pane--editor {
  display: none;
}

.write-page__textarea {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 154px);
  border: 0;
  resize: none;
  padding: 24px 32px 40px;
  font: inherit;
  font-size: 17px;
  line-height: 1.9;
  color: #102031;
  background: transparent;
  outline: none;
}

.write-page__preview-shell {
  min-height: 100%;
  padding: 32px 36px 48px;
}

.write-page__markdown {
  max-width: none;
  background: transparent;
  color: #0f172a;
  font-family: "Sora", "Sora Fallback", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  font-size: 16px;
  line-height: 1.9;
  padding: 0;
}

.write-page__markdown :deep(h1),
.write-page__markdown :deep(h2),
.write-page__markdown :deep(h3),
.write-page__markdown :deep(h4),
.write-page__markdown :deep(h5),
.write-page__markdown :deep(h6) {
  font-weight: 700;
  letter-spacing: -0.02em;
}

.write-page__markdown :deep(h1) {
  font-size: 2rem;
}

.write-page__markdown :deep(h2) {
  font-size: 1.7rem;
}

.write-page__markdown :deep(h3) {
  font-size: 1.5rem;
}

.write-page__markdown :deep(h4) {
  font-size: 1.3rem;
}

.write-page__markdown :deep(h5) {
  font-size: 1.1rem;
}

.write-page__markdown :deep(h6) {
  font-size: 1.05rem;
}

.write-page__markdown :deep(pre) {
  border-radius: 12px;
}

.write-page__markdown :deep(table) {
  display: table;
}

.write-page__preview-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #6b7f95;
}

.write-page__preview-empty p {
  margin: 0;
  font-size: 18px;
  color: #334155;
}

.write-page__statusbar {
  justify-content: flex-start;
  gap: 18px;
  color: #6b7f95;
  font-size: 13px;
  background: rgba(255, 251, 245, 0.84);
}

.publish-modal {
  width: min(720px, calc(100vw - 32px));
}

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.publish-form__row {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
}

.publish-form__row--top {
  align-items: flex-start;
}

.publish-form__label {
  font-size: 14px;
  color: #334155;
}

.publish-form__control {
  width: 100%;
}

.publish-cover {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.publish-cover__picker {
  width: 194px;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px dashed rgba(148, 163, 184, 0.7);
  border-radius: 16px;
  color: #64748b;
  background: rgba(248, 250, 252, 0.8);
}

.publish-cover__plus {
  font-size: 28px;
  line-height: 1;
}

.publish-summary {
  position: relative;
}

.publish-summary__count {
  position: absolute;
  right: 12px;
  bottom: 10px;
  font-size: 12px;
  color: #f97316;
}

.publish-form__switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid rgba(217, 226, 236, 0.82);
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.8);
}

.publish-form__note {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 247, 237, 0.92);
  color: #9a3412;
  font-size: 13px;
  line-height: 1.8;
}

.publish-form__note p {
  margin: 0;
}

.publish-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 1120px) {
  .write-page__topbar,
  .write-page__toolbar,
  .write-page__statusbar {
    padding: 12px 16px;
  }

  .write-page__actions {
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .write-page__body,
  .write-page__body--hide-toc,
  .write-page__body--editor-only,
  .write-page__body--preview-only,
  .write-page__body--editor-only.write-page__body--hide-toc,
  .write-page__body--preview-only.write-page__body--hide-toc {
    grid-template-columns: 1fr;
  }

  .write-page__toc,
  .write-page__pane--editor {
    border-right: 0;
    border-bottom: 1px solid rgba(217, 226, 236, 0.92);
  }

  .write-page__textarea {
    min-height: 420px;
    padding: 20px 18px 28px;
  }

  .write-page__preview-shell {
    padding: 24px 18px 32px;
  }
}

@media (max-width: 720px) {
  .write-title-input :deep(.n-input__input-el) {
    font-size: 20px;
  }

  .write-page__actions .muted {
    display: none;
  }

  .publish-form__row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .publish-modal__footer {
    flex-wrap: wrap;
  }
}
</style>
