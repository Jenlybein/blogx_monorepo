<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { NButton, NCard, NInput, NSelect, NSwitch, NTag, useMessage } from "naive-ui";
import { sendEmailCode } from "~/services/auth";
import { uploadImageByTask } from "~/services/image";
import { getTagOptions } from "~/services/search";
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
const { data: tagOptions } = await useAsyncData("studio-settings-tag-options", () => getTagOptions().catch(() => []));

const profileForm = reactive({
  username: "",
  nickname: "",
  avatar: "",
  avatar_image_id: null as string | null,
  abstract: "",
  like_tag_ids: [] as string[],
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

const avatarFileInputRef = ref<HTMLInputElement | null>(null);
const avatarUploading = reactive({
  pending: false,
  stage: "",
});
const avatarDirty = ref(false);

watch(
  () => profile.value,
  (value) => {
    if (!value) return;
    profileForm.username = value.username ?? "";
    profileForm.nickname = value.nickname ?? "";
    profileForm.avatar = value.avatar ?? "";
    profileForm.avatar_image_id = value.avatar_image_id ?? null;
    avatarDirty.value = false;
    profileForm.abstract = value.abstract ?? "";
    profileForm.like_tag_ids = [...(value.like_tag_ids ?? [])];
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

const likeTagItems = computed(() => profile.value?.like_tag_items ?? []);
const enabledTagIdSet = computed(() => {
  const set = new Set<string>();
  for (const option of tagOptions.value ?? []) {
    const raw = option?.value;
    if (raw == null) continue;
    const id = String(raw).trim();
    if (!id) continue;
    set.add(id);
  }
  return set;
});

async function saveProfile() {
  if (avatarUploading.pending) {
    message.warning("头像仍在上传中，请稍后再保存资料。");
    return;
  }

  try {
    const trimmedAvatarImageId = (profileForm.avatar_image_id ?? "").trim();
    const hasAvatarImageId = Boolean(trimmedAvatarImageId);
    if (hasAvatarImageId && !/^\d+$/.test(trimmedAvatarImageId)) {
      message.error("头像标识格式不合法，请重新上传头像后再保存。");
      return;
    }

    const normalizedLikeTagIds = profileForm.like_tag_ids
      .map((id) => String(id).trim())
      .filter((id) => Boolean(id) && enabledTagIdSet.value.has(id));
    if (normalizedLikeTagIds.length !== profileForm.like_tag_ids.length) {
      profileForm.like_tag_ids = normalizedLikeTagIds;
      message.warning("已自动移除不存在或停用的偏好标签，请确认后再次保存。");
      return;
    }

    const payload: Parameters<typeof updateUserProfile>[0] = {
      username: profileForm.username.trim() || null,
      nickname: profileForm.nickname.trim() || null,
      abstract: profileForm.abstract.trim() || null,
      like_tag_ids: normalizedLikeTagIds,
      favorites_visibility: profileForm.favorites_visibility,
      followers_visibility: profileForm.followers_visibility,
      fans_visibility: profileForm.fans_visibility,
      home_style_id: profileForm.home_style_id || null,
    };

    if (hasAvatarImageId) {
      payload.avatar_image_id = trimmedAvatarImageId;
    } else if (avatarDirty.value) {
      payload.avatar_image_id = null;
    }

    await updateUserProfile(payload);
    await Promise.all([refreshProfile(), authStore.fetchCurrentUser()]);
    avatarDirty.value = false;
    message.success("个人资料已更新");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "保存资料失败");
  }
}

function openAvatarPicker() {
  if (avatarUploading.pending) {
    return;
  }
  avatarFileInputRef.value?.click();
}

function clearAvatar() {
  profileForm.avatar = "";
  profileForm.avatar_image_id = null;
  avatarDirty.value = true;
  avatarUploading.stage = "";
  if (avatarFileInputRef.value) {
    avatarFileInputRef.value.value = "";
  }
}

function mapAvatarUploadStage(stage: "hashing" | "creating_task" | "uploading_to_qiniu" | "polling_status") {
  const stageMap = {
    hashing: "正在计算文件指纹…",
    creating_task: "正在创建上传任务…",
    uploading_to_qiniu: "正在上传头像…",
    polling_status: "正在确认上传状态…",
  } as const;
  avatarUploading.stage = stageMap[stage];
}

async function handleAvatarFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    message.warning("请选择图片文件作为头像");
    input.value = "";
    return;
  }

  avatarUploading.pending = true;
  avatarUploading.stage = "开始上传头像…";
  try {
    const uploadResult = await uploadImageByTask(file, {
      onStage: mapAvatarUploadStage,
    });
    if (!uploadResult.image_id || !uploadResult.url) {
      throw new Error("上传成功但缺少图片标识");
    }
    profileForm.avatar = uploadResult.url;
    profileForm.avatar_image_id = uploadResult.image_id;
    avatarDirty.value = true;
    avatarUploading.stage = "头像上传完成";
    message.success("头像上传成功");
  } catch (error) {
    avatarUploading.stage = "";
    message.error(error instanceof Error ? error.message : "头像上传失败");
  } finally {
    avatarUploading.pending = false;
    input.value = "";
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
      description="设置页已对齐新契约：偏好标签走 like_tag_ids，头像走上传任务并提交 avatar_image_id，消息偏好、邮箱和密码保持真实接口对接。"
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
            <NButton type="primary" :disabled="avatarUploading.pending" @click="saveProfile()">保存资料</NButton>
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
              <span class="text-sm font-medium">头像上传</span>
              <div class="rounded-[18px] border px-4 py-4">
                <input
                  ref="avatarFileInputRef"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarFileChange" />

                <div class="flex flex-wrap items-center gap-3">
                  <NButton quaternary :loading="avatarUploading.pending" @click="openAvatarPicker()">
                    {{ profileForm.avatar ? "重新上传头像" : "选择头像图片" }}
                  </NButton>
                  <NButton v-if="profileForm.avatar || profileForm.avatar_image_id" quaternary @click="clearAvatar()">
                    移除头像
                  </NButton>
                  <span v-if="avatarUploading.stage" class="text-xs muted">{{ avatarUploading.stage }}</span>
                </div>

                <div v-if="profileForm.avatar" class="mt-3 flex items-center gap-3">
                  <img :src="profileForm.avatar" alt="头像预览" class="h-12 w-12 rounded-full object-cover border" />
                  <span class="text-xs muted">预览 URL 仅用于显示，提交时只发送 avatar_image_id。</span>
                </div>
              </div>
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
            <label class="space-y-2 md:col-span-2">
              <span class="text-sm font-medium">偏好标签</span>
              <NSelect
                v-model:value="profileForm.like_tag_ids"
                multiple
                filterable
                clearable
                max-tag-count="responsive"
                :options="tagOptions || []"
                placeholder="选择你感兴趣的标签，提交时会走 like_tag_ids"
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
            <p>头像现在走上传任务链路，提交资料时优先传 `avatar_image_id`，而不是头像 URL。</p>
            <p>QQ 绑定也没有单独的用户侧绑定接口，当前只能保留说明，不做假按钮行为。</p>
            <p>`like_tag_ids` 已经成为主字段，详情展示走 `like_tag_items`，不再继续扩散旧的 `like_tags` 字段。</p>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <NTag v-for="tag in likeTagItems" :key="tag.id">{{ tag.title }}</NTag>
            <NTag v-if="!likeTagItems.length" type="default">暂无标签</NTag>
          </div>
        </NCard>
      </section>
    </div>
  </div>
</template>
