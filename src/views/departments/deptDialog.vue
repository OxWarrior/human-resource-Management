<template>
  <div>
    <el-form ref="deptForm" :model="deptForm" label-width="100px">
      <el-form-item label="部门名称">
        <el-input v-model="deptForm.name" />
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input v-model="deptForm.code" />
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-select v-model="deptForm.manager" placeholder="请选择部门负责人">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input v-model="deptForm.introduce" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="hSubmit">立即创建</el-button>
        <el-button @click="hCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'DeptDialog',
  data() {
    return {
      deptForm: {
        name: '', // 部门名称
        code: '', // 部门编码，同级部门不可重复
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      }
    }
  },
  methods: {
    // 确认编辑
    hSubmit() {

    },
    // 取消编辑
    hCancel() {

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
