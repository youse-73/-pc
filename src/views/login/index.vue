<template>
  <div class="login-page">
    <!-- 卡片面板 -->
    <el-card>
      <!-- 头部，必须用具名插槽 -->
      <template #header>
        <h1>黑马面经管理系统</h1>
      </template>
      <!-- 卡片的内容区:表单 -->
      <el-form :model="user" :rules="rules" ref="form">
        <!-- 第1行：用户名 -->
        <el-form-item prop="username">
          <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 第2行：密码 -->
        <el-form-item prop="password">
          <el-input v-model="user.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 第3行：按钮 -->
        <el-form-item class="tc">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="$refs.form.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { loginAPI } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      // 数据项user，和表单进行双向绑定
      user: {
        username: 'admin',
        password: 'admin'
      },
      // 验证规则
      rules: {
        username: [
          // required-必填  message-提示  trigger-触发方式
          { required: true, message: '请输入账号', trigger: ['blur', 'change'] },
          { min: 4, max: 6, message: '长度在 4 到 6 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 4, max: 6, message: '长度在 4 到 6 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    login () {
      // 在提交之前，还需要完整的验证
      this.$refs.form.validate(async valid => {
        // console.log(valid) // 验证通过valid=true; 验证不通过valid=false
        if (valid) {
          // 验证通过，发送ajax请求，提示数据
          // console.log(this.user)
          const res = await loginAPI(this.user)
          // console.log(res)
          // 提示、存token、跳转
          this.$message.success('登录成功')
          // localStorage.setItem('mj-pc-token', res.data.token)
          this.$store.commit('user/updateToken', res.data.token)
          this.$router.push('/dashboard')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background: url(@/assets/login-bg.svg) no-repeat center / cover;
  display: flex;
  align-items: center;
  justify-content: center;

  // element-ui中，组件名，就是类名
  .el-card {
    width: 410px;
    ::v-deep .el-card__header {
      color: #fff;
      background-color: #727cf5;
      text-align: center;
      line-height: 40px;
      h1 {
        font-size: 18px;
      }
    }
  }
  .el-form {
    margin: 0 20px;
  }
  .tc {
    text-align: center;
  }
}
</style>
