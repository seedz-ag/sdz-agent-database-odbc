import {
  ConnectorInterface,
  DatabaseRow,
} from "sdz-agent-types";

import odbc, { Connection } from "odbc";

export default class Connector implements ConnectorInterface {
  private connection: Connection;
  private config: any;

  constructor(config: any) {
    this.setConfig(config);
  }

  async connect(): Promise<void> {
    if (!this.connection) {
      try {
        this.connection = await odbc.connect(this.config);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.close();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async execute(query: string): Promise<DatabaseRow[]> {
    let resultSet: DatabaseRow[] = [];
    if (!this.connection) {
      await this.connect();
    }
    try {
      const response = await this.connection.query<DatabaseRow[]>(query);
      if (response.length) {
        resultSet = response.map(rows => rows);
      }
    } catch (e) {
      console.log(e);
    }
    return resultSet;
  }

  private setConfig(config: any): this {
    const connectionConfig = {
      connectionString: config.connectionString,
      connectionTimeout: 999999,
      loginTimeout: 999999,
  }

    this.config = connectionConfig;
    return this;
  }
}
