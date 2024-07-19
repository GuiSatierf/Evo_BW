const debounce = (func, wait, immediate) => {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    callNow && func.apply(context, args);
  };
};
//
// inspiration for dragging:
// https://codepen.io/normancarcamo/pen/pVzWJR
//
function DragMenu(options) {
  const self = this;
  self.menu = options.el;
  self.hasTouch = "ontouchstart" in window;
  self.isMoving = false;
  self.isOpen = false;

  const compStyles = window.getComputedStyle(self.menu);
  self.position = {
    min: parseInt(compStyles.left),
    max: 0,
    current: 0,
  };
  self.position.snapBorder = (self.position.min + self.position.max) * 0.5;

  self.btn = options.toggleButton;
  self.btn &&
    self.btn.addEventListener("click", function () {
      self.setOpen(!self.isOpen);
    });

  if (self.hasTouch) {
    self.eventStart = "touchstart";
    self.eventMove = "touchmove";
    self.eventEnd = "touchend";
  } else {
    self.eventStart = "mousedown";
    self.eventMove = "mousemove";
    self.eventEnd = "mouseup";
  }

  self.menu.addEventListener(self.eventStart, (e) => {
    e.preventDefault();
    var evt = e.type === "touchstart" ? e.changedTouches[0] : e;
    self.position.current = Math.abs(self.menu.offsetLeft - evt.clientX);
    self.menu.style.pointerEvents = "none";
    var l = parseInt(menu.style.left);
  });

  window.addEventListener(
    self.eventMove,
    debounce((e) => {
      if (self.menu.style.pointerEvents === "none") {
        self.menu.classList.add("is-moving");
        var evt = e.type === "touchmove" ? e.changedTouches[0] : e;
        var move = evt.clientX - self.position.current;
        if (move >= self.position.min && move <= self.position.max) {
          self.setOpen(false);
          self.menu.style.left = `${move}px`;
        }
      }
    }),
    200
  );

  window.addEventListener(self.eventEnd, (e) => {
    self.menu.classList.remove("is-moving");
    var evt = e.type === "touchstart" ? e.changedTouches[0] : e;
    var l = parseInt(menu.style.left);
    if (l > self.position.snapBorder) {
      self.setOpen(true);
    }
    self.menu.style.left = null;
    self.menu.style.pointerEvents = "initial";
  });

  self.setOpen = (isOpen) => {
    self.isOpen = isOpen;
    self.btn.classList[isOpen ? "add" : "remove"]("menu--open");
    self.menu.classList[isOpen ? "add" : "remove"]("open");
  };
}
const btn = document.getElementById("btn-menu");
const menu = document.getElementById("menu");
new DragMenu({ el: menu, toggleButton: btn });
