<script lang="ts" setup>

interface IProps {
  dialogVisible: boolean,
  youtubePath: string,
  isMobile: boolean,
}

const props = withDefaults(defineProps<IProps>(), {
  youtubePath: ''
})

const _dialogVisible = computed({
  get () {
    return props.dialogVisible
  },
  set () {
    dialogClose()
  }
})

const emits = defineEmits<{(e:'openVideo', value:boolean):void, (e:'dialogClose', value:boolean):void,}>()

const openVideo = () => {
  emits('openVideo', true)
}
const dialogClose = () => {
  emits('dialogClose', false)
}

</script>

<script lang="ts">
export default {
  name: 'PlayCircle',
}
</script>

<template>
  <div>
    <div class="playCircleWrap" @click="openVideo">
      <p class="text-center text-white mb-1">
        PLAY FULL MOVIE
      </p>
      <div class="circleWhite">
        <div class="circleRed">
          <v-icon color="#fff">
            mdi-play
          </v-icon>
        </div>
      </div>
    </div>
    <v-dialog v-model="_dialogVisible" fullscreen persistent>
      <v-card width="100%" height="100%" :style="{background:'rgba(0,0,0,0.7)'}" class="d-flex justify-center align-center">
        <div class="d-flex" :style="{width:isMobile ? '100%' : '80%',height: isMobile ? '70%' : '80%', maxWidth:'100%'}">
          <!-- 要用%設定iframe 一定要給父層寬高 -->
          <iframe
            width="100%"
            height="100%"
            :src="youtubePath"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
          <div class="closeBtn d-flex flex-column align-center ml-15">
            <v-icon size="60px" color="#fff" @click="dialogClose">
              mdi-close
            </v-icon>
            <span class="text-white">close</span>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss">
.playCircleWrap {
  /* position: absolute;
  z-index: 2;
  bottom: -80px;
  right: 100px; */
  background: transparent;
  cursor: pointer;

  &:hover .circleRed {
    width: 160px;
    height: 160px;
    transition: 0.3s;
  }

  .circleWhite,
  .circleRed {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 160px;
    height: 160px;
    background: #fff;
    border-radius: 50%;
  }

  .circleRed {
    width: 120px;
    height: 120px;
    background: red;
    transition: 0.3s;
  }
}

.closeBtn{
    position: absolute !important;
    top:30px;
    right:30px
  }
</style>
