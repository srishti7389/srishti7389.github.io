(function($) {
'use strict';

var projects = [{
	id: "hivado",
	name: "Hivado",
	images: 7,
	year: 2017,
	height: 1306,
	scope: "Branding . Web UI Design . Visual Design . Illustration",
}, {
	id: "cadence",
	name: "Cadence",
	images: 4,
	year: 2017,
	height: 649,
	scope: "Web UI Design",
}, {
	id: "arterior",
	name: "Arterior",
	images: 6,
	year: 2017,
	height: 1150,
	videos: { 2: ["animation", 19, 42.5, 62, 36.1] },
	scope: "Logo Design . Art direction . Web UI Design . Photography",
}, {
	id: "surgemonks",
	name: "Surgemonks",
	images: 5,
	year: 2016,
	height: 754,
	scope: "Logo Design . Web UI Design",
}, {
	id: "logofolio",
	name: "Logofolio",
	images: 6,
	year: 2016,
	height: 519,
	scope: "Logo Design",
}, {
	id: "esin_school",
	name: "Esin School",
	images: 5,
	year: 2015,
	height: 645,
	scope: "Parametric Architecture - Design",
}, {
	id: "titan",
	name: "Titan",
	images: 10,
	year: 2015,
	height: 957,
	scope: "Parametric Architecture - Modeling",
}, {
	id: "memorial",
	name: "Memorial",
	images: 13,
	year: 2015,
	height: 1451,
	scope: "Project Management . Lighting Design . Architectural Detailing . Technical Drawings",
}, {
	id: "urban_insert",
	name: "Coalescence",
	images: 1,
	year: 2014,
	no_download: true,
	scope: "Architecture . Landscape . Master Planning",
	embed: { 0: "<iframe width='560' height='315' src='https://www.youtube.com/embed/uHOVX3xXgfk?rel=0&amp;showinfo=0&amp;color=white&amp;autoplay=1' frameborder='0' allow='autoplay; encrypted-media' autoplay allowfullscreen></iframe>" },
}, {
	id: "institution",
	name: "Sports Complex",
	images: 10,
	year: 2013,
	height: 1236,
	scope: "Architectural Design - Institutional",
}, {
	id: "housing",
	name: "Housing",
	images: 7,
	year: 2012,
	height: 1211,
	scope: "Architectural Design - Housing",
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

var expandImage = function() {
	var img = $("img", this)[0];
	if (!$("div.project-details.single")[0]) {
		$("<div class='project-details single'><div class='inner'></div><a class='next'></a><a class='prev'></a><a class='close'></a></div>").hide().appendTo(body).fadeIn(250);
	}
	var links = $("div.project-details.single > a").removeClass('disabled').data('linkedElem', this);
	if (!$(this).prev("div")[0]) links.filter("a.prev").addClass('disabled');
	if (!$(this).next("div")[0]) links.filter("a.next").addClass('disabled');
	var container = links.siblings("div.inner").removeClass('full').css('background-image', "url(" + img.src + ")").html('');
	var video = $("video", this);
	if (video[0]) {
		video = video.add(video.next("div.play-btn")).clone();
		container.append(video);
	}

	setTimeout(function() {
		var height = 1.0 * container.width() * img.height / img.width;
		if (height < 1.1 * container.height()) {
			container.addClass('full');
		} else {
			if (video[0]) {
				var scale = container.height() / height;
				video.css('transform', "scale(" + scale + ", 1)");
				video.filter("div.play-btn").css("background-size", "7.5% " + (7.5/scale) + "%");
			}
			container.css('height', height);
		}
	}, 100);
	return false;
};
var showProject = function(proj) {
	var container = $("<div class='project-details'><div class='inner'></div><a class='close'></a><a class='download' download></a></div>").hide().appendTo(body).fadeIn(250).children("div.inner");
	var path_prefix = "projects/" + proj.id + "/";
	if (proj.no_download) container.siblings("a.download").remove();
	container.siblings("a.download").attr('href', "projects/full_images/SakshatGoyal-" + proj.id + ".jpg");
	if (!proj.loaded_images) {
		proj.loaded_images = [];
		for (var i = 1; i <= proj.images; i++) {
			proj.loaded_images.push(loadImage(path_prefix + (i < 10 ? "0" : "") + i + ".jpg"))
		}
		proj.loaded_images.push(loadImage("projects/signature.jpg"));
	}
	var appendImage = function(i) {
		if (i >= proj.loaded_images.length) return container.css({ minHeight: 0 });
		var cb = function(success, image) {
			var div;
			if (!success && proj.embed[i]) {
				div = $("<div class='embed_video'></div>").append(proj.embed[i]);
			} else {
				div = $("<div></div>").append(image).click(expandImage);
			}
			div.appendTo(container);
			if (success && proj.videos && proj.videos[i]) {
				var src = "<source src='" + path_prefix + proj.videos[i][0] + ".mp4' type='video/mp4'>";
				var video = $("<video loop>" + src + "\nYour browser does not support the video tag.\n</video><div class='play-btn'></div>").appendTo(div).css({
					left: '' + proj.videos[i][1] + '%',
					top: '' + proj.videos[i][2] + '%',
					width: '' + proj.videos[i][3] + '%',
					height: '' + proj.videos[i][4] + '%',
				}).filter("video");
			}
			appendImage(i+1);
		};
		proj.loaded_images[i].then(function(image) { cb(true, image); }, function(image) { cb(false, image); });
	};
	var min_height = proj.height ? Math.round(proj.height * 10.24) : '100%';
	container.css({ minHeight: min_height, backgroundColor: "#fff" });
	appendImage(0);
};

var addProjects = function() {
	var work_list = $("#worklist > ul"), work_info = $("#workinfos > ul");
	$(projects).each(function(i, proj) {
		var timeout = null;
		var li = $("<li><a href='#' data-project='" + proj.id + "'><span class='title'>" + proj.name + "</span><span class='prefix'>" + proj.year + "</span><span class='scope'>" + proj.scope + "</span></a></li>").appendTo(work_list);
		var info_li = $("<li></li>").appendTo(work_info).
			css('background-image', "url(projects/" + proj.id + "/cover.jpg" + ")");
		li.children("a[data-project]").click(function(e) {
			e.preventDefault();
			showProject(proj);
			return false;
		}).children("span.prefix, span.title").hover(function() {
			info_li.addClass('active').siblings(".active").removeClass('active');
			li.addClass('hover').siblings("li.hover").removeClass('hover');
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
		}, function() {
			timeout = setTimeout(function() {
				if (info_li.hasClass('active')) {
					info_li.removeClass('active').show().fadeOut(250);
					li.removeClass('hover');
				}
				timeout = null;
			}, 500)
		});
	});
};

$(function() {
	body.show();
	if ((window.location.hash || "").indexOf("loaded") >= 0) {
		body.addClass("loading-full preloaded hideloading");
		addProjects();
	} else {
		setTimeout(function() { body.addClass("loaded"); }, 500);
		setTimeout(function() { body.addClass("loading-full"); addProjects(); }, 3000);
	}

	body.on('click', ".project-details > *", function(e) {
		var $this = $(this);
		if ($this.is("div.inner") && $this.parent().hasClass('single')) {
			if (!$this.hasClass('full')) $this.toggleClass('expanded');
		} else if ($this.is('a.close')) {
			$this.parent().fadeOut(250, function() { $(this).remove(); });
		} else if ($this.is('a.download')) {
			e.stopPropagation();
			return true;
		} else if ($this.is('a:not(.close)') && !$this.hasClass('disabled')) {
			expandImage.call(($this.hasClass('next') ? $($this.data('linkedElem')).next("div") : $($this.data('linkedElem')).prev("div"))[0]);
		}
		e.stopPropagation();
		return false;
	}).on('click', ".project-details", function(e) {
		if (!$(this).hasClass('single')) $("a.close", this).click();
	}).on('mouseenter', "div.play-btn", function() {
		var video = $(this).addClass('playing').prev("video")[0];
		video && video.play();
	}).on('mouseleave', "div.play-btn", function() {
		var video = $(this).removeClass('playing').prev("video")[0];
		video && video.pause();
	});

	$(".scroll-down").on("click", hideloading).on('click', function() { return false; });
});

$(window).on('wheel', hideloading);
$(document).on('touchmove', hideloading);

})(jQuery);
