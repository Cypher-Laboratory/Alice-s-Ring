import { CairoRingSignature } from "./cairoRingSign";
async function main() {
  const b64_Rs =
    "eyJtZXNzYWdlIjoidGVzdCIsInJpbmciOlsiMjUxMzA5ODIyNzA3MjUzNTE0OTIwNzgwODA5MTcyNDQ5NDY2OTQ2NjIxMDU5NTQyOTY4OTkyMjg1ODU0NDA1NzQ0MjkxODMwMDQxMzcyMyIsIjM1MzA0NTU1MzMwMzA3MDg4NTYzMzc4OTg5MzY0MDExNDMyMTA4MTU0NDA4MjQ1MzM4Mjk3MTU4MjA2NTYxODMzMjAzODI5MDkyOTcyMjMiXSwiYyI6IjU0MDAwNjEzOTAwOTE0NDI5OTc2NjE1NTA3NjIwMDMxNTg0Mzg1NTI0NTQ5Njg4NjYyMTkyMjI5ODc2ODMxNzY4MDI4NzE1MTAxNDEiLCJyZXNwb25zZXMiOlsiNjg4NDY1MTkyMTcwOTY3MzMzODk1NDg5NDExNTMzMzY2NDMxMDIyMTk3NDY2NTEyNjk2NDgwNTEzNzQxMTYyOTU4ODI3ODg1MDAwNyIsIjQzNTUwMjc0MzA2MTY3NTI1NDA3MjIyOTQ5MDk5OTcwMDcyOTIzMDIyMjEyNzQyMDk5OTA4OTUzODc2MzU1NzA2MDA0ODIzMjg5NTciXSwiY3VydmUiOiJ7XCJjdXJ2ZVwiOlwiRUQyNTUxOVwifSJ9";
  const rs = CairoRingSignature.fromBase64(b64_Rs);
  console.log(rs);
  // for (const p of rs.getRing()) {
  //  console.log(p.toU384Coordinates());
  //}

  const sig = await rs.getCallDataStruct();
  console.log(sig.hints[0].toString());
  console.log(sig.hints[1].toString());
  //console.log("hint0 : ", sig[0].hint.toString());
  //console.log("hint1 : ", sig[1].hint.toString());
  //console.log("hint2 : ", sig[2].hint.toString());
}

main();
