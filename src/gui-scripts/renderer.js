const { ipcRenderer } = require("electron");
const { addTexToFile } = require("../modules/files");
const select = selector => document.querySelector(selector);

let container = select("#messages");
let progressBar = select("#progressBar");
let version = select("#version");

ipcRenderer.on("message", (event, text) => {
    let message = document.createElement("div");
    message.innerHTML = text;
    container.appendChild(message);
});

ipcRenderer.on("version", (event, text) => {
    version.innerText = text;
});

ipcRenderer.on("download-progress", (event, text) => {
    progressBar.style.width = `${text}%`;
});

const { store } = require("../modules/store");
const { pentacamAutocsvPath } = require("../modules/watch");
const { logger, loggingUri } = require("../modules/log");

let folderInput = document.getElementById("form-input");
folderInput.value = pentacamAutocsvPath;

select("#form").addEventListener("submit", evt => {
    evt.preventDefault();

    store.set("pentacamAutocsvPath", folderInput.value);
    alert("Ruta AutoCSV cambiada");
    logger.info(`Ruta AutoCSV cambiada a ${folderInput.value}`);
});

let loggingUriInput = document.getElementById("logging-uri");
loggingUriInput.value = loggingUri;

select("#logging-uri-form").addEventListener("submit", evt => {
    evt.preventDefault();
    store.set("loggingUriInput", loggingUriInput.value);
    alert("Logging URI cambiada");
});

let reportUri = document.getElementById("report-form");
reportUri.value = loggingUri;
select("#report-form").addEventListener("submit", evt => {
    evt.preventDefault();
    store.set("reportUriInput", reportUri.value);
    alert("Report URI cambiada");
});

select("#test-form").addEventListener("submit", evt => {
    evt.preventDefault();
    const files = {
        "ZERNIKE-WFA.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;8.03;7.76;OSA;6.00;6;�m;1.3375;2.489;0.575;2.422;0.918;0.197;0.897;2.180;0.558;2.107;;;;0.02292720;1.257;-0.056;-1.614;-1.312;1.092;0.586;0.025;-0.042;-0.485;0.090;0.030;-0.038;0.271;0.029;-0.065;0.034;-0.025;-0.008;0.034;0.010;-0.012;-0.009;-0.007;-0.005;-0.006;0.003;0.014;0.016;;;;;;;;;;;;;;;;;;;0.00875835;-0.922;-0.099;0.282;0.346;-0.768;-0.072;0.051;-0.014;0.064;0.034;-0.058;0.042;-0.154;0.017;-0.004;0.002;-0.014;0.010;-0.010;-0.003;-0.010;0.010;0.018;-0.011;0.017;-0.004;-0.006;0.013;;;;;;;;;;;;;;;;;;;0.02505328;579.582;-0.143;-1.514;-1.142;0.696;0.583;0.076;-0.055;-0.475;0.132;-0.022;-0.005;0.213;0.048;-0.075;0.039;-0.042;0.001;0.027;0.008;-0.022;-0.002;0.009;-0.015;0.011;-0.000;0.010;0.030;;;;;;;;;;;;;;;;;;OK;0;",
        "ZERNIKE-ELE.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;8.03;7.76;OSA;6.00;6;�m;1.3375;170.865;2.194;170.851;207.886;4.804;207.831;;;;;;;0.06848643;291.939;0.519;-9.134;-3.940;170.551;1.759;0.074;-0.121;-1.503;0.271;0.089;-0.128;1.535;0.093;-0.197;0.102;-0.076;-0.024;0.095;0.031;-0.036;-0.029;-0.020;-0.014;-0.007;0.010;0.041;0.050;;;;;;;;;;;;;;;;;;;0.21935718;349.522;10.410;3.207;-8.644;207.357;1.792;-1.266;0.332;-1.615;-0.859;1.452;-1.053;3.694;-0.421;0.099;-0.048;0.349;-0.247;0.251;0.079;0.252;-0.242;-0.449;0.270;-0.434;0.097;0.158;-0.314;;;;;;;;;;;;;;;;;;No;0.000;0.000;0.000;0.000;OK;0;",
        "SUMMARY-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;OK;0;8.03;7.76;8.03;7.76;42.1;43.5;7.90;42.7;168.4;1.4;8.05;7.59;0.46;-0.22;6.84;6.51;6.84;6.51;-5.9;-6.1;6.67;-6.0;167.0;0.3;6.84;6.20;0.38;-0.23;Zona 8mm(di�metro);503;503;-0.32;0.04;498;-0.39;-0.85;3.6;10.5;22.5;54.7;22;0.24;1.05;1.00;13.0;0.022;7.59;Posible;498;505;529;571;638;726;0;2;6;15;28;46;44.5;1;Service due;BASIC (70700);OK;0;",
        "PACHY-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;42.1;43.5;168.4;1.4;2.80;180;29.0;-0.39;-0.85;0.63;0.90;1.33;116;285;0.4;0.9;1.6;2.5;3.6;5.1;6.6;8.5;10.5;13.1;15.8;19.0;22.5;498;498;499;501;503;505;509;513;518;523;529;536;543;551;561;571;582;594;607;622;638;656;674;694;716;726;;;;;;0;0;0;1;1;2;3;5;6;8;10;11;13;15;16;18;20;22;24;28;32;37;43;50;57;0;0;0;0;0;0;0;0;0;1;1;2;2;3;4;5;6;8;9;11;13;15;17;19;22;25;28;32;35;39;44;46;0;0;0;0;0;0;0;0;779;762;737;712;688;667;648;630;614;599;586;574;564;555;547;539;532;526;521;516;511;508;505;502;500;499;498;498;498;499;500;502;504;507;510;515;519;525;531;538;546;554;563;573;582;592;603;614;625;639;654;670;689;709;730;753;777;801;0;774;754;731;707;685;664;646;628;613;599;586;575;566;557;549;542;535;529;523;519;514;511;508;506;504;503;502;502;502;503;504;506;508;510;513;517;521;526;532;538;546;553;562;571;580;590;600;610;620;632;645;660;676;693;711;731;753;775;795;0;OK;0;",
        "KEIO-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;8.03;7.76;168.4;-1.4;538;546;552;551;536;524;519;511;509;516;523;530;632;639;652;659;668;675;671;648;621;609;599;593;595;591;600;613;625;636;637;632;40.9;41.0;41.3;41.0;40.8;40.8;41.0;42.0;42.9;43.0;42.2;41.3;39.9;40.0;40.4;40.5;40.5;40.6;40.3;39.7;39.8;39.9;40.2;41.0;41.7;42.3;42.7;42.8;42.5;41.7;40.8;40.2;2.16;2.08;2.08;2.15;2.44;2.67;2.76;2.76;2.66;2.51;2.37;2.23;1.49;1.53;1.45;1.37;1.45;1.49;1.61;1.75;1.93;2.08;2.13;2.13;2.08;2.02;1.99;1.95;1.83;1.70;1.60;1.54;OK;0;503;41.8;2.80;78.4;steep;",
        "INDEX-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;8.03;7.76;42.1;43.5;168.4;-1.4;# Posible;22;0.24;1.05;1.00;13.0;0.022;100;7.59;-0.39;-0.85;498;505;529;571;638;726;0;0;2;10;18;32;0;0;0.63;0.90;1.33;116;285;3.6;10.5;22.5;0.075719;92;75;100;100;0;0;1;5;83;0.302;-0.033;OK;0;78.4;steep;44.47;-0.39;-2.15;astigmatismo;;;;;42.73;44.20;44.14;44.03;1.52;12.2;14.4;101.2;10.8;48.8;7.79;6.52;498;;0.0;0.0;0.9;;0.32;3.521;",
        "Fourier-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;OK;0;7.90;0.21;0.44;0.28;260;0.12;168;0.15;168;0.012;",
        "EccSag-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -; 17/08/1982; 25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;0.50;0.53;0.57;-0.00;0.40;0.45;0.47;0.49;0.08;0.23;0.27;0.31;0.47;0.51;0.53;0.55;8.07;8.15;8.27;0.00;8.10;8.16;8.24;8.43;7.61;7.63;7.66;7.74;7.99;8.06;8.16;8.41;8.03;7.76;168.4;0.46;",
        "COR-PWR-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;8.03;7.76;168.4;-1.4;0.46;0.44;3.19;-0.32;0.04;2.80;3.30;29.0;22.1;33.2;28.1;91.8;44.3;271.8;36.9;358.6;29.0;178.6;180.3;503;503;614;552;566;563;498;-0.39;-0.85;0.53;438.4;0.27;258.4;0.57;348.4;0.47;168.4;0.00;6.77;6.61;6.67;6.84;7.01;0.00;0.00;54.7;0.9;BACK;6.92;6.84;6.79;6.79;7.11;6.89;6.66;6.48;6.67;6.75;6.76;6.59;6.47;6.74;6.89;6.80;6.64;6.40;6.21;6.34;6.59;6.90;6.87;6.78;6.73;6.62;6.63;6.81;6.88;6.86;6.66;6.49;6.39;6.31;6.35;6.51;6.75;7.09;7.17;7.15;7.21;7.21;7.21;7.07;6.99;7.03;6.99;6.84;6.68;6.53;6.47;6.35;6.36;6.37;6.39;6.60;6.89;;;;;;7.44;7.59;7.51;7.37;7.30;7.19;7.08;7.11;7.17;6.82;6.59;6.51;6.45;6.53;6.59;6.72;6.93;7.12;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;",
        "CorneoScleral-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;OK;0;42.1;43.5;168.4;1.4;0.46;503;12.9;-0.47;-0.09;;;;14.0;;;;;;;;;300;;;14.5;;;;;;;;;300;;;15.0;;;;;;;;;300;;;15.0;0;0;0;0;0;0;0;0;300;;",
        "CHAMBER-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;8.03;7.76;168.4;-1.4;0.46;0.44;3.19;-0.32;0.04;2.80;3.30;29.0;22.1;33.2;28.1;91.8;44.3;271.8;36.9;358.6;29.0;178.6;180.3;503;503;614;552;566;563;498;-0.39;-0.85;0.53;438.4;0.27;258.4;0.57;348.4;0.47;168.4;0.00;7.90;7.91;7.96;8.05;8.23;8.42;0.00;54.7;0.9;-1.4;169.0;-1.5;167.5;-1.6;167.5;-1.9;172.1;-2.4;167.9;;;;;Q, Zona 8mm(di�metro);-0.22;-0.23;78.4;steep;OK;0;12.9;1468;41.88;43.03;169.3;-0.47;-0.09;",
        "BADisplay-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;OK;0;astigmatismo;;;;;42.1;43.5;168.4;1.4;Myopic/Normal;0.35;-0.33;-0.04;1.24;1.05;2.35;1.40;7.95;6.67;0.63;116.2;1.33;285.0;0.90;791;373;553;498;0.93;IT;",
        "AXLScan_Result-LOAD.CSV":
            "Chocano Lopez;Silvana;311958ajs -;17/08/1982;25/03/2015;20:40:09;Dcha.;(25) Esc�ner 3D;;OK;0;8.03;7.76;42.1;43.5;168.4;78.4;3.30;503;498;12.9;�No hay datos!;3;;;;;;;;;;;;;;;;;;;;;;"
    };

    // for (file of Object.keys(files)) {
    //     addTexToFile(`${folderInput.value}/${file}`, `\n${files[file]}`);
    // }
    for (file of Object.keys(files)) {
        addTexToFile(
            `${folderInput.value}/${file}`,
            `\n${files[file]}`.replace("Dcha.;", "Izq.;")
        );
    }
});
