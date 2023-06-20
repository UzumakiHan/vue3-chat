<template>
    <div class="face-comp">
        <ul
            class="facelist"
            :style="{bottom: props.faceBottom + 'px'}"
        >
            <li
                v-for="(item, index) in faceList"
                :key="index"
                @click.stop="handleGetCurrentFace(index)"
            >
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {emojData} from '@/common/constant';
import {IEmojiData} from '@/typings';
const props = defineProps({
    faceBottom: {
        type: Number,
        default: -35
    }
});
const emojDataJson: IEmojiData = emojData;

const faceList = ref<Array<string>>([]);
const emits = defineEmits(['handleGetCurrentFace']);

// 表情发送
function handleGetCurrentFace(index: number) {
    for (const i in faceList.value) {
        if (index === Number(i)) {
            emits('handleGetCurrentFace', faceList.value[index]);
        }
    }
}
// 获取所有表情
function handleFaceContent() {
    faceList.value = [];
    for (const i in emojDataJson) {
        const emoj: string = emojDataJson[i].char;
        faceList.value.push(emoj);
    }
}
onMounted(() => {
    handleFaceContent();
});
</script>

<style lang="scss" scoped>
.face-comp {
    .facelist {
        position: absolute;
        z-index: 10;
        right: 0;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        background: #fff;
    }
}
</style>
