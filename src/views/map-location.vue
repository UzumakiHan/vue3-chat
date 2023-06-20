<template>
    <div>
        <ChatNavBar
            title="选择位置"
            :nav-type="2"
        />
        <div>
            <BMap
                ref="map"
                height="100vh"
                enable-scroll-wheel-zoom
                ak="GYwo5IizBkimRTthD2Pj9IqfB2uVSms0"
                :plugins="['TrackAnimation']"
                :center="center || undefined"
                @click="handleGetLocation"
                @initd="get"
            >
                <BMarker :position="center" />
                <BZoom />
                <BLocation />
            </BMap>
            {{ handleSave(selectInfo?.value?.address) }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {
    BMap,
    BZoom,
    BLocation,
    useBrowserLocation,
    BMarker,
    usePointGeocoder,
    PointGeocoderResult
} from 'vue3-baidu-map-gl';
import {useUserStore} from '@/store/user';
import ChatNavBar from '@/components/chat-nav-bar.vue';
const userStore = useUserStore();
const center = ref();
const selectInfo = ref();
interface Tmap {
    latlng: {
        lat: number;
        lng: number;
    };
}
function handleGetLocation(e: Tmap) {
    center.value = e.latlng;
    const {get, result} = usePointGeocoder<PointGeocoderResult>();
    get(center.value);
    selectInfo.value = result;
}

function handleSave(address: string) {
    userStore.adress = address;
}
const map = ref();
const {get, location} = useBrowserLocation(null, async () => {
    center.value = location.value.point;
    map.value.resetCenter();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {country, province, city, district, street, street_number} = location.value.address;
    const adress = `${country}${province}${city}${district}${street}${street_number}`;
    setTimeout(() => {
        userStore.adress = adress;
    }, 100);
});
</script>
