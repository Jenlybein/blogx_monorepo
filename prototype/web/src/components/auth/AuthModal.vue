<script setup lang="ts">
import { ref } from "vue";
import {
  NButton,
  NCard,
  NGrid,
  NGridItem,
  NInput,
  NModal,
  NSpace,
  NTabPane,
  NTabs,
  NThing,
} from "naive-ui";

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  authenticated: [];
  "update:show": [value: boolean];
}>();

const account = ref("aster@blogx.dev");
const secret = ref("demo-password");
const captcha = ref("7Y2P");

function close() {
  emit("update:show", false);
}

function authenticate() {
  emit("authenticated");
  close();
}
</script>

<template>
  <NModal
    :show="props.show"
    preset="card"
    :style="{ width: 'min(980px, calc(100vw - 32px))' }"
    :mask-closable="true"
    @update:show="emit('update:show', $event)"
  >
    <NCard title="登录 / 注册" :bordered="false" size="large">
      <NTabs type="line" animated>
        <NTabPane name="password" tab="密码登录">
          <NGrid :cols="24" :x-gap="16">
            <NGridItem :span="10">
              <NCard class="auth-side-card" embedded>
                <NSpace vertical :size="16">
                  <NThing title="登录后可用">
                    创作文章并使用 AI 改写、诊断、评分等辅助能力。
                  </NThing>
                  <NThing title="消息与协作">
                    查看评论、点赞、全局通知、私信与浏览历史。
                  </NThing>
                  <NThing title="后台治理">
                    管理轮播、日志、站点配置、运营通知和用户状态。
                  </NThing>
                </NSpace>
              </NCard>
            </NGridItem>
            <NGridItem :span="14">
              <NSpace vertical :size="14">
                <NInput v-model:value="account" placeholder="用户名或邮箱" />
                <NInput v-model:value="secret" type="password" show-password-on="click" placeholder="密码" />
                <NInput v-model:value="captcha" placeholder="图形验证码" />
                <NSpace>
                  <NButton type="primary" @click="authenticate">确认登录</NButton>
                  <NButton quaternary @click="close">取消</NButton>
                </NSpace>
                <NCard embedded size="small">
                  QQ 登录与邮箱验证码登录在正式版本中切换为真实表单逻辑，这里仅保留交互外壳。
                </NCard>
              </NSpace>
            </NGridItem>
          </NGrid>
        </NTabPane>
        <NTabPane name="email" tab="邮箱登录">
          <NSpace vertical>
            <NInput placeholder="邮箱地址" />
            <NInput placeholder="邮箱验证码" />
            <NSpace>
              <NButton>发送验证码</NButton>
              <NButton type="primary" @click="authenticate">登录</NButton>
            </NSpace>
          </NSpace>
        </NTabPane>
        <NTabPane name="register" tab="邮箱注册">
          <NSpace vertical>
            <NInput placeholder="邮箱地址" />
            <NInput placeholder="邮箱验证码" />
            <NInput type="password" placeholder="设置密码" />
            <NSpace>
              <NButton>发送验证码</NButton>
              <NButton type="primary" @click="authenticate">创建账号</NButton>
            </NSpace>
          </NSpace>
        </NTabPane>
      </NTabs>
    </NCard>
  </NModal>
</template>
