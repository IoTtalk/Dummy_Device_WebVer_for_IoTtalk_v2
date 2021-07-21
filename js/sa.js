document.addEventListener('DOMContentLoaded', () => {
  function createRow(id, number) {
    const row = document.createElement('tr');
    const block1 = document.createElement('td');
    const block2 = document.createElement('td');
    const value = document.createTextNode(number);
    const timeStr = new Date().toLocaleTimeString(
      'zh-TW',
      {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        fractionalSecondDigits: 3,
      },
    );

    const time = document.createTextNode(timeStr);

    block1.appendChild(time);
    block2.appendChild(value);
    row.appendChild(block1);
    row.appendChild(block2);

    const table = document.getElementById(id);
    table.appendChild(row);

    if (table.rows.length > 10 + 1) {
      table.deleteRow(1);
    }
  }

  function DummySensor_I() {
    const number = Math.floor((1 + Math.random()) * 0x10000);
    createRow('dummySensor', number);
    return [number];
  }

  function DummyControl_O(data) {
    createRow('dummyControl', data);
  }

  const option = {
    apiUrl: 'https://iottalk2.tw/csm',
    deviceModel: 'Dummy_Device',
    deviceName: 'MyDummyDevice',
    idfList: [[DummySensor_I, ['int']]],
    odfList: [DummyControl_O],
    pushInterval: 0,
    interval: {
      'DummySensor-I': 1 / 24,
    },
  };

  const da = new iottalkjs.DAI(option);
  da.run();
});
