(function(document, window, $) {
    "use strict";

    /**
     * Singleton of the site
     *
     * @param {object} options
     * @constructor
     */
    function Bouncy(options = {}) {
        const BOUNCY_MENU = options.menuElem || $(".page_navigation"),
            AJAX_LOADER = options.ajaxLoader || $(new Image()).attr("src", "/images/ajax-loader.gif");

        /**
         * The main method (add handlers, call work functions etc.)
         */
        function initPage() {

            /*
            * <!-- EVENTS
            * */

            // Toggle fixed / static state of nav. menu
            $(document).on("scroll", {
                menuElem: BOUNCY_MENU
            }, togglePosStateOfNavMenu);

            // Scroll-spy
            $(document).on("scroll", {
                menuElem: BOUNCY_MENU
            }, checkCurrPagePosForNavMenu);

            // Scroll after main menu anchor clicking
            $(document).on("click", ".page_nav_anchor", scrollToPageSection);
            // Scroll after banner button clicking
            $(document).on("click", ".to_bottom_arrow", {
                destination: "#about"
            }, scrollToPageSection);

            // Toggle video state
            $(document).on("click", "video", toggleVideo);

            // AJAX request to the server for new data in the portfolio section
            // 'shown.bs.tab' is a Bootstrap event
            $('a[data-toggle="tab"]').on("shown.bs.tab", showPortfolioWorks);

            // Show modal window after clicking on a portfolio work
            $(document).on("click", ".pictures-grid_hover-block", getPortfolioWorkDetails);

            /*
            * EVENTS END -->
            * */

            let BAR_START_COLOR = "#19bd9a";
            let BAR_END_COLOR = "#e1e4e9";
            setGradientForProgressBars( $(".skill_progress"), BAR_START_COLOR, BAR_END_COLOR );

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

            // Just-add-water CSS animations
            let animPostCommonOptions = {
                    classToAddForFullView: 'full-visible',
                    offset: 150
                };
            $('.anim-post.bounce-in-left').addClass("anim-post-hidden").viewportChecker($.extend({
                classToAdd: 'anim-post-visible animated bounceInLeft'
            }, animPostCommonOptions));
            $('.anim-post.bounce-in-right').addClass("anim-post-hidden").viewportChecker($.extend({
                classToAdd: 'anim-post-visible animated bounceInRight'
            }, animPostCommonOptions));
            $('.anim-post.bounce-in-down').addClass("anim-post-hidden").viewportChecker($.extend({
                classToAdd: 'anim-post-visible animated bounceInDown'
            }, animPostCommonOptions));
            $('.anim-post.bounce-in-up').addClass("anim-post-hidden").viewportChecker($.extend({
                classToAdd: 'anim-post-visible animated bounceInUp'
            }, animPostCommonOptions));
            $('.anim-post.zoom-in').addClass("anim-post-hidden").viewportChecker($.extend({
                classToAdd: 'anim-post-visible animated zoomIn'
            }, animPostCommonOptions));
            $('.anim-post.rotate-in').addClass("anim-post-hidden").viewportChecker($.extend({
                classToAdd: 'anim-post-visible animated rotateIn'
            }, animPostCommonOptions));
        }

        /**
         * Check a current position on the site and update an active link of a navigation menu
         *
         * @param {object} event
         */
        function checkCurrPagePosForNavMenu(event) {
            event.data = event.data || {};
            let menu = event.data.menuElem;
            if (!menu) {
                return;
            }

            let menuLinkElems = $(menu).find(".page_nav_anchor"),
                oldActiveLi = $(menuLinkElems).parent().filter(".active"),
                newActiveLi,
                pageSections = $("*").filter("[id]"),
                offsetYPage = $(window).scrollTop() + 50;

            for (let i = 0; i < pageSections.length; i++) {
                let section = $(pageSections)[i];
                if ( $(section).offset().top > offsetYPage ) {
                    return;
                }
                for (let j = 0; j < menuLinkElems.length; j++) {
                    let linkElem = $(menuLinkElems)[j],
                        anchor = ("" + $(linkElem).prop("href").match(/#.*/)).slice(1);
                    if ( $(section).prop("id") !== anchor ) {
                        continue;
                    }

                    $(oldActiveLi).removeClass("active");
                    oldActiveLi = newActiveLi = $(linkElem).parent();
                    $(newActiveLi).addClass("active");
                }
            }
        }

        /**
         * Toggle fixed/static position state of navigation menu after page scrolling
         *
         * @param {object} event
         */
        function togglePosStateOfNavMenu(event) {
            event.data = event.data || {};
            let menuElem = event.data.menuElem;
            if (!menuElem) {
                return;
            }

            $(menuElem).removeClass("fixed_navigation");
            if ( $(window).scrollTop() >  $(menuElem).offset().top ) {
                $(menuElem).addClass("fixed_navigation");
            }
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
                newPath = (link === "body") ? "" : link.slice(1),
                destination = event.data.destination || $(link),
                offset = $(destination).offset();

            $('html, body').animate({
                scrollTop: offset.top - 10,
                scrollLeft: offset.left
            });

            $(this).blur();

            checkCurrPagePosForNavMenu({
                menuElem: BOUNCY_MENU
            });

            window.history.pushState({}, "", newPath);
        }

        /**
         * AJAX Request of works after tab changing in the 'portfolio' section
         *
         * @param {object} event
         */
        function showPortfolioWorks(event) {
            let tab = event.target,
                tabPaneHref = $(tab).attr("href"),
                tabPane = $(tabPaneHref);
            $(tabPane).append(AJAX_LOADER);
            $(tabPane).load(`content/portfolio.html ${tabPaneHref} > *`);
        }

        /**
         * Show modal window with data about portfolio work
         *
         * @param {object} event
         */
        function getPortfolioWorkDetails(event) {
            let portfolioModal = $("#porfolioModal"),
                portfolioModalTitle = $(portfolioModal).find(".modal-title"),
                portfolioModalTitleBody = $(portfolioModal).find(".modal-body");

            $(portfolioModalTitle).text("Load...");
            $(portfolioModalTitleBody).append(AJAX_LOADER);

            $(portfolioModal).modal('show');
            $(portfolioModal).focus();

            $.getJSON( "content/portfolio_details.json", () => {
                $(AJAX_LOADER).remove();
            })
                .done(( data ) => {
                    $(portfolioModalTitle).text(data.title);
                    $(portfolioModalTitleBody).text(data.description);
                })
                .fail(() => {
                    $(portfolioModalTitle).text("Error");
                    $(portfolioModalTitleBody).text("Can't get the details.");
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

        this.initPage = initPage;
    }

    /**
     * Add Google map on the site using Google Maps API
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