<template>
    <div :class="[isRight ? 'chat-receiver' : 'chat-sender']">
        <div>
            <slot name="useravatar" />
        </div>
        <div>{{ props.userName }}</div>
        <div v-if="props.chatMessage">
            <div :class="[isRight ? 'chat-right_triangle' : 'chat-left_triangle']" />
            <span>{{ props.chatMessage }}</span>
        </div>
        <div v-if="props.chatVoiceUrl">
            <div :class="[isRight ? 'chat-right_triangle' : 'chat-left_triangle']" />
            <div
                class="chat-voice"
                @click="playChatVoice(props.chatVoiceUrl)"
            >
                <van-icon
                    :name="voiceIcon"
                    size="18"
                    @click="recordingVoice"
                />
                <span style="margin-left: 6px">{{ props.chatVoiceTime }}s</span>
            </div>
        </div>
        <div id="chat-img">
            <slot name="chatimg" />
        </div>
        <div class="chat-notice">
            <span>
                {{ dayjs(props.chatTime).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import voiceIcon from '@/assets/image/voice-circle.png';

const props = defineProps({
    userAvatar: {
        type: String,
        default: ''
    },
    userName: {
        type: String,
        default: ''
    },
    chatMessage: {
        type: String,
        default: ''
    },
    chatVoiceUrl: {
        type: String,
        default: ''
    },
    chatVoiceTime: {
        type: String,
        default: ''
    },
    chatImg: {
        type: String,
        default: ''
    },
    chatTime: {
        type: String,
        default: ''
    },
    isRight: {
        type: Boolean,
        default: true
    }
});

function playChatVoice(voiceUrl: string) {
    console.log(voiceUrl);
}
function recordingVoice() {
    console.log(1);
}
</script>

<style lang="scss" scoped>
@import '@/scss/chat-page';
</style>
