import * as dot from 'dot-prop';
import { Structure } from '.';

const DEFAULT_STRUCTURE = {
  id: 'id',
  title: 'title',
  price: 'price'
};

export default class Transformer {

  structure: Structure.Tranformable;
  variant?: {
    field: string;
    structure: Structure.Tranformable;
  };

  constructor({ _variant, ...structure }: Structure) {
    this.structure = { ...DEFAULT_STRUCTURE, ...structure };
    if (_variant.field) {
      this.variant = {
        field: _variant.field,
        structure: { ...structure, ...(_variant.structure || {}) }
      };
    }
  }

  transform(metadata: any) {
    if (this.hasVariants(metadata)) {
      return this.remapVariants(metadata);
    } else {
      return [Transformer.remap(metadata, this.structure)];
    }
  }

  hasVariants(metadata: any) {
    return this.variant && metadata[this.variant.field] && Array.isArray(metadata[this.variant.field]);
  }

  remapVariants({[this.variant.field]: variants, ...metadata }: any) {
    const structure = { ...this.structure, ...this.variant.structure };
    return (<any[]>variants)
      .map((variant) => Transformer.remap({ ...metadata, ...variant }, structure));
  }

  static remap(metadata: any, { _transform = (meta) => meta, ...structure }: Structure.Tranformable) {
    return _transform(Object.entries(structure)
      .reduce((meta, [key, path]) => {
        const value = dot.get(key, path);
        return value ? Object.assign(meta, { [path]: value }) : meta;
      }, {}));
  }

  static mergeStructures(
    { _variant = <any>{}, ...base }: Structure,
    { _variant: variantOverride = <any>{}, ...override }: Structure
  ) {
    const merged: Structure = { ...base, ...override };
    const field = variantOverride.field || _variant.field;
    if (field) {
      if (_variant.field && variantOverride.field && _variant.field !== variantOverride.field) {
        merged._variant = variantOverride;
      } else {
        merged._variant = {
          field,
          structure: { ..._variant.structure, ...variantOverride.structure }
        };
      }
    }
    return merged;
  }
}
