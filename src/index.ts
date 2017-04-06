
export { EntityService } from './entity_service';

// export * from './categories';
import * as Config from './config';
export { Config };

import { createTables } from './db/create_tables';
import { deleteTables } from './db/delete_tables';
export { createTables, deleteTables };
