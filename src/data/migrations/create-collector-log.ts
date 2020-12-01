import Knex from "knex";

exports.up = function (knex: Knex, Promise: any) {
    return knex.schema.createTable('collector_log', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.dateTime('create_date').notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        t.string('service_name').notNullable();
        t.text('source_ip').nullable();
        t.text('url').nullable();
        t.text('query').nullable();
        t.text('headers').nullable();
        t.text('signed_cookies').nullable();
        t.specificType('files', "character varying[]");
        t.enum("status", ["collected", "processed", "error", "read"]);
    });
};

exports.down = function (knex: Knex, Promise: any) {
    return knex.schema.dropTable('collector_log');
};
