export async function getAllTokensUserOrders(id){
    let obj = {
        id
    }
    return Promise.resolve(obj);
}
export async function getPairRecentTrades(id,info){
    let obj = {
        id,
        info,
    }
    return Promise.resolve(obj);

}
export async function getMarketGraph24hs(id,one,two){
    let obj = {
        id,
        one,
        two
    }
    return Promise.resolve(obj)
}
export async function getPairs(){
    return Promise.resolve({});
}