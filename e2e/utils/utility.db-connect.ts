import { browser } from 'protractor';

const { Client } = require('pg');

export class DBConnect {

    async dbConnect(username?: string, password?: string): Promise<any> {
        let connectionString = undefined;
        username && password ? connectionString = `postgres://${username}:${password}@` + await this.getServerName() + ":5432/ARSystem":
        connectionString= "postgres://postgres:postgres@" + await this.getServerName() + ":5432/ARSystem";
        let pgClient = await new Client(connectionString);
        await pgClient.connect();
        return pgClient;
    }

    async dbConnectionEnd(dbClient): Promise<void>{
        await dbClient.end();
    }

    async getServerName(): Promise<string> {
        let serverString: string;
        let splittedURL = (browser.baseUrl.split('//'));
        if (splittedURL[1].includes(':')) {
            splittedURL = splittedURL[1].split(':');
            serverString = splittedURL[0];
        }
        else serverString = splittedURL[1];
        return serverString;
    }

    async dateEpochConverter(date: Date): Promise<number>{
        return (date.getTime() -date.getMilliseconds())/1000;
    }
}

export default new DBConnect();