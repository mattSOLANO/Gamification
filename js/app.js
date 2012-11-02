var sort_by;

(function() {
    // utility functions
    var default_cmp = function(a, b) {
            if (a == b) return 0;
            return a < b ? -1 : 1;
        },
        getCmpFunc = function(primer, reverse) {
            var dfc = default_cmp, // closer in scope
                cmp = default_cmp;
            if (primer) {
                cmp = function(a, b) {
                    return dfc(primer(a), primer(b));
                };
            }
            if (reverse) {
                return function(a, b) {
                    return -1 * cmp(a, b);
                };
            }
            return cmp;
        };

    // actual implementation
    sort_by = function() {
        var fields = [],
            n_fields = arguments.length,
            field, name, reverse, cmp;

        // preprocess sorting options
        for (var i = 0; i < n_fields; i++) {
            field = arguments[i];
            if (typeof field === 'string') {
                name = field;
                cmp = default_cmp;
            }
            else {
                name = field.name;
                cmp = getCmpFunc(field.primer, field.reverse);
            }
            fields.push({
                name: name,
                cmp: cmp
            });
        }

        // final comparison function
        return function(A, B) {
            var a, b, name, result;
            for (var i = 0; i < n_fields; i++) {
                result = 0;
                field = fields[i];
                name = field.name;

                result = field.cmp(A[name], B[name]);
                if (result !== 0) break;
            }
            return result;
        };
    };
}());


function Inflexxionite(data){
	var self = this;
	self.name = data.name;
	self.email = data.email;
	self.points = ko.observable(data.points);
	self.completed = data.completed;
	self.badges= ko.observableArray(data.badges);
	self.powerup = ko.observable(data.powerup);
	self.level = ko.computed(function() {
        if (self.points() === 0) {
			return 0;
        }else if (self.points() > 0 && self.points() < 50) {
			return 1;
        }else if (self.points() >= 50 && self.points() < 100) {
			return 2;
        }else if (self.points() >= 100 && self.points() < 150) {
			return 3;
        }else if (self.points() >= 150 && self.points() < 200) {
			return 4;
        }else if (self.points() >= 200 && self.points() < 250) {
			return 5;
        }else if (self.points() >= 250 && self.points() < 300) {
			return 6;
        }else if (self.points() >= 300 && self.points() < 350) {
			return 7;
        }else if (self.points() >= 350 && self.points() < 400) {
			return 8;
        }else if (self.points() >= 400 && self.points() < 450) {
			return 9;
        }else if (self.points() >= 450 && self.points() < 500) {
			return 10;
        }else if (self.points() >= 500 && self.points() < 550) {
			return 11;
        }else if (self.points() >= 550 && self.points() < 600) {
			return 12;
        }else if (self.points() >= 600 && self.points() < 650) {
			return 13;
        }else if (self.points() >= 650 && self.points() < 700) {
			return 14;
        }else if (self.points() >= 700 && self.points() < 750) {
			return 15;
        }else if (self.points() >= 750 && self.points() < 800) {
			return 16;
        }else if (self.points() >= 800 && self.points() < 850) {
			return 17;
        }else if (self.points() >= 850 && self.points() < 900) {
			return 18;
        }else if (self.points() >= 900 && self.points() < 950) {
			return 19;
        }else if (self.points() >= 950 && self.points() < 1000) {
			return 20;
        }else if (self.points() >= 1000) {
			return 21;
        }
    });


}


function Code(data){
	var self = this;
	self.code = data.code;
	self.points = data.points;
	self.type = data.type;
	self.badgeID = data.badgeID;
	self.multiplier= data.multiplier;
}



function GameViewModel() {

	var self = this;

	self.users = ko.observableArray([
		//new Inflexxionite('Matt Solano', 'msolano@inflexxion.com', 0, 0)
	]);

	self.codes = ko.observableArray([
	]);


	self.myEmail = ko.observable();
	self.myCode = ko.observable();
	

	self.mySubmit = function() {


		self.users(null);

		$.getJSON("data.json", function(allData) {

			var mappedUsers = $.map(allData, function(item) { return new Inflexxionite(item);});

			self.users(mappedUsers);


			var myEmailX = self.myEmail();
			var myCodeX = self.myCode().toUpperCase();
			var validEmail = 0;
			var validCode = 0;
			

			$.each(self.users(), function(i,obj){

				var currentPoints = obj.points();

				if(obj.email === myEmailX ){

					validEmail = 1;

					$.each(self.codes(), function(x, y){

						if (y.code === myCodeX){

							if (y.type === "points") {

								validCode = 1;

								if ($.inArray(y.code,obj.completed)==-1){

									obj.completed.push(y.code);

									var currentLevel = obj.level();

									obj.points(currentPoints + (y.points * obj.powerup()));

									self.popup((y.points * obj.powerup()) + " points added to " + obj.name);

									if (obj.level() > currentLevel){
										self.levelUp(obj.level());
									}

									obj.powerup(1);
									
									self.myCode(null);

									self.saveUsers();
								}
								else{
									self.popup("Unfortunately, you may only use a code once.");
								}

							}
							else if (y.type === "badge") {

								validCode = 1;

								if ($.inArray(y.code,obj.completed)==-1){

									obj.completed.push(y.code);

									var currentLevel = obj.level();

									obj.badges.push(y.badgeID);

									obj.points(currentPoints + (y.points * obj.powerup()));

									self.popup((y.points * obj.powerup()) + " points added to " + obj.name);

									if (obj.level() > currentLevel){
										self.levelUp(obj.level());
									}
									
									obj.powerup(1);

									self.myCode(null);

									self.saveUsers();

								}
								else{
									self.popup("You already have this badge. Good for You!");
								}

							}
							else if (y.type === "powerup") {

								validCode = 1;

								if ($.inArray(y.code,obj.completed)==-1){

									if (obj.powerup() === 1){

										obj.completed.push(y.code);

										obj.powerup(y.multiplier);

										self.popup("You've just activated a Power Up! The next code you redeem will be increased by " + ((y.multiplier * 100) - 100) + "%");

										self.myCode(null);

										self.saveUsers();

									}
									else {

										self.popup("Only one Power Up at a time, please.");
									}
								}
								else{
									self.popup("This PowerUp has already been used.");
								}
							}
						}
					});
					if (validCode === 0) {
						self.popup("Haven't seen that code before!");
					}
				}

				

			});
			if (validEmail === 0) {
				self.popup('Email not recognized! Are you sure you work at Inflexxion?');
			}

			self.users.sort(function(a,b){
				if(a.points()> b.points()) return -1;
				if(a.points() <b.points()) return 1;
				if(a.name< b.name) return -1;
				if(a.name >b.name) return 1;
				return 0;
			});

		});
		 
	};


	self.saveUsers = function () {
        $.ajax({
			type : "POST",
			url : "json.php",
			dataType : 'json',
			data : {
				json : ko.toJSON(self.users()) /* convert here only */
			}
		});
	};

	self.popup = function(message){
		$('.popup p').text(message);
		$('.popup').animate({right:'0'}, 300);
	};

	self.levelUp = function(level){
		if (level === 1) {
			$('.levelUp p').text("You've just reached level " + level + "! More points means higher levels!");
			$('.levelUp').delay(200).animate({right:'0'}, 300);
		}
		else if (level > 1) {
			$('.levelUp p').text("You've just reached level " + level + "! Swing by UExD and pick up some candy.");
			$('.levelUp').delay(200).animate({right:'0'}, 300);
		}
	};


	

	$.getJSON("data.json", function(allData) {
        var mappedUsers = $.map(allData, function(item) { return new Inflexxionite(item);});
        self.users(mappedUsers);
		self.users.sort(function(a,b){
			if(a.points()> b.points()) return -1;
			if(a.points() <b.points()) return 1;
			if(a.name< b.name) return -1;
			if(a.name >b.name) return 1;
			return 0;
		});

    });

    $.getJSON("thecodes.json", function(allData) {
        var mappedCodes = $.map(allData, function(item) { return item;});
        self.codes(mappedCodes);
    });

	$('.close').on("click", function(){
		$('.popup').animate({right:'-400'}, 300);
		$('.levelUp').delay(200).animate({right:'-400'}, 300);
	});


	
    

	$("body").on('mouseenter','.new', function(){
		$(this).find('.tip').stop(true,true).fadeIn(100);
    });
    $("body").on('mouseleave','.new', function(){
		$(this).find('.tip').stop(true,true).fadeOut(100);
    });
        
	


}
ko.applyBindings(new GameViewModel());






