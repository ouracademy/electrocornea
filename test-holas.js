const test = require("ava");

const { getFileLinesNumber, existNewData } = require("./holas");
const { sliceFile, getLastLinesFiles } = require("./slice-file");

test("getFileLinesNumber", t => {
  return getFileLinesNumber("test-data.csv").then(x => t.is(4, x));
});

test("sliceFile", t => {
  return sliceFile("test-data.csv", 1, 2).then(x =>
    t.deepEqual(x, ["arthur,mauricio\n"])
  );
});

test("existNewData() on exist new data", t => {
  return existNewData(
    { "new_data_basic_flow.csv": 2 },
    "test_data/new_data_basic_flow.csv"
  ).then(x => t.true(x));
});

test("existNewData() on not new data", t => {
  return existNewData(
    { "new_data_basic_flow.csv": 3 },
    "test_data/new_data_basic_flow.csv"
  ).then(x => t.false(x));
});

test("existNewData() on empty header", t => {
  return existNewData(
    { "new_data_empty.csv": 0 },
    "test_data/new_data_empty.csv"
  ).then(x => t.false(x));
});

// test("getLastLines", t => {
//   return getLastLinesFiles("test-data.csv", 2).then(x =>
//     t.deepEqual(x, ["persona1,persona2\npersona3,persona3\n"])
//   );
// });
