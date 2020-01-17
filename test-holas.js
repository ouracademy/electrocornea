const test = require("ava");

const { getFileLinesNumber, existNewData } = require("./holas");
const { sliceFile, getLastLinesFiles } = require("./art");

test("getFileLinesNumber", t => {
  return getFileLinesNumber("test-data.csv").then(x => t.is(4, x));
});

test("sliceFile", t => {
  return sliceFile("test-data.csv", 1, 2).then(x =>
    t.deepEqual(x, ["arthur,mauricio\n"])
  );
});

test("existNewData", t => {
  return existNewData({ "test-data.csv": 2 }, "test-data.csv").then(x =>
    t.true(x)
  );
});

// test("getLastLines", t => {
//   return getLastLinesFiles("test-data.csv", 2).then(x =>
//     t.deepEqual(x, ["persona1,persona2\npersona3,persona3\n"])
//   );
// });
