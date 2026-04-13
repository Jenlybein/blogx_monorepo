<script setup lang="ts">
import { NCard, NModal, NTabPane, NTabs } from "naive-ui";
import EmailLoginForm from "~/components/auth/EmailLoginForm.vue";
import EmailRegisterForm from "~/components/auth/EmailRegisterForm.vue";
import PasswordLoginForm from "~/components/auth/PasswordLoginForm.vue";

const uiStore = useUiStore();

function closeModal() {
  uiStore.closeAuthModal();
}
</script>

<template>
  <NModal :show="uiStore.authModalOpen" preset="card" :mask-closable="true" @update:show="uiStore.authModalOpen = $event">
    <NCard
      style="max-width: 560px; margin: 0 auto;"
      title="加入 BlogX"
      :bordered="false"
      class="surface-card surface-card--strong"
      @close="closeModal"
    >
      <div class="mb-5 text-sm muted">
        先把登录、恢复登录和认证入口稳稳接起来，后续个人中心、创作页和消息页都能复用这套鉴权基础。
      </div>

      <NTabs type="segment" animated>
        <NTabPane name="password" tab="密码登录">
          <PasswordLoginForm @success="closeModal" />
        </NTabPane>
        <NTabPane name="email-login" tab="邮箱登录">
          <EmailLoginForm @success="closeModal" />
        </NTabPane>
        <NTabPane name="register" tab="邮箱注册">
          <EmailRegisterForm @success="closeModal" />
        </NTabPane>
      </NTabs>
    </NCard>
  </NModal>
</template>
