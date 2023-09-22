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

const proofId = "123";
const proverAddress = "rNxp4h8apvRis6mJf9Sh8C6iRxfrDWN7AV";
const validAtBlock = "12345";
const signingSoftware = "gemWallet";
const amount = "123";
const currency = "XRP";
const message: Message = {
  proofId,
  proverAddress,
  validAtBlock,
  signingSoftware,
  amount,
  currency,
};

const p0: P0 = {
  messsage: message,
  owningAddress: "rAPERVgXZavGgiGv6xBgtiZurirW2yAmY",
  params: {
    alpha:
      "105546261164777430933799347045207257055591877348517300042194085010751223318528n",
    c: "74186039275583178113989603613492261973686677670503135568411751755447522397654n",
    p: "99808316686213984418558947773324242732980186384146832132234797338278246000221n",
  },
};

// display p0 as a json string
console.log(JSON.stringify(p0, null, 2));
