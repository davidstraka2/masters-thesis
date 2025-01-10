import { Migration } from '@mikro-orm/migrations';

export class Migration20241229020514 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop index "booking_address_user_id_index";`);

    this.addSql(
      `alter table "booking_address" add constraint "booking_address_user_id_unique" unique ("user_id");`,
    );

    this.addSql(`drop table if exists "inventory_permission_list" cascade;`);

    this.addSql(`drop table if exists "item_xor" cascade;`);

    this.addSql(`alter table "inventory" drop column "permission_mode";`);

    this.addSql(`alter table "item" drop column "modify_deadline";`);

    this.addSql(`drop type "permission_mode";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create type "permission_mode" as enum ('ban', 'allow');`);
    this.addSql(
      `create table "inventory_permission_list" ("inventory_id" uuid not null, "booking_address_address" citext not null, constraint "inventory_permission_list_pkey" primary key ("inventory_id", "booking_address_address"));`,
    );

    this.addSql(
      `create table "item_xor" ("item_1_id" uuid not null, "item_2_id" uuid not null, constraint "item_xor_pkey" primary key ("item_1_id", "item_2_id"));`,
    );

    this.addSql(
      `alter table "inventory_permission_list" add constraint "inventory_permission_list_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "inventory_permission_list" add constraint "inventory_permission_list_booking_address_address_foreign" foreign key ("booking_address_address") references "booking_address" ("address") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "item_xor" add constraint "item_xor_item_1_id_foreign" foreign key ("item_1_id") references "item" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "item_xor" add constraint "item_xor_item_2_id_foreign" foreign key ("item_2_id") references "item" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "inventory" add column "permission_mode" "permission_mode" not null;`,
    );

    this.addSql(
      `alter table "item" add column "modify_deadline" timestamptz null;`,
    );

    this.addSql(
      `alter table "booking_address" drop constraint "booking_address_user_id_unique";`,
    );

    this.addSql(
      `create index "booking_address_user_id_index" on "booking_address" ("user_id");`,
    );
  }
}
