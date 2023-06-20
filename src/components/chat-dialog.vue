<template>
    <div>
        <!-- eslint-disable -->
        <van-dialog
            v-model:show="visible"
            title="更改群公告"
            show-cancel-button
            @confirm="handleConfirmEdit"
        >
            <van-field
                v-model="dialogContent"
                :placeholder="placeholder"
                input-align="center"
            />
        </van-dialog>
        <!-- eslint-disable -->
    </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '请输入群公告'
    },
    title: {
        type: String,
        default: '更改群公告'
    }
});

const visible = ref(props.show);

const dialogContent = ref('');
const emits = defineEmits(['handleConfirmEdit']);
function handleConfirmEdit() {
    emits('handleConfirmEdit', dialogContent.value);
}
watch(
    () => props.show,
    value => {
        visible.value = value;
    }
);
</script>
