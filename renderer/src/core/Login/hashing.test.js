import {hash} from "./hashing"
describe("Hash function", () => {
  test("it should hash the value and return hashed value and salt", () => {
    const input ="testpassword";
    const output = {"password": "dd2c35aab9d621f49487cc4d735ad448204eb2800c9b658bcae4eaf59637286081ef482d5a063aed54a82c105ab0e831790c169cd75d0acc32978cde9ae88a47",
    "salt": "scribe",
    };
    expect(hash(input,"scribe")).toEqual(output);
  });
});