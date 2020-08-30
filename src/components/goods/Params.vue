<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <el-row class="goods_type">
        <el-col>
          <span>
            请选择商品分类：
            <!-- 级联选择框 -->
            <el-cascader
              expand-trigger="hover"
              :options="catelist"
              :props="cateProps"
              v-model="selectedCateKeys"
              @change="handleChange"
            ></el-cascader>
          </span>
        </el-col>
      </el-row>
      <!-- tab标签导航 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="!isBtnDisabled" @click="addParams">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" :disabled="!isBtnDisabled" @click="addParams">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+texttitle"
      :visible.sync="ParamsDialogVisible"
      width="30%"
      @close="addDiaglogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addParamsRules"
        ref="addFormRuleFormRef"
        label-width="100px"
      >
        <el-form-item :label="texttitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureToAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+texttitle"
      :visible.sync="editParamsDialogVisible"
      width="30%"
      @close="addDiaglogClosed"
    >
      <el-form
        :model="editForm"
        :rules="addParamsRules"
        ref="addFormRuleFormRef"
        label-width="100px"
      >
        <el-form-item :label="texttitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureToEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类列表
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //级联选择框双向绑定的数组
      selectedCateKeys: [],
      //tab栏默认选中的名字
      activeName: 'many',
      //   动态参数的数据
      manyTableData: [],
      //静态属性数据
      onlyTableData: [],
      ParamsDialogVisible: false,
      //修改参数信息对话框
      editParamsDialogVisible: false,
      inputVisible: false,
      inputValue: '',
      //添加参数的表单数据对象
      addForm: {
        attr_name: '',
      },
      editForm: {
        attr_name: 'nihao',
      },
      //验证规则
      addParamsRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取商品分类列表
    getCateList() {
      this.axios.get('categories').then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.error('初始化商品失败')
        } else {
          this.catelist = res.data.data
        }
      })
    },
    // 级联选择框发生变化时
    handleChange() {
      //console.log(this.selectedCateKeys)
      //   如果选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.getParams()
    },
    //点击tab栏触发的事件
    handleClick() {
      console.log(this.activeName)
      // 只有当级联选择框有选项,才会调用获取商品参数的函数
      if (this.selectedCateKeys.length !== 0) {
        this.getParams()
      }
    },
    //获取商品参数
    getParams() {
      this.axios
        .get('categories/' + this.cateId + '/attributes', {
          params: { sel: this.activeName },
        })
        .then((res) => {
          res.data.data.forEach((item) => {
            //利用三元表达式,防止字符串为空时,用split将原字符串转化为了[' ']
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            //为每一项添加一个控制按钮和标签切换的布尔值和双向绑定的数据
            item.inputVisible = false
            item.inputValue = ''
          })
          if (this.activeName === 'many') {
            this.manyTableData = res.data.data
          } else {
            this.onlyTableData = res.data.data
          }
          console.log(res)
        })
    },
    //添加参数按钮
    addParams() {
      this.ParamsDialogVisible = true
    },
    //当关闭添加参数对话框时
    addDiaglogClosed() {
      this.$refs.addFormRuleFormRef.resetFields()
    },
    //添加属性
    sureToAdd() {
      this.ParamsDialogVisible = false
      this.$refs.addFormRuleFormRef.validate((val) => {
        if (val !== true) {
          return this.$message.error('请检擦输入的参数是否正确')
        } else {
          this.axios
            .post('categories/' + this.selectedCateKeys[2] + '/attributes', {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName,
            })
            .then((res) => {
              if (res.data.meta.status !== 201) {
                return this.$message.error('添加参数失败')
              } else {
                this.$message.success('添加参数成功')
                this.getParams()
              }
              console.log(res)
            })
        }
      })
    },
    showEditDialog(attr_id) {
      this.axios
        .get(
          'categories/' + this.selectedCateKeys[2] + '/attributes/' + attr_id
        )
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取参数信息失败')
          } else {
            this.editForm = res.data.data
          }
          console.log(res)
        })
      this.editParamsDialogVisible = true
    },
    //确认修改
    sureToEdit() {
      //   请求axios时,应先对表单进行与验证
      this.$refs.addFormRuleFormRef.validate((val) => {
        if (!val) {
          return this.$message.error('请检查输入的参数是否有误')
        } else {
          this.$message.success('修改成功')
          this.axios
            .put(
              'categories/' +
                this.selectedCateKeys[2] +
                '/attributes/' +
                this.editForm.attr_id,
              {
                attr_name: this.editForm.attr_name,
                attr_sel: this.activeName,
                attr_vals: this.editForm.attr_vals,
              }
            )
            .then((res) => {
              this.getParams()
              console.log(res)
            })
          this.editParamsDialogVisible = false
        }
      })
    },
    //删除参数
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm('确定删除该参数?', '删除参数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('你已取消删除')
      } else {
        this.$message.success('删除成功')
        this.axios
          .delete(
            'categories/' + this.selectedCateKeys[2] + '/attributes/' + attr_id
          )
          .then((res) => {
            console.log(res)
            this.getParams()
          })
      }
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      } else {
        row.attr_vals.push(row.inputValue.trim())
        this.getParamsList(row)
        row.inputValue = ''
        row.inputVisible = false
      }
    },
    getParamsList(row) {
      this.axios
        .put('categories/' + this.cateId + '/attributes/' + row.attr_id, {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' '),
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            this.$message.error('添加失败')
          } else {
            return
          }
        })
    },
    showInput(row) {
      row.inputVisible = true
      console.log(this)
      //让文本框自动获得焦点
      //$nextTick方法作用,当页面上元素被重新渲染之后,才会执行回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },
    // 删除对应属性标签
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.getParamsList(row)
    },
  },
  computed: {
    //机算属性,如果哦级联选择框未选中三级分类,就禁用添加按钮
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return false
      } else {
        return true
      }
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    texttitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 30px;
}
.goods_type {
  margin-top: 25px;
}
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 0 20px;
}
.input-new-tag {
  width: 100px;
}
</style>>

