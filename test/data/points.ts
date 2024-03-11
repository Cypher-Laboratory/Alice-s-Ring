import { Point } from "../../src";
import { hash } from "../../src/utils";
import { SECP256K1, ED25519 } from "./curves";
import * as ed from "../../src/utils/noble-libraries/noble-ED25519";
import { sha512 } from "@noble/hashes/sha512";
import { derivePubKey } from "../../src/curves";
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export const privateKey = [
  // len = 10
  BigInt(
    "0x" +
      hash(
        "9705133229738916056634998425092693862103756529453934308865022401716",
      ),
  ),
  BigInt(
    "0x" +
      hash(
        "4318861583892663632806519796230532373192103809994855662126970712647",
      ),
  ),
  BigInt(
    "0x" +
      hash(
        "10579313822749735210413161819590856590862794332884737964405659760314",
      ),
  ),
  BigInt(
    "0x" +
      hash(
        "68161763693580201300943912337684944208977417910319730619449844563940",
      ),
  ),
  BigInt(
    "0x" +
      hash(
        "8634119974408146311716701391246969535999260973264641793056688235068",
      ),
  ),
  BigInt(
    "0x" +
      hash(
        "9113896929353355328784107873437923947336811150190804863481514955668",
      ),
  ),
  BigInt(
    "0x" +
      hash(
        "1163688883508814427224876604206982990192180583578734395491607304583",
      ),
  ),
  BigInt(
    "0x" +
      hash(
        "7258859556452483793061624179811700710650744725464309019396316674516",
      ),
  ),
  BigInt(
    "0x" +
      hash(
        "9414050615748193132357451564295068856153644556595859905926493518530",
      ),
  ),
  BigInt(
    "0x" +
      hash(
        "3466046328795217128129578311582509952671098725444443823446053020103",
      ),
  ),
];

/* -------------SIGNER KEYS------------- */
export const signerPrivKey = ed.utils.getExtendedPublicKey(
  BigInt(
    "0x" +
      hash(
        "4705133659738916056634998425092693862103756529453934308865022401716",
      ),
  ).toString(16),
).scalar;

export const signerPubKey_secp256k1 = derivePubKey(signerPrivKey, SECP256K1);
export const signerPubKey_ed25519 = derivePubKey(signerPrivKey, ED25519);
/* --------------------------------------- */

export const zeroPivateKey = 0n;

export const publicKeys_secp256k1 = privateKey.map((privKey) =>
  SECP256K1.GtoPoint().mult(privKey),
).sort(// sort by x ascending
  (a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0,
);


export const publicKeys_ed25519 = privateKey.map((key) => {
  return ED25519.GtoPoint().mult(
    ed.utils.getExtendedPublicKey(key.toString(16)).scalar,
  );
}).sort(// sort by x ascending
  (a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0,
);
console.log()

export const valid_coordinates_ed25519: [bigint, bigint] = [
  18692818425924056284077361575286289503472634786144083983260241244353871635402n,
  25130982270725351492078080917244946694662105954296899228585440574429183004137n,
];
export const valid_coordinates_secp256k1: [bigint, bigint] = [
  30558939714202291090863029727820829993227403204286654734430544819396481281155n,
  46835398937525857424678912804713110217248423408711238708095319128726301404767n,
];

export const valid_string_point_ed25519 = new Point(
  ED25519,
  valid_coordinates_ed25519,
).toString();
export const valid_string_point_secp256k1 = new Point(
  SECP256K1,
  valid_coordinates_secp256k1,
).toString();

export const invalid_string_point_secp256k1 =
  valid_string_point_secp256k1.slice(
    0,
    valid_coordinates_secp256k1.length - 3,
  ) +
  valid_string_point_secp256k1.slice(valid_coordinates_secp256k1.length - 2);
export const invalid_string_point_ed25519 =
  valid_string_point_ed25519.slice(0, valid_coordinates_ed25519.length - 3) +
  valid_string_point_ed25519.slice(valid_coordinates_ed25519.length - 2);

// invalid points
export const idPoint_secp256k1 = new Point(SECP256K1, [0n, 0n], false);
export const idPointX_secp256k1 = new Point(SECP256K1, [0n, 1n], false);
export const idPointY_secp256k1 = new Point(SECP256K1, [1n, 0n], false);

export const idPoint_ed25519 = new Point(ED25519, [0n, 0n], false);
export const idPointX_ed25519 = new Point(ED25519, [0n, 1n], false);
export const idPointY_ed25519 = new Point(ED25519, [1n, 0n], false);

export const randomC =
  4663621002712304654134267866148565564648521986326001983848741804705428459856n;

export const randomResponses = [
  // len = 10
  48369350950340794820993823831946226298689742469731910982201300697869810797167n,
  100449888915666473051591594355617005748335101020946797451756200381355427535883n,
  19461404851285363324410789626364457413244489434633287456900091567454654616320n,
  53706853720020248352568631504839791148236861114913686643543396106643678246398n,
  74646179906956108563362909297257464082782829881933463992813659851286428809739n,
  71535436363134726009492680326940110837538521870697878865667548074638456561387n,
  52195487097652879051304573687526354962305495615151447282113947599888977837532n,
  52196047653693565153635186992550383607134727307386493484715442322026234573447n,
  74091150300363372893247715377341913096446778788031541336871110197911481146359n,
  29896340703093012145909022712244181911546003092922234877958412520719305671945n,
];

