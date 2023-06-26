import {showImagePreview} from 'vant';
export function handlePreviewImg(img: string) {
    const imglist = [];
    imglist.push(img);
    showImagePreview(imglist);
}
