import { Model } from 'objection';

class SkuMap extends Model {
    static get tableName() {
        return 'skus_map';
    }
}

export default SkuMap;