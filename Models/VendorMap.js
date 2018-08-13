import { Model } from 'objection';

class VendorMap extends Model {
    static get tableName() {
        return 'vendors_map';
    }
}

export default VendorMap;