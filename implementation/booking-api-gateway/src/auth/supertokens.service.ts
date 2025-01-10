import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

@Injectable()
export class SupertokensService {
  constructor(private configService: ConfigService) {
    supertokens.init({
      appInfo: this.configService.get('appInfo'),
      supertokens: {
        connectionURI: this.configService.get('supertokens.connectionURI'),
        apiKey: this.configService.get('supertokens.apiKey'),
      },
      recipeList: [
        EmailPassword.init(),
        ThirdParty.init({
          signInAndUpFeature: {
            providers: [
              {
                config: {
                  thirdPartyId: 'github',
                  clients: [this.configService.get('github')],
                },
              },
            ],
          },
        }),
        Session.init(),
      ],
    });
  }
}
