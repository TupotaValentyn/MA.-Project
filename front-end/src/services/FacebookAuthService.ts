const FACEBOOK_CLIENT_ID = process.env.REACT_APP_FACEBOOK_CLIENT_ID as string;

console.log(FACEBOOK_CLIENT_ID);

export default class FacebookAuthService {
  private static instance?: object;

  static getInstance(): any {
    if (this.instance) {
      return this.instance;
    }

    const { FB } = window as any;

    FB.init({
      appId: FACEBOOK_CLIENT_ID,
      cookie: true,
      xfbml: true,
      version: 'v6.0'
    });

    this.instance = FB;

    return this.instance;
  }
}
