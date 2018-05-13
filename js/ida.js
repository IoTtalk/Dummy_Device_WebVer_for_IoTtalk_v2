 $(function(){
        set_endpoint('http://140.113.199.198:9992');
		set_PUSH_INTERVAL(500);  // unit: ms
		
        var profile = {
		    'dm_name': 'Dummy_Device',          
			'idf_list':[[Dummy_Sensor,['None']]],
			'odf_list':[[Dummy_Control,['None']]],			
        };
		
        function Dummy_Sensor(){
            return Math.random();
        }
		
        function Dummy_Control(data){
            $('.ODF_value')[0].innerText=data[0];
        }
      
/*******************************************************************/                
        function ida_init(){console.log('Success.');}
        var ida = {
            'ida_init': ida_init,
        }; 
        dai(profile,ida);     
});
