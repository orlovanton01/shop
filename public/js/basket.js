let products=JSON.parse(localStorage.getItem('В корзину'));

if (products==null||products.length==0) {
    let table=document.createElement('table');
    table.className="flex";
    let row=document.createElement('tr');
    table.append(row);
    row.className="row-cols-5";
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
    row.className="row-cols-5";
    let cell1=document.createElement('th');
    row.append(cell1);
    cell1.id="caption";
    cell1.className="col";
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
    cell4.id="caption";
    let cell5=document.createElement('th');
    row.append(cell5);
    cell5.className="col";
    cell1.textContent="ID товара";
    cell2.textContent="Бренд";
    cell3.textContent="Вид товара";
    cell4.textContent="Цена (руб.)";
    let sum=0;

    printBasket(products);

    function printBasket(products){
        for (let i = 0; i < products.length; i++) {
            let row=document.createElement('tr');
            table.append(row);
            row.className="row-cols-5";
            let cell1=document.createElement('th');
            row.append(cell1);
            cell1.className="col";
            let cell2=document.createElement('th');
            row.append(cell2);
            cell2.className="col";
            let cell3=document.createElement('th');
            row.append(cell3);
            cell3.className="col";
            let cell4=document.createElement('th');
            row.append(cell4);
            cell4.className="col";
            let a=document.createElement('a');
            row.append(a);
            a.className="col";
            a.href='/basket';
            let cell5=document.createElement('td');
            a.append(cell5);
            a.id='link';
            cell5.className="col";
            cell1.textContent=products[i][0];
            cell2.textContent=products[i][1];
            cell3.textContent=products[i][2];
            cell4.textContent=products[i][3];
            sum+=products[i][3];
            cell5.textContent="Удалить";
            a.addEventListener('click', ()=>{
                products.splice(i, 1);
                localStorage.setItem('В корзину', JSON.stringify(products));
                printBasket(JSON.parse(localStorage.getItem('В корзину')));
            })
        }
        let row=document.createElement('tr');
        table.append(row);
        row.className="row-cols-5";
        let cell1=document.createElement('th');
        row.append(cell1);
        cell1.id="caption";
        cell1.className="col";
        let cell2=document.createElement('th');
        row.append(cell2);
        cell2.id="caption";
        cell2.className="col";
        let a1=document.createElement('a');
        row.append(a1);
        a1.className="col";
        a1.href='/basket';
        let cell3=document.createElement('td');
        a1.append(cell3);
        cell3.className="col";
        cell3.id='basket_cell';
        a1.id='basket_link';
        a1.addEventListener('click', ()=>{
            localStorage.removeItem('В корзину');
            alert('Оплачено!');
        })
        let cell4=document.createElement('th');
        row.append(cell4);
        cell4.className="col";
        cell4.id="caption";
        let a2=document.createElement('a');
        row.append(a2);
        a2.className="col";
        a2.href='/basket';
        let cell5=document.createElement('td');
        a2.append(cell5);
        cell5.id='basket_cell';
        a2.id='basket_link';
        cell5.className="col";
        a2.addEventListener('click', ()=>{
            localStorage.removeItem('В корзину');
        })
        cell3.textContent="Оплатить";
        cell4.textContent="Итого "+sum;
        cell5.textContent="Очистить корзину";
        document.body.appendChild(table);
    }
}