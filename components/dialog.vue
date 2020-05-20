/**
* Диалоговое окно
*/
<template>
  <dir class="confirm-overlay">
    <div class="confirm-box">
      <slot />
    </div>
  </dir>
</template>

<script>
export default {
  name: 'Dialog',
}
</script>

<style lang='scss' scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: rgba(128, 128, 128, 0.7);
  z-index: 11;
}

.confirm-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 350px;
  height: 220px;
  padding: 20px;
  background-color: white;
  text-align: center;
}

.closer {
  top: 16px;
  right: 10px;
}
</style>
