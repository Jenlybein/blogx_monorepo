<script setup lang="ts">
import { reactive } from "vue";
import { NButton, NCard, NInput, NSwitch, NTag, useMessage } from "naive-ui";
import { sendEmailCode } from "~/services/auth";
import {
  bindUserEmail,
  getMessagePreference,
  updateMessagePreference,
  updateUserProfile,
  renewPasswordByEmail,
} from "~/services/studio";
import { getSelfUserDetail } from "~/services/user";

definePageMeta({
  layout: "studio",
  middleware: "auth",
});

const message = useMessage();
const authStore = useAuthStore();

const { data: profile, refresh: refreshProfile } = await useAsyncData("studio-settings-profile", () => getSelfUserDetail());
const { data: preference, refresh: refreshPreference } = await useAsyncData("studio-settings-preference", () => getMessagePreference());

const profileForm = reactive({
  username: "",
  nickname: "",
  abstract: "",
  favorites_visibility: true,
  followers_visibility: true,
  fans_visibility: true,
  home_style_id: "",
});

const emailBindForm = reactive({
  email: "",
  email_id: "",
  email_code: "",
});

const passwordForm = reactive({
  old_password: "",
  new_password: "",
});

const preferenceForm = reactive({
  digg_notice_enabled: true,
  comment_notice_enabled: true,
  favor_notice_enabled: true,
  private_chat_notice_enabled: true,
});

watch(
  () => profile.value,
  (value) => {
    if (!value) return;
    profileForm.username = value.username ?? "";
    profileForm.nickname = value.nickname ?? "";
    profileForm.abstract = value.abstract ?? "";
    profileForm.favorites_visibility = value.favorites_visibility ?? true;
    profileForm.followers_visibility = value.followers_visibility ?? true;
    profileForm.fans_visibility = value.fans_visibility ?? true;
    profileForm.home_style_id = value.home_style_id ?? "";
  },
  { immediate: true },
);

watch(
  () => preference.value,
  (value) => {
    if (!value) return;
    preferenceForm.digg_notice_enabled = value.digg_notice_enabled;
    preferenceForm.comment_notice_enabled = value.comment_notice_enabled;
    preferenceForm.favor_notice_enabled = value.favor_notice_enabled;
    preferenceForm.private_chat_notice_enabled = value.private_chat_notice_enabled;
  },
  { immediate: true },
);

const likeTags = computed(() =>
  String(profile.value?.like_tags || "")
    .split(/[，,]/u)
    .map((item) => item.trim())
    .filter(Boolean),
);

async function saveProfile() {
  try {
    await updateUserProfile({
      username: profileForm.username.trim() || null,
      nickname: profileForm.nickname.trim() || null,
      abstract: profileForm.abstract.trim() || null,
      favorites_visibility: profileForm.favorites_visibility,
      followers_visibility: profileForm.followers_visibility,
      fans_visibility: profileForm.fans_visibility,
      home_style_id: profileForm.home_style_id || null,
    });
    await Promise.all([refreshProfile(), authStore.fetchCurrentUser()]);
    message.success("个人资料已更新");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "保存资料失败");
  }
}

async function sendBindCode() {
  try {
    const payload = await sendEmailCode({
      email: emailBindForm.email.trim(),
      type: 4,
    });
    emailBindForm.email_id = payload.email_id;
    message.success("邮箱验证码已发送");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "发送验证码失败");
  }
}

async function submitBindEmail() {
  try {
    await bindUserEmail({
      email_id: emailBindForm.email_id,
      email_code: emailBindForm.email_code.trim(),
    });
    message.success("邮箱已绑定");
    emailBindForm.email_code = "";
  } catch (error) {
    message.error(error instanceof Error ? error.message : "绑定邮箱失败");
  }
}

async function submitPasswordReset() {
  try {
    await renewPasswordByEmail({
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
    });
    passwordForm.old_password = "";
    passwordForm.new_password = "";
    message.success("密码已更新，请留意旧登录态可能会失效");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "更新密码失败");
  }
}

async function savePreference() {
  try {
    await updateMessagePreference({ ...preferenceForm });
    await refreshPreference();
    message.success("消息偏好已保存");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "保存消息偏好失败");
  }
}

useSeoMeta({
  title: "个人中心 - 账号设置",
});
</script>

<template>
  <div class="page-stack">
    <StudioPageHeader
      title="账号设置"
      description="设置页只接当前后端已经明确给出的资料、邮箱、密码和消息偏好接口。头像上传、QQ 绑定和 like_tags 的正式编辑能力暂不伪造。"
      eyebrow="Settings"
    />

    <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section class="space-y-5">
        <NCard class="studio-list-card" :bordered="false">
          <div class="studio-toolbar">
            <div>
              <div class="eyebrow">Profile</div>
              <h2 class="section-title mt-2">个人资料</h2>
            </div>
            <NButton type="primary" @click="saveProfile()">保存资料</NButton>
          </div>

          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="space-y-2">
              <span class="text-sm font-medium">用户名</span>
              <NInput v-model:value="profileForm.username" maxlength="20" placeholder="输入用户名…" />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium">昵称</span>
              <NInput v-model:value="profileForm.nickname" maxlength="20" placeholder="输入昵称…" />
            </label>
            <label class="space-y-2 md:col-span-2">
              <span class="text-sm font-medium">个人简介</span>
              <NInput
                v-model:value="profileForm.abstract"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                maxlength="120"
                placeholder="介绍你的创作方向、关注主题或个人偏好…"
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium">主页样式 ID</span>
              <NInput v-model:value="profileForm.home_style_id" placeholder="例如：1、2、3" />
            </label>
            <div class="space-y-3">
              <div class="flex items-center justify-between rounded-[18px] border px-4 py-3">
                <span>收藏夹可见</span>
                <NSwitch v-model:value="profileForm.favorites_visibility" />
              </div>
              <div class="flex items-center justify-between rounded-[18px] border px-4 py-3">
                <span>关注列表可见</span>
                <NSwitch v-model:value="profileForm.followers_visibility" />
              </div>
              <div class="flex items-center justify-between rounded-[18px] border px-4 py-3">
                <span>粉丝列表可见</span>
                <NSwitch v-model:value="profileForm.fans_visibility" />
              </div>
            </div>
          </div>
        </NCard>

        <NCard class="studio-list-card" :bordered="false">
          <div class="eyebrow">Bind</div>
          <h2 class="section-title mt-2">绑定信息</h2>

          <div class="mt-5 grid gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium">邮箱地址</span>
              <NInput v-model:value="emailBindForm.email" placeholder="name@example.com" />
            </label>
            <div class="flex flex-wrap gap-3">
              <NButton quaternary @click="sendBindCode()">发送邮箱验证码</NButton>
              <span v-if="emailBindForm.email_id" class="glass-badge">email_id 已生成</span>
            </div>
            <label class="space-y-2">
              <span class="text-sm font-medium">邮箱验证码</span>
              <NInput v-model:value="emailBindForm.email_code" maxlength="8" placeholder="输入邮箱验证码…" />
            </label>
            <div>
              <NButton type="primary" @click="submitBindEmail()">绑定邮箱</NButton>
            </div>
          </div>
        </NCard>

        <NCard class="studio-list-card" :bordered="false">
          <div class="eyebrow">Security</div>
          <h2 class="section-title mt-2">密码更新</h2>
          <p class="mt-3 text-sm leading-7 muted">
            当前 OpenAPI 对这个接口的请求体是 `old_password + new_password`，并没有邮箱验证码字段，所以这里按真实 schema 实现。
          </p>

          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="space-y-2">
              <span class="text-sm font-medium">旧密码</span>
              <NInput v-model:value="passwordForm.old_password" type="password" show-password-on="click" />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium">新密码</span>
              <NInput v-model:value="passwordForm.new_password" type="password" show-password-on="click" />
            </label>
          </div>
          <div class="mt-4">
            <NButton type="primary" @click="submitPasswordReset()">更新密码</NButton>
          </div>
        </NCard>
      </section>

      <section class="space-y-5">
        <NCard class="studio-list-card" :bordered="false">
          <div class="eyebrow">Preference</div>
          <h2 class="section-title mt-2">消息偏好</h2>

          <div class="mt-5 space-y-3">
            <div class="flex items-center justify-between rounded-[18px] border px-4 py-3">
              <span>点赞提醒</span>
              <NSwitch v-model:value="preferenceForm.digg_notice_enabled" />
            </div>
            <div class="flex items-center justify-between rounded-[18px] border px-4 py-3">
              <span>评论提醒</span>
              <NSwitch v-model:value="preferenceForm.comment_notice_enabled" />
            </div>
            <div class="flex items-center justify-between rounded-[18px] border px-4 py-3">
              <span>收藏提醒</span>
              <NSwitch v-model:value="preferenceForm.favor_notice_enabled" />
            </div>
            <div class="flex items-center justify-between rounded-[18px] border px-4 py-3">
              <span>私信提醒</span>
              <NSwitch v-model:value="preferenceForm.private_chat_notice_enabled" />
            </div>
          </div>
          <div class="mt-4">
            <NButton type="primary" @click="savePreference()">保存偏好</NButton>
          </div>
        </NCard>

        <NCard class="studio-list-card" :bordered="false">
          <div class="eyebrow">Contract</div>
          <h2 class="section-title mt-2">当前接口约束</h2>
          <div class="mt-4 space-y-3 text-sm leading-7 muted">
            <p>头像上传 API 还没进入当前 web 端 Phase3 范围，所以这里只展示现有头像，不做伪上传。</p>
            <p>QQ 绑定也没有单独的用户侧绑定接口，当前只能保留说明，不做假按钮行为。</p>
            <p>`like_tags` 在详情里是字符串，在更新 schema 里又是 `number[]`，现在先只读展示。</p>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <NTag v-for="tag in likeTags" :key="tag">{{ tag }}</NTag>
            <NTag v-if="!likeTags.length" type="default">暂无标签</NTag>
          </div>
        </NCard>
      </section>
    </div>
  </div>
</template>
