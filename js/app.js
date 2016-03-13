import HP from './helpers';
import './jquery-change-size';

(function ($) {

  // When DOM is ready
  $(function () {
    example(HP.random(10, 20));
    $('.box').cropResize({
      cnt: '.container'
    });

  });

  /**
   * Just an example function
   *   DELETE IT
   * @param  {Number} n - random number between 10 and 20
   */
  function example(n) {
    console.log(`Hello in ES6... I am ${n} - random number between 10 and 20`);
  }

}(jQuery));