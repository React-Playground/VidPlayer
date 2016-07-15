import $ from 'jquery';



export class ComponentBase {
  attach($mount) {
    this._mount = $mount;
    this._onDetachHandlers = [];
    this.children = [];
    this._onAttach();
  }

  detach() {
    this._onDetach();
    for (let handler of this._onDetachHandlers)
      handler();

    for (let child of this.children)
      child.detach();

    this._onDetachHandlers = [];
    this.children = [];
  }

  _onAttach() {
    
  }

  _onDetach() {

  }
}

export class ElementComponent extends ComponentBase {
  get $element() { return this.$element; }

  constructor(elementType = 'div') {
    super();
    this._$element = $(`<${elementType}>`).data('component', this);
  }
}
