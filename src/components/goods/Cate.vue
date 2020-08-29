<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主要内容区域，卡片 -->
    <el-card>
      <el-button type="primary" :columns="columns" @click="showAddCateDialog">添加分类</el-button>
      <tree-table
        :data="cateList"
        :columns="columns"
        border
        :expand-type="false"
        :selection-type="false"
        :show-index="true"
        :index-text="'#'"
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            :class="scope"
            v-if="scope.row.cat_deleted===false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level===2" type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- <el-table :data="cateList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效">有效</el-table-column>
        <el-table-column prop="cat_level" label="排序"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>-->
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog
      title="添加商品分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            expand-trigger="hover"
            @change="parentCateChanged"
            :props="cascaderProps"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },

      //   商品分类总数
      total: 0,

      //有关分页的数据
      currentPage: 1,
      //   所有父级分类
      parentCateList: [],
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok',
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order',
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt',
        },
      ],
      //是否显示添加用户对话框
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0,
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取商品分类数据列表
    getCateList() {
      this.axios.get('categories', { params: this.queryInfo }).then((res) => {
        //  console.log(res)
        this.cateList = res.data.data.result
        this.total = res.data.data.total
      })
    },

    //改变分页大小
    handleSizeChange(val) {
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    //当前页数改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    // 显示添加分类对话框
    showAddCateDialog() {
      ;(this.addCateDialogVisible = true), this.getParentCateList()
    },
    // 获取父级分类的数据列表
    getParentCateList() {
      this.axios.get('categories', { params: { type: 2 } }).then((res) => {
        console.log(res)
        if (res.data.meta.status !== 200) {
          this.$message.error('获取父级分类数据失败！')
        } else {
          this.parentCateList = res.data.data
        }
      })
    },
    //级联选择框发生变化
    parentCateChanged() {
      //被选中分类的id,并且是一个数组
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        //父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length - 1
        return
      } else {
        //父级分类的Id
        this.addCateForm.cat_pid = 0
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate((val) => {
        if (!val) {
          return this.$message.error('表单输入有误请检擦')
        } else {
          this.axios.post('categories', this.addCateForm).then((res) => {
            if (res.data.meta.status !== 201) {
              return this.$message.error('添加分类失败')
            } else {
              this.$message.success('添加新的分类成功')
              this.getCateList()
              console.log(res)
              this.addCateDialogVisible = false
            }
          })
        }
      })
    },
    // 关闭添加分类对话框时，重置表单数据
    addCateDialogClosed() {
      // 重置表单
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      console.log(this.addCateForm)
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 30px;
}
.tree-table {
  margin-top: 30px;
}
.el-cascader {
  width: 100%;
}
</style>>

