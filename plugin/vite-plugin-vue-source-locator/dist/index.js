// src/index.ts
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import MagicString from "magic-string";
import {
  NodeTypes,
  parse as parseTemplate
} from "@vue/compiler-dom";
import { parse as parseSfc } from "@vue/compiler-sfc";
var DEFAULT_ATTRIBUTE_PREFIX = "data-vsl";
var DEFAULT_ENDPOINT = "/__vue-source-locator__/open-in-editor";
function vueSourceLocator(options = {}) {
  const attributePrefix = options.attributePrefix ?? DEFAULT_ATTRIBUTE_PREFIX;
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const triggerKey = options.triggerKey ?? "alt";
  const overlay = options.overlay ?? true;
  const pathMode = options.pathMode ?? "absolute";
  const editor = options.launchEditor ?? process.env.LAUNCH_EDITOR ?? "code";
  const fileAttr = `${attributePrefix}-file`;
  const lineAttr = `${attributePrefix}-line`;
  const columnAttr = `${attributePrefix}-column`;
  let allowedRoots = [];
  return {
    name: "vite-plugin-vue-source-locator",
    apply: "serve",
    enforce: "pre",
    configResolved(config) {
      allowedRoots = [
        config.root,
        ...(options.allowRoots ?? []).map(
          (root) => path.resolve(config.root, root)
        )
      ];
    },
    transform(code, id) {
      const [filepath] = id.split("?", 1);
      if (!filepath.endsWith(".vue")) {
        return null;
      }
      return instrumentVueFile(code, filepath, {
        fileAttr,
        lineAttr,
        columnAttr,
        pathMode,
        root: allowedRoots[0] ?? process.cwd()
      });
    },
    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: {
            type: "module"
          },
          children: createClientScript({
            endpoint,
            triggerKey,
            overlay,
            fileAttr,
            lineAttr,
            columnAttr
          }),
          injectTo: "body"
        }
      ];
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }
        const requestUrl = new URL(req.url, "http://127.0.0.1");
        if (requestUrl.pathname !== endpoint) {
          next();
          return;
        }
        const file = requestUrl.searchParams.get("file");
        const line = toPositiveInt(requestUrl.searchParams.get("line"), 1);
        const column = toPositiveInt(requestUrl.searchParams.get("column"), 1);
        if (!file) {
          sendJson(res, 400, {
            ok: false,
            message: "\u7F3A\u5C11 file \u53C2\u6570\u3002"
          });
          return;
        }
        const targetFile = path.isAbsolute(file) ? path.resolve(file) : path.resolve(allowedRoots[0] ?? process.cwd(), file);
        if (!isAllowedPath(targetFile, allowedRoots)) {
          sendJson(res, 403, {
            ok: false,
            message: `\u7981\u6B62\u6253\u5F00\u5DE5\u4F5C\u533A\u5916\u6587\u4EF6\uFF1A${targetFile}`
          });
          return;
        }
        if (!fs.existsSync(targetFile)) {
          sendJson(res, 404, {
            ok: false,
            message: `\u6587\u4EF6\u4E0D\u5B58\u5728\uFF1A${targetFile}`
          });
          return;
        }
        try {
          openInEditor(editor, targetFile, line, column);
          sendJson(res, 200, {
            ok: true,
            message: "\u7F16\u8F91\u5668\u5DF2\u6253\u5F00\u3002"
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "\u6253\u5F00\u7F16\u8F91\u5668\u5931\u8D25\u3002";
          sendJson(res, 500, {
            ok: false,
            message
          });
        }
      });
    }
  };
}
function instrumentVueFile(code, filepath, attrs) {
  const { descriptor } = parseSfc(code, { filename: filepath });
  const template = descriptor.template;
  if (!template || template.lang) {
    return null;
  }
  const templateContent = template.content;
  const blockSource = template.loc.source;
  const blockStartOffset = template.loc.start.offset;
  const innerOffset = blockSource.indexOf(templateContent);
  if (innerOffset < 0) {
    return null;
  }
  const templateContentStart = blockStartOffset + innerOffset;
  const templateAst = parseTemplate(templateContent, {
    comments: true
  });
  const edits = [];
  walkNodes(templateAst.children, (node) => {
    if (node.type !== NodeTypes.ELEMENT) {
      return;
    }
    const element = node;
    if (element.tag === "template") {
      return;
    }
    if (element.props.some(
      (prop) => prop.type === NodeTypes.ATTRIBUTE && prop.name === attrs.fileAttr
    )) {
      return;
    }
    const insertOffset = templateContentStart + element.loc.start.offset + 1 + element.tag.length;
    const absoluteLine = template.loc.start.line + element.loc.start.line - 1;
    const absoluteColumn = element.loc.start.line === 1 ? template.loc.start.column + element.loc.start.column - 1 : element.loc.start.column;
    const normalizedFile = normalizeFilePath(filepath, attrs.pathMode, attrs.root);
    edits.push({
      offset: insertOffset,
      content: ` ${attrs.fileAttr}="${escapeHtmlAttribute(normalizedFile)}" ${attrs.lineAttr}="${absoluteLine}" ${attrs.columnAttr}="${absoluteColumn}"`
    });
  });
  if (edits.length === 0) {
    return null;
  }
  const magicString = new MagicString(code);
  edits.sort((left, right) => right.offset - left.offset).forEach((edit) => {
    magicString.appendLeft(edit.offset, edit.content);
  });
  return {
    code: magicString.toString(),
    map: magicString.generateMap({ hires: true })
  };
}
function walkNodes(nodes, visit) {
  for (const node of nodes) {
    visit(node);
    if ("branches" in node && Array.isArray(node.branches)) {
      for (const branch of node.branches) {
        walkNodes(branch.children, visit);
      }
    }
    if ("children" in node && Array.isArray(node.children)) {
      walkNodes(node.children, visit);
    }
  }
}
function normalizeFilePath(filepath, pathMode, root) {
  const absolutePath = path.resolve(filepath);
  if (pathMode === "relative") {
    const relativePath = path.relative(path.resolve(root), absolutePath);
    if (relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
      return relativePath.replaceAll("\\", "/");
    }
  }
  return absolutePath.replaceAll("\\", "/");
}
function escapeHtmlAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}
function toPositiveInt(rawValue, fallback) {
  if (!rawValue) {
    return fallback;
  }
  const parsed = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function isAllowedPath(targetFile, allowedRoots) {
  return allowedRoots.some((root) => {
    const relative = path.relative(path.resolve(root), targetFile);
    return relative === "" || !relative.startsWith("..") && !path.isAbsolute(relative);
  });
}
function openInEditor(editor, file, line, column) {
  const editorArgs = resolveEditorArgs(editor, file, line, column);
  const result = spawnSync(editor, editorArgs, {
    shell: process.platform === "win32",
    stdio: "ignore",
    windowsHide: true
  });
  if (result.error) {
    throw result.error;
  }
  if (typeof result.status === "number" && result.status !== 0) {
    throw new Error(`\u7F16\u8F91\u5668\u547D\u4EE4\u6267\u884C\u5931\u8D25\uFF1A${editor} ${editorArgs.join(" ")}`);
  }
}
function resolveEditorArgs(editor, file, line, column) {
  const editorName = path.basename(editor).toLowerCase();
  const location = `${file}:${line}:${column}`;
  if (editorName === "code" || editorName === "code-insiders" || editorName === "codium" || editorName === "cursor" || editorName === "windsurf") {
    return ["-r", "-g", location];
  }
  if (editorName === "webstorm" || editorName === "webstorm64.exe" || editorName === "idea" || editorName === "idea64.exe") {
    return ["--line", String(line), file];
  }
  return ["-g", location];
}
function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
function createClientScript(options) {
  const triggerLabelMap = {
    alt: "Alt",
    ctrl: "Ctrl",
    meta: "Meta",
    shift: "Shift"
  };
  return `
const fileAttr = ${JSON.stringify(options.fileAttr)};
const lineAttr = ${JSON.stringify(options.lineAttr)};
const columnAttr = ${JSON.stringify(options.columnAttr)};
const endpoint = ${JSON.stringify(options.endpoint)};
const triggerKey = ${JSON.stringify(options.triggerKey)};
const overlayEnabled = ${JSON.stringify(options.overlay)};
let activeHighlightTarget = null;
let activeLocatorCandidates = [];
let activeLocatorIndex = 0;
let lastPointerTarget = null;
let lastPointerX = 0;
let lastPointerY = 0;

const highlightEl = document.createElement("div");
highlightEl.setAttribute(
  "style",
  [
    "position:fixed",
    "left:0",
    "top:0",
    "width:0",
    "height:0",
    "z-index:99998",
    "border:1.5px solid rgba(59, 130, 246, 0.95)",
    "background:rgba(59, 130, 246, 0.12)",
    "box-shadow:0 0 0 1px rgba(255,255,255,0.7) inset, 0 12px 32px rgba(59,130,246,0.18)",
    "border-radius:10px",
    "pointer-events:none",
    "opacity:0",
    "transition:opacity .12s ease, width .08s ease, height .08s ease, transform .08s ease",
  ].join(";"),
);

const matchesTrigger = (event) => {
  if (triggerKey === "alt") return event.altKey;
  if (triggerKey === "shift") return event.shiftKey;
  if (triggerKey === "meta") return event.metaKey;
  return event.ctrlKey;
};

const isTriggerKeyEvent = (event) => {
  if (triggerKey === "alt") return event.key === "Alt";
  if (triggerKey === "shift") return event.key === "Shift";
  if (triggerKey === "meta") return event.key === "Meta";
  return event.key === "Control";
};

const getLocatorCandidates = (target) => {
  if (!(target instanceof Element)) return [];

  const candidates = [];
  let current = target.closest(\`[\${fileAttr}]\`);

  while (current) {
    candidates.push(current);
    current = current.parentElement?.closest(\`[\${fileAttr}]\`) ?? null;
  }

  return candidates;
};

const getCurrentLocatorTarget = () => activeLocatorCandidates[activeLocatorIndex] ?? null;

const ensureHighlight = () => {
  if (!document.body.contains(highlightEl)) {
    document.body.appendChild(highlightEl);
  }
};

const hideHighlight = () => {
  activeHighlightTarget = null;
  activeLocatorCandidates = [];
  activeLocatorIndex = 0;
  highlightEl.style.opacity = "0";
  highlightEl.style.width = "0";
  highlightEl.style.height = "0";
};

const renderHighlight = () => {
  if (!activeHighlightTarget) {
    hideHighlight();
    return;
  }

  const rect = activeHighlightTarget.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    hideHighlight();
    return;
  }

  ensureHighlight();
  highlightEl.style.transform = \`translate(\${Math.round(rect.left)}px, \${Math.round(rect.top)}px)\`;
  highlightEl.style.width = \`\${Math.round(rect.width)}px\`;
  highlightEl.style.height = \`\${Math.round(rect.height)}px\`;
  highlightEl.style.opacity = "1";
};

const updateHighlightTarget = (target, candidates = activeLocatorCandidates, index = activeLocatorIndex) => {
  activeLocatorCandidates = candidates;
  activeLocatorIndex = index;
  activeHighlightTarget = target;
  renderHighlight();
};

const syncHighlightFromPointer = (target) => {
  const candidates = getLocatorCandidates(target);
  updateHighlightTarget(candidates[0] ?? null, candidates, 0);
};

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.setAttribute(
    "style",
    "position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;",
  );
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
};

const showToast = (message, x, y, tone = "success") => {
  const toast = document.createElement("div");
  const background =
    tone === "error" ? "rgba(127, 29, 29, 0.94)" : "rgba(15, 23, 42, 0.94)";

  toast.textContent = message;
  toast.setAttribute(
    "style",
    [
      "position:fixed",
      \`left:\${x}px\`,
      \`top:\${y}px\`,
      "transform:translate(-50%, -115%)",
      "z-index:100000",
      "padding:10px 14px",
      "border-radius:12px",
      \`background:\${background}\`,
      "color:#fff",
      "font:13px/1.4 system-ui,sans-serif",
      "box-shadow:0 18px 40px rgba(15,23,42,0.22)",
      "pointer-events:none",
      "white-space:nowrap",
      "opacity:0",
      "transition:opacity .18s ease, transform .45s ease",
    ].join(";"),
  );

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translate(-50%, -140%)";
  });

  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, -175%)";
    window.setTimeout(() => toast.remove(), 320);
  }, 1100);
};

const cycleLocatorCandidate = (step) => {
  if (activeLocatorCandidates.length < 2) return;

  const nextIndex = Math.min(
    activeLocatorCandidates.length - 1,
    Math.max(0, activeLocatorIndex + step),
  );

  if (nextIndex === activeLocatorIndex) return;

  updateHighlightTarget(
    activeLocatorCandidates[nextIndex],
    activeLocatorCandidates,
    nextIndex,
  );

  showToast(
    \`\u5DF2\u5207\u6362\u5230\u7956\u5148\u5C42\u7EA7 \${nextIndex + 1}/\${activeLocatorCandidates.length}\`,
    lastPointerX || window.innerWidth / 2,
    lastPointerY || window.innerHeight / 2,
  );
};

const openSourceFile = async (element, event) => {
  const file = element.getAttribute(fileAttr);
  if (!file) return;

  const line = element.getAttribute(lineAttr) ?? "1";
  const column = element.getAttribute(columnAttr) ?? "1";
  const sourcePath = \`\${file}:\${line}:\${column}\`;
  const params = new URLSearchParams({ file, line, column });

  try {
    const copied = await copyText(sourcePath);
    showToast(
      copied ? "\u5DF2\u590D\u5236\u5143\u7D20\u8DEF\u5F84" : "\u590D\u5236\u5931\u8D25\uFF0C\u4ECD\u5C06\u5C1D\u8BD5\u6253\u5F00\u6E90\u7801",
      event.clientX,
      event.clientY,
      copied ? "success" : "error",
    );

    const response = await fetch(\`\${endpoint}?\${params.toString()}\`);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      console.error("[vue-source-locator]", payload?.message ?? "\u6253\u5F00\u6E90\u7801\u5931\u8D25\u3002");
      showToast(
        payload?.message ?? "\u6253\u5F00\u6E90\u7801\u5931\u8D25",
        event.clientX,
        event.clientY + 32,
        "error",
      );
    }
  } catch (error) {
    console.error("[vue-source-locator]", error);
    showToast("\u6253\u5F00\u6E90\u7801\u5931\u8D25", event.clientX, event.clientY + 32, "error");
  }
};

document.addEventListener(
  "mousemove",
  (event) => {
    lastPointerTarget = event.target;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;

    if (!matchesTrigger(event)) {
      hideHighlight();
      return;
    }

    syncHighlightFromPointer(event.target);
  },
  true,
);

document.addEventListener(
  "keydown",
  (event) => {
    if (isTriggerKeyEvent(event)) {
      syncHighlightFromPointer(
        lastPointerTarget ?? document.elementFromPoint(lastPointerX, lastPointerY),
      );
      return;
    }

    if (!matchesTrigger(event)) return;

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      cycleLocatorCandidate(1);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      cycleLocatorCandidate(-1);
    }
  },
  true,
);

document.addEventListener(
  "keyup",
  (event) => {
    if (!isTriggerKeyEvent(event)) return;
    hideHighlight();
  },
  true,
);

window.addEventListener("blur", hideHighlight);
window.addEventListener("resize", renderHighlight);
window.addEventListener("scroll", renderHighlight, true);

document.addEventListener(
  "wheel",
  (event) => {
    if (!matchesTrigger(event)) return;
    if (activeLocatorCandidates.length < 2) return;

    event.preventDefault();
    cycleLocatorCandidate(event.deltaY > 0 ? 1 : -1);
  },
  { capture: true, passive: false },
);

document.addEventListener(
  "click",
  (event) => {
    if (!matchesTrigger(event)) return;

    const target = getCurrentLocatorTarget() ?? getLocatorCandidates(event.target)[0] ?? null;
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();
    void openSourceFile(target, event);
  },
  true,
);

if (overlayEnabled) {
  const overlay = document.createElement("div");
  overlay.textContent = "\u6E90\u7801\u5B9A\u4F4D\u5DF2\u542F\u7528\uFF1A\u6309\u4F4F ${triggerLabelMap[options.triggerKey]} + \u70B9\u51FB\u9875\u9762\u5143\u7D20";
  overlay.setAttribute(
    "style",
    [
      "position:fixed",
      "right:16px",
      "bottom:16px",
      "z-index:99999",
      "padding:8px 12px",
      "border-radius:999px",
      "background:rgba(15,23,42,0.88)",
      "color:#fff",
      "font:12px/1.4 system-ui,sans-serif",
      "box-shadow:0 12px 30px rgba(15,23,42,0.25)",
      "pointer-events:none"
    ].join(";"),
  );
  window.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(overlay);
  });
}
`;
}
export {
  vueSourceLocator as default
};
