(function(document, window, $) {
    "use strict";

    /**
     * Singleton of the site
     * @constructor
     */
    function Bouncy() {

        /**
         * The main method (add handlers, call work functions etc.)
         */
        function initPage() {

            /*
            * <!-- EVENTS
            * */

            // Scroll after main menu anchor clicking
            $(document).on("click", ".page_nav_anchor", scrollToPageSection);
            // Scroll after banner button clicking
            $(document).on("click", ".to_bottom_arrow", {
                destination: "#about"
            }, scrollToPageSection);


            $(document).on("click", "video", toggleVideo);

            /*
            * EVENTS END -->
            * */

            let BAR_START_COLOR = "#19bd9a";
            let BAR_END_COLOR = "#e1e4e9";
            setGradientForProgressBars( $(".skill_progress"),
                BAR_START_COLOR, BAR_END_COLOR );

            // Add sliders to the page using the jQuery plugin named "Slick"
            let bouncyHorizontalSlidersOptions = {
                    dots: true,
                    customPaging: () => "<a class='slider_point'></a>",
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 4000
                },
                bouncyVerticalSlidersOptions = {
                    dots: true,
                    customPaging: () => "<a class='slider_point'></a>",
                    arrows: false,
                    draggable: false,
                    vertical: true
                };
            $(".team_slider").slick(bouncyHorizontalSlidersOptions);
            $(".testimonials_slider").slick(bouncyHorizontalSlidersOptions);
            $(".news_slider").slick(bouncyVerticalSlidersOptions);

        }

        /**
         * Set true values for progress bars,
         * take these values from their attribute 'data-progress'
         *
         * @param {HTMLElement[]} progressBars
         * @param {string} startColor
         * @param {string} endColor
         */
        function setGradientForProgressBars(progressBars, startColor, endColor) {
            progressBars.filter("[data-progress]").each( (index, progressBar) => {
                let progress = parseFloat(progressBar.dataset.progress);
                $(progressBar).css(`background`,
                    `linear-gradient(to right, ${startColor}, ${startColor} ${progress}%,
                                               ${endColor} ${progress + 0.1}%, ${endColor})`);
            });
        }

        /**
         * Set a correct behavior for video elements without a 'controls' attribute.
         * Add control elements to the video element after first click on this video.
         * And toggle a play/pause status after each click on this video.
         *
         * @returns {boolean} Prevent the default action of the event
         */
        function toggleVideo() {
            let video = $(this).get(0);
            if ( !$(video).prop("controls") ) {
                $(video).prop("controls", "true");
            }
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            return false;
        }

        /**
         * Page scrolling after clicking on a navigation link
         *
         * @param {object} event
         */
        function scrollToPageSection(event) {
            event.preventDefault();
            event.data = event.data || {};

            let href = $(this).prop("href") || "",
                linkMatch = href.match(/#.*/),
                link = (linkMatch && linkMatch[0].length > 1) ? linkMatch[0] : "body",
                destination = event.data.destination || $(link),
                offset = $(destination).offset();

            $('html, body').animate({
                scrollTop: offset.top,
                scrollLeft: offset.left
            });

            $(this).blur();
        }

        this.initPage = initPage;
    }

    /**
     * Add Google map using Google Maps API
     *
     * @param mapElem
     */
    Bouncy.initMap = function(mapElem = $("#map").get(0)) {
        let uluru = {lat: 50.446159, lng: 30.515426},
            map = new google.maps.Map(mapElem, {
                zoom: 15,
                center: uluru
            }),
            marker = new google.maps.Marker({
                position: uluru,
                map: map
            }),
            mapHoverTitle = $(mapElem).parent().find(".map_title");
        if ( !mapHoverTitle ) {
            return;
        }
        mapHoverTitle.on("click", function() {
            $(this).fadeOut(500);
        });
    };
    window.Bouncy = Bouncy;

    $(document).ready(() => {
        let page = new Bouncy();
        page.initPage();
    });
}(document, window, jQuery));