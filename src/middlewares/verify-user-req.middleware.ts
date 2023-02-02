/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import config from "config/config";
import { NextFunction, Request, Response } from "express";
import { Logger } from "helpers/logger";
import { verify } from "jsonwebtoken";
import { AuthService } from "../modules/auth/auth.service";
const logger = new Logger("middleware", "verifyRequest")

export interface ITokenData {
  tokenId: string;
  id: string;
  userId: string;
  exp: number;
}

export interface IVerifiedRequest extends Request {
  userId: string;
}

export const verifyRequest = async (req: IVerifiedRequest, res: Response, next: NextFunction) => {
  const authorization = req.header("authorization")?.replace("Bearer ", "");

  logger.info("init verify request")

  try {
    if (!authorization) {
      logger.info("no header")
      return res.status(401).json("no header");
    }

    let decryptedToken;

    try {
      logger.info("decrypting token")
      decryptedToken = verify(authorization, config.JWT_SECRET) as ITokenData;
    } catch (error) {
      logger.info("token decr error", error)
      console.log(error);
      next(error);
    }

    if (!decryptedToken) {
      return res.status(401).json("no token");
    }

    if (decryptedToken.exp < Date.now() / 1000) {
      logger.info("token expired")
      return res.status(401).json("token expired");
    }

     const authService = new AuthService();
     let stored_token


    try {
       stored_token = await authService.findOneBy({
        id: decryptedToken.tokenId
      });
      logger.info("token isRevoked")

    } catch (error) {
      console.error("token isRevoked check error", error);
      next(error);
    }

    if (!stored_token) {
      return res.status(401).json("token revoked");
    }

    req.userId = decryptedToken.id;
    logger.info("success")
    next();
  } catch (error) {
    return res.status(500).json(error.toString());
  }
};
