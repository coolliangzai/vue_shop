<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <!-- 输入框 -->
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getGoodsList()"
            v-model="queryInfo.query"
            class="search"
            @keyup.enter="getGoodsList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加商品按钮 -->
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品信息列表 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="70px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="180px">
          <!-- 过滤器 -->
          <template slot-scope="scope">{{scope.row.add_time|DateFormate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit">修改</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeById(scope.row.goods_id )"
              >删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取商品列表的请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //商品列表总数
      total: 0,
      goodsList: [],
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //   获取商品信息列表
    getGoodsList() {
      this.axios
        .get('goods', {
          params: this.queryInfo,
        })
        .then((res) => {
          console.log(res)
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取商品列表失败')
          } else {
            this.total = res.data.data.total
            this.goodsList = res.data.data.goods
          }
        })
    },
    // 改变分页大小
    handleSizeChange(val) {
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    //改变当前页码
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 通过商品的id删除对应的商品
    async removeById(id) {
      console.log(id)
      //   是否确定删除商品的提示框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        this.$message.info('已经取消删除操作')
      } else {
        this.axios.delete('goods/' + id).then((res) => {
          console.log(res)
          if (res.data.meta.status !== 200) {
            this.$message.error('删除商品失败')
          } else {
            this.$message.success('删除商品成功')
            this.getGoodsList()
          }
        })
      }
    },
    //点击添加商品按钮，通过编程式导航跳转到添加商品的页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 30px;
}
.search {
  width: 420px;
}
.el-table {
  margin-top: 20px;
}
</style>