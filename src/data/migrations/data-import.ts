import Migration, {MigrationContext, runMigration} from "contentful-migration";

const migrationFunction = (migration: Migration, context?: MigrationContext) => {
  createMeetings(migration, context);
};

const createMeetings = (migration: Migration, context?: MigrationContext) => {

}

runMigration({
  migrationFunction,
  spaceId: `3ygf5yadm911`,
  accessToken: `6fjoJngK3XE-8s6xQgABZxM69MTrTArf_32jcXn77G4`,
})
  .then(() => console.log('Migration Done!'))
  .catch((e) => console.error(e))
