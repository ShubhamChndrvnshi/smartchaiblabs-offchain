import { NextFunction, Request, Response } from 'express';
import * as OAuth2Server from 'oauth2-server';
import oauth from '../../config/oauth';
import AuthService from './service';
import HttpError from '../../config/error';
import { IUserModel } from '../User/model';

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function signup(req: Request, res: Response, next: NextFunction): Promise < void > {
    try {
        const user: IUserModel = await AuthService.createUser(req.body);

        res.json({
            status: 200,
            user: {
                email: user.email,
            },
        });
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.json({
            status: 400,
            message: error.message,
        });
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise < void > {
    const reqOAuth: OAuth2Server.Request = new OAuth2Server.Request(req);
    const resOAuth: OAuth2Server.Response = new OAuth2Server.Response(res);

    const options: OAuth2Server.AuthorizeOptions = {
        authenticateHandler: {
            handle: async (request: Request): Promise<OAuth2Server.User> => {
                try {
                    const user: OAuth2Server.User = await AuthService.getUser(request.body);

                    return user;
                } catch (error) {
                    throw new Error(error);
                }
            },
        },
    };
    const code: OAuth2Server.AuthorizationCode = await oauth.authorize(reqOAuth, resOAuth, options);

    res.redirect(`${code.redirectUri}?code=${code.authorizationCode}&state=${req.query.state}`);
}
/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function token(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const reqOAuth: OAuth2Server.Request = new OAuth2Server.Request(req);
        const resOAuth: OAuth2Server.Response = new OAuth2Server.Response(res);
        const oAuthToken: OAuth2Server.Token = await oauth.token(reqOAuth, resOAuth);

        res.json({
            accessToken: oAuthToken.accessToken,
            refreshToken: oAuthToken.refreshToken,
        });
    } catch (error) {
        return next(new HttpError(error.status, error.message));
    }
}
