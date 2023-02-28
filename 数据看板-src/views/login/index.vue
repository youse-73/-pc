<template>
  <div class="login-page">
    <el-card>
      <template #header>黑马面经运营后台</template>
      <el-form label-width="60px" :model="user" :rules="rules" ref="form">
        <!-- 账号 -->
        <el-form-item label="账 号" prop="username">
          <el-input placeholder="输入用户名" v-model="user.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密 码" prop="password">
          <el-input
            type="password"
            placeholder="输入用户密码"
            v-model="user.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form class="tc">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="$refs.form.resetFields()">重置</el-button>
        </el-form>
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
      // 数据项
      user: {
        username: 'admin',
        password: 'admin'
      },
      rules: {
        // 对用户名的验证规则
        username: [
          {
            required: true,
            message: '请输入登录账号',
            trigger: ['blur', 'change']
          },
          {
            min: 4,
            max: 6,
            message: '长度在 4 到 6 个字符',
            trigger: ['blur', 'change']
          }
        ],
        // 对于密码的验证规则
        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: ['blur', 'change']
          },
          {
            min: 4,
            max: 6,
            message: '长度在 4 到 6 个字符',
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
          // localStorage.setItem('mj-pc-token', res.data.token)
          // vuex写法
          this.$store.commit('user/updateToken', res.data.token)
          this.$message.success('登录成功')
          this.$router.push('/dashboard') // 跳转到图表页
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
  display: flex;
  align-items: center;
  justify-content: space-around;
  .el-card {
    width: 420px;
    ::v-deep .el-card__header {
      height: 80px;
      background: rgba(114, 124, 245, 1);
      text-align: center;
      line-height: 40px;
      color: #fff;
      font-size: 18px;
    }
  }
  .el-form {
    padding: 0 20px;
  }
  .tc {
    text-align: center;
  }
}
</style>
