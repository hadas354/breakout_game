//ברית מחדל login
document.getElementById("signUp").style.display = 'none';
document.querySelector(".login").style.backgroundColor = "#131d5a";


let user = {
    name: '',
    mail: '',
    password: '',
    heighScore: 0
};
//פונקציה שבוחרת איזה דף להראות עכשיו: את הדף של ה login או signUp
function thePageToShow(className) {
    if (className === "signUp") {
        document.querySelector(".signUp").style.backgroundColor = "#131d5a";
        document.querySelector(".login").style.backgroundColor = "rgba(255, 255, 255, 0)";
        document.getElementById("signUp").style.display = 'block';
        document.getElementById("login").style.display = 'none';
    }
    if (className === "login") {
        document.querySelector(".login").style.backgroundColor = "#131d5a";
        document.querySelector(".signUp").style.backgroundColor = "rgba(255, 255, 255, 0)";
        document.getElementById("login").style.display = 'block';
        document.getElementById("signUp").style.display = 'none';
    }
}
let nowName;
//הפונקציה מכניסה משתמשים חדשים למערכת ומחזירה הודעות שגיאה אם יש בעיה
function getTheName() {
    let isGood = true;
    //הכנסת שם המשתמש לתוך משתנה
    user.name = document.getElementById("signupName").value;
    user.mail = document.getElementById("signupEmail").value;
    user.password = document.getElementById("signupPassword").value;
    let reflection = document.getElementById("massage1");//הודעה למשתמש
    if (user.name === '' || user.mail === '' || user.password === '') {//אין פרט
        reflection.innerHTML = "Please enter your details";
        return;
    }
    //לבדוק האם קיימות שגיאות בקלט
    for (let i = 0; i < localStorage.length; i++) {
        let index = localStorage.key(i);
        let checkName = JSON.parse(localStorage.getItem(index));
        if (checkName.mail === user.mail) {//מייל זה כבר קיים
            reflection.innerHTML = "This email already exists, try to connect through the login";
            isGood = false;//קלט לא טוב
        } else if (checkName.name === user.name) {//שם המשתמש כבר קיים
            reflection.innerHTML = "This username is taken, please choose a different username";
            isGood = false;//קלט לא טוב
        }
    }
    if (!isGood) {//אם הקלט לא תקין הפונקציה לא תכניס את המשתמש
        return;
    } else {//הקלט תקין
        //הכנסה לתוך הlocal storage
        localStorage.setItem(user.name, JSON.stringify(user));
        localStorage.setItem('player', JSON.stringify(user));//שמירה בתור השחקן הנוכחי
        document.getElementById("allPage").style.display = 'none';
        document.getElementById("helloUser").innerHTML = "Hello, " + JSON.parse(localStorage.getItem('player')).name;
    }
}
//בדיקה כאשר נכנס משתמש קיים האם שם המשתמש והסיסמא שלו תואמים
function checkPass() {
    let isGood = false;
    let reflection = document.getElementById("massage2");//ההודעה למשתמש (אם צריך)
    for (let i = 0; i < localStorage.length; i++) {
        nowName = localStorage.key(i);
        let playerName = JSON.parse(localStorage.getItem(nowName));//הכנסת פרטי המקום למשתנה
        if (nowName === document.getElementById("loginName").value) {//השם קיים במערכת
            if (playerName.password === document.getElementById("loginPassword").value) {//הסיסמא תואמת לסיסמא השמורה
                isGood = true;
                user = playerName;
                break;
            } else {
                reflection.innerHTML = "The password or the user name is wrong";
            }
        } else {//שם המשתמש לא קיים במערכת
            reflection.innerHTML = "This user name is not axist";
        }
    }
    if (isGood) {
        localStorage.setItem('player', JSON.stringify(user));//שמירה בתור השחקן הנוכחי
        document.getElementById("allPage").style.display = 'none';
        document.getElementById("helloUser").innerHTML = "Hello, " + JSON.parse(localStorage.getItem('player')).name;
    }
}


// localStorage.clear();