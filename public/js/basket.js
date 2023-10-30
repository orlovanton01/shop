let products=JSON.parse(localStorage.getItem('В корзину'));

if (products.length==0) {
    let table=document.createElement('table');
    table.className="flex";
    let row=document.createElement('tr');
    table.append(row);
    row.className="row";
    let cell1=document.createElement('th');
    row.append(cell1);
    cell1.id="caption";
    cell1.className="col";
    cell1.textContent="Корзина пуста!";
    document.body.appendChild(table);
}
else{
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
    cell3.id="caption";
    row.append(cell3);
    let cell4=document.createElement('th');
    cell4.className="col";
    row.append(cell4);
    cell1.textContent="Бренд";
    cell2.textContent="Вид товара";
    cell3.textContent="Цена (руб.)";
    let sum=0;

    printBasket(products);

    function printBasket(products){
        for (let i = 0; i < products.length; i++) {
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
            a.href='/basket';
            let cell4=document.createElement('td');
            a.append(cell4);
            a.id='link';
            cell4.className="col-3";
            cell1.textContent=products[i][0];
            cell2.textContent=products[i][1];
            cell3.textContent=products[i][2];
            sum+=products[i][2];
            cell4.textContent="Удалить";
            a.addEventListener('click', ()=>{
                products.splice(i, 1);
                localStorage.setItem('В корзину', JSON.stringify(products));
                printBasket(JSON.parse(localStorage.getItem('В корзину')));
            })
        }
        let row=document.createElement('tr');
        table.append(row);
        row.className="row";
        let cell1=document.createElement('th');
        row.append(cell1);
        cell1.id="caption";
        cell1.className="col-3";
        let a1=document.createElement('a');
        row.append(a1);
        a1.className="col-3";
        a1.href='/basket';
        let cell2=document.createElement('td');
        a1.append(cell2);
        cell2.className="col-3";
        cell2.id='basket_cell';
        a1.id='basket_link';
        a1.addEventListener('click', ()=>{
            localStorage.removeItem('В корзину');
            alert('Оплачено!');
        })
        let cell3=document.createElement('th');
        row.append(cell3);
        cell3.className="col-3";
        cell3.id="caption";
        let a2=document.createElement('a');
        row.append(a2);
        a2.className="col-3";
        a2.href='/basket';
        let cell4=document.createElement('td');
        a2.append(cell4);
        cell4.id='basket_cell';
        a2.id='basket_link';
        cell4.className="col-3";
        a2.addEventListener('click', ()=>{
            localStorage.removeItem('В корзину');
        })
        cell2.textContent="Оплатить";
        cell3.textContent="Итого "+sum;
        cell4.textContent="Очистить корзину";
        document.body.appendChild(table);
    }
}