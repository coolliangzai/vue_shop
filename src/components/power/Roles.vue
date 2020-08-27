<template>
  <div>
    <!-- 面包屑头部导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <!-- 添加角色按钮 -->
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1===0? 'bdtop':'','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRolesById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRolesById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRolesById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="btn">
              <el-button type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" @click="showRightSet(scope.row)">分配权限</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="rightSetVisible" width="50%">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        default-expand-all
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightSetVisible = false">取 消</el-button>
        <el-button type="primary" @click="toSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      rightSetVisible: false,
      // 点击的角色名字
      rolesId: '',
      //所有权限列表
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      defKeys: [],
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色信息列表
    getRolesList() {
      this.axios.get('roles').then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        } else {
          this.rolesList = res.data.data
        }
        console.log(res)
      })
    },
    // 通过角色Id移除角色
    async removeRolesById(role, powerId) {
      console.log(role.children)
      const confirm = await this.$confirm(
        '此操作将删除该权限,是否继续',
        '提示',
        {
          confirmButton: '确认',
          cancelButton: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        this.axios
          .delete('roles/' + role.id + '/rights/' + powerId)
          .then((res) => {
            if (res.data.meta.status !== 200) {
              this.$message.error('删除失败')
            } else {
              this.$message.success('删除成功')
            }
            role.children = res.data.data
          })
      }
    },
    //分配权限
    showRightSet(role) {
      // 将数组清空，避免上一次的数据叠加渲染到下一次上
      this.defKeys = []
      this.rolesId = role.id
      console.log(role)
      this.axios.get('rights/tree').then((res) => {
        this.rightsList = res.data.data
      })
      this.getRightsId(role, this.defKeys)
      this.rightSetVisible = true
    },
    //通过递归函数获取每一个角色具备的权限的Id值
    getRightsId(node, arr) {
      if (!node.children) {
        // 如果node节点下没有子节点了，就把当前节点的id添加到数组中
        return arr.push(node.id)
      } else {
        node.children.forEach((item) => {
          this.getRightsId(item, arr)
        })
      }
    },
    //确认按钮点击后提交修改
    toSure() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // 将数组通过逗号（,）拼接成字符串
      const idStr = keys.join(',')

      this.axios
        .post('roles/' + this.rolesId + '/rights', { rids: idStr })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            this.$message.error('权限分配更改失败')
          } else {
            this.$message.success('权限分配更新成功')
            this.getRolesList()
          }
        })
      this.rightSetVisible = false
    },
  },
}
</script>
<style lang="less" scoped>
.btn {
  margin-left: 100px;
}
.el-col {
  margin: 7px;
  .el-tag {
    margin: 7px;
  }
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>