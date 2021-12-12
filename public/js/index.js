const toggleIcon = document.getElementById('toggle-icon');
const navmain = document.getElementById("nav-menus");

function myFunction(){
    navmain.classList.toggle('fade-animate')
    navmain.classList.toggle('nav-onclick');

    
    if(toggleIcon.classList.contains('fa-bars')){
        toggleIcon.classList.remove('fa-bars')
        toggleIcon.classList.add('fa-times')
    }else{
        toggleIcon.classList.add('fa-bars')
        toggleIcon.classList.remove('fa-times')
    }   
}   
    if(document.querySelector(".carousel-ul-list") != null){
        document.querySelector(".carousel-ul-list").firstElementChild.setAttribute("data-active",'');
    };
    const buttons = document.querySelectorAll("[data-carousel-button]")

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1
        const slides = button
          .closest("[data-carousel]")
          .querySelector("[data-slides]")
    
        const activeSlide = slides.querySelector("[data-active]")
        let newIndex = [...slides.children].indexOf(activeSlide) + offset
        if (newIndex < 0) newIndex = slides.children.length - 1
        if (newIndex >= slides.children.length) newIndex = 0
    
        slides.children[newIndex].dataset.active = true
        delete activeSlide.dataset.active
      })
})
window.addEventListener('DOMContentLoaded', () => {

    let scrollPos = 0;
    const mainNav = document.getElementById('nav-bar');
    const headerHeight = mainNav.clientHeight;
    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if ( currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
                // document.body.style.paddingTop = mainNav.offsetHeight +'px';
            } else {
                console.log(123);
                mainNav.classList.remove('is-visible', 'is-fixed');
            }

        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
            navmain.classList.remove('nav-onclick');
            toggleIcon.classList.add('fa-bars');
        }
        scrollPos = currentTop;
    })
});
