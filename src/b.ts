import { CairoRingSignature } from "./cairoRingSign";
async function main() {
  const b64_Rs =
    "eyJtZXNzYWdlIjoidGVzdCIsInJpbmciOlsiMjUxMzA5ODIyNzA3MjUzNTE0OTIwNzgwODA5MTcyNDQ5NDY2OTQ2NjIxMDU5NTQyOTY4OTkyMjg1ODU0NDA1NzQ0MjkxODMwMDQxMzcyMyIsIjMxNTAxMTAwNTYzNDQ3Nzk3MDg5MzcwNDQ0MTg0ODc1MzAzMTkyMzA0NjEwMTk1MjczMDE5MzQ3ODI1MDI1MzQ5MDI0NzI3MzcwNDcyMjMiLCIzNTMwNDU1NTMzMDMwNzA4ODU2MzM3ODk4OTM2NDAxMTQzMjEwODE1NDQwODI0NTMzODI5NzE1ODIwNjU2MTgzMzIwMzgyOTA5Mjk3MjIzIl0sImMiOiI1NTEyNzM0MzYzMzUxNzM1Njk3ODgxMzU2NjcwNDY4NTg0MDUyNjI1OTk1NzE0MzcxNjY3MjYyOTk5NTk0NjA0OTcxNjE4NjM1MjcyIiwicmVzcG9uc2VzIjpbIjYwMjQ4MjA3NTE0NDE1OTMxNTY3ODU2NjQwMTcyODkyODM5MjQzNTc4NTkwNjQ4OTA0MDExMTQzMDU3MTQ5MTE1MzkxMTg4NzQ5NiIsIjExOTA0MTAzNDQ0NTAwNjI3NDIzOTg4MDE1MTk1OTA5MDc3NjQ5MzcxNTc4NTQzNDIwMzQ1MTcyNTkyMDIzNDczODg0MTgzNzYwMTYiLCIxNzUwMTA5MDgzMzY5MjA2MDg5MjQ5OTcyMzczMDU2OTExMDcyNDQ5MzMyMjYwMjU1NjY4OTU4NTk3MDIyNDAxNDM5NTcwNzE4MDc3Il0sImN1cnZlIjoie1wiY3VydmVcIjpcIkVEMjU1MTlcIn0ifQ==";
  const rs = CairoRingSignature.fromBase64(b64_Rs);
  const sig = await rs.verify_garaga();
  //console.log("hint0 : ", sig[0].hint.toString());
  //console.log("hint1 : ", sig[1].hint.toString());
  //console.log("hint2 : ", sig[2].hint.toString());
}

main();
