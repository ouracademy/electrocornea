const test = require("ava");
const { sliceFile, getLastLinesFiles } = require("./slice-file");

test("sliceFile", t => {
  return sliceFile("test-data.csv", 1, 2).then(x =>
    t.deepEqual(x, ["arthur,mauricio\n"])
  );
});

// test("getLastLines", t => {
//   return getLastLinesFiles("test-data.csv", 2).then(x =>
//     t.deepEqual(x, ["persona1,persona2\npersona3,persona3\n"])
//   );
// });
