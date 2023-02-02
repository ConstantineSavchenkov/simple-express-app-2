import { DataSource } from "typeorm";
import axios from "axios";
import { Logger } from "./logger";
const logger = new Logger("utils");

export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
  await ds.destroy();
};

export const fetchCoordinates = async (userId: string, address: string): Promise<{ lat: number; lng: number }> => {
  // todo: move URL and token to config
  try {
    logger.info(userId, "asking distancematrix about address coordinates .. ");
    const response = await axios.get("https://api.distancematrix.ai/maps/api/geocode/json", {
      params: {
        address,
        key: "2hQgUkSvgrR6AjdK1AgInnzzAyxuc",
      },
    });

    // todo: handle different api responses
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const answer = response?.data?.result[0]?.geometry?.location;

    if (!answer) {
      logger.error(userId, "distancematrix incorrect response");
    }

    logger.info(userId, "user coordinate successfully fetched");

    return answer as { lat: number; lng: number };
  } catch (err) {
    logger.error(userId, "can not get response from  distancematrix", err);
    throw err;
  }
};

export const fetchDestinations = async (
  userId: string,
  origin: { lat: number; lng: number },
  destinations: { lat: number; lng: number }[],
): Promise<{ text: string; value: number }[]> => {
  // "text":"4.7 miles", "value":7563.898
  // todo: move URL and token to config
  try {
    logger.info(userId, "asking distancematrix about closest driving routes.. ");
    const response = await axios.get("https://api.distancematrix.ai/maps/api/distancematrix/json", {
      params: {
        origins: `${origin.lng},${origin.lat}`,
        destinations: destinations.reduce((accum, el) => accum + `${el.lng},${el.lat}|`, ""),
        key: "2hQgUkSvgrR6AjdK1AgInnzzAyxuc",
      },
    });

    // todo: handle different api responses
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    const answer = response?.data?.rows?.map((el: { distance: any }) => el.distance);

    if (!answer) {
      logger.error(userId, "distancematrix incorrect destination response");
    }

    logger.info(userId, "user destinations successfully fetched");

    return answer as { text: string; value: number }[];
  } catch (err) {
    logger.error(userId, "can not get response from  distancematrix", err);
    throw err;
  }
};
