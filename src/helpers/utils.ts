import fs from "fs";
import path from "path";
import { DataSource } from "typeorm";

export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
  await ds.destroy();
};

function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
  return typeof obj === "undefined" || obj === null;
  }
  export {
  isNullOrUndefined
};
  
//# Small code exercises
//1. Please write a function to transform array to containing number and strings.
export const transformStringToNumber = (stringArray: string[])=>{
  const numberArray = []
  for (let i = 0; i < stringArray.length; i++){
    if(isNaN(parseInt(stringArray[i]))){
      numberArray.push(stringArray[i])
      continue;
    }
    numberArray.push(parseFloat(stringArray[i]));
  }  
  console.log(numberArray)
}

//2. Please write a function to return an array of all `.csv` files in folder `/files`
export const findFilesInDir = (folderPath:string, extension:string): string[] => {

    let results: string[] = [];

    if (!fs.existsSync(folderPath)){
        console.log("no dir ", folderPath);
        return[];
    }

    const files=fs.readdirSync(folderPath);
    for(let i=0;i<files.length;i++){
        const filename=path.join(folderPath, files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            results = results.concat(findFilesInDir(filename, extension));
        }
        else if (filename.indexOf(extension)>=0) {
            console.log(`-- file with ${extension} number ${i} : `, filename);
            results.push(filename);
        }
    }
    return results;
}

// 3. Please write a function to return if a string contains a digit
export const containsNumbers =(text:string) =>{
  const hasNumber = Boolean(text.match(/\d/));
  console.log(`'${text}' -> '${hasNumber}'`)
  return hasNumber;
}
