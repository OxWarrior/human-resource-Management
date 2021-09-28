<template>
  <div>
    <!-- <div>分配权限功能</div> -->
    <el-tree
      ref="tree"
      :data="permissionList"
      default-expand-all
      show-checkbox
      check-strictly
      :props="{label:'name'}"
      node-key="id"
    />

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { getRoleId, assignPerm } from '@/api/setting'
export default {
  name: 'AssignPermission',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      permissionList: []
    }
  },
  created() {
    // console.log(this.roleId)
    this.getPermissionList()
    this.getRoleId()
  },
  methods: {
    //
    async getRoleId() {
      const res = await getRoleId(this.roleId)
      // console.log(res)
      this.$refs.tree.setCheckedKeys(res.data.permIds)
    },

    // 获取权限列表数据
    async getPermissionList() {
      const res = await getPermissionList()
      this.permissionList = tranListToTreeData(res.data, '0')
    },
    // 取消按钮
    cancelButton() {
      this.$emit('close')
    },

    // 设置权限按钮
    async setRolesBtn() {
      const permIds = this.$refs.tree.getCheckedKeys()
      const res = await assignPerm({ id: this.roleId, permIds })
      this.$message.success(res.message)
      this.$emit('update')
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
