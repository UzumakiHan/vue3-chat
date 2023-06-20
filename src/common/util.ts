
export  function handleMsgSort(arr:any, name:string){
    arr.sort((a:any, b:any) => {
        const t1 = new Date(a[name]);
        const t2 = new Date(b[name]);
        return t2.getTime() - t1.getTime();
    });
    return arr;
}

export  function handleMsgSortReserve(arr:any, name:string){
    arr.sort((a:any, b:any) => {
        const t1 = new Date(a[name]);
        const t2 = new Date(b[name]);
        return t1.getTime() - t2.getTime();
    });
    return arr;
}
