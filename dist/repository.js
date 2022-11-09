"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdz_agent_types_1 = require("sdz-agent-types");
class OracleRepository extends sdz_agent_types_1.AbstractRepository {
    async count(query) {
        const total = (await this.execute(`SELECT COUNT (*) as total FROM (${this.buildQuery(query)}) as TOTAL`))[0].TOTAL;
        return total;
    }
    execute(query, page, limit) {
        const statement = [
            this.buildQuery(query),
            limit ? `LIMIT ${limit}` : null,
            page && limit ? `OFFSET ${page * limit}` : null,
        ]
            .filter((item) => !!item)
            .join(" ");
        return this.getConnector().execute(statement);
    }
}
exports.default = OracleRepository;
