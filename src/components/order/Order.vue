<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" type="text">
            <!-- append是输入框的后置内容指定一个放大镜搜索图标 -->
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="650px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" width="80px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay==='0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time|DateFormate}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" @click="showLocation"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="30%" @close="closebox">
      <!-- 修改地址的表单 -->
      <el-form
        :model="addressForm"
        :rules="addressRules"
        ref="addressRuleFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address">
          <el-cascader
            v-model="addressForm.address"
            :options="city"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detalAddress">
          <el-input v-model="addressForm.detalAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示物流进度的对话框 -->
    <el-dialog title="提示" :visible.sync="locationDialogVisible" width="30%">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in locationList"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="locationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="locationDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import city from './citydata'
export default {
  created() {
    this.getOrderList()
  },
  data() {
    return {
      // 订单列表
      orderList: [],
      //订单的总数
      total: 0,
      //   获取订单信息的请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //   控制修改地址对话框的显示隐藏
      addressDialogVisible: false,
      //物理信息对话框的显示和隐藏
      locationDialogVisible: false,
      addressForm: { address: [], detalAddress: '' },
      //   修改地址表单的验证规则
      addressRules: {
        address: [
          { required: true, message: '请选择收货地址', trigger: 'blur' },
        ],
        detalAddress: [
          { required: true, message: '请选择详细的收货地址', trigger: 'blur' },
        ],
      },
      city,
      //物流信息列表
      locationList: [],
    }
  },
  methods: {
    getOrderList() {
      this.axios
        .get('orders', {
          params: this.queryInfo,
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            this.$message.error('获取订单信息失败')
          } else {
            this.orderList = res.data.data.goods
            this.total = res.data.data.total
          }
          console.log(res)
          console.log(this.orderList)
        })
    },
    //改变分页的大小时触发
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.queryInfo.pagenum = 1
      this.getOrderList()
    },
    //改变页码时触发
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getOrderList()
    },
    showBox() {
      this.addressDialogVisible = true
    },
    handleChange() {},
    closebox() {
      console.log(this.addressForm)
      this.$refs.addressRuleFormRef.resetFields()
      console.log(this.addressForm)
      console.log(2)
    },
    //显示物流进度
    showLocation() {
      this.axios.get('/kuaidi/1106975712662').then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取物流信息失败')
        } else {
          this.locationList = res.data.data
        }
        console.log(res)
      })
      this.locationDialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 30px;
}
.el-cascader {
  width: 100%;
}
</style>