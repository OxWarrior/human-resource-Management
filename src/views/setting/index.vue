<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片 -->
      <el-card class="box-card">
        <!-- 标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">

          <!-- 用户管理 -->
          <el-tab-pane label="角色管理" name="first" class="tab-pane">

            <!-- 新增按钮 -->
            <el-row style="height:60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="addRole">新增角色</el-button>
            </el-row>

            <!-- 表格区域 -->
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column label="角色名" prop="name" />
              <el-table-column label="描述" prop="description" />

              <el-table-column label="操作">
                <!-- 操作按钮 -->
                <template slot-scope="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination :current-page="query.page" :page-sizes="[10, 15, 20, 25]" :page-size="query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息" name="second" class="tab-pane">
            <!-- 警告提示 -->
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon :closable="false" />
            <el-form :model="formData" label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 弹窗 -->
      <el-dialog title="新增角色" :visible.sync="showDialog" width="50%" @close="roleCancel">
        <!-- 表单 -->
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="roleCancel">取 消</el-button>
          <el-button size="small" type="primary" @click="roleSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoles, getCompanyInfo, addRole, getRoleId, updateRole, deleteRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'first', // 当前激活页
      tableData: [], // 表格数据
      query: {
        page: 1, // 当前页
        pagesize: 10 // 当前显示几条数据
      },
      total: 0, // 数据总条数
      formData: {}, // 公司信息
      showDialog: false, // 控制弹窗
      roleForm: { // 表单数据
        name: '',
        description: ''
      },
      rules: { // 表单验证规则
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入公司描述信息', trigger: 'blur' }
        ]
      },
      isEdit: false // 判断新增还是编辑标记
    }
  },

  computed: {
    ...mapGetters(['companyId'])
  },

  created() {
    // 调用获取所有角色列表方法
    this.getRoles()
    // 调用获取企业信息方法
    this.getCompanyInfo()
  },

  methods: {
    // 删除角色
    async delRole(id) {
      const confirmRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消删除消息提示
      if (confirmRes === 'cancel') return this.$message('您已取消删除')
      // 调用删除角色API
      const res = await deleteRole(id)

      // 当前页只有一条数据, 请求页码-1
      if (this.tableData.length === 1) {
        this.query.page--
        // 请求页码小于1重置为1
        if (this.query.page <= 0) {
          this.query.page = 1
        }
      }

      this.$message.success(res.message)
      this.getRoles()
    },

    // 新增角色
    addRole() {
      // 显示弹窗
      this.showDialog = true
      // false为新增
      this.isEdit = false
    },

    // 编辑数据回填
    async editRole(id) {
      // true为编辑
      this.isEdit = true
      // 显示弹窗
      this.showDialog = true
      // 调用获取角色API
      const res = await getRoleId(id)
      // console.log(res)
      this.roleForm = res.data
    },

    // 确认提交
    roleSubmit() {
      // 整体兜底校验
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return
        // 提交时为新增
        if (!this.isEdit) {
          // 调用新增员工API
          const res = await addRole(this.roleForm)
          // console.log(res)
          this.$message({
            type: 'success',
            message: res.message
          })
        } else {
          // 调用编辑员工API
          const res = await updateRole(this.roleForm)
          this.$message({
            type: 'success',
            message: res.message
          })
        }

        // 关闭弹窗
        this.showDialog = false
        // 再次调用获取所有角色列表方法渲染页面
        this.getRoles()
      })
    },

    // 取消提交
    roleCancel() {
      this.showDialog = false
      this.$refs.roleForm.resetFields()
    },

    // 获取企业信息
    async getCompanyInfo() {
      // 调用根据id查询企业
      const res = await getCompanyInfo(this.companyId)
      // console.log(res)
      this.formData = res.data
    },

    // 获取所有角色列表
    async getRoles() {
      // 调用获取所有角色列表API
      const res = await getRoles(this.query)
      // console.log(res)
      this.total = res.data.total
      this.tableData = res.data.rows
    },

    // 切换激活页
    handleClick(tab, event) {
      // console.log(tab, event)
    },

    // pageSize 改变时会触发
    handleSizeChange(newPageSize) {
      this.query.pagesize = newPageSize
      this.getRoles()
    },

    // currentPage 改变时会触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getRoles()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
form.el-form {
  padding-top: 30px;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
</style>
