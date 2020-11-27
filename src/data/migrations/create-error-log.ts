import Knex from "knex";

exports.up = function(knex: Knex, Promise:any) {
    return knex.schema.createTable("error_log", function(t) {
        t.increments('id').unsigned().primary();
        t.dateTime('create_date').notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        t.string('service_name').notNullable();
        t.text('message').nullable();
    });
};

exports.down = function(knex: Knex, Promise:any) {
    return knex.schema.dropTable('error_log');
};