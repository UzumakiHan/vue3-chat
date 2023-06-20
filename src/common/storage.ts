import localforage from 'localforage';

const storage = localforage.createInstance({
    driver: localforage.LOCALSTORAGE
});

export default {
    setItem(key:string, value:any) {
        return new Promise((resolve, reject) => {
            storage
                .setItem(key, value)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    getItem(key:string) {
        return new Promise((resolve, reject) => {
            storage
                .getItem(key)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    removeItem(key:string) {
        return new Promise((resolve, reject) => {
            storage
                .removeItem(key)
                .then(() => resolve(1))
                .catch(err => reject(err));
        });
    }
};
