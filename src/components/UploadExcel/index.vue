<template>
  <div>
    <!-- 用户 Browse 按钮，实际上触发的是隐藏域 -->
    <!-- 当选择文件以后，触发 change 事件 -->
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drop excel file here or
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        Browse
      </el-button>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  name: 'UploadExcel',
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      // 接收 表头 和 具体的数据，赋值给 data 中的状态
      this.excelData.header = header
      this.excelData.results = results

      // 开始判断父级是否传递了 onSuccess 事件，如果父级传递了事件，开始将 表头 和 具体的数据 传递给父级
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      // 触发隐藏域
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      console.log(e)
      // 通过事件对象获取到上传的文件信息
      const files = e.target.files
      // 获取到上传的文件
      const rawFile = files[0] // only use files[0]
      // 开始判断是否选择了文件
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      // beforeUpload：是父级传递方法，进行上传之前逻辑的处理
      // 例如：判断文件格式是否正确、判断文件大小
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      // 父级开始进行逻辑处理，返回 true 或者 false
      const before = this.beforeUpload(rawFile)

      // 如果返回 true，说明逻辑通过
      if (before) {
        this.readerData(rawFile)
      }
    },
    // 这个方法开始去读取文件的具体内容，解析成 【表头】和 【具体的数据】
    // rawFile 就是上传的文件
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        // 读取文件的实例
        const reader = new FileReader()
        // onload 理解为将上传的文件全部读取完成
        reader.onload = e => {
          // 读取完成的数据
          const data = e.target.result

          // 下面几行都是 XLSX 插件的文件的内容开始进行解析和读取
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)

          // header 头部：excel 的表头
          // results ：excel 里面的具体数据
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
