import assert from "assert";
import { describe, test } from "@jest/globals";
import { Solution1, Solution2, Solution3 } from "./codeExercises";

describe("fun exercises ", () => {
  test("should work", () => {
    assert.deepEqual(Solution1(["Aitäh", "1984", "Terviseks", "15.5"]), ["Aitäh", 1984, "Terviseks", 15.5]);
    assert.deepEqual(Solution1(["Kus?", "parem", "Mida?", "-1"]), ["Kus?", "parem", "Mida?", -1]);

    assert.deepEqual(Solution2(), ["export.csv", "import.csv"]);

    assert.equal(Solution3("sünnipäevanädalalõpupeopärastlõunaväsimatus"), false);
    assert.equal(Solution3("sõber1"), true);
    assert.equal(Solution3("6na9ine"), true);
    assert.equal(Solution3("2022"), true);

    console.log("Yeaaah");
  });
});
