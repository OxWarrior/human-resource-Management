<template>
  <div>
    <!-- 上传 -->
    <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="upload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <!-- 进度条 -->
      <el-progress v-if="showProgress" class="progress" type="circle" :percentage="percentage" />
    </el-upload>
  </div>
</template>

<script>
var COS = require('cos-js-sdk-v5')

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKIDb3GFyShhRvA9sNfjY8TaR4TeaHjyzkHa',
  SecretKey: '70g8NN8ewznNiogJhqkPoysWv88uRjnc'
})
export default {
  name: 'UploadImg',
  data() {
    return {
      imageUrl: '',
      percentage: 0, // 进度条上传进度
      showProgress: false // 展示进度条
    }
  },
  methods: {
    upload(file) {
      // 开始加载后显示进度条
      this.showProgress = true
      // console.log(file)

      // 判断是否选择了上传的文件
      if (file.file) {
        // 调用对象存储提供的上传对象的方法
        cos.putObject({
          Bucket: 'niuniu-1307602665', // 存储对象的名字，必须
          Region: 'ap-beijing', // 存储桶所在地域，必须字段
          Key: file.file.name, // 文件名 必须
          StorageClass: 'STANDARD', // 上传模式，标准模式
          Body: file.file, // 上传文件对象

          onProgress: (progressData) => {
            // 展示进度条进度
            this.percentage = progressData.percent * 100
            // console.log(JSON.stringify(progressData))
          }
        }, (err, data) => {
          // 上传成功以后的回调函数
          // err: 错误对象，如果上传失败，会返回错误对象
          // data: 上传成功以后，腾讯云返回的图片地址
          // console.log(err || data)
          if (err === null && data.statusCode === 200) {
            this.imageUrl = 'https:' + data.Location // 需要拼接协议
          }
          // 上传成功过后隐藏进度条
          this.showProgress = false
        })
      }
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style scoped>
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e4e4e4;
  border-radius: 50%;
  opacity: 0.9;
}
</style>
