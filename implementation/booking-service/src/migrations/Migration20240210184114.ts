import { Migration } from '@mikro-orm/migrations';

export class Migration20240210184114 extends Migration {
  async up(): Promise<void> {
    // Postgres Extensions
    this.addSql('CREATE EXTENSION IF NOT EXISTS citext;');

    this.addSql("create type \"permission_mode\" as enum ('ban', 'allow');");
    this.addSql(
      'create table "inventory" ("id" uuid not null, "permission_mode" "permission_mode" not null, "metadata" jsonb null, "form" jsonb null, "item_type" text null, "item_metadata_schema" jsonb null, constraint "inventory_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "booking_address" ("address" citext not null, "user_id" uuid null, "inventory_id" uuid null, constraint "booking_address_pkey" primary key ("address"));',
    );
    this.addSql(
      'create index "booking_address_user_id_index" on "booking_address" ("user_id");',
    );
    this.addSql(
      'alter table "booking_address" add constraint "booking_address_inventory_id_unique" unique ("inventory_id");',
    );

    this.addSql(
      'create table "inventory_permission_list" ("inventory_id" uuid not null, "booking_address_address" citext not null, constraint "inventory_permission_list_pkey" primary key ("inventory_id", "booking_address_address"));',
    );

    this.addSql(
      'create table "item" ("id" uuid not null, "created_at" timestamptz not null, "capacity" int null, "book_deadline" timestamptz null, "modify_deadline" timestamptz null, "metadata" jsonb null, "inventory_id" uuid not null, constraint "item_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "item_created_at_index" on "item" ("created_at");',
    );

    this.addSql(
      'create table "booking" ("id" uuid not null, "created_at" timestamptz not null, "form_data" jsonb null, "booking_address_address" citext not null, "item_id" uuid not null, constraint "booking_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "booking_created_at_index" on "booking" ("created_at");',
    );

    this.addSql(
      'create table "item_xor" ("item_1_id" uuid not null, "item_2_id" uuid not null, constraint "item_xor_pkey" primary key ("item_1_id", "item_2_id"));',
    );

    this.addSql(
      'alter table "booking_address" add constraint "booking_address_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "inventory_permission_list" add constraint "inventory_permission_list_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "inventory_permission_list" add constraint "inventory_permission_list_booking_address_address_foreign" foreign key ("booking_address_address") references "booking_address" ("address") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "item" add constraint "item_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "booking" add constraint "booking_booking_address_address_foreign" foreign key ("booking_address_address") references "booking_address" ("address") on update cascade;',
    );
    this.addSql(
      'alter table "booking" add constraint "booking_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "item_xor" add constraint "item_xor_item_1_id_foreign" foreign key ("item_1_id") references "item" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "item_xor" add constraint "item_xor_item_2_id_foreign" foreign key ("item_2_id") references "item" ("id") on update cascade on delete cascade;',
    );
  }
}
