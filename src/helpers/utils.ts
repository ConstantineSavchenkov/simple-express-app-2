import { DataSource } from "typeorm";
import axios from "axios";
import { Logger } from "./logger";
const logger = new Logger("utils")

export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
  await ds.destroy();
};

export const fetchCoordinates = async (userId:string, address: string): Promise<{lat: number, lng: number}> => {
  // todo: move URL and token to config 
  try{
    logger.info(userId, "asking distancematrix about address coordinates .. ")
    const response = await axios.get('https://api.distancematrix.ai/maps/api/geocode/json', {
      params: {
        address,
        key: '2hQgUkSvgrR6AjdK1AgInnzzAyxuc',
      },
    });

    // todo: handle different api responses
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const answer = response?.data?.result[0]?.geometry?.location

    if(!answer){
      logger.error(userId, "distancematrix incorrect response")
    }

    logger.info(userId, "user coordinate successfully fetched")

    return answer as {lat: number, lng: number}

  }catch(err){
    logger.error(userId, "can not get response from  distancematrix", err)
     throw err
  }
    
}
