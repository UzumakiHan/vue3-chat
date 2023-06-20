import axios from 'axios'

import qs from 'qs'
import {IAjaxRes} from '@/typings'

export function get(url:string, data?:any) {
    //console.log(data)
    return new Promise((resolve, reject) => {

        axios.get(url, {

            params: data||{}

        }).then((res) => {

            if (res) {

                //成功回调
                const resData :IAjaxRes= res.data

                resolve(resData);

            }

        }).catch((error) => {

            reject(error);

        })

    })
}
export function post(url:string, data:any) {
    return new Promise((resolve, reject) => {

        axios.post(url, qs.stringify(data), {

            headers: {

                'Content-Type': 'application/x-www-form-urlencoded',

                'Accept': 'application/json'

            }

        }).then((res) => {

            if (res) {

                //成功回调

                const resData = res.data

                resolve(resData);

            }

        }).catch((error) => {

            reject(error);

        })

    })
}