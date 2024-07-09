const cashInput = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const clearBtn = document.getElementById('clear-btn');
const changeDueDiv = document.getElementById('change-due');
const displayCid = document.getElementById('cash-in-drawer');

const price = 3.26;
const cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100],
];

document.getElementById('price').innerHTML = `<b>Price: </b> $${price}`;

const displayCashDrawer = () => {
  displayCid.innerHTML += `<h4>Cash in Drawer:</h4>`;
  cid.map((cash) => `${cash[0]}: $${cash[1].toFixed(2)}`).join('<br>');
};

const checkCashRegister = () => {
  const cashIntg = parseFloat(cashInput.value);
  let change = Number((cashIntg - price).toFixed(2));
  const totalCid = Number(cid.reduce((total, sum) => total + sum[1], 0).toFixed(2));

  changeDueDiv.innerHTML = `<b>Change: </b> $${change}`;
  if (cashIntg < price) {
    changeDueDiv.innerText = 'Customer does not have enough money to purchase the item';
    return;
  }
  if (cashIntg === price) {
    changeDueDiv.innerText = 'No change due - customer paid with exact cash';
    return;
  }
  if (change > totalCid) {
    changeDueDiv.innerText = 'Status: INSUFFICIENT_FUNDS';
    return;
  }

  const currencyUnit = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  const currencyUnitName = ['ONE HUNDRED', 'TWENTY', 'TEN', 'FIVE', 'ONE', 'QUARTER', 'DIME', 'NICKEL', 'PENNY'];
  const changeArr = [];
  const cidShow = [...cid];

  for (let i = 0; i < currencyUnit.length; i += 1) {
    let totalCurrency = 0;
    while (change >= currencyUnit[i] &&
      cidShow[cidShow.length - 1 - i][1] > 0) {
      cidShow[cidShow.length - 1 - i][1] = Number((cidShow[cidShow.length - 1 - i][1] - currencyUnit[i]).toFixed(2));
      change = Number((change - currencyUnit[i]).toFixed(2));
      totalCurrency += currencyUnit[i];
    }
    if (totalCurrency > 0) {
      changeArr.push([currencyUnitName[i], totalCurrency]);
    }
  }

  if (change > 0) {
    changeDueDiv.innerText = 'Status: INSUFFICIENT_FUNDS';
    return;
  }
  const remainCid = cidShow.reduce((total, sum) => total + sum[1], 0);
  if (remainCid === 0) {
    changeDueDiv.innerHTML = `Status: CLOSED<br>${
      changeArr.map((cash) => `${cash[0]}: $${cash[1].toFixed(2)}`).join('<br>')
    }`;
  } else {
    changeDueDiv.innerHTML = `Status: OPEN<br>${
      changeArr.map((cash) => `${cash[0]}: $${cash[1].toFixed(2)}`).join('<br>')
    }`;
  }
  displayCashDrawer();
};

const clearData = () => {
  cashInput.value = '';
  changeDueDiv.innerHTML = '';
  displayCashDrawer();
};

window.onload = displayCashDrawer;
purchaseBtn.addEventListener('click', checkCashRegister);
clearBtn.addEventListener('click', clearData);
cashInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    checkCashRegister();
  }
});
