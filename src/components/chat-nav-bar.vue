<template>
    <ConfigProvider :theme-vars="navTheme">
        <div v-if="hasLeft">
            <NavBar
                v-if="navType === 1"
                :title="title"
                :fixed="true"
                :z-index="99"
            />
            <NavBar
                v-else
                :title="title"
                :z-index="99"
                :fixed="true"
                left-text="返回"
                left-arrow
                @click-left="handleClickLeft"
            >
                <template
                    v-if="hasRight"
                    v-slot:right
                >
                    <Icon
                        :name="iconName"
                        size="18"
                        @click="handleClickRight"
                    />
                    <Icon
                        v-if="isSave"
                        name="success"
                        size="18"
                        style="margin-left: 10px"
                        @click="handleSave"
                    />
                </template>
            </NavBar>
        </div>
        <div v-else>
            <NavBar
                v-if="navType === 1"
                :title="title"
                :z-index="99"
                :fixed="true"
            />
            <NavBar
                v-else
                :title="title"
                :z-index="99"
                :fixed="true"
            >
                <template
                    v-if="hasRight"
                    v-slot:right
                >
                    <Icon
                        :name="iconName"
                        size="18"
                        @click="handleClickRight"
                    />
                </template>
            </NavBar>
        </div>
    </ConfigProvider>
</template>

<script setup lang="ts">
import {ConfigProvider, NavBar, Icon} from 'vant';
import {useRouter} from 'vue-router';
const router = useRouter();
defineProps({
    navType: {
        type: Number,
        default: 1
    },
    isSave: {
        type: Boolean,
        default: false
    },
    hasLeft: {
        type: Boolean,
        default: true
    },
    hasRight: {
        type: Boolean,
        default: false
    },
    iconName: {
        type: String,
        default: 'more'
    },
    navTheme: {
        type: Object,
        default: () => {
            return {
                ['nav-bar-background']: '#1989fa',
                ['nav-bar-title-text-color']: '#ffffff',
                ['nav-bar-text-color']: '#ffffff',
                ['nav-bar-icon-color']: '#ffffff'
            };
        }
    },
    title: {
        type: String,
        default: '标题'
    }
});
const emits = defineEmits(['handleClickRight', 'handleSave']);
function handleClickLeft() {
    router.go(-1);
}
function handleClickRight() {
    emits('handleClickRight');
}
function handleSave() {
    emits('handleSave');
}
</script>
