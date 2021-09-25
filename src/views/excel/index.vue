<template>
  <div class="app-container">
    <!-- on-success：上传成功，在里面执行上传成功以后的逻辑处理 -->
    <!-- before-upload：上传之前进行验证、文件格式、文件的大小等等等 -->
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />

  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

import { formatExcelDate } from '@/utils'
import { importEmployee } from '@/api/employees'
export default {
  name: 'Excel',
  components: { UploadExcelComponent },
  data() {
    return {}
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    async handleSuccess({ results, header }) {
      // 父级接收到子组件传递的表头和具体的数据
      const arr = this.transExcel(results)
      // console.log(arr)
      const res = await importEmployee(arr)
      // console.log(res)
      this.$message.success(res.message)
      this.$router.push('/employees')

      // this.tableData = results
      // this.tableHeader = header
    },

    // 格式化results
    transExcel(results) {
      // 创建原始枚举对象
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }

      return results.map(item => {
        const obj = {}
        // 得到原数组中每一项对象的key组成的数组
        const transKey = Object.keys(item)
        // 遍历数组枚举得到obj的key
        transKey.forEach(key => {
          const objKey = userRelations[key]
          // 判断值是否为转正和入职时间转换为时间戳
          if (objKey === 'timeOfEntry' || objKey === 'correctionTime') {
            obj[objKey] = new Date(formatExcelDate(item[key]))
          } else {
            // 当前每一项的值赋值给obj的值
            obj[objKey] = item[key]
          }
        })

        return obj
      })
    }
  }
}
</script>
