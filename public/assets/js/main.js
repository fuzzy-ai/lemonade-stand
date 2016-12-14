// Lemonade stand


let cloudyIcon = document.querySelector('.cloudy-icon-btn');
let sunnyIcon = document.querySelector('.sunny-icon-btn');
let b = document.getElementsByTagName('body')[0];
let bSunny = document.getElementsByClassName('sunny');
let sun = document.querySelector('.sun');
let sunnyOrCloudy = document.querySelector('.sunny-or-cloudy');
let jsNotActive = document.querySelector('.js-not-active');

const startBtn = document.querySelector('.js-start-btn');
const sceneAction = document.querySelector ('.scene-action');


//toggle cloudy or sunny weather
cloudyIcon.addEventListener('click', function(){
  console.log('clicked')
  b.classList.toggle('cloudy');
  b.classList.remove('sunny')
  cloudyIcon.classList.add('active-icon');
  sunnyIcon.classList.remove('active-icon');
  sunnyOrCloudy.innerHTML = 'cloudy';


  window.setTimeout(function(){
    sun.classList.add('offset-sun');
  }, 7000);
});

sunnyIcon.addEventListener('click', function(){
  console.log('clicked')
  b.classList.add('sunny');
  b.classList.remove('cloudy')
  sun.classList.remove('offset-sun');
  sunnyOrCloudy.innerHTML = 'sunny';
  sunnyIcon.classList.add('active-icon');
  cloudyIcon.classList.remove('active-icon');
});

//Load scene
// setTimeout(function(){
//   startBtn.addEventListener('click', function(){
//     jsNotActive.classList.remove('js-not-active');
//     this.classList.add('js-active');
//   });
// }, 8000);



//GSAP animations


TweenMax.from(".sun", 1, {opacity:0, rotation:360,  scale:0, ease: Power4.easeInOut})
TweenMax.to(".sun", 2, {opacity:1, y:0,   scale:1.1, ease: Power2.easeInOut})
TweenMax.from(".clouds", 3, { opacity:0, scale:0, delay:0.75,  ease:  Circ.easeOut })
// TweenMax.to(".js-active" , 10, { opacity:1, x: 200, ease:  Circ.easeOut })

startBtn.onclick = function() {
  TweenMax.to(".lemonsplanation", 3, {scale: 0, opacity:0, ease: Power4.easeInOut})
  TweenMax.to(window, 1, {scrollTo:{y:"#funtimes", offsetY:-100}, onComplete:function(){
    // var tl = New TimelineMax();
    // //set label for timeline
    // tl.add("label");

    jsNotActive.classList.remove('js-not-active');
    sceneAction.classList.add('js-active');
    TweenMax.staggerFrom(".buyer" , 1, {opacity: 0,  x:-200})
    TweenMax.staggerTo(".buyer" , 3, {opacity:1, x:0, ease:  Power0.easeIn }, 1.5)
    }
  });

}

// function complete(){
// TweenMax("#funtimes" , 4, { opacity:1, x: -1200, ease:  Circ.easeOut });
//
// };
