"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const odbc_1 = __importDefault(require("odbc"));
class Connector {
    constructor(config) {
        this.setConfig(config);
    }
    async connect() {
        if (!this.connection) {
            try {
                this.connection = await odbc_1.default.connect(this.config);
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    async close() {
        if (this.connection) {
            try {
                await this.connection.close();
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    async execute(query) {
        let resultSet = [];
        if (!this.connection) {
            await this.connect();
        }
        try {
            const response = await this.connection.query(query);
            if (response.length) {
                resultSet = response.map(rows => rows);
            }
        }
        catch (e) {
            console.log(e);
        }
        return resultSet;
    }
    setConfig(config) {
        const connectionConfig = {
            connectionString: config.connectionString,
            connectionTimeout: 999999,
            loginTimeout: 999999,
        };
        this.config = connectionConfig;
        return this;
    }
}
exports.default = Connector;
