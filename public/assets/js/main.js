// Lemonade stand


let cloudyIcon = document.querySelector('.cloudy-icon-btn'),
    sunnyIcon = document.querySelector('.sunny-icon-btn'),
    b = document.getElementsByTagName('body')[0],
    bSunny = document.getElementsByClassName('sunny'),
    sun = document.querySelector('.sun'),
    sunnyOrCloudy = document.querySelector('.sunny-or-cloudy'),
    jsNotActive = document.querySelector('.js-not-active');

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




//GSAP animations


TweenMax.from(".sun", 1, {opacity:0, rotation:360,  scale:0, ease: Power4.easeInOut})
TweenMax.to(".sun", 2, {opacity:1, y:0,   scale:1.1, ease: Power2.easeInOut})
TweenMax.staggerFrom(".clouds", 3, {cycle:{
  scale:[0, 1.1]
}, autoAlpha:0,  ease:  Power1.easeOut }, 1)

startBtn.onclick = function() {
  TweenMax.to(".lemonsplanation", 3, {scale: 0, opacity:0, ease: Power4.easeInOut})
  TweenMax.to(window, 1, {scrollTo:{y:"#funtimes", offsetY:-100}, onComplete:function(){
    jsNotActive.classList.remove('js-not-active');
    sceneAction.classList.add('js-active');

    var tl = new TimelineLite();
      tl.to(".buyer", 3, {left:"30%"})
        .add("purchasing", '+=2')
        .to(".buyer", 9, {x:2000}, "purchasing");
    }
});

}
