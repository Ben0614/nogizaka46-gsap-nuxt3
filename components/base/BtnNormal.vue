<script lang="ts" setup>

interface IProps {
  content?: string,
  btnColor?: string,
  textColor?: string,
  textHoverColor?: string,
  circleColor?: string,
  time?: string,
}

const props = withDefaults(defineProps<IProps>(), {
  content: '',
  btnColor: '',
  textColor: '#000',
  textHoverColor: '#fff',
  circleColor: 'skyblue',
  time: '0.3',
})

const cssProps = computed(() => {
  return {
    '--text-color': props.textColor,
    '--text-hover-color': props.textHoverColor,
    '--time': `${props.time}s`,
    '--circle-color': props.circleColor,
  }
})

</script>

<script lang="ts">
export default {
  name: 'BtnNormal',
}
</script>

<template>
  <v-btn
    :color="btnColor"
    :style="cssProps"
    class="btnWrap"
    rounded
    variant="outlined"
    large
  >
    <div class="btn-circle" />
    <span class="btn-text">{{ content }}</span>
  </v-btn>
</template>

<style lang="scss" scoped>
.btnWrap {
  position: relative;
  overflow: hidden;

  .btn-circle {
    position: absolute;
    left: 12px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--circle-color);
    z-index: 0;
    transition: var(--time);
  }
  .btn-text {
    position: relative;
    z-index: 1;
    margin-left: 12px;
    color: var(--text-color);
  }

  &:hover .btn-circle {
    transition: var(--time);
    scale: 50;
  }
  &:hover .btn-text {
    color: var(--text-hover-color);
  }
}
</style>
