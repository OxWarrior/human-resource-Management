<template>
  <div>
    <el-form ref="deptForm" :model="deptForm" :rules="rules" label-width="100px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="deptForm.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="deptForm.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="deptForm.manager" placeholder="请选择部门负责人" @change="changeSelect">
          <el-option v-for="item in employees" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="deptForm.introduce" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="hSubmit">确定</el-button>
        <el-button @click="hCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEmployeeSimple, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  name: 'DeptDialog',
  props: {
    parentId: { // 父级部门ID
      type: String,
      required: true
    },
    isEdit: { // 区分新增和编辑
      type: Boolean,
      required: true
    },
    originList: { // 格式化的弹框需要用的数据
      type: Array,
      required: true
    }
  },
  data() {
    // 自定义验证编码规则，不能出现重复编码
    const validCode = (rule, value, callback) => {
      // 通过原始数组得到以每个对象的编码组成的数组
      let existCodeList = this.originList.map(item => item.code)
      // 判断是否是编辑，筛选出 不含自身id 的方法
      if (this.isEdit) {
        existCodeList = existCodeList.filter(item => item.id === this.parentId).map(item => item.code)
      }
      existCodeList.includes(value) ? callback(new Error(`部门编码${value}已经存在`)) : callback()
    }

    // 自定义验证名称规则，同级不能重复
    const validName = (rule, value, callback) => {
      // 筛选原始数组中每一项同级的pid和传入当前id相等的数组 并返回一个name组成的新数组
      let existNameList = this.originList.filter(item => item.pid === this.parentId).map(item => item.name)

      // 编辑时
      if (this.isEdit) {
        // 找出当前编辑的那一项
        const dept = this.originList.find(item => item.id === this.parentId)
        const pid = dept.pid // 获取到当前的pid
        // 筛选出pid相等的所有，并且是兄弟部门不包含自身 map返回一个name组成的新数组
        existNameList = this.originList.filter(item => item.pid === pid && item.id !== this.parentId).map(item => item.name)
      }
      // 判断同级是否包含
      existNameList.includes(value) ? callback(new Error(`部门名称${value}已经存在`)) : callback()
    }

    return {
      deptForm: {
        name: '', // 部门名称
        code: '', // 部门编码，同级部门不可重复
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      employees: [], // 部门manager
      rules: { // 表单验证规则
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },

  // 监听parentId，先清空，再调用部门详情方法
  watch: {
    parentId(newValue, oldValue) {
      // for (const key in this.deptForm) {
      //   this.deptForm[key] = ''
      // }
      this.getDepartDetail()
    }
  },

  created() {
    // 调用获取负责人数据的方法
    this.getEmployeeSimple()
    // 调用获取部门详情的方法
    this.getDepartDetail()
  },
  methods: {
    // 下拉框内容变化
    changeSelect() {
      this.$refs.deptForm.validateField('manager')
    },
    // 确认提交按钮
    hSubmit() {
      // 兜底验证表单提交
      this.$refs.deptForm.validate(valid => {
        // 验证未通过
        if (!valid) return
        // 编辑 -> 调用  更新方法 否则 添加方法
        this.isEdit ? this.updateDepartments() : this.addDepartments()
        // 调用清空数据以及重置的方法
        this.resetForm()
      })

      // 弹框关闭
      // this.$emit('closeDialog')
    },

    // 取消编辑
    hCancel() {
      this.resetForm()
    },

    // 新增部门
    async addDepartments() {
      await addDepartments({ ...this.deptForm, pid: this.parentId })
    },

    // 根据ID修改部门详情
    async updateDepartments() {
      await updateDepartments(this.deptForm)
    },

    // 获取员工基本列表
    async getEmployeeSimple() {
      const res = await getEmployeeSimple()
      // console.log(res)
      this.employees = res.data
    },

    // 根据ID查询部门详情
    async getDepartDetail() {
      if (this.isEdit) { // 判断是否是编辑
        const res = await getDepartDetail(this.parentId)
        // console.log(res)
        this.deptForm = res.data
      }
    },

    // 清空数据以及重置的方法
    resetForm() {
      // 清空数据
      for (const key in this.deptForm) {
        this.deptForm[key] = ''
      }
      // 调用element方法重置
      this.$refs.deptForm.resetFields()
      // 关闭弹框子传父
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>
.el-form {
  padding: 0 60px 0 20px;
}
.el-select {
  width: 100%;
}
</style>
