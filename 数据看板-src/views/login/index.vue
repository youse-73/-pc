<template>
  <div class="login-page">
    <el-card>
      <template #header>黑马面经运营后台</template>
      <el-form label-width="55px" :model="user" :rules="rules" ref="form">
        <!-- 账号 -->
        <el-form-item prop="username" label="账号">
          <el-input
            placeholder="请输入用户名"
            v-model="user.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <el-input
            type="password"
            placeholder="请输入账号"
            v-model="user.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
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
      user: {
        username: 'admin',
        password: 'admin'
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: ['blur', 'change']
          },
          {
            min: 4,
            max: 6,
            message: '账号长度在 4 到 6 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 4,
            max: 6,
            message: '密码长度在 4 到 6 个字符',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 通过验证
          const res = await loginAPI(this.user)
          // console.log(res)
          localStorage.setItem('mj-pc-token', res.data.token)
          this.$message.success('登录成功')
          this.$router.push('/dashboard')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: url(@/assets/login-bg.svg) no-repeat center / cover;
  // 通过flex布局让卡片居中
  display: flex;
  align-items: center;
  justify-content: space-around;
  .el-card {
    width: 420px;
    ::v-deep .el-card__header {
      height: 80px;
      color: rgb(255, 255, 255);
      background: rgb(114, 124, 245);
      text-align: center;
      line-height: 40px;
      font-size: 18px;
    }
  }
  .tc {
    text-align: center;
    margin-left: -40px;
  }
}
</style>
