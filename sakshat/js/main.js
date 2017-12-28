(function($) {
'use strict';

var projects = [{
	id: "hivado",
	name: "Hivado",
	images: 11,
	cover: "cover.png",
	description: "A startup that tries to make luxurious perfumes and colognes more accessible to a larger audience.",
	scope: ["Branding", "Website", "Visual design", "Illustration"],
}, {
	id: "cadence",
	name: "Cadence",
	images: 5,
	cover: "cover.png",
	description: "A web based application meant for marketing agencies.",
	scope: ["Visual design"],
}, {
	id: "parametric_design",
	name: "Parametric Design",
	images: 11,
	path_prefix: "arterior",
	description: "A startup that tries to make luxurious perfumes and colognes more accessible to a larger audience.",
	scope: ["Branding", "Visual design", "Illustration"],
}, {
	id: "housing",
	name: "Housing",
	images: 11,
	path_prefix: "arterior",
	description: "A startup that tries to make luxurious perfumes and colognes more accessible to a larger audience.",
	scope: ["Branding", "Visual design", "Illustration"],
}, {
	id: "urban_insert",
	name: "Urban Insert",
	images: 11,
	path_prefix: "arterior",
	description: "A startup that tries to make luxurious perfumes and colognes more accessible to a larger audience.",
	scope: ["Branding", "Visual design", "Illustration"],
}, {
	id: "arterior",
	name: "Arterior",
	images: 11,
	videos: { 3: ["animation", 19, 42.5, 62, 36.1] },
	description: "A startup that tries to make luxurious perfumes and colognes more accessible to a larger audience.",
	scope: ["Branding", "Visual design", "Illustration"],
}, {
	id: "shades",
	name: "Shades",
	images: 11,
	path_prefix: "arterior",
	description: "A startup that tries to make luxurious perfumes and colognes more accessible to a larger audience.",
	scope: ["Branding", "Visual design", "Illustration"],
}, {
	id: "sports_complex",
	name: "Sports Complex",
	images: 13,
	description: "A startup that tries to make luxurious perfumes and colognes more accessible to a larger audience.",
	scope: ["Branding", "Visual design", "Illustration"],
}, {
	id: "surge_monks",
	name: "Surge Monks",
	images: 7,
	description: "A marketing agency that was slowly transitioning from a few individuals working in an informal setup to becoming an established company with a large team and a healthy portfolio of clients. Also, my first project as a visual designer.",
	scope: ["Logo design", "Web design"],
}, {
	id: "memorial",
	name: "Memorial",
	images: 11,
	path_prefix: "arterior",
	description: "A startup that tries to make luxurious perfumes and colognes more accessible to a larger audience.",
	scope: ["Branding", "Visual design", "Illustration"],
}];
var body = $("body");
var hideloading = function() {
	if (body.hasClass("loading-full") && !body.hasClass("hideloading")) {
		body.addClass("hideloading");
		setTimeout(function() {
			body.addClass("preloaded");
		}, 1500);
	}
};

var loadImage = function(url) {
  return $.Deferred(function(deferred) {
    var image = new Image();
		var unbindEvents = function() {
			// Ensures the event callbacks only get called once.
			image.onload = null;
			image.onerror = null;
			image.onabort = null;
		};

    // Set up event handlers to know when the image has loaded or fails to load due to an error or abort.
    image.onload = function() {
			unbindEvents();
		  deferred.resolve(image);
		};
    image.onerror = image.onabort = function() {
      unbindEvents();
      deferred.reject(image);
    };
    // Setting the src property begins loading the image.
    image.src = url;
	}).promise();
};
var showProject = function(proj) {
	var container = $("<div id='project-details'><div class='inner'></div></div>").hide().appendTo(body).fadeIn(250).children("div.inner");
	var path_prefix = "projects/" + (proj.path_prefix || proj.id) + "/";
	if (!proj.loaded_images) {
		proj.loaded_images = [];
		for (var i = 1; i <= proj.images; i++) {
			proj.loaded_images.push(loadImage(path_prefix + (i < 10 ? "0" : "") + i + ".png"))
		}
	}
	var appendImage = function(i) {
		if (i >= proj.loaded_images.length) return;
		proj.loaded_images[i].then(function(image) {
			var div = $("<div></div>").append(image).appendTo(container);
			if (proj.videos && proj.videos[i]) {
				var src = "<source src='" + path_prefix + proj.videos[i][0] + ".mp4' type='video/mp4'>";
				var video = $("<video loop>" + src + "\nYour browser does not support the video tag.\n</video><div class='play-btn'></div>").appendTo(div).css({
					position: "absolute",
					left: '' + proj.videos[i][1] + '%',
					top: '' + proj.videos[i][2] + '%',
					width: '' + proj.videos[i][3] + '%',
					height: '' + proj.videos[i][4] + '%',
				}).filter("video");
				var playButton = video.siblings("div.play-btn").hover(function() {
					playButton.addClass('playing');
					video[0].play();
				}, function() {
					playButton.removeClass('playing');
					video[0].pause();
				});
				video[0].addEventListener('ended', function() {
					playButton.removeClass('playing');
				}, false);
			}
			appendImage(i+1);
		});
	};
	appendImage(0);
};

$(function() {
	if ((window.location.hash || "").indexOf("loaded") >= 0) {
		body.addClass("preloaded hideloading");
	} else {
		setTimeout(function() { body.addClass("loaded"); }, 250);
		setTimeout(function() { body.addClass("loading-full"); }, 2700);
	}

	var work_list = $("#worklist > ul"), work_info = $("#workinfos > ul");
	$(projects).each(function(i, proj) {
		var info_li = $("<li></li>").css('background-image', "url(projects/" + (proj.path_prefix || proj.id) + "/" + (proj.cover || "cover.jpg") + ")");
		$("<div class='description'></div>").text(proj.description).appendTo(info_li);
		var scope_div = $("<div class='scope'></div>").appendTo(info_li);
		$.each(proj.scope, function(i, s) { $("<p></p>").text(s).appendTo(scope_div); });
		work_info.append(info_li);

		var li = "<li><a href='#' data-project='" + proj.id + "'><span class='prefix'>";
		li += (i < 9 ? "0" : "") + (i + 1) + "</span><span class='title'>" + proj.name + "</span></a></li>";
		var timeout = null;
		$(li).appendTo(work_list).hover(function() {
			info_li.addClass('active').siblings(".active").removeClass('active');
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
		}, function() {
			timeout = setTimeout(function() {
				if (info_li.hasClass('active')) {
					info_li.removeClass('active').show().fadeOut();
				}
				timeout = null;
			}, 250)
		}).children("a[data-project]").click(function(e) {
			e.preventDefault();
			showProject(proj);
			return false;
		});
	});

	body.on('click', "#project-details", function() {
		$("#project-details").fadeOut(250, function() { $(this).remove(); });
	}).on('click', "#project-details > div.inner", function(e) {
		e.stopPropagation();
		return false;
	});

	$(".scroll-down").on("click", hideloading).on('click', function() { return false; });
	$("#main-nav a.selected").click(function() { return false; });
});
$(window).on('wheel', hideloading);
$(document).on('touchmove', hideloading);

})(jQuery);
