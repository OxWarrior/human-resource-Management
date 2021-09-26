<template>
  <el-image :src="src" class="img-container">
    <div slot="error" class="image-slot">
      <img src="./head.jpg" alt="默认头像">
    </div>
  </el-image>
</template>

<script>
export default {
  name: 'ImageHolder',
  props: {
    src: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.img-container {
  border-radius: 50%;
  width: 100px;
  height: 100px;

  img {
    width: 100%;
  }
}
</style>
