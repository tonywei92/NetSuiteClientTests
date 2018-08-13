import { Model } from 'objection';

class BrandMap extends Model {
    static get tableName() {
        return 'brands_map';
    }
}

export default BrandMap;