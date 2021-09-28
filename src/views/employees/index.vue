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
          <el-button v-if="'import'" type="danger" size="small" @click="$router.push('/excel')">导入excel</el-button>
          <el-button v-if="'export'" type="success" size="small" @click="downloadExcel">导出excel</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 表格数据 -->
      <el-card style="margin-top: 10px;">
        <el-table :data="employeesList" border :default-sort="{prop: 'workNumber'}">
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="staffPhoto" label="头像">
            <template slot-scope="scope">
              <!-- <img class="staffPhoto" :src="scope.row.staffPhoto" alt=""> -->
              <image-holder :src="scope.row.staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="workNumber" sortable label="工号" />
          <el-table-column prop="formOfEmployment" :formatter="formatter" label="聘用形式" />
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" sortable label="入职时间">
            <template slot-scope="scope">
              <span>{{ scope.row.timeOfEntry | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="correctionTime" label="转正时间">
            <template slot-scope="scope">
              <span>{{ scope.row.correctionTime | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail?id=${scope.row.id}`)">查看</el-button>
              <el-button type="text" size="small" @click="setEmp(scope.row.id)">分配角色</el-button>
              <el-button type="text" size="small" @click="delEmp(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination :current-page="query.page" :page-sizes="[10, 15, 20, 25]" :page-size="query.size" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-row>

        <!-- 新增员工弹窗 -->
        <el-dialog
          title="新增员工"
          :visible.sync="showDialog"
          width="50%"
          @close="closeDialog"
        >

          <emp-dialog
            ref="empDia"
            @updateEmp="updateHandle"
            @close="showDialog = false"
          />

        </el-dialog>

        <!-- 分配角色弹窗 -->
        <el-dialog
          title="新增员工"
          :visible.sync="showRoleDialog"
          width="50%"
        >

          <assign-role v-if="showRoleDialog" :user-id="userId" @close="showRoleDialog=false" />

        </el-dialog>

      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeList, deleteEmployee } from '@/api/employees'
import employeesEnum from '@/constant/employees'
import EmpDialog from './empDialog.vue'
import AssignRole from './assignRole.vue'

// 引入dayjs做时间处理，体积更小
import dayjs from 'dayjs'
export default {
  name: 'Employees',
  components: {
    EmpDialog,
    AssignRole
  },
  filters: {
    formatTime(time) {
      // 如果未设置转正时间为空
      return time ? dayjs(time).format('YYYY-MM-DD') : ''
    }
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      showDialog: false, // 控制新增员工弹窗
      showRoleDialog: false, // 控制分配角色弹窗
      userId: '' // 员工id
    }
  },
  created() {
    // 调用获取员工列表方法
    this.getEmployeeList()
  },

  methods: {
    // 分配角色
    setEmp(id) {
      this.showRoleDialog = true
      this.userId = id
    },

    // 导出 Excel
    downloadExcel() {
      import('@/vendor/Export2Excel').then(async excel => {
        // console.log(excel)
        const res = await getEmployeeList(this.query)
        const obj = this.transData(res.data.rows)
        // console.log(obj)

        // excel表示导入的模块对象
        excel.export_json_to_excel({
          header: obj.headers, // 表头 必填
          data: obj.results, // 具体数据 必填
          filename: 'excel-list', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },
    // 格式化导出数据
    transData(data) {
      // 准备枚举的对象
      const map = {
        'id': '编号',
        'password': '密码',
        'mobile': '手机号',
        'username': '姓名',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门',
        'staffPhoto': '头像地址'
      }
      const headerKey = Object.keys(data[0])
      const headers = headerKey.map(item => {
        return map[item]
      })
      const results = data.map(item => {
        return Object.values(item)
      })
      return { headers, results }
    },

    // x关闭
    closeDialog() {
      this.$refs.empDia.close()
    },
    // 弹窗关闭处理函数
    updateHandle() {
      this.showDialog = false
      // 新增时如果当前页已满，再调用员工列表跳转至下一页
      if (this.employeesList.length === this.query.size) {
        this.query.page++
      }
      this.getEmployeeList()
    },

    // 删除员工
    async delEmp(id) {
      const confimRes = await this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confimRes === 'cancel') return this.$message('您已取消删除该员工')
      // 调用根据id删除员工API
      const res = await deleteEmployee(id)
      // console.log(res)
      if (this.employeesList.length === 1) {
        this.query.page--
        if (this.query.page <= 0) {
          this.query.page = 1
        }
      }
      // 消息提示
      this.$message.success(res.message)
      // 重新渲染页面
      this.getEmployeeList()
    },
    // 用来格式化内容 -- 枚举
    // 行，列，单元格值，索引
    formatter(row, column, cellValue, index) {
      const obj = employeesEnum.hireType.find(obj => obj.id === Number(cellValue))
      return obj ? obj.value : '未知'
    },

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

<style lang="scss" scoped>
.staffPhoto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
