<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示添加商品信息 -->
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>
      <!-- 添加商品步骤 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="propName"
                  v-for="(propName,index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="pictureURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addGoods" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览的对话框 -->
    <el-dialog title="图片预览" :visible.sync="PreviewPicVisible" width="50%">
      <img :src="previewPicURL" alt class="picPreview" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      activeIndex: '0',
      tabPosition: 'left',
      // 添加商品信息表单
      addForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        //商品所属分类数组
        goods_cat: [],
        //图片基本信息数组
        pics: [],
        attrs: [],
      },
      // 添加商品规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      manyTableData: [],
      onlyTableData: [],
      pictureURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        //手动添加一个请求头携带token
        Authorization: window.sessionStorage.getItem('token'),
      },
      previewPicURL: '',
      // 控制预览图片窗口是否显示
      PreviewPicVisible: false,
    }
  },
  methods: {
    getCateList() {
      this.axios.get('categories').then((res) => {
        this.catelist = res.data.data
        console.log(res)
      })
    },
    handleChange(val) {
      // console.log(val)
      if (val.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    tabClicked(name) {
      // console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        this.axios
          .get('categories/' + this.cateId + '/attributes', {
            params: {
              sel: 'many',
            },
          })
          .then((res) => {
            console.log(res)
            if (res.data.meta.status !== 200) {
              this.$message.error('获取商品参数失败')
            } else {
              res.data.data.forEach((val) => {
                val.attr_vals =
                  val.attr_vals === '' ? [] : val.attr_vals.split(' ')
              })
              this.manyTableData = res.data.data
            }
          })
      } else if (this.activeIndex === '2') {
        this.axios
          .get('categories/' + this.cateId + '/attributes', {
            params: {
              sel: 'only',
            },
          })
          .then((res) => {
            console.log(res)
            if (res.data.meta.status !== 200) {
              this.$message.error('获取商品参数失败')
            } else {
              this.onlyTableData = res.data.data
            }
          })
      }
    },
    //预览上传的图片
    handlePreview(file) {
      console.log(file)
      this.previewPicURL = file.response.data.url
      console.log(this.previewPicURL)
      this.PreviewPicVisible = true
    },
    //删除图片操作
    handleRemove(file) {
      console.log(this.addForm.pics)
      const filePath = file.response.data.tmp_path
      // 查询存储图片临时路径的数组
      const picIndex = this.addForm.pics.findIndex((val) => {
        val.pic === filePath
      })
      this.addForm.pics.splice(picIndex, 1)
      console.log(this.addForm.pics)
    },
    uploadSuccess(res) {
      // console.log(res)
      this.addForm.pics.push({ pic: res.data.tmp_path })
      // console.log(this.addForm)
    },
    add() {
      this.$refs.addFormFormRef.validate((val) => {
        if (!val) {
          return this.$message.error('请填写必填项')
        } else {
          // 深拷贝
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          // 处理动态参数
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' '),
            }
            this.addForm.attrs.push(newInfo)
          })
          //处理静态参数
          this.onlyTableData.forEach((val) => {
            const newInfo = {
              attr_id: val.attr_id,
              attr_value: val.attr_vals,
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          // console.log(form)
          this.axios.post('goods', form).then((res) => {
            if (res.data.meta.status !== 201) {
              this.$message.error('添加商品失败')
            } else {
              this.$router.push('/goods')
            }
            console.log(res)
          })
        }
      })
    },
  },
  computed: {
    cateId() {
      if ((this, this.addForm.goods_cat.length === 3)) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 30px;
}
.el-steps {
  margin-top: 15px;
  margin-left: 150px;
  .el-step__title {
    background-color: blue;
    font-size: 13px;
  }
}
.el-tabs {
  margin-top: 30px;
}
.picPreview {
  width: 100%;
}
.addGoods {
  margin-top: 15px;
}
</style>