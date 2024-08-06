import csvParser from "csv-parser";
import fs from "fs";

interface Row {
  text: string;
}

async function parseCSV(filePath: string): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    const rows: Row[] = [];

    fs.createReadStream(filePath)
      .pipe(
        csvParser({
          separator: ",",
          mapHeaders: ({ header }) => header.toLowerCase(),
        })
      )
      .on("data", (row) => {
        rows.push(row);
      })
      .on("error", (err) => {
        console.log("Error" + err);
        reject(err);
      })
      .on("end", () => {
        resolve(rows);
      });
  });
}

const seed = async () => {
  const data = await parseCSV("./training_data.csv");
  console.log(data);
};

seed();
