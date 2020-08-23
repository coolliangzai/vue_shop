<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" size="small">退出</el-button>
    </el-header>
    <!-- 主体部分 -->
    <el-container>
      <!-- 左侧菜单部分 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="NavState"
        >
          <!-- :unique-opened="true"  是否只保持一个子菜单的展开 -->
          <el-submenu v-for="(item) in menus" :key="item.id" :index="item.order+''">
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[item.id]"></i>
              <!-- 文字 -->
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index=" '/'+items.path+''"
              v-for="(items,indexs) in item.children"
              :key="indexs"
              @click="saveNavState"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文字 -->
              <span>{{items.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      menus: [],
      icons: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      // 用来保存该链接是否被点击高亮
      NavState: '',
    }
  },
  created() {
    this.NavState = window.sessionStorage.getItem('NavState')
    this.getList()
  },
  methods: {
    logout() {
      //   点击退出按钮清除window对象下的sessionStorage;
      window.sessionStorage.clear()
      //   跳转到登录页面
      this.$router.push('/login')
    },
    //获取左侧菜单
    getList() {
      this.axios({
        method: 'get',
        url: 'menus',
        params: '',
      }).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.menus = res.data.data
        // console.log(res)
      })
    },
    //左侧菜单的折叠和展开
    toggleCollapse() {
      //通过控制布尔值来控制折叠与展开
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState() {
      console.log(this.$route.fullPath)
      // 存储该链接的值
      window.sessionStorage.setItem('NavState', this.$route.fullPath)
      this.NavState = this.$route.fullPath
    },
  },
}
</script>

<style lang="less" scoped>
.el-header {
  height: 100%;
  padding-left: 0;
  background-color: #373d41;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 60px;
      margin-right: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}
.toggle-button {
  height: 24px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3em; //设置字符之间的距离
  cursor: pointer;
  color: #fff;

  background-color: #4a5064;
}

.home-container {
  height: 100%;
}
.el-button {
  height: 40px;
  width: 80px;
}
.iconfont {
  padding-right: 6px;
}
</style>