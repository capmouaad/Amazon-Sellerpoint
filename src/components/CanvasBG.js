import TweenLite from 'gsap/TweenLite'
import { Circ } from 'gsap/EasePack'

export const CanvasBG = (options) => {

  var largeHeader, canvas, ctx, points, animateHeader = true
  let target = options.Loc

  let width = options.width
  let height = options.height


  const initHeader = () => {
    largeHeader = document.getElementById('canvas-wrapper')
    largeHeader.style.height = height+'px';

    canvas = document.getElementById('demo-canvas')
    canvas.width = width
    canvas.height = height
    ctx = canvas.getContext('2d')

    // create points
    points = [];
    for(let x = 0; x < width; x = x + width / 20) {
        for(let y = 0; y < height; y = y + height / 20) {
            var px = x + Math.random() * width / 20;
            var py = y + Math.random() * height / 20;
            var p = {x: px, originX: px, y: py, originY: py }
            points.push(p);
        }
    }

    // for each point find the 5 closest points
    for(let i = 0; i < points.length; i++) {
        let closest = [];
        let p1 = points[i];
        for(let j = 0; j < points.length; j++) {
            let p2 = points[j]
            if(!(p1 === p2)) {
                let placed = false;
                for(let k = 0; k < 5; k++) {
                    if(!placed) {
                        if(closest[k] === undefined) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }

                for(let k = 0; k < 5; k++) {
                    if(!placed) {
                        if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }
            }
        }
        p1.closest = closest;
    }

    // // assign a circle to each point
    for(let i in points) {
        let c = new Circle(points[i], 2 + Math.random()*2, 'rgba(255,255,255,0.3)');
        points[i].circle = c;
    }
  }

  // // Event handling
  const addListeners = () => {
      if(!('ontouchstart' in window)) {
          //window.addEventListener('mousemove', mouseMove);
      }
      window.addEventListener('scroll', scrollCheck);
      window.addEventListener('resize', resize);
  }

  const mouseMove = (e) => {
      let posx = 0
      let posy = 0
      if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
      }
      else if (e.clientX || e.clientY)    {
          posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      target.x = posx;
      target.y = posy;
  }

  const scrollCheck = () => {
      if(document.body.scrollTop > height) animateHeader = false;
      else animateHeader = true;
  }

  const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      largeHeader.style.height = height+'px';
      canvas.width = width;
      canvas.height = height;
  }

  // // animation
  const initAnimation = () => {
      animate()
      for(var i in points) {
          shiftPoint(points[i]);
      }
  }

  const animate = () => {
      if(animateHeader) {
          ctx.clearRect(0,0,width,height);
          for(let i in points) {
              // detect points in range
              if(Math.abs(getDistance(target, points[i])) < 4000) {
                  points[i].active = 0.3;
                  points[i].circle.active = 0.6;
              } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                  points[i].active = 0.1;
                  points[i].circle.active = 0.3;
              } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                  points[i].active = 0.02;
                  points[i].circle.active = 0.1;
              } else {
                  points[i].active = 0;
                  points[i].circle.active = 0;
              }

              drawLines(points[i]);
              points[i].circle.draw();
          }
      }
      requestAnimationFrame(animate);
  }

  const shiftPoint = (p) => {
      TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
          y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
          onComplete: function() {
              shiftPoint(p);
          }});
  }

  // // Canvas manipulation
  const drawLines = (p) => {
      if(!p.active) return;
      for(let i in p.closest) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.strokeStyle = 'rgba(249,198,60,'+ p.active+')';
          ctx.stroke();
      }
  }

  function Circle (pos,rad,color) {
      let _this = this;

      // constructor
      (() => {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
      })();

      this.draw = () => {
          if(!_this.active) return;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'rgba(249,198,60,'+ _this.active+')';
          ctx.fill();
      };
  }

  // // Util
  const getDistance = (p1, p2) => {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }
  
  initHeader()
  initAnimation()
  addListeners()
}



export const CanvasBG1 = (options) => {
  var largeHeader, canvas, ctx, points, animateHeader = true

  let width = options.width
  let height = options.height

  let target = options.Loc

  const initHeader = () => {
      largeHeader = document.getElementById('canvas-wrapper1');
      // largeHeader.style.height = height+'px';

      canvas = document.getElementById('demo-canvas1');
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');

      // create points
      points = [];
      for(let x = 0; x < width; x = x + width/20) {
          for(let y = 0; y < height; y = y + height/20) {
              let px = x + Math.random()*width/20;
              let py = y + Math.random()*height/20;
              let p = {x: px, originX: px, y: py, originY: py };
              points.push(p);
          }
      }

      // for each point find the 5 closest points
      for(let i = 0; i < points.length; i++) {
          let closest = [];
          let p1 = points[i];
          for(let j = 0; j < points.length; j++) {
              let p2 = points[j]
              if(!(p1 === p2)) {
                  let placed = false;
                  for(let k = 0; k < 5; k++) {
                      if(!placed) {
                          if(closest[k] === undefined) {
                              closest[k] = p2;
                              placed = true;
                          }
                      }
                  }

                  for(let k = 0; k < 5; k++) {
                      if(!placed) {
                          if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                              closest[k] = p2;
                              placed = true;
                          }
                      }
                  }
              }
          }
          p1.closest = closest;
      }

      // assign a circle to each point
      for(let i in points) {
          let c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
          points[i].circle = c;
      }
  }

  // Event handling
  const addListeners = () => {
      if(!('ontouchstart' in window)) {
          //window.addEventListener('mousemove', mouseMove);
      }
      window.addEventListener('scroll', scrollCheck);
      window.addEventListener('resize', resize);
  }

  const mouseMove = (e) => {
      let posx = 0
      let posy = 0
      if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
      }
      else if (e.clientX || e.clientY)    {
          posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      target.x = posx;
      target.y = posy;
  }

  const scrollCheck = () => {
      if(document.body.scrollTop > height) animateHeader = false;
      else animateHeader = true;
  }

  function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      largeHeader.style.height = height+'px';
      canvas.width = width;
      canvas.height = height;
  }

  // animation
  const initAnimation = () => {
      animate();
      for(let i in points) {
          shiftPoint(points[i]);
      }
  }

  const animate = () => {
      if(animateHeader) {
          ctx.clearRect(0,0,width,height);
          for(let i in points) {
              // detect points in range
              if(Math.abs(getDistance(target, points[i])) < 4000) {
                  points[i].active = 0.3;
                  points[i].circle.active = 0.6;
              } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                  points[i].active = 0.1;
                  points[i].circle.active = 0.3;
              } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                  points[i].active = 0.02;
                  points[i].circle.active = 0.1;
              } else {
                  points[i].active = 0;
                  points[i].circle.active = 0;
              }

              drawLines(points[i]);
              points[i].circle.draw();
          }
      }
      requestAnimationFrame(animate);
  }

  const shiftPoint = (p) => {
      TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
          y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
          onComplete: function() {
              shiftPoint(p);
          }});
  }

  // Canvas manipulation
  const drawLines = (p) => {
      if(!p.active) return;
      for(let i in p.closest) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.strokeStyle = 'rgba(249,198,60,'+ p.active+')';
          ctx.stroke();
      }
  }

  function Circle (pos,rad,color) {
      var _this = this;

      // constructor
      (() => {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
      })();

      this.draw = function() {
          if(!_this.active) return;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'rgba(249,198,60,'+ _this.active+')';
          ctx.fill();
      };
  }

  // Util
  const getDistance = (p1, p2) => {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }

  initHeader()
  initAnimation()
  addListeners()
}
