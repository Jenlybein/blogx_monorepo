<script setup lang="ts">
import { ref } from "vue";
import {
  NAvatar,
  NButton,
  NCard,
  NInput,
  NSelect,
  NSpace,
  NSwitch,
  NTag,
} from "naive-ui";

const likeTags = ref(["开发工具", "编辑语言", "前端", "前沿技术", "AIGC"]);
const tagToAdd = ref<string | null>(null);
const homeStyle = ref<number | null>(2);
const favoritesVisibility = ref(true);
const followersVisibility = ref(true);
const fansVisibility = ref(false);

const homeStyleOptions = [
  { label: "默认样式", value: 1 },
  { label: "简洁资料卡", value: 2 },
  { label: "内容流优先", value: 3 },
];

const likeTagOptions = [
  { label: "开发工具", value: "开发工具" },
  { label: "编辑语言", value: "编辑语言" },
  { label: "前端", value: "前端" },
  { label: "前沿技术", value: "前沿技术" },
  { label: "AIGC", value: "AIGC" },
  { label: "OpenAPI", value: "OpenAPI" },
  { label: "Monorepo", value: "Monorepo" },
  { label: "搜索", value: "搜索" },
];

function handleAddTag(value: string | null) {
  if (!value) {
    return;
  }

  if (!likeTags.value.includes(value)) {
    likeTags.value = [...likeTags.value, value];
  }

  tagToAdd.value = null;
}

function removeTag(target: string) {
  likeTags.value = likeTags.value.filter((item) => item !== target);
}
</script>

<template>
  <NSpace vertical :size="20">
    <NCard class="settings-profile-panel" title="基本信息">
      <div class="settings-profile-layout">
        <div class="settings-form-column">
          <div class="settings-form-grid">
            <div class="settings-form-item">
              <label class="settings-form-item__label settings-form-item__label--required">用户名</label>
              <div class="settings-form-item__control">
                <NInput value="river" maxlength="20" show-count />
              </div>
            </div>

            <div class="settings-form-item">
              <label class="settings-form-item__label settings-form-item__label--required">昵称</label>
              <div class="settings-form-item__control">
                <NInput value="River" maxlength="20" show-count />
              </div>
            </div>

            <div class="settings-form-item">
              <label class="settings-form-item__label">站龄</label>
              <div class="settings-form-item__control">
                <NInput value="已加入 2 年 3 个月" disabled />
              </div>
            </div>

            <div class="settings-form-item">
              <label class="settings-form-item__label">主页样式</label>
              <div class="settings-form-item__control">
                <NSelect v-model:value="homeStyle" :options="homeStyleOptions" />
              </div>
            </div>

            <div class="settings-form-item settings-form-item--textarea">
              <label class="settings-form-item__label">个人介绍</label>
              <div class="settings-form-item__control">
                <NInput
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 7 }"
                  value="前端架构师，关注 API 驱动设计、可维护性和研发体验。"
                  maxlength="100"
                  show-count
                />
              </div>
            </div>

            <div class="settings-form-item">
              <label class="settings-form-item__label">收藏夹可见</label>
              <div class="settings-form-item__control settings-form-item__control--switch">
                <NSwitch v-model:value="favoritesVisibility" />
              </div>
            </div>

            <div class="settings-form-item">
              <label class="settings-form-item__label">关注列表可见</label>
              <div class="settings-form-item__control settings-form-item__control--switch">
                <NSwitch v-model:value="followersVisibility" />
              </div>
            </div>

            <div class="settings-form-item">
              <label class="settings-form-item__label">粉丝列表可见</label>
              <div class="settings-form-item__control settings-form-item__control--switch">
                <NSwitch v-model:value="fansVisibility" />
              </div>
            </div>
          </div>
        </div>

        <aside class="settings-avatar-panel">
          <div class="settings-avatar-panel__preview">
            <NAvatar round :size="104">RV</NAvatar>
          </div>
          <strong>上传头像</strong>
          <span class="muted">格式：支持 JPG、PNG、JPEG</span>
          <span class="muted">大小：5MB 以内</span>
          <NSpace vertical :size="10" class="settings-avatar-panel__actions">
            <NButton type="primary" block>上传头像</NButton>
          </NSpace>
        </aside>
      </div>
    </NCard>

    <NCard title="兴趣标签管理">
      <div class="settings-tag-section">
        <div class="settings-form-item settings-form-item--tags">
          <label class="settings-form-item__label settings-form-item__label--required">兴趣标签</label>
          <div class="settings-form-item__control settings-tags-control">
            <div class="settings-tag-list">
              <NTag v-for="tag in likeTags" :key="tag" closable @close="removeTag(tag)">
                {{ tag }}
              </NTag>
            </div>
            <NSelect
              v-model:value="tagToAdd"
              class="settings-tag-select"
              :options="likeTagOptions"
              placeholder="请选择兴趣标签"
              @update:value="handleAddTag"
            />
          </div>
        </div>
        <p class="muted">偏好标签会用于首页推荐、搜索召回和个性化内容展示。</p>
      </div>
    </NCard>

    <NCard title="绑定信息">
      <div class="settings-bind-list">
        <div class="settings-form-item settings-form-item--bind">
          <label class="settings-form-item__label">邮箱</label>
          <div class="settings-form-item__control">
            <div class="settings-bind-row">
              <div class="settings-bind-row__main">
                <div class="settings-bind-row__line">
                  <span>river@blogx.dev</span>
                  <NTag type="success">已绑定</NTag>
                </div>
                <p class="muted">用于登录验证、密码找回和重要通知提醒。</p>
              </div>
              <NSpace>
                <NButton size="small" secondary>更换邮箱</NButton>
                <NButton size="small" quaternary>发送验证邮件</NButton>
              </NSpace>
            </div>
          </div>
        </div>

        <div class="settings-form-item settings-form-item--bind">
          <label class="settings-form-item__label">QQ</label>
          <div class="settings-form-item__control">
            <div class="settings-bind-row">
              <div class="settings-bind-row__main">
                <div class="settings-bind-row__line">
                  <span>未绑定 QQ 账号</span>
                  <NTag>未绑定</NTag>
                </div>
                <p class="muted">绑定后可直接使用 QQ 登录，并同步第三方头像信息。</p>
              </div>
              <NSpace>
                <NButton size="small" type="primary">绑定 QQ</NButton>
              </NSpace>
            </div>
          </div>
        </div>

        <div class="settings-form-item settings-form-item--bind">
          <label class="settings-form-item__label">密码</label>
          <div class="settings-form-item__control">
            <div class="settings-bind-row">
              <div class="settings-bind-row__main">
                <div class="settings-bind-row__line">
                  <span>已设置登录密码</span>
                </div>
                <p class="muted">建议定期更新密码，并避免与其他平台使用相同凭证。</p>
              </div>
              <NSpace>
                <NButton size="small" secondary>重置密码</NButton>
              </NSpace>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <div class="settings-footer-actions">
      <NButton quaternary>重置修改</NButton>
      <NButton type="primary">保存资料</NButton>
    </div>
  </NSpace>
</template>
