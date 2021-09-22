<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共{{ total }}条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button type="danger" size="small">导入excel</el-button>
          <el-button type="success" size="small">导出excel</el-button>
          <el-button type="primary" size="small">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 表格数据 -->
      <el-card style="margin-top: 10px;">
        <el-table :data="employeesList" border>
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="staffPhoto" label="头像" />
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="workNumber" label="工号" />
          <el-table-column prop="formOfEmployment" label="聘用形式" />
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" />
          <el-table-column prop="correctionTime" label="转正时间" />
          <el-table-column label="操作" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'

export default {
  name: 'Employees',
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0 // 数据总条数
    }
  },
  created() {
    // 调用获取员工列表方法
    this.getEmployeeList()
  },

  methods: {
    // 获取员工列表
    async getEmployeeList() {
      // 调用获取员工列表API
      const res = await getEmployeeList(this.query)
      // console.log(res)
      // 绑定员工table和total
      this.employeesList = res.data.rows
      this.total = res.data.total
    },

    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getEmployeeList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
