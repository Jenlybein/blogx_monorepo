<script setup lang="ts">
import type { Component } from "vue";
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { NAvatar, NButton, NInput, NModal, NPopover, NSelect, NSpace, NTooltip } from "naive-ui";
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

type ToolOption = {
  label: string;
  icon?: Component;
  desc?: string;
};

type ToolItem = {
  key: string;
  label: string;
  icon: Component;
  options?: ToolOption[];
};

const title = ref("");
const content = ref("");
const showToc = ref(true);
const viewMode = ref<"split" | "editor" | "preview">("split");
const publishVisible = ref(false);
const publishCategory = ref<string | null>("frontend");
const publishTags = ref<string[]>(["nuxt", "openapi"]);
const publishCover = ref("");
const publishSummary = ref("这篇文章围绕现有 OpenAPI 反推前端页面、状态、组件和 API 封装设计。");

const leftTools: ToolItem[] = [
  {
    key: "title",
    label: "标题",
    icon: IconHeading,
    options: [
      { label: "H1 一级标题" },
      { label: "H2 二级标题" },
      { label: "H3 三级标题" },
      { label: "H4 四级标题" },
      { label: "H5 五级标题" },
      { label: "H6 六级标题" },
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
      { label: "左对齐", icon: IconAlignLeft },
      { label: "居中对齐", icon: IconAlignCenter },
      { label: "右对齐", icon: IconAlignRight },
    ],
  },
  {
    key: "mermaid",
    label: "Mermaid 图",
    icon: IconTopologyStar3,
    options: [
      { label: "流程图" },
      { label: "时序图" },
      { label: "类图" },
      { label: "状态图" },
      { label: "关系图" },
      { label: "旅程图" },
      { label: "甘特图" },
      { label: "饼状图" },
    ],
  },
];

const rightTools: ToolItem[] = [
  { key: "toc", label: "目录", icon: IconListDetails },
  { key: "editor", label: "仅显示编辑区", icon: IconColumns1 },
  { key: "preview", label: "仅显示预览区", icon: IconColumns2 },
];

const tocItems = [
  { label: "为什么先看接口能力", level: 1 },
  { label: "页面职责先于组件拆分", level: 1 },
  { label: "API Integration Design", level: 1 },
  { label: "service：只管请求本身", level: 2 },
  { label: "composable：组织状态", level: 2 },
  { label: "store：只放共享状态", level: 2 },
];

const categoryOptions = [
  { label: "前端", value: "frontend" },
  { label: "后端", value: "backend" },
  { label: "Android", value: "android" },
  { label: "iOS", value: "ios" },
  { label: "人工智能", value: "ai" },
  { label: "开发工具", value: "tooling" },
  { label: "代码人生", value: "career" },
  { label: "阅读", value: "reading" },
];

const tagOptions = [
  { label: "Nuxt 3", value: "nuxt" },
  { label: "OpenAPI", value: "openapi" },
  { label: "Monorepo", value: "monorepo" },
  { label: "Pinia", value: "pinia" },
  { label: "TypeScript", value: "typescript" },
  { label: "SSE", value: "sse" },
];

const writeBodyClass = computed(() => ({
  "write-page__body--hide-toc": !showToc.value,
  "write-page__body--editor-only": viewMode.value === "editor",
  "write-page__body--preview-only": viewMode.value === "preview",
}));

function handleRightToolClick(key: string) {
  if (key === "toc") {
    showToc.value = !showToc.value;
    return;
  }

  const nextMode = key === "editor" ? "editor" : "preview";
  viewMode.value = viewMode.value === nextMode ? "split" : nextMode;
}

function handleSmartFill() {
  publishCategory.value = "ai";
  publishTags.value = ["openapi", "typescript", "nuxt"];
  publishCover.value = "https://mock.blogx.dev/covers/openapi-article-cover.png";
  publishSummary.value = "结合既有 OpenAPI 能力，从页面结构、组件拆分到 API Integration Design，整理一套可直接落地的前端方案。";
}
</script>

<template>
  <div class="write-page">
    <header class="write-page__header">
      <div class="write-page__topbar">
        <NInput
          v-model:value="title"
          class="write-title-input"
          size="large"
          placeholder="输入文章标题..."
          :bordered="false"
        />
        <div class="write-page__actions">
          <span class="muted">文章将自动保存至草稿箱</span>
          <NButton quaternary>草稿箱</NButton>
          <NButton type="primary" @click="publishVisible = true">发布</NButton>
          <RouterLink to="/studio/profile" class="write-avatar-link">
            <NAvatar round>RV</NAvatar>
          </RouterLink>
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
                <button v-for="option in tool.options" :key="option.label" type="button" class="write-tool-option">
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
                <button type="button" class="write-tool-button" :aria-label="tool.label">
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
                <component :is="rightTools[0].icon" class="write-tool-button__icon" :size="18" :stroke-width="1.9" />
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
                <component :is="rightTools[1].icon" class="write-tool-button__icon" :size="18" :stroke-width="1.9" />
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
                <component :is="rightTools[2].icon" class="write-tool-button__icon" :size="18" :stroke-width="1.9" />
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
            :class="[`write-page__toc-item--level-${item.level}`]"
          >
            {{ item.label }}
          </button>
        </nav>
      </aside>

      <section class="write-page__pane write-page__pane--editor">
        <textarea
          v-model="content"
          class="write-page__textarea"
          placeholder="从这里开始写作，把 API 能力、页面结构和组件关系整理清楚。"
        />
      </section>

      <aside class="write-page__pane write-page__pane--preview">
        <div class="write-page__preview-empty">
          <p>预览区</p>
          <span>当前为静态原型，只展示写作工作区布局，不做真实渲染逻辑。</span>
        </div>
      </aside>
    </main>

    <footer class="write-page__statusbar">
      <span>字符数: {{ content.length }}</span>
      <span>行数: {{ content ? content.split("\n").length : 1 }}</span>
      <span>正文字符数: {{ content.replace(/\s/g, "").length }}</span>
      <span>同步滚动</span>
    </footer>

    <NModal v-model:show="publishVisible" preset="card" class="publish-modal" title="发布文章">
      <div class="publish-form">
        <div class="publish-form__row">
          <label class="publish-form__label">分类</label>
          <NSelect
            v-model:value="publishCategory"
            :options="categoryOptions"
            placeholder="请选择分类"
            class="publish-form__control"
          />
        </div>

        <div class="publish-form__row">
          <label class="publish-form__label">添加标签</label>
          <NSelect
            v-model:value="publishTags"
            multiple
            filterable
            tag
            :options="tagOptions"
            placeholder="请选择或添加标签"
            class="publish-form__control"
          />
        </div>

        <div class="publish-form__row publish-form__row--top">
          <label class="publish-form__label">文章封面</label>
          <div class="publish-cover">
            <div class="publish-cover__picker">
              <span class="publish-cover__plus">+</span>
              <span>上传封面</span>
            </div>
            <p class="muted">建议尺寸：192*128px（封面仅展示在首页信息流中）</p>
            <NInput
              v-model:value="publishCover"
              placeholder="https://mock.blogx.dev/covers/openapi-article-cover.png"
              class="publish-form__control"
            />
          </div>
        </div>

        <div class="publish-form__row publish-form__row--top">
          <label class="publish-form__label">编辑摘要</label>
          <div class="publish-summary">
            <NInput
              v-model:value="publishSummary"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 8 }"
              placeholder="请输入文章摘要"
            />
            <span class="publish-summary__count">{{ publishSummary.length }}/100</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="publish-modal__footer">
          <NButton quaternary @click="publishVisible = false">取消</NButton>
          <NButton secondary @click="handleSmartFill">智能填入</NButton>
          <NButton type="primary">确定并发布</NButton>
        </div>
      </template>
    </NModal>
  </div>
</template>
