<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 标签页 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="组织架构" name="first" class="tab-pane">
            <!-- layout布局 -->
            <el-row type="flex" justify="space-between" align="center" class="department-header">
              <el-col :span="20">
                <i class="el-icon-s-home" />
                <span class="company">江苏传智播客教育科技股份有限公司</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex">
                  <el-col>
                    <span>负责人</span>
                  </el-col>
                  <el-col>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addDepartment('')">添加子部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- 主体区域绘制 -->
            <el-tree class="departments-tree" :data="treeData" :props="defaultProps" default-expand-all>
              <template slot-scope="{ data }">
                <el-row type="flex" justify="space-between" style="height: 50px; width: 100%;" align="middle">
                  <el-col :span="20">
                    <span>{{ data.name }}</span>
                  </el-col>
                  <el-col :span="4">
                    <el-row type="flex" justify="end">
                      <el-col>{{ data.manager }}</el-col>
                      <el-col>
                        <el-dropdown>
                          <span class="el-dropdown-link">
                            操作<i class="el-icon-arrow-down el-icon--right" />
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="addDepartment(data.id)">添加子部门</el-dropdown-item>
                            <el-dropdown-item @click.native="editDepartment(data.id)">编辑部门</el-dropdown-item>
                            <el-dropdown-item v-if="data && !data.children" @click.native="delDepartment(data.id)">删除部门</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-tree>
          </el-tab-pane>

          <!-- 弹框 -->
          <el-dialog title="新增/编辑组织架构" :visible.sync="showDialog" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeFn">

            <!-- 弹框组件 -->
            <dept-dialog v-if="showDialog" ref="deptDialog" :origin-list="originList" :parent-id="patentId" :is-edit="isEdit" @closeDialog="closeDialogFn" />

          </el-dialog>

          <!-- data 展示数据 -->
          <!-- props	自定义渲染的规则 -->
          <!-- node-click 节点被点击时的回调
          共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 -->
          <!-- default-expand-all 是否默认展开所有节点 -->
          <!-- <el-tree :data="data" :props="defaultProps" default-expand-all @node-click="handleNodeClick" /> -->
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDepartments, delDepartment } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import DeptDialog from './deptDialog.vue'
export default {
  name: 'Departments',
  components: {
    DeptDialog
  },
  data() {
    return {
      activeName: 'first', // 高亮关联name
      treeData: [], // 树形数组
      defaultProps: { // 配置选项
        label: 'name'
      },
      showDialog: false, // 控制弹框显示
      patentId: '', // 父级部门ID
      isEdit: false, // 区分新增和编辑
      originList: []
    }
  },
  created() {
    // 数据渲染
    this.getDepartments()
  },
  methods: {
    // 获取组织架构列表
    async getDepartments() {
      const res = await getDepartments()
      // console.log(res)
      // 格式化数据 返回的是一个数组
      this.originList = res.data.depts.map(item => ({
        id: item.id,
        code: item.code,
        pid: item.pid,
        name: item.name
      }))

      this.treeData = tranListToTreeData(res.data.depts, '')
    },

    // 添加子部门
    addDepartment(id) {
      this.isEdit = false
      // 显示弹框
      this.showDialog = true
      this.patentId = id // 绑定
    },

    // 关闭弹框调用获取组织架构列表的方法重新渲染页面
    closeDialogFn() {
      this.showDialog = false
      this.getDepartments()
    },

    // 编辑部门
    editDepartment(id) {
      this.isEdit = true
      // 显示弹框
      this.showDialog = true
      this.patentId = id // 绑定
    },

    // 点击x关闭弹框
    closeFn() {
      this.$refs.deptDialog.resetForm()
    },

    // 根据部门id删除部门
    async delDepartment(id) {
      // 消息弹框
      const confirmRes = await this.$confirm('是否删除此部门？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }).catch(err => err)
      // 点击取消返回一个消息提示
      if (confirmRes === 'cancel') {
        return this.$message('取消删除部门')
      }
      // 调用删除部门的API
      const res = await delDepartment(id)

      // 删除成功的消息提示
      this.$message(res.message)
      // 删除成功调用获取组织架构列表的方法
      this.getDepartments()
    }
  }
}
</script>

<style lang="scss" scoped>
.departments-tree {
  margin: 12px 0px;
}
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}
</style>
