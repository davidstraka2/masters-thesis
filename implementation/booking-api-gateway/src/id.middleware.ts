import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { getSession } from 'supertokens-node/recipe/session';

@Injectable()
export class IdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(IdMiddleware.name);

  async use(req: Request, res: any, next: () => void) {
    if (typeof req.headers['user-id'] !== 'undefined') {
      this.logger.warn(
        `A suspicious client sent a user-id header "${req.headers['user-id']}"`,
      );
    }

    const session = await getSession(req, res);
    const userId = session.getUserId();
    req.headers['user-id'] = userId;
    this.logger.verbose(`Set user-id header for user ${userId}`);
    next();
  }
}
