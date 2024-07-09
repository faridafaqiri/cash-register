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
  displayCid.innerHTML = '<h4>Cash in Drawer:</h4>';
  displayCid.innerHTML += cid.map(cash => `${cash[0]}: $${cash[1].toFixed(2)}`).join('<br>');
};

const calculateChange = (cash, price, cid) => {
  let change = Number((cash - price).toFixed(2));
  const totalCid = Number(cid.reduce((total, sum) => total + sum[1], 0).toFixed(2));
  if (cash < price) return { status: 'INSUFFICIENT_FUNDS', change: [] };
  if (cash === price) return { status: 'EXACT_PAYMENT', change: [] };
  if (change > totalCid) return { status: 'INSUFFICIENT_FUNDS', change: [] };

  const currencyUnit = [0.01, 0.05, 0.1, 0.25, 1, 5, 10, 20, 100].reverse();
  const currencyUnitName = ['PENNY', 'NICKEL', 'DIME', 'QUARTER', 'ONE', 'FIVE', 'TEN', 'TWENTY', 'ONE HUNDRED'].reverse();
  const changeArr = [];
  const cidCopy = [...cid].reverse();

  for (let i = 0; i < currencyUnit.length; i++) {
    let totalCurrency = 0;
    while (change >= currencyUnit[i] && cidCopy[i][1] > 0) {
      cidCopy[i][1] = Number((cidCopy[i][1] - currencyUnit[i]).toFixed(2));
      change = Number((change - currencyUnit[i]).toFixed(2));
      totalCurrency += currencyUnit[i];
    }
    if (totalCurrency > 0) changeArr.push([currencyUnitName[i], totalCurrency]);
  }

  if (change > 0) return { status: 'INSUFFICIENT_FUNDS', change: [] };
  const remainCid = cidCopy.reduce((total, sum) => total + sum[1], 0);
  return { status: remainCid === 0 ? 'CLOSED' : 'OPEN', change: changeArr };
};

const displayChange = (result) => {
  if (result.status === 'EXACT_PAYMENT') {
    changeDueDiv.innerText = 'No change due - customer paid with exact cash';
  } else if (result.status === 'INSUFFICIENT_FUNDS') {
    changeDueDiv.innerText = 'Status: INSUFFICIENT_FUNDS';
  } else {
    changeDueDiv.innerHTML = `Status: ${result.status}<br>${result.change.map(cash => `${cash[0]}: $${cash[1].toFixed(2)}`).join('<br>')}`;
  }
};

const checkCashRegister = () => {
  const cashIntg = parseFloat(cashInput.value);
  const result = calculateChange(cashIntg, price, cid);
  displayChange(result);
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
  if (e.key === 'Enter') checkCashRegister();
});
