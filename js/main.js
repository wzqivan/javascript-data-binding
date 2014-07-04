$(document).ready(function(){
		
	var app = {
		config: {
			product_num: 0,
			default_price: 19.95
		},
		cart: new Cart(),
		cartItems : new DataUpdater("number"),
		cartItemList : new DataUpdater("list"),
		cartAmount : new DataUpdater("total"),
		cartSet: function(){
			this.cartItems.set("num", this.cart.getSize());
            this.cartAmount.set("amount", this.cart.getTotal());
            this.cartItemList.set("product", this.cart.getPartial());
		},
		binding: function(){
			var _this = this;
			
			$("#inp-seearch").each(function(){
		        var default_value = $(this).val();
		
		        $(this).focus(function() {
		           if($(this).val() == default_value) $(this).val("");
		        }).blur(function(){
		            if($(this).val().length == 0) $(this).val(default_value);
		        });
            });
	
			$(".btn-menu").click(function() {
				$(".head-navi").slideToggle();
			});
			
			$(document).on( "attach", function(evt) {    
		       $(".btn-del").each(function(){
		        	$(this).on("click", function(){
		
				    	_this.cart.deleteItem($(this).data("index"));
				
				        _this.cartSet(); 
				        $(document).trigger( "attach" );
			        });
		        });
		    });
			
			$(".btn-buy").click(function() {
		        _this.config.product_num++;
		        
		        var new_add_product = new Product( "Model-" + _this.config.product_num, _this.config.default_price );
		        _this.cart.set(new_add_product);
		        
		        _this.cartSet(); 
		        $(document).trigger( "attach" );
		        
		    });
		},
		init: function(){
			this.binding();
            this.cartSet();
		}
		
	};
	
	app.init();
});


function Product(pname, price){
	
  var product = {
	 name: pname,
     price: price
  };
  
  return product;
}


function Cart(){

  var list = {
  	  ele: [],
  	  set: function(item){
  	  	 this.ele.push(item);
  	  },
  	  getSize: function(){
  	  	 return this.ele.length;
  	  },
  	  getPartial: function(){
  	  	 var table_head = "<tr><th class=\"th-name\">Produnct Name</th><th class=\"th-price\">Price</th><th class=\"th-action\">&nbsp;</th></tr>",
  	  	     table_body = "";
  	  	     
  	  	 for(i=0; i<this.ele.length; i++){
  	  	 	table_body += "<tr><td>" 
  	  	 	           + this.ele[i].name 
  	  	 	           + "</td><td class=\"align-center\">$" 
  	  	 	           + this.ele[i].price 
  	  	 	           + "</td><td class=\"align-center\"><button class=\"btn-del\" data-index=\""
  	  	 	           + i 
  	  	 	           + "\">Delele</button></td></tr>";
  	  	 };
  	  	 
  	  	 return table_head + table_body;
  	  },
  	  getTotal: function(){
  	  	 var total = 0;
  	  	 
  	  	 for(i=0; i<this.ele.length; i++){
  	  	 	total = total + parseFloat(this.ele[i].price);
  	  	 };
  	  	
  	  	 return total.toFixed(2);
  	  },
  	  deleteItem: function(item_id){
  	  	this.ele.splice(item_id, 1);
  	  }
  };

  return list;
}


function DataBinder(object_id) {
  
  var propagates = $({});

  // in the form: data-bind-<object_id>="<property_name>"
  var data_attr = "bind-" + object_id,
      message = object_id + ":change";

  $(document).on( "change", "[data-" + data_attr + "]", function( evt ) {
    var $input = $( this );

    propagates.trigger( message, [ $input.data( data_attr ), $input.val() ] );
  });

  propagates.on( message, function( evt, prop_name, new_val ) {
    $( "[data-" + data_attr + "=" + prop_name + "]" ).each( function() {
    	$(this).html(new_val);
    });
  });

  return propagates;
}


function DataUpdater(uid) {
  var binder = new DataBinder(uid),

      data = {
        attributes: {},

        set: function(attr_name, val) {
          this.attributes[ attr_name ] = val;
          binder.trigger( uid + ":change", [ attr_name, val, this ] );
        },

        get: function(attr_name) {
          return this.attributes[ attr_name ];
        },

        _binder: binder
      };

  binder.on( uid + ":change", function(evt, attr_name, new_val, initiator) {
    if ( initiator !== data ) {
      data.set(attr_name, new_val);
    }
  });

  return data;
}
