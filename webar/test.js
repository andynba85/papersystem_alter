AFRAME.registerComponent('markerhandler', {

    init: function() {
        // box
        const boxBody = document.querySelector('#boxBody');
        let boxCovers = ["boxCover0","boxCover1","boxCover2","boxCover3"];
        const boards = document.querySelectorAll('.board');
        const boxRotations = [];
        let boxOpen = false;
        const animToggle = {true: "from", false: "to"};
        for (let i = 0; i < 4; i++) {
          let rotI = document.getElementById(boxCovers[i]).getAttribute('rotation');
          console.log(rotI);
          boxRotations[i] = rotI.x + " " + rotI.y + " " + rotI.z;
          }
        console.log(boxRotations);

        // effects
        const particles = document.querySelector('#particles');

        // loot
        const plant = document.querySelector('#plant');
        const book = document.querySelector('#book');
        const books = document.querySelector('#books');
        const boat = document.querySelector('#boat');
        const lamp = document.querySelector('#lamp');

        let curLoot = null;
        const lootList = [plant, book, books, boat, lamp];
        const numLoot = lootList.length;

        // text
        const openInst = document.querySelector('#openInst');
        const closeInst = document.querySelector('#closeInst');
        closeInst.setAttribute('visible', false);

        // util
        let animPlay = true;

        const animatedMarker = document.querySelector("#animated-marker");

        // every click, we make our model grow in size :)
        animatedMarker.addEventListener('click', function(ev, target){
            const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;
            if (openInst && intersectedElement === openInst) {
                
                dependencies: ['raycaster'];
                console.log(123456);
                
                // avoid animation being fired twice together
                if (animPlay) {
                  // wait for a while
                  console.log("disabled to wait");
                  animPlay = false;
                  window.setTimeout(function() {
                    console.log("enabled");
                    animPlay = true;    
                  }, 5000);
                } else {
                  // do not play animation
                   
                  return;
                }
                
                // animate box body
                if (boxOpen) {
                  boxBody.setAttribute('visible', boxOpen);
                } else {
                  window.setTimeout(function() {
                    boxBody.setAttribute('visible', !boxOpen);
                    console.log('disappear');
                  }, 5000);
                }
                boxBody.setAttribute('animation',
                                      "property: opacity; " + animToggle[!boxOpen] +
                                      ": 0.8; " + animToggle[boxOpen] +
                                      ": 0; dur: 500");
                
                // animate box covers
                boxCovers.forEach(function(el, i) {
                  document.getElementById(el).setAttribute('animation',
                                  "property: rotation; " + animToggle[!boxOpen] +
                                  ": " + boxRotations[i] + "; " +animToggle[boxOpen] +
                                  ": 0 0 0; dur: 500");
                  boards[i].setAttribute('animation',
                                         "property: color; " + animToggle[!boxOpen] +
                                         ": #FFFFFF; " + animToggle[boxOpen] +
                                         ": #FFFF84; dur: 500");
                });
                
                // show effects
                particles.setAttribute('particle-system', 'enabled', !boxOpen);
                
                // change instructions
                openInst.setAttribute('visible', boxOpen);
                closeInst.setAttribute('visible', !boxOpen);
                
                if (boxOpen) {
                  // hide loot
                  curLoot.setAttribute('visible', !boxOpen);
                  curLoot.removeEventListener('click', animBox());
                  //boxCovers.forEach(function(el, i) {
                    //document.getElementById(el).removeEventListener('click', animBox());
                  //});
                  //boxBody.addEventListener('click', animBox(),
                  // once=true);
                } else {
                  // show loot
                  curLoot = chooseLoot();
                  curLoot.setAttribute('visible', !boxOpen);
                  //curLoot.addEventListener('click', animBox(),
                    //                       once=true);
                  //boxCovers.forEach(function(el, i) {
                    //document.getElementById(el).addEventListener('click', animBox(),
                     //                    once=true);
                   //boxBody.removeEventListener('click', 
                    //                           animBox());
                   //});
                   //closeInst.addEventListener('click', animBox());
                }
                
                boxOpen = !boxOpen;
                console.log(999999999);

            }
        });
}});