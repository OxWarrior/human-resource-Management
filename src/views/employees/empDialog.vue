<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:90%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:90%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:90%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:90%" placeholder="请选择">
        <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:90%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="formData.departmentName" style="width:90%" placeholder="请选择部门" @focus="departmentNameFocus" />
      <div v-if="showTree" class="tree-box">
        <el-tree :data="treeData" :props="{ label:'name' }" default-expand-all @node-click="handleNodeClick" />
      </div>
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:90%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button @click="addCancel">取消</el-button>
      <el-button type="primary" @click="addSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import employeesEnum from '@/constant/employees'

import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

import { addEmployee } from '@/api/employees'

export default {
  name: 'EmpDialog',
  data() {
    return {
      // 添加表单字段
      // 字段和后端接口要求的字段要一致
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      // 添加表单的校验字段
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      hireType: employeesEnum.hireType, // 聘用形式
      treeData: [], // 树形数据
      showTree: false // 控制部门数据展示
    }
  },
  created() {
    // // 调用组织架构部门数据方法渲染数据
    // this.getDepartments()
  },

  methods: {
    // 选择部门聚焦展示数据
    departmentNameFocus() {
      // 调用组织架构部门数据方法渲染数据
      this.getDepartments()
    },

    // tree节点点击的回调
    handleNodeClick(data) {
      // console.log(data)
      // 当前有数据并且有子部门禁止选中
      if (data && data.children) return
      this.formData.departmentName = data.name
      // 隐藏tree组件
      this.showTree = false
    },

    // 组织架构部门数据
    async getDepartments() {
      const res = await getDepartments()
      // 获取数据后显示数据
      this.showTree = true
      // 扁平数组转tree
      this.treeData = tranListToTreeData(res.data.depts, '')
    },

    // 取消提交
    addCancel() {
      // 调用关闭弹窗的方法
      this.close()
      this.$emit('close')
    },

    // 确认提交
    addSubmit() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 调用新增员工API
        const res = await addEmployee(this.formData)
        this.$message.success(res.message)

        // 子传父关闭弹窗
        this.$emit('updateEmp')
      })
    },

    // 关闭弹窗
    close() {
      this.$refs.addForm.resetFields()
    }
  }

}
</script>

<style lang="scss" scoped></style>
