/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import config from "config/config";
import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export interface ITokenData {
    id: string;
    email: string;
    iat?: number;
    exp: number;
  }
  export interface IPrivateRequest extends Request {
    tokenData: ITokenData;
  }
  
export const verifyToken = (req: IPrivateRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.header("authorization")?.replace("Bearer ", "");
    try {
      if (!authorizationHeader) {
        return res.status(401).json("no header");
      }
      const decryptedToken = decryptToken(authorizationHeader, config.JWT_SECRET) as ITokenData;
      if (!decryptedToken) {
        return res.status(401).json("no token");
      }
      const hasTokenExpired = isTokenExpired(decryptedToken.exp);
      if (hasTokenExpired) {
        return res.status(401).json("token expired");
      }
  
      req.tokenData = decryptedToken;
      next();
    } catch (error) {
      return res.status(500).json(error.toString());
    }
  };
  

  
export const decryptToken = (token: string, jwtSecret: string): JwtPayload | string => {
    let decrypt;
    try {
      decrypt = verify(token, jwtSecret);
    } catch (error) {
      console.log(error)
      throw error;
    }
  
    return decrypt;
  };
  
  export const isTokenExpired = (tokenExpiration: number): boolean => {
    const currentTime = Date.now() / 1000;
    return tokenExpiration < currentTime;
  };
  
