var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let changeX = 2;
let changeY = -2;
const ballRadius = 10;
const floorHeight = 10;
const floorWidth = 75;
let floorX = (canvas.width - floorWidth) / 2;
let rightPress = false;
let leftPress = false;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;
let lives = 3;
let livesColor = "#ffa8d8";
const bricks = [];//יצירת מערך ללבנים
//יצירת מטריצה ללבנים
for (let i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickRowCount; j++) {
        bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
}
let playerName = JSON.parse(localStorage.getItem('player'));//שמירת השחקן

document.addEventListener("keydown", keyDownHandler, false);//לחיצת מקש צד
document.addEventListener("keyup", keyUpHandler, false);//עזיבת מקש צד
document.addEventListener("mousemove", mouseMoveHandler, false);//הזזת עכבר

function goToTheHomePage() {//כשלוחצים על כפתור "עמוד הבית" עובר לעמוד הבית
    window.location.assign("../html/homePage.html");
}

function showInstructions() {//להראות את ההוראות או להסתיר אותם
    if (document.getElementById("horaot").style.display == "block") {
        document.getElementById("horaot").style.display = "none";
        setInterval(draw, 10);//המשך משחק
    }
    if (document.getElementById("horaot").style.display === "") {
        document.getElementById("horaot").style.display = "block";
        clearInterval(interval);//עצור משחק
    }
}

//פונקציה שאחראית על הזזת המשטח ע"י העכבר
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;//מרחק בין קצה שמאל של הקנווס למיקום העכבר
    if (relativeX > 0 + floorWidth / 2 && relativeX < canvas.width - floorWidth / 2) {//הרצפה בתוך הקנווס
        floorX = relativeX - floorWidth / 2;//הרצפה תזוז בהתאם לאמצע
    }
}

//פונקציה של הוזזה על ידי לחיצה על המקשים
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {//מקש ימין
        rightPress = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {//מקש שמאל
        leftPress = true;
    }
}

//פונקציה שאחראית על שיחרור המקשים
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {//מקש ימין
        rightPress = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {//מקש שמאל
        leftPress = false;
    }
}

//פונקציה שאחראית על ניפוץ הלבנים
function collisionDetection() {
    //מעבר על כל הלבנים
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            const b = bricks[i][j];
            if (b.status === 1) {//הלבנה קיימת
                if (
                    ballX > b.x &&//מיקום הכדור גדול מקצה הלבנה השמאלי
                    ballX < b.x + brickWidth &&//מיקום הכדור קטן מקצה הלבנה הימני
                    ballY > b.y &&//מיקום הכדור גדול מקצה הלבנה העליון
                    ballY < b.y + brickHeight//מיקום הכדור קטן מהקצה התחתון של הלבנה
                ) {//נמצא בתוך הלבנה
                    changeY = -changeY;//שינוי כיוון
                    b.status = 0;//הלבנה אינה קיימת
                    score += 2;//הגדלת מספר הנקודות
                    if (score / 2 === brickRowCount * brickColumnCount) {//קיבל את מירב הנקודות
                        clearInterval(interval);//הפסקת התזוזה
                        document.getElementById("winOrFailed").style.display = "flex";//יראו את דף הניצחון
                        document.getElementById("winOrFailed").style.flexDirection = "column";
                        document.getElementById("winOrFailedText").innerHTML = "✨ You win!! ✨";
                        document.getElementById("yourScore").innerHTML = "Your score is: " + score + "</br>Your high score is: " + playerName.heighScore;
                        document.getElementById("newGame").addEventListener("click", () => { document.location.reload(); })//התחלת משחק חדש
                        //עדכון נקודות
                        if (playerName.heighScore < score) {//הנקודות הנוכחיות הם יותר מהשיא הקודם
                            playerName.heighScore = score;
                        }
                        localStorage.setItem('player', JSON.stringify(playerName));//עידכון בשחקן
                        localStorage.setItem(playerName.name, JSON.stringify(playerName));
                    }
                }
            }
        }
    }
}

//הפונקציה מציירת בצד הלוח את מספר הנקודות
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffa8d8";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

//הפונקציה מציירת בצד הלוח את כמות החיים שנותרו
function drawLives(color) {
    ctx.font = "16px Arial";
    ctx.fillStyle = color;
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

//פונקציה המציירת את הכדור
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

//פונקציה המציירת את הלבנים
function drawBricks() {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            if (bricks[i][j].status === 1) {
                const brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;//קביעת המרחק לפי הרוחב/גובה והפדינג
                const brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[i][j].x = brickX;//קביעת מיקום הלבנה
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#4f5f75';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//ציור הרצפה
function drawFloor() {
    ctx.beginPath();
    ctx.rect(floorX, canvas.height - floorHeight, floorWidth, floorHeight);
    ctx.fillStyle = "#ffa8d8";
    ctx.fill();
    ctx.closePath();
}

//ציור כל הקנווס
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);//ניקוי הקנווס בכל קריאה לפונקציה
    //קריאה לפונקציות לציור המשחק
    drawBall();
    drawFloor();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives(livesColor);
    //בדיקה האם הכדור מתנגש בקירות ושינוי כיוון הכדור
    if (ballY + changeY - ballRadius < 0) {//קיר
        changeY = -changeY;
    } else if (ballY + changeY > canvas.height - ballRadius) {//תקרה
        if (ballX > floorX && ballX < floorX + floorWidth) {//רצפה זזה
            changeY = -changeY;
        } else {//רצפה
            lives--;//פסילה
            canvas.style.boxShadow="red 1px -10px 20px inset";
            let redBorder=setTimeout(()=>{
                canvas.style.boxShadow="none";
            },2000);
            let heartsText=document.getElementById("hearts");
            if (lives === 2) {
                heartsText.innerHTML="❤️ ❤️"
            } else if (lives === 1) {
                heartsText.innerHTML="❤️"
                heartsText.style.textShadow="0 0 10px #fff, 0 0 20px #fff, 0 0 30px #3e08d4, 0 0 40px #3e08d4, 0 0 50px #3e08d4, 0 0 60px #3e08d4, 0 0 70px #3e08d4";
            }
            if (!lives) {//נגמרו החיים
                clearInterval(interval);//עוצר את המשחק
                //מקפיץ הודעה של GAME OVER
                document.getElementById("winOrFailed").style.display = "flex";
                document.getElementById("winOrFailed").style.flexDirection = "column";
                document.getElementById("winOrFailedText").innerHTML = "GAME OVER";
                document.getElementById("yourScore").innerHTML = "Your score is: " + score + "</br>Your high score is: " + playerName.heighScore;
                document.getElementById("newGame").addEventListener("click", () => { document.location.reload(); })
                //עדכון נקודות
                if (playerName.heighScore < score) {
                    playerName.heighScore = score;
                }
                localStorage.setItem('player', JSON.stringify(playerName));//עדכון בשם המשתמש
                localStorage.setItem(playerName.name, JSON.stringify(playerName));

            } else {//לא נגמרו החיים
                //מיקום הכדור מחדש באמצע והמשך משחק
                ballX = canvas.width / 2;
                ballY = canvas.height - 30;
                changeX = 2;
                changeY = -2;
                floorX = (canvas.width - floorWidth) / 2;
            }
        }
    }
    if (ballX + changeX + ballRadius > canvas.width || ballX + changeX - ballRadius < 0) {//קירות
        changeX = -changeX;
    }
    if (rightPress) {//תזוזה ימינה
        floorX = Math.min(floorX + 7, canvas.width - floorWidth);
    } else if (leftPress) {//תזוזה שמאלה
        floorX = Math.max(floorX - 7, 0);
    }
    ballX += changeX;//הזזת הכדור
    ballY += changeY;
}

document.getElementById("usersignupName").innerHTML = playerName.name;

const interval = setInterval(draw, 10);

