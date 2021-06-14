# Dummy_Device_IoTtalk_v2_Javascript
This is a DA example in Javascript version, which has enabled automatic IDF push/ODF pull.

## Quick Start
Modify **apiUrl** in option
```javascript
apiUrl: 'http://IP:9992'
```
Open index.html in your browser
```
file://file-path-to-index.html
```
After you bind the DA in your IotTalk project, it will send and receive the data automatically.
## API Reference

### `class iottalkjs.DAI`

#### constructor `iottalkjs.DAI(option)`

`options` is an `object`:

- `apiUrl` (`string`): The CSM API URL.
- `deviceModel` (`string`)
- `deviceName` (`string`)
- `deviceAddr` (`string`): Should be a valid UUID string.
- `persistentBinding` (`bool`): Default is `false`.
- `username` (`string`): The DA owner.
- `extraSetupWebpage` (`string`)
- `deviceWebpage` (`string`)
- `onRegister` (`function`): A callback function with signature `function (dan)`.
                             The first argument is the instance of `iottalkjs.DAN.Client`.
- `onDeregister` (`function`): A callback function with signature `function (dan)`.
- `onConnect` (`function`): A callback invoked on MQTT broker connected.
                            The signature is `function (dan)`.
- `onDisconnect` (`function`): A callback function with signature `function (dan)`.
- `pushInterval` (`number`): The push interval in second.
- `interval` (`object`): The key is the device feature name in `string`.
- `idfList` (`Array`): Should be a list of `idf, unit` pairs.
                       Where a `idf, unit` pair can be following format:
    - `[<function pointer>, <unit>]`: e.g.: `[Dummy_Sensor, ['dB']]`
    - `[<df name>, <unit>]`: In this case, since the function pointer is not provided,
                             the auto-push won't be applied.
                             Please checkout the Smartphone example.
- `odfList` (`Array`)

Example:

```javascript
const Dummy_Sensor  = () => { ... };
const Dummy_Control = () => { ... };

const da = new iottalkjs.DAI({
  apiUrl: 'http://IP:9992',
  deviceModel: 'Dummy_Device',
  deviceName: 'MyMagicDevice',
  deviceAddr: '0a14943f-cc88-4f36-a441-dc3f42f03546',
  persistentBinding: true,
  idfList: [[Dummy_Sensor, ['dB']]],
  odfList: [[Dummy_Control, ['dB']]],
});
```

Example of DF name conversion, the valid underscore suffix in function name will be converted to df naming rules:

```javascript
const Acceleration_I = () => { ... };

const da = new iottalkjs.DAI({
 ...
 idfList: [Acceleration_I, ['g']],
 inverval: {
   'Acceleration-I': 42,
 },
});
```

#### `run()`

```
const da = new iottalkjs.DAI({ ... });
da.run();
```
