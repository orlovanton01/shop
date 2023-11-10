const mysql = require("mysql2"); //подключаем БД
const express = require("express"); //подключаем фреймворк express
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const bcrypt = require("bcryptjs"); //для генерации hash-пароля, длина хэша 60, поэтому в БД  поле Pass надо увеличить мин до 60
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy; // подключаем passpоrt и стратегию
const ExtractJwt = require("passport-jwt").ExtractJwt; 
const passport = require("passport");

const app = express(); //создаем объект приложение
const port = 3000;

const secretKey = "secret";

let opts = {}; // создаем параметры для работы стратегии c 2 парметрами
opts.jwtFromRequest = ExtractJwt.fromBodyField("jwt");  //берем из реквеста token
opts.secretOrKey = secretKey;

const urlencodedParser = express.urlencoded({ extended: false });
//парсер URL – разбирает URL

// сообщаем Node где лежат ресурсы сайта
app.use(express.static(__dirname + '/public'));

//создаем пул подключений к нашему серверу
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",      //наш хостинг
    user: "root",           //логин к нашей базе
    database: "shop",     //наша база travel, созданная в прошлой работе
    password: ""            //пароль к нашей базе
});

// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs.engine( 
//expressHbs.engine() осуществляет конфигурацию движка
{
layoutsDir: "views/layouts", 
//задает путь к папке с файлами layout относительно корня каталога проекта
defaultLayout: "layout", 
//указывает на название файла шаблона
 extname: "hbs" //задает расширение файлов
}
))

//устанавливаем Handlebars в качестве движка представлений в Express
app.set("view engine", "hbs");

// УСТАНОВКА МАРШРУТОВ
// ===================================================
// 

// маршурут на главную страницу
app.get("/", function(req, res){
    let d={
        title: "shop"
    };
    res.render("index.hbs", {d:d});
});

app.get("/index_copy", function(req, res){
    let d={
        title: "shop"
    };
    res.render("index_copy.hbs", {d:d});
});

app.get("/clothes", function(req, res){
    let d={
        title: "Одежда"
    };
    res.render("clothes.hbs", {d:d});
});

app.get("/shoes", function(req, res){
    let d={
        title: "Обувь"
    };
    res.render("shoes.hbs", {d:d});
});

app.get("/basket", function(req, res){
    let d={
        title: "Корзина"
    };
    res.render("basket.hbs", {d:d});
});

app.get("/catalog", function(req, res){
    pool.query("select * from products", function(err, data) {
        if (err) return console.log(err);
        let result=[];
        for (let i = 0; i < 1000; i++)
            result[i]=[data[i]['ps_id'], data[i]['pr_manufacturer'], data[i]['pr_name'], data[i]['price']];
        let d={
            d: result,
            title: "Каталог"
        };
        res.render("catalog.hbs", {d:d});
    });
});
// возвращаем форму для добавления данных
app.get("/create", function(req, res){
    let d={
        title: "Регистрация"
    };
    res.render("create.hbs", {d:d});
});
app.get("/createfault", function(req, res){
    let d={
        title: "Ошибка регистрации"
    };
    res.render("createfault.hbs", {d:d});
});
// возвращаем браузеру форму для авторизации данных
app.get("/avtoriz", function (req, res) {
    let d={
        title: "Авторизация"
    };
    res.render("avtoriz.hbs", {d:d});
});
app.get("/contacs", function(req, res){
    let d={
        title: "О нас"
    };
    res.render("contacs.hbs", {d:d});
});

// РЕГИСТРАЦИЯ В БАЗЕ travel В ТАБЛИЦЕ users
// ===================================================
//

//получаем отправленные данные из формы со страницы «Регистрация» create.hbs и добавляем их в БД
//.post(маршрут, разбор URL, функция) 
app.post("/create", urlencodedParser, function (req, res) {
    try {
        if (!req.body) {
            return res.sendStatus(400);
            console.log("Ошибка при регистрации", err);
        }
        //проверяем на дубль         
        pool.query("SELECT `Name`, `login` FROM users WHERE `Name` = '" + req.body.name + "' OR Login = '" + req.body.login + "'", (err, rows) => {
            if (err) {
                res.status(400);
                console.log("Ошибка при чтении из бд", err);
            } else if (typeof rows !== 'undefined' && rows.length > 0) {
                console.log('есть в бд')
                res.redirect("/createfault");
                return true;

                //и если нет дубля, добавляем пользователя в БД 				
            } else {
                const Name = req.body.name;
                const Login = req.body.login;

                //генерируем hash-пароль из переданного пороля в реквесте
                const salt = bcrypt.genSaltSync(7);
                const Pass = bcrypt.hashSync(req.body.pass, salt);
                //параметризация ???	
                pool.query("INSERT INTO users (Name, Login, Pass) VALUES (?,?,?)", [Name, Login, Pass], function (err, data) {
                    if (err) return console.log(err);
                    //пока просто перенаправляем на index.hbs, можно добавить иное: страницу, алерт и т.п.
                    res.redirect("/");
                    //выводим в консоль в случае успеха
                    console.log("Добавил в базу");
                })
            }
        })
    } catch (e) {
        console.log(e);
        res.status(400).send('Registration error');
    }
});

// АВТОРИЗАЦИЯ НА САЙТЕ ПО ИМЕЮЩЕЙСЯ ИНФОРМАЦИИ В БАЗЕ В ТАБЛИЦЕ users
// ===================================================
//

// получаем отправленные данные из формы
app.post("/avtoriz", urlencodedParser, function (req, res) {
    try {
        if (!req.body) {
            return res.sendStatus(400);
        }
        //console.log(`${req.body.login}`);
        //берем из базы данные по Login  
        pool.query("SELECT * FROM users WHERE `Login` = '" + req.body.login + "'", (err, result) => {
            if (err) {
                res.sendStatus(400);
                console.log("Ошибка при чтении из бд", err);
                // проверка наличия в БД, если пустая строка, то нет в БД
            } else if (result.length <= 0) {
                console.log(`пользователя ${req.body.login} нет в бд`);
                res.sendStatus(401);
            } else {
                //сравнение hash-пароля из запроса и полученного хэша пароля объекта из базы, спец.функцией
                const match = bcrypt.compareSync(req.body.pass, result[0].Pass);

                //Если true мы пускаем юзера 
                if (match) {
                    //генерируем токен
                    const token = jwt.sign({
                        id_user: result[0].ID,
                        login: result[0].Login
                    }, secretKey, { expiresIn: 120 * 120 });  //можно "1h" и т.п.
                    res.status(200).json({ name: result[0].Name, token: `${token}` });
                    console.log(`Пользователь с таким именем - ${req.body.login} найден в бд, пароль верный,  токен +!`);
                } else {
                    //Выкидываем ошибку что пароль не верный
                    res.status(403).send(`введен не верный пароль`);
                    console.log(`Пользователь с таким именем - ${req.body.login} есть, но пароль не верный!`);
                }
            }
        });
    } catch (e) {
        console.log(e);
        res.status(400).send('Autorization error');
    }
});

app.listen(port, function () {
    console.log(`Сервер ожидает подключения на ${port} порту...`);
});