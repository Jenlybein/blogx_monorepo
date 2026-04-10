<script setup lang="ts">
import { IconLock, IconShieldCheck, IconSparkles, IconUser } from "@tabler/icons-vue";
import { RouterLink, useRouter } from "vue-router";
import { NButton, NCard, NCheckbox, NInput, NSpace, useMessage } from "naive-ui";

const router = useRouter();
const message = useMessage();

function mockLogin() {
  message.success("已进入后台原型");
  void router.push("/");
}
</script>

<template>
  <div class="admin-login-page">
    <div class="admin-login-shell">
      <section class="admin-login-hero">
        <div class="admin-login-brand">
          <div class="brand-badge">BX</div>
          <div>
            <strong>BlogX Admin</strong>
            <p class="muted">运营后台原型</p>
          </div>
        </div>

        <div class="admin-login-copy">
          <p class="eyebrow">Admin Access</p>
          <h1>统一管理内容审核、站点配置与运营数据。</h1>
          <p class="muted">
            登录页主要用于确认后台入口风格、表单层级和安全提示位置，不包含真实鉴权逻辑。
          </p>
        </div>

        <div class="admin-login-highlights">
          <div class="admin-login-highlight">
            <span class="admin-login-highlight__icon"><IconShieldCheck :size="18" /></span>
            <div>
              <strong>安全登录</strong>
              <p class="muted">预留账号密码、二次验证和异常设备提醒的展示位置。</p>
            </div>
          </div>
          <div class="admin-login-highlight">
            <span class="admin-login-highlight__icon"><IconSparkles :size="18" /></span>
            <div>
              <strong>运营视图</strong>
              <p class="muted">登录后进入仪表盘、审核台、用户管理、日志中心等模块。</p>
            </div>
          </div>
        </div>
      </section>

      <NCard class="admin-login-card" size="large">
        <template #header>
          <div>
            <h2 class="admin-login-card__title">后台登录</h2>
            <p class="muted">请输入管理员账号与密码进入后台。</p>
          </div>
        </template>

        <NSpace vertical :size="16">
          <div class="admin-login-field">
            <label class="admin-login-field__label">管理员账号</label>
            <NInput placeholder="admin@blogx.dev" clearable>
              <template #prefix><IconUser :size="16" /></template>
            </NInput>
          </div>

          <div class="admin-login-field">
            <label class="admin-login-field__label">登录密码</label>
            <NInput type="password" show-password-on="click" placeholder="请输入后台密码">
              <template #prefix><IconLock :size="16" /></template>
            </NInput>
          </div>

          <div class="admin-login-actions">
            <NCheckbox>记住当前设备</NCheckbox>
            <a href="#" class="admin-login-link">忘记密码</a>
          </div>

          <NButton type="primary" block size="large" @click="mockLogin">登录后台</NButton>

          <div class="admin-login-footer">
            <RouterLink to="/" class="admin-login-link">直接进入仪表盘</RouterLink>
            <span class="muted">后台管理入口</span>
          </div>
        </NSpace>
      </NCard>
    </div>
  </div>
</template>
