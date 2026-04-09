<script setup lang="ts">
import { h } from "vue";
import { NAvatar, NButton, NCard, NDataTable, NGrid, NGridItem, NInput, NSelect, NSpace, NTag } from "naive-ui";

const columns = [
  {
    title: "用户",
    key: "name",
    render: (row: { name: string; avatar: string }) =>
      h(NSpace, { align: "center", size: "small" }, { default: () => [h(NAvatar, { round: true, size: "small" }, { default: () => row.avatar }), h("span", row.name)] }),
  },
  {
    title: "角色",
    key: "role",
    render: (row: { role: string }) => h(NTag, { type: row.role === "管理员" ? "warning" : "default" }, { default: () => row.role }),
  },
  {
    title: "状态",
    key: "status",
    render: (row: { status: string }) => h(NTag, { type: row.status === "正常" ? "success" : "error" }, { default: () => row.status }),
  },
  { title: "最近登录", key: "lastLogin" },
  { title: "操作", key: "action", render: () => h(NButton, { size: "small", quaternary: true }, { default: () => "查看" }) },
];

const data = [
  { name: "Aster / aster", avatar: "AS", role: "普通用户", status: "正常", lastLogin: "今天 10:18" },
  { name: "Louis / louis-admin", avatar: "LO", role: "管理员", status: "正常", lastLogin: "今天 09:42" },
  { name: "Mocker / mock-user", avatar: "MK", role: "普通用户", status: "禁用", lastLogin: "昨天 20:31" },
];
</script>

<template>
  <NSpace vertical :size="20">
    <NCard title="用户检索">
      <NGrid :cols="24" :x-gap="16" responsive="screen">
        <NGridItem :span="6"><NInput value="aster" /></NGridItem>
        <NGridItem :span="6"><NSelect :options="[{ label: '全部角色', value: 'all' }, { label: '管理员', value: 'admin' }]" value="all" /></NGridItem>
        <NGridItem :span="6"><NSelect :options="[{ label: '全部状态', value: 'all' }, { label: '正常', value: 'active' }, { label: '禁用', value: 'disabled' }]" value="all" /></NGridItem>
        <NGridItem :span="6"><NInput value="2026-03-01 ~ 2026-04-08" /></NGridItem>
      </NGrid>
    </NCard>

    <NGrid :cols="24" :x-gap="20" responsive="screen">
      <NGridItem :span="15">
        <NCard title="用户列表">
          <NDataTable :columns="columns" :data="data" :pagination="false" />
        </NCard>
      </NGridItem>
      <NGridItem :span="9">
        <NCard title="用户详情侧板">
          <NSpace vertical :size="14">
            <NSpace align="center">
              <NAvatar round size="large">AS</NAvatar>
              <strong>Aster</strong>
            </NSpace>
            <NInput value="Aster" />
            <NInput value="aster" />
            <NInput value="https://mock.blogx.dev/avatar/aster.png" />
            <NSelect :options="[{ label: '普通用户', value: 'user' }, { label: '管理员', value: 'admin' }]" value="user" />
            <NSelect :options="[{ label: '正常', value: 'active' }, { label: '禁用', value: 'disabled' }, { label: '封禁', value: 'banned' }]" value="active" />
            <NInput type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" value="前端架构师，关注文档体验、可维护性和中后台演进。" />
            <NSpace>
              <NButton type="primary">保存变更</NButton>
              <NButton tertiary type="error">封禁用户</NButton>
            </NSpace>
          </NSpace>
        </NCard>
      </NGridItem>
    </NGrid>
  </NSpace>
</template>
