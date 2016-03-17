(function ($) {

  const pluginName = 'cropResize';

  /**
   * Simple math operations in the object representation
   *   for create different math operations depending on variable
   * @type {Object}
   */
  const _operators = {
    plus: function (a, b) {
      return a + b;
    },
    minus: function (a, b) {
      return a - b;
    }
  }

  class Plugin {

    /**
     * Plugin constructor
     *   Create basic structure
     *   Handles option extension
     * @param  {String|Object} element - jQuery selection or element of the box that will be affected
     * @param  {String|Object} opts.cnt - jQuery selection or element of the box that will be used
     *                                      as a crop container for the main element
     * @param {Object} draggable - options for the jquery-ui draggable plugin
     * @param {Object} resizable - options for the jquery-ui resizable plugin
     */
    constructor(element, opts) {
      this.$el = $(element);
      this.opts = $.extend({
        resizable: {},
        draggable: {}
      }, opts);
      this.$cnt = $(this.opts.cnt);
      this.ratio = this.$el.width() / this.$el.height();
      this.init();
    }

    /**
     * Initialize the plugin
     *   Init draggalbe and resizable modules
     */
    init() {
      if (!this._handleErrors()) { return; }
      this._initDraggable();
      this._initResizable();
    }

    /**
     * Init draggable module for the element
     */
    _initDraggable() {
      this.$el.draggable($.extend({
        drag: (event, ui) => {
          [ui.position.left, ui.position.top] = 
            this._checkViewport(ui.position.left, ui.position.top, this.$el, this.$cnt);
        }
      }, this.opts.draggable));
    }

    /**
     * Init resizable module for the element
     */
    _initResizable() {
      this.$el.resizable($.extend({
        aspectRatio: true,
        handles: 'ne, se, sw, nw',
        resize: (event, ui) => {
          var $el = $(ui.element),
            cntWidth = this.$cnt.width(),
            cntHeight = this.$cnt.height(),
            [top, left] = this._centeringResize(ui);

          $el.width = function () { return ui.size.width; };
          $el.height = function () { return ui.size.height; };
          [left, top] = this._checkViewport(left, top, $el, this.$cnt);
          [ui.position.left, ui.position.top] = this._stabilizeRatio(left, top, $el, this.$cnt, ui);
        }
      }, this.opts.resizable));
    }

    /**
     * Error showing helper
     *   just show a console.error when theere is something wrong with a plugin
     * @param  {String} msg - error message
     * @return {Boolean} - false
     */
    _showError(msg) {
      console.error(`${pluginName} plugin error: `, msg);
      return false;
    }

    /**
     * Handling all possible problems with the plugin initialization
     * @return {Boolean}
     */
    _handleErrors() {
      if (!$.fn.draggable || !$.fn.resizable) {
        return this._showError('You need to install jquery-ui with draggable and resizable plugins')
      }
      if (!this.opts.cnt) {
        return this._showError('You need to specify crop container with cnt option');
      }
      return true;
    }

    /**
     * Checking viewport of the container
     *   to prevent element cross its edges
     * @param  {Number} left - left position of the element
     * @param  {Numer} top  - top position of the element
     * @param  {Object} $el  - jQuery selection of the element
     * @param  {Object} $cnt - jQuery selection of the container
     * @return {Array} - array with resulting left and top numbers
     */
    _checkViewport(left, top, $el, $cnt) {
      var elWidth = $el.width(),
        elHeight = $el.height(),
        cntWidth = $cnt.width(),
        cntHeight = $cnt.height();
      if (left > 0) { left = 0; }
      if (top > 0) { top = 0; }
      if (Math.abs(left) > elWidth - cntWidth) { left = cntWidth - elWidth; }
      if (Math.abs(top) > elHeight - cntHeight) { top = cntHeight - elHeight; }
      return [left, top];
    }

    /**
     * Helping function to always centering element
     *   when resizing
     * @param  {Object} ui - default resizable ui object
     * @param  {String} axis - current axis of the resizable event
     * @return {Array} array with resulting numbers for left ant top position
     */
    _centeringResize(ui) {
      var top = parseInt(ui.originalPosition.top, 10) + ((ui.originalSize.height - ui.size.height)) / 2;
      var left = parseInt(ui.originalPosition.left, 10) + ((ui.originalSize.width - ui.size.width)) / 2;
      return [top, left];
    }

    /**
     * Stabilizing resizable image to keep apect ratio
     * @param  {Number} left - new left position of element
     * @param  {Number} top  - new top position of element
     * @param  {Object} $el  - jQuery selection of the element
     * @param  {Object} $cnt - jQuery selection of the element container
     * @return {Array} - Array with stabilized left and top positions of the element
     */
    _stabilizeRatio(left, top, $el, $cnt, ui) {
      var cntWidth = $cnt.width(),
        cntHeight = $cnt.height();
      if (ui.size.width <= cntWidth) {
        left = 0;
        top = parseInt($el.css('top'), 10);
        ui.size.width = cntWidth;
        ui.size.height = ui.size.width / this.ratio;
      }
      if (ui.size.height <= cntHeight) {
        top = 0;
        left = parseInt($el.css('left'), 10);
        ui.size.height = cntHeight;
        ui.size.width = ui.size.height * this.ratio;
      }
      return [left, top];
    }
  }

  /**
   * Create the jQuery plugin
   * @param  {Object} opts - options which will be passed into constructor
   * @return {Object} - first elemetn of jQuery selection 
   */
  $.fn[pluginName] = function (opts) {
    return this.each(function () {
      if ( !$.data(this, "plugin_" + pluginName )) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts));
      }
    });
  }

}(jQuery));