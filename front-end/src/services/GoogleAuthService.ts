const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

export default class GoogleAuthService {
  private static instance?: object;

  static async getInstance(): Promise<any> {
    if (this.instance) {
      return Promise.resolve(this.instance);
    }

    const { gapi } = window as any;

    return new Promise((resolve) => {
      gapi.load('auth2', () => {
        this.instance = gapi.auth2.init({
          client_id: GOOGLE_CLIENT_ID
        });

        resolve(this.instance);
      });
    });
  }
}
