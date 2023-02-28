<template>
  <div class="article-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>面经后台</el-breadcrumb-item>
      <el-breadcrumb-item>面经管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="never" border="false">
      <template #header>
        <div class="header">
          <span>共 300 条记录</span>
          <el-button icon="el-icon-plus" size="small" type="primary" round @click="openDrawer('add')">
            添加面经
          </el-button>
        </div>
      </template>
      <!-- 这里放表格 -->
      <el-table :data="list" style="width: 100%" stripe>
        <el-table-column prop="stem" label="标题" width="400"> </el-table-column>
        <el-table-column prop="creator" label="作者"> </el-table-column>
        <el-table-column prop="likeCount" label="点赞"> </el-table-column>
        <el-table-column prop="views" label="浏览数"> </el-table-column>
        <el-table-column prop="createdAt" label="更新时间" width="180"> </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="{ row }">
            <div class="actions">
              <i class="el-icon-view" @click="openDrawer('view', row.id)"></i>
              <i class="el-icon-edit-outline" @click="openDrawer('edit', row.id)"></i>
              <i class="el-icon-delete" @click="del(row.id)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页，放到表格后面 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 抽屉组件 -->
    <el-drawer :title="drawerTitle" :visible.sync="drawer" :before-close="handleClose" size="50%">
      <!-- 如果是预览操作，显示div，不显示form表单 -->
      <div v-if="drawerType === 'view'" class="article-preview">
        <h5>{{ form.stem }}</h5>
        <div v-html="form.content"></div>
      </div>

      <el-form v-else label-width="80px" :model="form" :rules="rules" ref="form">
        <!-- 第一行 -->
        <el-form-item label="标题" prop="stem">
          <el-input v-model="form.stem"></el-input>
        </el-form-item>
        <!-- 第二行 -->
        <el-form-item label="内容" prop="content">
          <quill-editor v-model="form.content" @blur="$refs.form.validateField('content')"></quill-editor>
        </el-form-item>
        <!-- 第三行 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { articleListAPI, addArticleAPI, articleAPI, updateArticleAPI } from '@/api/article'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'article-page',
  data () {
    return {
      current: 1, // 默认获取第1页的数据
      pageSize: 10, // 每页数据，10条
      list: [], // 要展示的接口数据
      total: 0, // 总数据 数量
      drawer: false, // 控制抽屉是否打开
      drawerType: '', // 操作类型 add、edit、view
      id: null, // 修改、预览的时候，存一下数据的id
      form: {
        stem: '',
        content: ''
      },
      rules: {
        stem: [{ required: true, message: '标题必填', trigger: 'blur' }],
        content: [{ required: true, message: '内容必填', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.articleList()
  },
  methods: {
    async articleList () {
      // 调用API方法，获取数据
      const res = await articleListAPI({
        current: this.current,
        pageSize: this.pageSize
      })
      // console.log(res)
      this.list = res.data.rows
      this.total = res.data.total
    },
    // 删除方法
    del (id) {
      console.log(id)
    },
    // 当修改了每页多少条之后，执行这个方法
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.current = 1
      this.articleList()
    },
    // 页码改变的时候，执行的方法
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.current = val // 修改数据项为当前点击的页码值
      this.articleList() // 调用方法，发送请求，获取数据
    },
    // 关闭抽屉之前的方法
    handleClose () {
      // console.log('关闭抽屉之前')
      this.form.stem = this.form.content = ''
      this.drawer = false
    },
    // 打开抽屉的方法
    async openDrawer (type, id) {
      // console.log(type, id)
      if (type !== 'add') {
        const res = await articleAPI(id)
        // console.log(res)
        // 给数据项赋值，只要数据项有值，页面自然就回显了
        this.form.stem = res.data.stem
        this.form.content = res.data.content
        this.id = id
      }
      this.drawerType = type
      this.drawer = true // 打开抽屉
    },
    // 提交表单的方法
    onSubmit () {
      this.$refs.form.validate(async valid => {
        // console.log(valid)
        if (valid) {
          // console.log('验证通过，可以提交数据了')
          if (this.drawerType === 'add') {
            await addArticleAPI(this.form)
            // 提示、清空表单、关闭抽屉、重新获取页面数据
            this.$message.success('添加成功')
          } else {
            await updateArticleAPI({ id: this.id, ...this.form })
            // 提示、清空表单、关闭抽屉、重新获取页面数据
            this.$message.success('修改成功')
          }
          // console.log(res)
          this.current = 1
          this.articleList() // 重新获取页面数据
          this.handleClose() // 清空表单的数据，并关闭抽屉
        }
      })
    }
  },
  computed: {
    drawerTitle () {
      let title = '大标题'
      if (this.drawerType === 'add') title = '添加面经'
      if (this.drawerType === 'edit') title = '修改面经'
      if (this.drawerType === 'view') title = '面经预览'
      return title
    }
  },
  components: {
    quillEditor
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 25px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
  }
  .actions {
    font-size: 18px;
    display: flex;
    justify-content: space-around;
    color: #666;
    > i:hover {
      color: rgba(114, 124, 245, 1);
      cursor: pointer;
    }
  }
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
.el-breadcrumb {
  margin-top: 10px;
}
.el-form {
  padding-right: 40px;
}
.quill-editor {
  ::v-deep .ql-editor {
    height: 300px;
  }
}
.el-rate {
  padding: 10px 0;
}
.article-preview {
  padding: 0 40px 40px 40px;
  > h5 {
    font-size: 20px;
    color: #666;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 30px;
    margin: 0 0 20px 0;
  }
}
</style>
