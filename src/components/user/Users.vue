<template>
  <div>
    <!-- 面包屑头部导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 卡片区域的内容 -->

      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 通过作用于插槽接收到了scope这个数据对象，然后通过scope.row就可以拿到这一行的信息 -->
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteUserById(scope.row.id)"></el-button>

            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 8, 16]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="30%"
      @close="addDialogClose"
    >
      <!-- @close是窗口关闭事件 -->
      <!-- 添加用户信息的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息弹窗 -->
    <el-dialog title="修改信息" :visible.sync="EditdialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    // 自定义校验规则
    // 邮箱的校验规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // console.log(this.$refs)
        return cb()
      } else {
        cb(new Error('请输入合法的邮箱地址'))
      }
    }
    // 电话号码的校验规则
    var checkPhoneNumber = (rule, value, cb) => {
      const regPhoneNumber = /^[1]+[3,8]+\d{9}$/
      if (regPhoneNumber.test(value)) {
        // console.log(cb)
        return cb()
      } else {
        cb(new Error('请输入合法的电话号码'))
      }
    }
    return {
      //用户列表
      userlist: [],
      // 用户总数
      total: 0,
      // 当前的页码
      currentPage: 1,
      //每页的大小
      pageSize: 2,
      // 查询的用户名
      query: '',
      // 控制添加用户的对话框的显示和隐藏
      addUserDialogVisible: false,
      // 控制修改用户信息对话框的显示和隐藏
      EditdialogVisible: false,
      // 定义一个变量接收是否删除用户
      confirmResult: '',
      addForm: {
        username: 'admin1',
        password: '',
        email: '',
        mobile: '18381975597',
      },
      //查询用户信息
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkPhoneNumber, trigger: 'blur' },
        ],
      },
      editFormrules: {
        email: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '电话号码不能为空', trigger: 'blur' },
          {
            validator: checkPhoneNumber,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 获取用户列表信息
    getUserList() {
      this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize,
        },
      }).then((res) => {
        //console.log(res.data)
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取用户列表失败!')
        } else {
          this.userlist = res.data.data.users
          this.total = res.data.data.total
          // console.log(this.total)
          //console.log(this.userlist)
        }
      })
    },
    //处理当前表单所能展示数据的数目
    handleSizeChange(newpagesize) {
      // console.log(newpagesize)
      this.pageSize = newpagesize
      this.getUserList()
    },
    //改变用户当前的page
    handleCurrentChange(newpage) {
      //  console.log(newpage)
      this.currentPage = newpage
      this.getUserList()
    },
    //改变用户状态
    userStateChanged(userinfo) {
      console.log(userinfo)
      this.axios({
        method: 'put',
        url: 'users/' + userinfo.id + '/state/' + userinfo.mg_state,
        params: '',
      }).then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.error('更新用户状态失败')
        } else {
          return this.$message.success('更新用户状态成功')
        }
      })
    },
    //当添加用户的窗口关闭的时候重置整个表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // //点击确定按钮添加用户
    addUser() {
      //this.$refs.addFormRef.validate（）进行表单的与验证
      this.$refs.addFormRef.validate((val) => {
        console.log(val)
        console.log(this.addForm.username)
        if (val) {
          this.axios.post('users', this.addForm).then((res) => {
            console.log(res)
            if (res.data.meta.status !== 201) {
              return this.$message.error('添加失败')
              this.addUserDialogVisible = false
            } else {
              this.$message.success('添加成功')
              this.addUserDialogVisible = false
              this.getUserList()
            }
          })
        }
      })
    },
    // 修改用户信息
    showEditDialog(id) {
      // console.log(id)

      this.axios.get('users/' + id).then((res) => {
        //console.log(res)
        if (res.data.meta.status !== 200) {
          return this.$message.error('查询用户信息失败')
        } else {
          this.editForm = res.data.data
          this.EditdialogVisible = true
        }
      })
    },
    //关闭修改用户信息时重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户表单并提交
    editUserInfo() {
      this.$refs.editFormRef.validate((val) => {
        // console.log(val)
        if (!val) {
          return
        } else {
          //发送修改用户信息请求
          this.axios
            .put('users/' + this.editForm.id, {
              id: this.editForm.id,
              email: this.editForm.email,
              mobile: this.editForm.mobile,
            })
            .then((res) => {
              console.log(res)
              if (res.data.meta.status !== 200) {
                return this.$message.error('更新失败')
              } else {
                //提示更新成功
                this.$message.success('更新用户信息成功')
                // 重新渲染用户信息列表
                this.getUserList()
              }
              this.EditdialogVisible = false
            })
        }
      })
    },
    //通过用户id号删除用户信息
    async deleteUserById(id) {
      this.confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '删除用户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      console.log(this.confirmResult)
      if (this.confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        this.axios.delete('users/' + id).then((res) => {
          if (res.data.meta.status !== 200) {
            return
          } else {
            this.getUserList()
            console.log(res)
          }
        })
        this.$message.success('删除成功')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 30px;
}
</style>