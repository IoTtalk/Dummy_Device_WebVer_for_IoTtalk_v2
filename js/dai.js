function UUID () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

var ENDPOINT = null;
function set_endpoint (endpoint) {
        ENDPOINT = endpoint;
    }

var PUSH_INTERVAL = 1000;
function set_PUSH_INTERVAL (interval) {
        PUSH_INTERVAL = interval;
    }	
	
var dai = function (profile, ida) {
    
	var _idf_list=[];
    /*
    profile = {
      'dm_name': <DeviceModel name>,
      'idf_list': [ [<callback function with DeviceFeature name> , [<unit>, ...]], ...],
      'odf_list': [ [<callback function with DeviceFeature name> , [<unit>, ...]], ...],
    }

    ida = {
      'iot_app': <callback function for register successly called>,
    }
    */
    let idf_func = {};
    let odf_func = {};
    let app_id = UUID();
	var _registered = 0;


	
    for (let i = 0; i < profile.idf_list.length; i++) {
        //idf_func[profile['idf_list'][i][0].name] = profile['idf_list'][i][0];
        //profile['idf_list'][i][0] = profile['idf_list'][i][0].name;
        idf_func[profile.idf_list[i][0].name] = profile.idf_list[i][0];
        profile.idf_list[i][0] = profile.idf_list[i][0].name;		
		_idf_list.push(profile.idf_list[i][0]);
    }
    //console.log(idf_func); 
	//console.log(_idf_list); 
	
	
    for (let i = 0; i < profile.odf_list.length; i++) {
        odf_func[profile.odf_list[i][0].name] = profile.odf_list[i][0];
        profile.odf_list[i][0] = profile.odf_list[i][0].name;
    }

    function on_data (odf_name, data) {
        odf_func[odf_name](data);
    }

    function on_signal (cmd, param) {
        console.log('[cmd]', cmd, param);
        return true;
    }

    function init_callback (result) {
      console.log('register:', result);
      if (ida && ida.ida_init) {
        _registered = 1;
        ida.ida_init();
      }
    }

    //var index =0;
    function push_idf (index) {
        if (index >= _idf_list.length){
            setTimeout(push, PUSH_INTERVAL);
            return;
		} 
        if (!_registered) {
            setTimeout(push, PUSH_INTERVAL);
			return;
        }
		var _idf_name = _idf_list[index];
        data = idf_func[_idf_name]();
		dan2.push(_idf_name, [data]);

        push_idf(index+1);
		//index = index+1;
        //setTimeout(push, PUSH_INTERVAL);
    }

    function push(){
        push_idf(0);
    }	
	
    if (!profile['name']) {
        profile['name'] = Math.floor(Math.random() * 100) + '.'+ profile['dm_name'];
    }

    document.title = profile['name'];
    parent.document.title = profile['name'];

    let msg = {
        'id': app_id,
        'on_signal': on_signal,
        'on_data': on_data,
        'name': profile['name'],
        'profile': {'model': profile['dm_name']},
        'accept_protos': ['mqtt'],
    }
    console.log(msg);
    if (profile['idf_list'] && profile['idf_list'].length) {
      msg.idf_list = profile.idf_list;
    }
    if (profile.odf_list && profile.odf_list.length) {
      msg.odf_list = profile.odf_list
    }

	
	dan2.register(ENDPOINT, msg, init_callback);
    
	if (profile.idf_list.length >0){
        push();
    }    
};


