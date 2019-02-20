//animation variable
var ghost;

//heart variable
let heart = [];
let heart_num = 250;

//candy variable
let candy = [];
let candy_num = 250;

//variables for heart images
let heart_img;
let secondheart_img;
let thirdheart_img;
let candyheart_img;

//variable for mousePressed function that allows users to create hearts by clicking
let a;

//variable for mousePressed function that allows users to create candies by clicking
let b;

//variable for mouseDragged function that allows users to create pink hearts by dragging the mouse
let c;

//variable for mouseDragged function that allows users to create candies by dragging the mouse
let e;

//loading the images from the images folder
function preload(){
    heart_img = loadImage('images/heart.png');
    secondheart_img = loadImage('images/secondheart.png');
    thirdheart_img = loadImage('images/thirdheart.png');
    candyheart_img = loadImage('images/candyheart.png');
}

function setup(){
    //creating full screen Canvas
    createCanvas(windowWidth, windowHeight);

    //creating a ghost sprite
    ghost = createSprite(400, 150, 50, 100);

    /*
    load animation in the order: label, first frame, last frame
    store animation in a temporary variable
    */
    var myAnimation = ghost.addAnimation('floating', 'assets/ghost_standing0001.png', 'assets/ghost_standing0007.png');
    ghost.addAnimation('moving', 'assets/ghost_walk0001.png', 'assets/ghost_walk0004.png');
    ghost.addAnimation('spinning', 'assets/ghost_spin0001.png', 'assets/ghost_spin0003.png');

    //creating a group to hold the candyheart images so that candyheart sprite can be created
    heartcandies = new Group ();

    //using a for-loop to create three candyheart images that are sprites and can therefore interact with the ghost
    for(let i=0; i<3; i++){
    //creating three candyheart images that divide the canvas into fourths
    candyheart = createSprite(200 + (i * 400), 300)
    candyheart.addAnimation('normal', 'images/candyheart.png')
    //putting the candyhearts into the 'heartcandies' group
    heartcandies.add(candyheart);
    }

}

function draw() {
    //if else statement for background; the background changes from pink to red depending on where the mouse is
    if (mouseX < width/2){
        background(255, 199, 225);
    }else{
        background(255, 84, 84);
    }

    /*
    if else statement for hearts and candies
    either hearts or candies show up depending on where the mouse is
    heart and candy arrays are in for-loops to allow for interaction
    */
    if (mouseX < width/2){
        for(let i=0; i<heart.length; i++){
            heart[i].display();
            heart[i].move();
            heart[i].rollover(mouseX, mouseY)
        }
    }else{
        for(let i =0; i<candy.length; i++){
            candy[i].display();
            candy[i].move();
            candy[i].rollover(mouseX, mouseY)
        }
    }

    //removes hearts when there are too many to allow for continuous interaction
    if(heart.length > 100){
        heart.splice(0, 1)
    }

    //removes candies when there are too many to allow for continuous interaction
    if(candy.length > 100){
        candy.splice(0, 1)
    }

    /*
    animation for ghost
    if mouse is pressed, spin
    */
    if(mouseIsPressed) {
        ghost.rotation -= 10;
        ghost.changeAnimation('spinning');
    }
    else{
        ghost.rotation = 0;
    }

    /*
    animation for ghost
    when the left arrow is pressed, the ghost flips horizontally and moves left
    when the right arrow is pressed, the ghost unflips and moves right
    when no arrow key is pressed, the ghost doesn't move
    */   
    if(keyIsDown(LEFT_ARROW)){
        ghost.changeAnimation('moving');
        //flip horizontally
        ghost.mirrorX(-1);
        //move left
        ghost.velocity.x = -2
    }
    else if(keyIsDown(RIGHT_ARROW)) {
        ghost.changeAnimation('moving');
        //unflip
        ghost.mirrorX(1);
        //move right
        ghost.velocity.x = 2;
    }
    else{
        //if no arrow key is pressed, don't move
        ghost.changeAnimation('floating');
        ghost.velocity.x = 0;
    }

    /*
    animation for ghost
    when the up arrow is pressed, the ghost moves up
    when the down arrow is pressed, the ghost moves down
    */
    if(keyIsDown(UP_ARROW)){
        ghost.velocity.y = -2
    }
    else if(keyIsDown(DOWN_ARROW)){
        ghost.velocity.y = 2
    }
    else{
        ghost.velocity.y = 0
    }

    //ghost displaces candyheart images, creating the effect that the ghost is pushing them
    ghost.displace(heartcandies);

    //draw sprites
    drawSprites();

  }

/*
interaction with heart and candy arrays

when the mouse is in a location where the background is pink and hearts show up,
a new heart is created with every click of the mouse

when the mouse is in a location where the background is red and candies show up,
a new candy is created with every click of the mouse 
*/
function mousePressed(){
    a = new Heart(mouseX, mouseY, 40, 40, random(0.1,1), color('red'));
    heart.push(a);
    for(let i=0; i<heart.length; i++){
        heart[i].clicked(mouseX, mouseY)
    }

    b = new Candy(mouseX, mouseY, random(20, 40), random(20,40), random(0.1,1), color(random(99, 255), random(99, 255), random(99, 255)));
    candy.push(b)
    for(let i=0; i<candy.length; i++){
        candy[i].clicked(mouseX, mouseY)
    }

}

/*
interaction with heart and candy arrays

when the mouse is in a location where the background is pink and hearts show up,
users can create pink hearts by dragging the mouse

when the mouse is in a location where the background is red and candies show up,
users can create candies by dragging the mouse
*/
function mouseDragged(){
    c = new Heart(mouseX, mouseY, random(40,60), random(40,60), 0.1, color('red'));
    heart.push(c)
    for(let i=0; i<heart.length; i++){
        heart[i].clicked(mouseX, mouseY)
    }

    e = new Candy(mouseX, mouseY, random(40,60), random(40,60), 0.1, color(random(99, 255), random(99, 255), random(99, 255)));
    candy.push(e)
    for(let i=0; i<candy.length; i++){
        candy[i].clicked(mouseX, mouseY)
    }
    
}

//setting up a class for Heart
class Heart{
    constructor(tempX, tempY, tempW, tempH, tempSpeed, tempShade){
        this.x = tempX;
        this.y = tempY;
        this.w = tempW;
        this.h = tempH;
        this.speed = tempSpeed;
        this.shade = tempShade;
        this.over = false;
        this.isclicked = false;
    }

    //setting up boolean that is used for interaction under display()
    rollover(mx, my){
        let d = dist(mx, my, this.x, this.y);
        if(d<this.w){
            this.over = true;
        }else{
            this.over = false;
        }
    }

    //setting up boolean that is used for interaction under display()
    clicked(mx, my){
        let d = dist(mx, my, this.x, this.y);
        if(d< this.w){
            this.isclicked = true;
        }else{
            this.isclicked = false;
        }
    }

    //hearts move in a horizontal motion
    move(){
        this.x = this.x + this.speed;
        if(this.x > width){
            this.x = 0;
        }
    }

     /*
    interaction with hearts
    when you initially click the mouse, a new red heart appears
    when you click the mouse elsewhere, the red heart then changes to a pink heart
    when the mouse rolls over the hearts, they change to purple hearts
    */
    display(){
        fill(this.shade)
        if(this.isclicked){
            image(secondheart_img, this.x, this.y, this.w, this.h);
        }else{
            image(heart_img, this.x, this.y, this.w, this.h);
        }
        if(this.over){
            image(thirdheart_img, this.x, this.y, this.w, this.h);
        }
    }

}

//setting up a class for Candy
class Candy{
    constructor(tempX, tempY, tempW, tempH, tempSpeed, tempShade){
        this.x = tempX;
        this.y = tempY;
        this.w = tempW;
        this.h = tempH;
        this.speed = tempSpeed;
        this.shade = tempShade;
        this.over = false;
        this.isclicked = false;
    }

    //setting up boolean that is used for interaction under display()
    rollover(mx, my){
        let d = dist(mx, my, this.x, this.y);
        if(d<this.w){
            this.over = true;
        }else{
            this.over = false;
        }
    }

    //setting up boolean that is used for interaction under display()
    clicked(mx, my){
        let d = dist(mx, my, this.x, this.y);
        if(d< this.w){
            this.isclicked = true;
        }else{
            this.isclicked = false;
        }
    }

    //candies move in a vertical motion
    move(){
        this.y = this.y + this.speed;
        if(this.y > height){
            this.y = 0;
        }
    }

    /*
    interaction with candies
    when you initially click the mouse, a new candy appears in a pastel green color
    when you click the mouse elsewhere, the candy then changes to a different pastel color because this.shade is defined as color(random(99, 255), random(99, 255), random(99, 255))
    when the animation rolls over the candies, they briefly change to pastel pink
    */
    display(){
        if(this.isclicked){
            fill(66, 244, 155);
        }else{
            fill(this.shade);
        }
        if(this.over){
            fill(255, 199, 225);
        }
        ellipse(this.x, this.y, this.w, this.h);
    }

}
