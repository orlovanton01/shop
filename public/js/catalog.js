let d=localStorage.getItem('Данные');
d=d.replace('"', '').split(',');
data=[];
k=0;
for (let i = 0; i < 1000; i++){
    data[i]=[];
    for (let j = 0; j < 3; j++){
        if (k==2+3*i)
            d[k]=Number(d[k]);
        data[i][j]=d[k];
        k++;
    }
}

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
if (type=='Бренды') {
    let brand=localStorage.getItem('Бренд');
    cell1.textContent="Вид товара";
    cell2.textContent="Цена (руб.)";
    printItems(brand, 0);
}
else {
    let clothes=localStorage.getItem('Одежда');
    cell1.textContent="Бренд";
    cell2.textContent="Цена (руб.)";
    printItems(clothes, 1);
}

function printItems(item, k) {
    for (let i = 0; i < 1000; i++) {
        if (data[i][k]==item) {
            let row=document.createElement('tr');
            table.append(row);
            row.className="row";
            let cell1=document.createElement('th');
            row.append(cell1);
            cell1.className="col-4";
            let cell2=document.createElement('th');
            row.append(cell2);
            cell2.className="col-4";
            let a=document.createElement('a');
            row.append(a);
            a.className="col-4";
            a.href='#';
            let cell3=document.createElement('td');
            a.append(cell3);
            a.id='link';
            cell3.className="col-4";
            cell2.textContent=data[i][2];
            if (k==0)
                cell1.textContent=data[i][1];
            else
                cell1.textContent=data[i][0];
            cell3.textContent="В корзину";
            a.addEventListener('click', ()=>{
                toBasket.push([data[i][0], data[i][1], data[i][2]]);
                localStorage.setItem('В корзину', JSON.stringify(toBasket));
            })
        }
    }
    document.body.appendChild(table);
}
