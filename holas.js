const { job } = require("cron");
const each_10_minutes = f => job("*/10 * * * *", f, null, true);

const linea_actual_por_archivo = {
  "summary-load.csv": 0,
  "keio-load.csv": 0
};

const get_file_lines_number = file_name => 0; // TODO: implement
const exist_new_data = file_name =>
  linea_actual_por_archivo[file_name] !== get_file_lines_number(file_name);

const update_lines_file = (archivo, size) =>
  (linea_actual_por_archivo[archivo] = size);

const get_files_from = dir => []; //TODO: implement

each_10_minutes(() => {
  for (let [file, size] of Object.entries(linea_actual_por_archivo)) {
    if (exist_new_data(file)) {
      leer_lineas((since = number_lines), (path = archivo));
      update_lines_file();
    }
  }
});
