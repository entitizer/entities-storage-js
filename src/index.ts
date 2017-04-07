
export { EntityService } from './entity_service';
export { EntityNamesService } from './entity_names_service';
export { ENTITY_FIELDS, ENTITY_NAMES_FIELDS } from './db/schemas';

// export * from './categories';
import * as Config from './config';
export { Config };

import { createTables } from './db/create_tables';
import { deleteTables } from './db/delete_tables';
export { createTables, deleteTables };
