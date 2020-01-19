const { relativePath: _ } = require("./relative-path");

const test = require("ava");
const { getFileLinesNumber, existNewData } = require("./exist-new-data");

test("getFileLinesNumber", t => {
  return getFileLinesNumber(_("test-data.csv")).then(x => t.is(4, x));
});

test("existNewData() on exist new data", t => {
  return existNewData(
    { "new_data_basic_flow.csv": 1 },
    _("test_data/new_data_basic_flow.csv")
  ).then(x => t.true(x));
});

test("existNewData() on not new data", t => {
  return existNewData(
    { "new_data_basic_flow.csv": 3 },
    _("test_data/new_data_basic_flow.csv")
  ).then(x => t.false(x));
});

test("existNewData() on empty header", t => {
  return existNewData(
    { "new_data_empty.csv": 1 },
    _("test_data/new_data_empty.csv")
  ).then(x => t.false(x));
});
