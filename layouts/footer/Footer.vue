<script lang="ts" setup>
const router = useRouter()
const goToPage = (paegName: string) => {
  router.push({ name: paegName })
}

</script>
<template>
  <v-footer class="v-footer">
    <v-container class="d-flex">
      <h3 :style="{ cursor: 'pointer' }" class="text-h5 text-white" @click="goToPage('index')">
        Home
      </h3>
      <h3 :style="{ cursor: 'pointer' }" class="text-h5 ml-10 text-white" @click="goToPage('joinUs')">
        Join Us
      </h3>
      <h3 :style="{ cursor: 'pointer' }" class="text-h5 ml-10 text-white" @click="goToPage('ohitorisamaTengoku')">
        33rd
      </h3>
    </v-container>
  </v-footer>
</template>

<style lang="scss" scoped>
.v-footer {
  background: rgb(128, 0, 128, 0.7);
  padding: 100px 0;
}
</style>
