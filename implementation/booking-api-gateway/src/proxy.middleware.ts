import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProxyMiddleware.name);
  private readonly proxyMiddleware: ReturnType<typeof createProxyMiddleware>;
  private readonly bookingServiceURL: string;

  constructor(private configService: ConfigService) {
    this.bookingServiceURL = this.configService.get('bookingServiceURL');
    this.proxyMiddleware = createProxyMiddleware({
      target: this.bookingServiceURL,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) => {
          if (typeof req.headers['fwd-remote-ip'] !== 'undefined') {
            this.logger.warn(
              `A suspicious client sent a fwd-remote-ip header "${req.headers['fwd-remote-ip']}"`,
            );
          }
          proxyReq.setHeader('fwd-remote-ip', req.socket.remoteAddress);
          proxyReq.setHeader('fwd-host', req.headers['host']);
          fixRequestBody(proxyReq, req);
        },
      },
      timeout: 120000,
      proxyTimeout: 120000,
      pathRewrite: (path: string, req: Request) => `${req.baseUrl}${path}`,
    });
  }

  use(req: Request, res: any, next: () => void) {
    this.logger.verbose(
      `Using proxy: ${req.method} ${req.originalUrl} -> ${this.bookingServiceURL}${req.baseUrl}${req.url}`,
    );
    return this.proxyMiddleware(req, res, next);
  }
}
