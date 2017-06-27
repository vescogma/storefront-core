import Tag, { TAG_DESC, TAG_META } from '.';
import StoreFront from '../../storefront';
import Lifecycle from './lifecycle';

namespace TagUtils {

  /**
   * tag initializer creator
   */
  export function initializer(clazz: any) {
    return function init(this: riot.TagInterface & { __proto__: any }) {

      TagUtils.inherit(this, clazz);

      const proto = this.__proto__;
      this.__proto__ = clazz.prototype; // fool the class constructor check
      clazz.call(this);
      this.__proto__ = proto;
    };
  }

  export function bindController(tag: Tag, clazz: Function) {
    TagUtils.initializer(clazz).call(tag);

    tag.trigger(Lifecycle.Phase.INITIALIZE);

    if (typeof tag.init === 'function') {
      tag.init();
    }
  }

  export function tagDescriptors(clazz: Function) {
    const { [TAG_DESC]: { metadata: { name }, view, css } } = clazz;
    return [name, view, css];
  }

  export function buildProps(tag: Tag) {
    return {
      stylish: tag.config.options.stylish,
      ...Tag.getMeta(tag).defaults,
      ...tag.opts.__proto__,
      ...tag.opts
    };
  }

  export function inherit(target: any, superclass: any) {
    if (superclass && superclass !== Object.getPrototypeOf(Object)) {
      TagUtils.inherit(target, Object.getPrototypeOf(superclass));

      Object.getOwnPropertyNames(superclass.prototype)
        .filter((name) => name !== 'constructor')
        // tslint:disable-next-line
        .forEach((name) => Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(superclass.prototype, name)));
    }
  }
}

export default TagUtils;