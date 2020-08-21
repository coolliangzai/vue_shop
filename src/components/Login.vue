<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录logo部分 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 账号输入 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 登录和重置按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '用户名长度必须是2-8个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户密码必须是6-15个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //点击重置按钮，重置表单
    resetLoginFrom() {
      this.$refs.loginFormRef.resetFields()
      //   console.log(this);
    },
    //表单登录的预校验
    login() {
      this.$refs.loginFormRef.validate((valid) => {
        // console.log(valid);
        if (!valid) {
          return
        } else {
          this.$http({
            method: 'post',
            url: 'login',
            params: this.loginForm,
          }).then((res) => {
            console.log(res)
            if (res.data.meta.status != 200) {
              return this.$message({ message: '登录失败', type: 'error' })
            } else {
              this.$message({ message: '登录成功', type: 'success' })
              // 1.将登录成功之后的token, 保存到客户端的sessionStorage 中
              //1.1项目中出了登录之外的其他API接口，必须在登录之后才能访问
              //1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage 中
              window.sessionStorage.setItem('token', res.data.data.token)
              //通过编程式导航跳转到首页
              this.$router.push('/home')
            }
          })
        }
      })
    },
  },
}
</script>


<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  position: relative;
  border-radius: 15px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  padding: 10px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
    height: 100%;
    border: 1px solid #eee;
    border-radius: 130px;
    background-color: #eee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}
</style>