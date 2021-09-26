<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </div>

        <el-table :data="permissionList" row-key="id" border>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="code" label="标识" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- type为1是添加权限，2是按钮权限 -->
              <el-button v-if="scope.row.type === 1" type="text" @click="addPermission(2,scope.row.id)">添加</el-button>
              <el-button type="text" @click="editPerHander(scope.row.id)">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 放置一个弹层 用来编辑新增节点 -->
        <el-dialog title="新增权限点" :visible="showDialog" @close="btnCancel">
          <!-- 表单 -->
          <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
            <el-form-item label="权限名称" prop="name">
              <el-input v-model="formData.name" style="width:90%" />
            </el-form-item>
            <el-form-item label="权限标识" prop="code">
              <el-input v-model="formData.code" style="width:90%" />
            </el-form-item>
            <el-form-item label="权限描述">
              <el-input v-model="formData.description" style="width:90%" />
            </el-form-item>
            <el-form-item label="开启">
              <el-switch
                v-model="formData.enVisible"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
          </el-form>
          <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
              <el-button size="small" type="primary" @click="addPermissionSubmit">确定</el-button>
              <el-button size="small" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission, updatePermission, getPermissionDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    // 同级部门权限名称不能重名
    const validName = (rule, value, callback) => {
      // 筛选出当前pid相同的部门
      let existNameList = this.originList.filter(item => item.pid === this.formData.pid)

      if (this.isEdit) {
        // 编辑状态，筛选出当前pid相同的部门并且不包含自身
        existNameList = this.originList.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id)
      }

      // 遍历统计部门，name和value比较
      existNameList.map(item => item.name).includes(value) ? callback(new Error(`权限名称${value}已存在`)) : callback()
    }

    // 整体不允许部门标识相同
    const validCode = (rule, value, callback) => {
      let existCodeList = this.originList

      if (this.isEdit) {
        existCodeList = this.originList.filter(item => item.id !== this.formData.id)
      }

      existCodeList.map(item => item.code).includes(value) ? callback(new Error(`权限标识${value}已存在`)) : callback()
    }

    return {
      permissionList: [], // 权限管理列表数据
      showDialog: false, // 是否显示弹层
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ]
      },
      isEdit: false, // 判断编辑或添加
      originList: []
    }
  },
  created() {
    // 调用获取权限列表方法
    this.getPermissionList()
  },
  methods: {
    // 提交确认
    addPermissionSubmit() {
      // 兜底验证
      this.$refs.perForm.validate(async valid => {
        if (!valid) return
        // 判断提交时是添加还是编辑
        this.isEdit ? await this.editSubmit() : await this.addSubmit()
        // 关闭弹窗
        this.showDialog = false
        this.getPermissionList()
      })
    },

    // 确认添加逻辑
    async addSubmit() {
      // 添加API
      const res = await addPermission(this.formData)
      this.$message.success(res.message)
      // // 关闭弹窗
      //   this.showDialog = false
      //   this.getPermissionList()
    },

    // 确认编辑逻辑
    async editSubmit() {
      const res = await updatePermission(this.formData)
      this.$message.success(res.message)
      // // 关闭弹窗
      // this.showDialog = false
      // this.getPermissionList()
    },

    // 编辑按钮
    async editPerHander(id) {
      this.isEdit = true
      this.showDialog = true
      const res = await getPermissionDetail(id)
      this.formData = res.data
    },

    // 添加按钮
    addPermission(type, pid) {
      // 显示弹框
      this.showDialog = true
      // 添加按钮判断
      this.isEdit = false
      // 赋值区分当前是按钮权限还是
      this.formData.type = type
      this.formData.pid = pid
    },

    // 关闭弹框
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    // 获取表格数据
    async getPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      // 处理返回数据，只需要id,name,code,pid。同级不能出现相同名称，全部code不能相同
      this.originList = res.data.map(({ id, name, code, pid }) => ({
        id,
        name: name.trim(),
        code,
        pid
      }))
      this.permissionList = tranListToTreeData(res.data, '0')
    }
  }
}
</script>

<style lang="scss" scoped></style>
