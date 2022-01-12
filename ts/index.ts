import * as readline from "node:readline";
import * as fs from "fs/promises";
import { DSCommander } from "dscom";
import { DivineStarData } from "dsdata";

const dsCom = new DSCommander(readline);
const dsData = new DivineStarData(fs);

(async () => {
  let doing: string = "";
  let path = "";
  dsCom
    .defineProgramTitle("[ Divine Star Data Tool ]")
    .defineHelpText(
      `This is a cli for compressing and de-compressing json data.`
    )
    .addParam({
      name: "compress",
      flag: "c",
      desc: "Compress a json file.",
      type: "string",
      required: false,
    })
    .addParam({
      name: "de-compress",
      flag: "d",
      desc: "Decompress a json file.",
      type: "string",
      required: false,
    });
  (await dsCom.initProgramInput())
    .ifParamIsset("d", (value: any, args: any) => {
      doing = "decompressing";
      path = value;
    })
    .ifParamIsset("c", (value: any, args: any) => {
      doing = "compressing";
      path = value;
    });

  if (doing == "compressing" && path != "") {
    try {
      const data = await fs.readFile(path, { encoding: "utf-8" });
      const jsonData = JSON.parse(data);
      const newPath = path.replace(".json", ".dsd");
      await dsData.write(newPath, jsonData);
      dsCom.BR.G.logSleep("Compression was successful.");
    } catch (error: any) {
      dsCom.log(error);
    }
  }

  if (doing == "decompressing" && path != "") {
    try {
      const data = await dsData.read(path);
      const dataRaw = JSON.stringify(data,undefined,1);
      const newPath = path.replace(".dsd", "-new.json");
      await fs.writeFile(newPath, dataRaw);
      dsCom.BR.G.logSleep("De-compression was successful.");
    } catch (error: any) {
      dsCom.log(error);
    }
  }
})();
