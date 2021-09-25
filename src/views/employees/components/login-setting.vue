<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :model="userInfo"
      :rules="rules"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateUser">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 调用获取员工基本信息
    this.getUserDetail()
  },
  methods: {
    // 获取员工基本信息
    async getUserDetail() {
      const res = await getUserDetailById(this.$route.query.id)
      this.userInfo = res.data
    },

    // 更新用户信息
    updateUser() {
      this.$refs.userForm.validate(async valid => {
        if (!valid) return
        // 保存员工基本信息API
        const res = await saveUserDetailById(this.userInfo)
        this.$message.success(res.message)
        this.getUserDetail()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
