<script lang="ts" setup>
interface IProps {
  iconName: string,
  btnColor?: string,
  btnHoverColor?: string,
  iconColor?: string,
  iconHoverColor?: string,
  time?: string,
  fnName?: string, // 點擊後要調用的function name
}

const props = withDefaults(defineProps<IProps>(), {
  btnColor: '#fff',
  btnHoverColor: 'gray',
  iconColor: '#000',
  iconHoverColor: '#fff',
  time: '0',
  fnName: '',
})

const cssProps = computed(() => {
  return {
    '--btn-color': props.btnColor,
    '--btn-hover-color': props.btnHoverColor,
    '--icon-color': props.iconColor,
    '--icon-hover-color': props.iconHoverColor,
    '--time': `${props.time}s`,
  }
})

const emits = defineEmits<{(e: string):void}>()

const handleClick = () => {
  emits(props.fnName)
}

</script>

<script lang="ts">
export default {
  name: 'BtnCircle',
}
</script>

<template>
  <v-btn
    width="50"
    height="50"
    icon
    :style="cssProps"
    class="btnCircle"
    @click="handleClick"
  >
    <v-icon size="30">
      {{ iconName }}
    </v-icon>
  </v-btn>
</template>

<style lang="scss" scoped>
.btnCircle {
  margin: 0 0 8px;
  background-color: var(--btn-color);
  transition: var(--time);
  .v-btn__content {
    .v-icon {
      color: var(--icon-color);
      transition: var(--time);
    }
  }

  &:hover {
    background-color: var(--btn-hover-color);
    transition: var(--time);
    .v-icon {
      color: var(--icon-hover-color);
      transition: var(--time);
    }
  }
}
</style>
