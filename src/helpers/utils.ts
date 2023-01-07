import { DataSource } from "typeorm";

export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
  await ds.destroy();
};
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
