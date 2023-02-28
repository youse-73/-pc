<template>
  <div class="article-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>面经后台</el-breadcrumb-item>
      <el-breadcrumb-item>面经管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="never" border="false">
      <!-- 添加面经 -->
      <template #header>
        <div class="header">
          <span>共 {{ total }} 条记录</span>
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            round
            @click="openDrawer('add')"
          >
            添加面经
          </el-button>
        </div>
      </template>
      <!-- 表格 -->
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column prop="stem" label="标题" width="400px">
        </el-table-column>
        <el-table-column prop="creator" label="作者"> </el-table-column>
        <el-table-column prop="likeCount" label="点赞"> </el-table-column>
        <el-table-column prop="views" label="浏览数"> </el-table-column>
        <el-table-column prop="createdAt" label="更新时间"> </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="{ row }">
            <div class="actions">
              <i class="el-icon-view" @click="openDrawer('view', row.id)"></i>
              <i
                class="el-icon-edit-outline"
                @click="openDrawer('edit', row.id)"
              ></i>
              <i class="el-icon-delete" @click="del(row.id)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 抽屉组件 -->
    <el-drawer
      :visible.sync="drawer"
      :before-close="handleClose"
      :title="drawerTitle"
      size="50%"
    >
      <div v-if="drawerType === 'view'" class="article-preview">
        <h5>{{ form.stem }}</h5>
        <div v-html="form.content"></div>
      </div>
      <!-- 添加面经 -->
      <el-form
        v-else
        label-width="80px"
        :model="form"
        :rules="rules"
        ref="form"
      >
        <!-- 标题 -->
        <el-form-item label=" 标题" prop="stem">
          <el-input v-model="form.stem"></el-input>
        </el-form-item>
        <!-- 内容 -->
        <el-form-item label=" 内容" prop="content">
          <quill-editor
            v-model="form.content"
            @blur="$refs.form.validateField('content')"
          ></quill-editor>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item label=" 内容">
          <el-button type="primary" @click="onSubmit">确认</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
// 导入
import {
  articleListAPI,
  addArticleAPI,
  articleAPI,
  updateArticleAPI
} from '@/api/article'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'article-page',
  data () {
    return {
      current: 1, // 默认获取第一页的数据；】
      pageSize: 10, // 每页数据：10条
      list: [], // 要展示的接口数据
      total: 0, // 总数据 数量
      drawer: false, // true表示打开抽屉； false表示关闭抽屉
      drawerType: '', // 操作类型 add、view、 edit
      id: null,
      form: {
        stem: '',
        content: ''
      },
      // 判断规则
      rules: {
        stem: [{ required: true, message: '请输入面经标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入面经标题', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.articleList()
  },
  methods: {
    // 列表请求
    async articleList () {
      // 调用API方法，获取数据
      const res = await articleListAPI({
        current: this.current,
        pageSize: this.pageSize
      })
      this.list = res.data.rows
      this.total = res.data.total
    },
    // 删除
    del (id) {
      console.log(id)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.current = 1
      this.articleList()
    },
    // 页码改变的时候，执行的方法
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.current = val
      this.articleList()
    },
    // 关闭抽屉
    handleClose () {
      // 清空文本
      this.form.stem = this.form.content = ''
      this.drawer = false
    },
    // 打开抽屉的方法
    async openDrawer (type, id) {
      // console.log(type, id)
      if (type !== 'add') {
        const res = await articleAPI(id)
        // 给数据项赋值，只要数据项有值，页面自然就回显了
        this.form.stem = res.data.stem
        this.form.content = res.data.content
        this.id = id
      }
      this.drawerType = type
      this.drawer = true
    },
    // 提交表单的方法
    onSubmit () {
      this.$refs.form.validate(async vaild => {
        if (vaild) {
          // 判断点击事件
          if (this.drawerType === 'add') {
            await addArticleAPI(this.form)
            this.$message.success('添加成功')
          } else {
            await updateArticleAPI({ id: this.id, ...this.form })
            this.$message.success('修改成功')
          }
          // console.log('验证通过了')

          this.current = 1
          // 重新渲染数据
          this.articleList()
          // 清空表单数据，并关闭
          this.handleClose()
        }
      })
    }
  },
  computed: {
    drawerTitle () {
      let title = '大标题'
      if (this.drawerType === 'add') {
        title = '添加面经'
      }
      if (this.drawerType === 'view') {
        title = '面经预览'
      }
      if (this.drawerType === 'edit') {
        title = '修改面经'
      }
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
