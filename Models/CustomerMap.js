import { Model } from 'objection';

class CustomerMap extends Model {
    static get tableName() {
        return 'customers_map';
    }
}

export default CustomerMap;