import ProductService from 'src/modules/product/productService';

/**
 * Combos are Product documents with type: 'combo'. This wraps the product
 * API so the combo module never has to think about that detail.
 */
export default class ComboService {
  static async create(data) {
    return ProductService.create({ ...data, type: 'combo' });
  }

  static async update(id, data) {
    return ProductService.update(id, { ...data, type: 'combo' });
  }

  static async destroyAll(ids) {
    return ProductService.destroyAll(ids);
  }

  static async find(id) {
    return ProductService.find(id);
  }

  static async list(filter, orderBy, limit, offset) {
    return ProductService.list(
      { ...filter, type: 'combo' },
      orderBy,
      limit,
      offset,
    );
  }
}
