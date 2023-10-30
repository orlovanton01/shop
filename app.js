const mysql = require("mysql2"); //подключаем БД
const express = require("express"); //подключаем фреймворк express

const expressHbs = require("express-handlebars");
const hbs = require("hbs");

const app = express(); //создаем объект приложение

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

//устанавливаем Handlebars в качестве движка представлений в Express
app.set("view engine", "hbs");



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
    pool.query("select pr_name, pr_manufacturer, price from products", function(err, data) {
        if (err) return console.log(err);
        let result=[];
        for (let i = 0; i < 1000; i++)
            result[i]=[data[i]['pr_manufacturer'], data[i]['pr_name'], data[i]['price']];
        let d={
            d: result,
            title: "Каталог"
        };
        res.render("catalog.hbs", {d:d});
    });
});
// возвращаем форму для добавления данных
app.get("/registration", function(req, res){
    let d={
        title: "Регистрация"
    };
    res.render("registration.hbs", {d:d});
});
// возвращаем браузеру форму для авторизации данных
app.get("/authorization", function (req, res) {
    let d={
        title: "Авторизация"
    };
    res.render("authorization.hbs", {d:d});
});
app.get("/contacs", function(req, res){
    let d={
        title: "О нас"
    };
    res.render("contacs.hbs", {d:d});
});

//получаем отправленные данные со страницы «Регистрация» registration.hbs и добавляем их в БД
app.post("/registration", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const Name = req.body.name;
    const Login = req.body.login;
    const Pass = req.body.pass;
    pool.query("INSERT INTO users (Name, Login, Pass) VALUES (?,?,?)", [Name, Login, Pass], function (err, data) {
            if (err) return console.log(err);
            //пока просто перенаправляем на index.hbs
            res.redirect("/");
            //выводим в консоль в случае успеха
            console.log("Добавил в базу");
        });
});

//получаем отправленные данные со страницы «Авторизация» authorization.hbs и добавляем их в БД
app.post("/authorization", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const Login = req.body.login;
    const Pass = req.body.pass;
    pool.query("select Login, Pass from users where Login=? and Pass=?", [Login, Pass], function (err, data) {
        if (err) return console.log(err);
        if (data.length==0){
            console.log("Неверные логин и пароль, повторите попытку снова");
            res.redirect("/authorization");
        }
        else{
            console.log("Вы авторизованы");
            //перенаправляем на index.hbs
            res.render("index_copy.hbs", {f:true});
        }
    });
});

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});