<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              style="width: 300px"
              type="date"
              class="inputW"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                v-for="item in EmployeeEnum.hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <upload-img ref="imgUrl" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>

        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import EmployeeEnum from '@/constant/employees'
import { getUserDetailById, saveUserDetailById } from '@/api/employees'

export default {
  name: 'UserInfo',
  data() {
    return {
      userInfo: {}, // 个人信息
      EmployeeEnum
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
      // console.log(res.data)
      // 获取用户信息子组件imgUrl得到响应的结果S
      this.$refs.imgUrl.imageUrl = res.data.staffPhoto
    },

    // 保存用户信息
    async saveUser() {
      // 保存更新信息后，将子组件的地址保存到 userInfo 中,再发请求
      this.userInfo.staffPhoto = this.$refs.imgUrl.imageUrl
      const res = await saveUserDetailById(this.userInfo)
      this.$message.success(res.message)
      // 重新渲染页面
      this.getUserDetail()
    }

  }
}
</script>

<style lang="scss" scoped></style>
