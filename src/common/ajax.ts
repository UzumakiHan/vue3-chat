import axios from 'axios';

import qs from 'qs';
import {showLoadingToast, closeToast} from 'vant';
import {IAjaxRes} from '@/typings';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function get(url: string, data?: any) {
    // console.log(data)
    return new Promise((resolve, reject) => {
        showLoadingToast({});
        axios
            .get(url, {
                params: data || {}
            })
            .then(res => {
                if (res) {
                    closeToast();
                    // 成功回调
                    const resData: IAjaxRes = res.data;

                    resolve(resData);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function post(url: string, data: any) {
    return new Promise((resolve, reject) => {
        showLoadingToast({});

        axios
            .post(url, qs.stringify(data), {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'application/x-www-form-urlencoded',

                    Accept: 'application/json'
                }
            })
            .then(res => {
                if (res) {
                    closeToast();

                    // 成功回调

                    const resData = res.data;

                    resolve(resData);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}
