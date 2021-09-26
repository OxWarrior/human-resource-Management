<template>
  <div>
    <!-- 渲染角色列表 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="addRoles">确定</el-button>
        <el-button size="small" @click="cancleDialog">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRoles } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      roleIds: [], // 复选框选中状态
      roleList: [] // 复选框数据
    }
  },
  created() {
    // 调用获取所有角色方法
    this.getRoles()
    // 调用获取员工的基本信息方法
    this.getUserDetail()
  },
  methods: {
    // 给员工添加角色
    async addRoles() {
      // 给员工分配角色API
      const res = await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$message.success(res.message)
      this.$emit('close')
    },

    cancleDialog() {
      // 关闭弹窗
      this.$emit('close')
    },

    // 获取所有角色
    async getRoles() {
      const res = await getRoles()
      // console.log(res)
      this.roleList = res.data.rows
    },

    // 获取员工的基本信息
    async getUserDetail() {
      const res = await getUserDetailById(this.userId)
      // console.log(res)
      this.roleIds = res.data.roleIds ? res.data.roleIds : []
    }
  }
}
</script>

<style scoped>
.footer {
  margin-top: 30px;
}
</style>
