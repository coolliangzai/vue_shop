<template>
  <div>
    <!-- 面包屑头部导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <span class="tag-span">
              <el-tag effect="dark" v-if="scope.row.level==0">一级</el-tag>
              <el-tag type="warning" effect="dark" v-if="scope.row.level==1">二级</el-tag>
              <el-tag type="danger" effect="dark" v-if="scope.row.level==2">三级</el-tag>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: [],
    }
  },
  created() {
    console.log(1)
    this.getRightsList()
  },
  methods: {
    getRightsList() {
      this.axios.get('rights/list').then((res) => {
        console.log(res)
        if (res.data.meta.status !== 200) {
          return
        } else {
          this.rightsList = res.data.data
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 30px;
}
.tag-span {
  padding: 0 20px;
}
</style>