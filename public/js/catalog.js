let d=localStorage.getItem('Данные');
d=d.replace('"', '').split(',');
data=[];
k=0;
for (let i = 0; i < 1000; i++){
    data[i]=[];
    for (let j = 0; j < 4; j++){
        if (k==3+4*i||k==4*i)
            d[k]=Number(d[k]);
        data[i][j]=d[k];
        k++;
    }
}

let r=localStorage.getItem('Отзывы');
r=r.split(',');
remarks=[];
l=0;
for (let i = 0; i < r.length/3; i++){
    remarks[i]=[];
    for (let j = 0; j < 3; j++){
        if (l==1+3*i||l==3*i)
            r[l]=Number(r[l]);
        remarks[i][j]=r[l];
        l++;
    }
}

console.log(remarks);

let type=localStorage.getItem('Тип');

let products=JSON.parse(localStorage.getItem('В корзину'));

if (products==null)
    var toBasket=[];
else
    var toBasket=JSON.parse(localStorage.getItem('В корзину'));

let table=document.createElement('table');
table.className="flex";
let row=document.createElement('tr');
table.append(row);
row.className="row";
let cell1=document.createElement('th');
row.append(cell1);
cell1.id="caption";
cell1.className="col";
let cell2=document.createElement('th');
row.append(cell2);
cell2.className="col";
cell2.id="caption";
let cell3=document.createElement('th');
row.append(cell3);
cell3.className="col";
let cell4=document.createElement('th');
row.append(cell4);
cell4.className="col";
if (type=='Бренды') {
    let brand=localStorage.getItem('Бренд');
    cell1.textContent="Вид товара";
    cell2.textContent="Цена (руб.)";
    printItems(brand, 1);
}
else {
    let clothes=localStorage.getItem('Одежда');
    cell1.textContent="Бренд";
    cell2.textContent="Цена (руб.)";
    printItems(clothes, 2);
}

function printItems(item, k) {
    let m=localStorage.getItem('Счётчик отзывов');
    for (let i = 0; i < 1000; i++) {
        if (data[i][k]==item) {
            let row1=document.createElement('tr');
            table.append(row1);
            row1.className="row";
            let cell1=document.createElement('th');
            row1.append(cell1);
            cell1.className="col-3";
            let cell2=document.createElement('th');
            row1.append(cell2);
            cell2.className="col-3";
            let a1=document.createElement('a');
            row1.append(a1);
            a1.className="col-3";
            a1.href='#';
            let cell3=document.createElement('td');
            a1.append(cell3);
            a1.id='link1';
            cell3.className="col-3";
            cell2.textContent=data[i][3];
            let a2=document.createElement('a');
            row1.append(a2);
            a2.href='/remarks';
            let cell4=document.createElement('td');
            a2.append(cell4);
            a2.className='link2 col-3';
            if (k==1)
                cell1.textContent=data[i][2];
            else
                cell1.textContent=data[i][1];
            cell3.textContent="В корзину";
            cell4.textContent="Добавить отзыв";
            a1.addEventListener('click', ()=>{
                toBasket.push([data[i][1], data[i][2], data[i][3]]);
                localStorage.setItem('В корзину', JSON.stringify(toBasket));
            })
            if (remarks!=null&&remarks[m][1]==data[i][0]){
                let row2=document.createElement('tr');
                table.append(row2);
                row2.className="row";
                let cell5=document.createElement('th');
                row2.append(cell5);
                cell5.id="caption";
                cell5.className="col-3";
                cell5.textContent='id_user';
                let cell6=document.createElement('th');
                row2.append(cell6);
                cell6.className="col-9";
                cell6.id="caption";
                cell6.textContent='Текст отзыва';
                let row3=document.createElement('tr');
                table.append(row3);
                row3.className="row";
                let cell7=document.createElement('th');
                row3.append(cell7);
                cell7.id="caption";
                cell7.className="col-3";
                cell7.textContent=remarks[m][0];
                let cell8=document.createElement('th');
                row3.append(cell8);
                cell8.className="col-9";
                cell8.id="caption";
                cell8.textContent=remarks[m][2];
            
                // while (m<remarks.length)
                //     if (remarks[m][0]==data[i][0])
                m=0;
                console.log(m);
                localStorage.setItem('Счётчик отзывов', m);
            }
            else{
                if (m!=remarks.length-1)
                    m++;
                localStorage.setItem('Счётчик отзывов', m);
            }
        }
    }
    document.body.appendChild(table);
}

let elems=document.getElementsByClassName("link2");
for (let i=0; i<elems.length; i++){
    if (userName !== null) {
        elems[i].style.color='black';
        elems[i].style.display="block";
    }
    else{
        elems[i].textContent='Войдите, чтобы оставить отзыв';
        elems[i].href='/avtoriz';
    }
}
        
//отлавливание кнопки "выход" с header  => сокрытие блока для добавки отзыва
document.getElementById("logOut").addEventListener("click", e => {
    e.preventDefault();
    for (let i=0; i<elems.length; i++){
        elems[i].textContent='Войдите, чтобы оставить отзыв';
        elems[i].href='/avtoriz';
    }
});