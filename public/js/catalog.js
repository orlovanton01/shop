var ID=localStorage.getItem('ID');

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
    if (data[i][0]==ID)
        localStorage.setItem('Бренд', data[i][1]);
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
cell1.textContent="ID товара";
let cell2=document.createElement('th');
row.append(cell2);
cell2.id="caption";
cell2.className="col";
let cell3=document.createElement('th');
row.append(cell3);
cell3.className="col";
cell3.id="caption";
let cell4=document.createElement('th');
row.append(cell4);
cell4.className="col";
if (type=='Бренды') {
    let brand=localStorage.getItem('Бренд');
    cell2.textContent="Вид товара";
    cell3.textContent="Цена (руб.)";
    printItems(brand, 1);
}
else {
    let clothes=localStorage.getItem('Одежда');
    cell2.textContent="Бренд";
    cell3.textContent="Цена (руб.)";
    printItems(clothes, 2);
}

function printItems(item, k) {
    for (let i = 0; i < 1000; i++) {
        if (data[i][k]==item) {
            let row=document.createElement('tr');
            table.append(row);
            row.className="row";
            let cell1=document.createElement('th');
            row.append(cell1);
            cell1.className="col-3";
            let cell2=document.createElement('th');
            row.append(cell2);
            cell2.className="col-3";
            let cell3=document.createElement('th');
            row.append(cell3);
            cell3.className="col-3";
            let a=document.createElement('a');
            row.append(a);
            a.className="col-3";
            a.href='#';
            let cell4=document.createElement('td');
            a.append(cell4);
            a.id='link';
            cell1.textContent=data[i][0]
            cell4.className="col-3";
            cell3.textContent=data[i][3];
            if (k==1)
                cell2.textContent=data[i][2];
            else
                cell2.textContent=data[i][1];
            cell4.textContent="В корзину";
            a.addEventListener('click', ()=>{
                toBasket.push([data[i][0], data[i][1], data[i][2], data[i][3]]);
                localStorage.setItem('В корзину', JSON.stringify(toBasket));
            })
        }
    }
    document.body.appendChild(table);
}

localStorage.setItem('ID', null);