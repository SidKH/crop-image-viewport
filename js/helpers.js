var HP = {
  random: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  operators: {
    plus: function (a, b) {
      return a + b;
    },
    minus: function (a, b) {
      return a - b;
    }
  }
}

export default HP;