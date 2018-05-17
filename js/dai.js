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
	var _idf_list=[];
	var _registered = 0;

    for (let i = 0; i < profile.idf_list.length; i++) {
        idf_name = profile.idf_list[i][0].name;
        if(idf_name[idf_name.length-2] == '_'){
            idf_name = idf_name.substr(0, idf_name.length-2) + '-' + idf_name.substr(idf_name.length-1);
        }		
	    idf_func[idf_name] = profile.idf_list[i][0];
        profile.idf_list[i][0] = idf_name;		
		_idf_list.push(profile.idf_list[i][0]);
    }

    for (let i = 0; i < profile.odf_list.length; i++) {
	    odf_name = profile.odf_list[i][0].name;
        if(odf_name[odf_name.length-2] == '_'){
            odf_name = odf_name.substr(0, odf_name.length-2) + '-' + odf_name.substr(odf_name.length-1);
        }		
        odf_func[odf_name] = profile.odf_list[i][0];
        profile.odf_list[i][0] = odf_name;
    }

    function on_data (odf_name, data) {
	    console.log(odf_name);
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

    function push_idf (index) {

        if (!_registered) {
            setTimeout(push_idf, PUSH_INTERVAL, 0);
			return;
        }

        if (index >= _idf_list.length){
            setTimeout(push_idf, PUSH_INTERVAL, 0);
            return;
		} 		
		
		var _idf_name = _idf_list[index];
        data = idf_func[_idf_name]();
		dan2.push(_idf_name, [data]);

        setTimeout(push_idf, PUSH_INTERVAL, index+1);
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
        push_idf(0);
    }    
};


