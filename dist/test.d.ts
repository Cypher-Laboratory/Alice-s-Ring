interface Message {
    proofId: string;
    proverAddress: string;
    validAtBlock: string;
    signingSoftware: string;
    amount: string;
    currency: string;
}
interface Params {
    alpha: string;
    c: string;
    p: string;
}
interface P0 {
    messsage: Message;
    owningAddress: string;
    params: Params;
}
declare const proofId = "123";
declare const proverAddress = "rNxp4h8apvRis6mJf9Sh8C6iRxfrDWN7AV";
declare const validAtBlock = "12345";
declare const signingSoftware = "gemWallet";
declare const amount = "123";
declare const currency = "XRP";
declare const message: Message;
declare const p0: P0;
