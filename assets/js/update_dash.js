function setExpandLink(expandElementId, link) {
    document.getElementById(expandElementId).href = link;
    return true;
}

function addStatCard(targetDiv, overlayImg, descriptionText){
    var cardElementId = targetDiv + "Element";
    var cardTextId = targetDiv + "Title";

    var $cardHtml = $((
        "<div class=\"card border-light bg-info w-100 h-100\" id='"+ cardElementId + "'>" +
          "<img src=\""+ overlayImg +"\" class=\"card-img h-100\" style=\"opacity: 0.2;\">" +
          "<div class=\"card-img-overlay\">" +
            "<h5 class=\"card-title\" id=\""+ cardTextId + "\">Loading...</h5>" +
            "<p class=\"card-text\">" + descriptionText + "</p>" +
          "</div>" +
        "</div>"
    ));

    $('#' + targetDiv).append( $cardHtml );

    return cardTextId;
};

function setStatValue(cardTextDiv, cardValue, text_suffix="", numeral_format=false){
   if (numeral_format) {
        var floatValue = parseFloat(cardValue);
        var value = numeral(floatValue).format("0.[0]a");
   } else {
        value = cardValue;
   }

   $("#" + cardTextDiv).text(value + text_suffix);
};

function setStatCardValue(cardTextDiv, titleTextJson, titleTextId, text_suffix="", numeral_format=false){
    $.getJSON(titleTextJson, function( data ) {
        setStatValue(cardTextDiv, data[titleTextId], text_suffix, numeral_format)
    });
};

function setStatCardNestedValue(cardTextDiv, titleTextJson, titleTextIds, text_suffix="", numeral_format=false){
    $.getJSON(titleTextJson, function( data ) {
        var value = data[titleTextIds[0]]

        titleTextIds.forEach(function (item, index) {
            if (index > 0){
                value = value[item];
            }
        });

        setStatValue(cardTextDiv, value, text_suffix, numeral_format)
    });
}

function setStatCardNestedValueWithTrend(cardTextDiv, cardElementDiv, textJson, titleTextIds, trendTextIds, percent_val=false, increase_bad=true){
    $.getJSON(textJson, function( data ) {
        var titleTextValue = data[titleTextIds[0]]
        titleTextIds.forEach(function (item, index) {
            if (index > 0){
                titleTextValue = titleTextValue[item];
            }
        });

        var trendTextValue = data[trendTextIds[0]]
        trendTextIds.forEach(function (item, index) {
            if (index > 0){
                trendTextValue = trendTextValue[item];
            }
        });

        var change_indicator = "▲"
        var bg_class = increase_bad ? "bg-danger" : 'bg-success'
        if ((trendTextValue > -0.0005) && (trendTextValue < 0.0005)){
            change_indicator = "-"
            bg_class = "bg-info"
        } else if (trendTextValue < 0){
            change_indicator = "▼"
            bg_class = increase_bad ? "bg-success" : 'bg-danger'
        }
        $("#" + cardElementDiv).removeClass("bg-info")
        $("#" + cardElementDiv).addClass(bg_class)

        var val = numeral(titleTextValue)
        var formattedVal = val.format("0.[0]a")
        if (percent_val) {
            formattedVal = val.format("0.[0]%");
        }

        var text = formattedVal + " (" + change_indicator + numeral(trendTextValue).format("+0.[0]%") + ")"

        setStatValue(cardTextDiv, text)
    });
}

function setStatCardValueFractions(cardTextDiv, titleTextJson, titleNominatorTextId, titleDenominatorTextId, numeral_format=false, colour=false){
    $.getJSON(titleTextJson, function( data ) {
        if (numeral_format) {
            var floatNom = parseFloat(data[titleNominatorTextId]);
            var nom = numeral(floatNom).format("0.[0]a");

            var floatDom = parseFloat(data[titleDenominatorTextId]);
            var dom = numeral(floatDom).format("0.[0]a");
        } else {
            var nom = data[titleNominatorTextId];
            var dom = data[titleDenominatorTextId];
        }

        $("#" + cardTextDiv).text(nom + "/" + dom);

        var fracVal = (floatNom / floatDom);
        var cardElementId = cardTextDiv.replace("Title", "Element")
        if (colour && (fracVal > 0.8)) {
            $("#" + cardElementId).removeClass("bg-info")
            $("#" + cardElementId).addClass("bg-success")
        } else if (colour && (fracVal > 0.6)) {
            $("#" + cardElementId).removeClass("bg-info")
            $("#" + cardElementId).addClass("bg-warning")
        } else if (colour && fracVal <= 0.6) {
            console.log("Danger!")
            $("#" + cardElementId).removeClass("bg-info")
            $("#" + cardElementId).addClass("bg-danger")
        }
    });
};

function addCard(targetDiv, iframeLink, titleString, scrolling="no") {
    var iframeId = targetDiv + "iframe";

    var $cardHtml = $((
        "<div class=\"card border-light w-100 h-100\">" +
          "<div class=\"card-header p-1 ml-0 m-0 bg-info\">" +
            "<div class=\"row row-cols-2 m-0\">" +
              "<div class=\"col-8 mt-1\">" +
                "<h6>" + titleString + "</h6>" +
              "</div>" +
              "<div class=\"col-4\">" +
                "<ul class=\"nav nav-tabs card-header-tabs justify-content-end h-100\" id=\"tabList\" role=\"tablist\">" +
                  "<li class=\"nav-item sticky-top\">" +
                     "<a class=\"card-link nav-link pl-0 pr-0\" id=\"expand\" href=\""+ iframeLink + "\" target=\"_blank\">" +
                       "<img src=\"assets/imgs/external-link-square-alt-solid.svg\" width=\"18\" height=\"18\" style=\"opacity: 0.4;\" class=\"img-fluid\"/>" +
                     "</a>" +
                  "</li>" +
                "</ul>" +
              "</div>" +
            "</div>" +
          "</div>" +
          "<div class=\"card-body embed-responsive embed-responsive-4by3\">" + //
            "<iframe class=\"embed-responsive-item lazyload\" data-src=\"" + iframeLink + "\" id=\"" + iframeId + "\" " +
                     "scrolling=\"" + scrolling + "\"></iframe>" +
          "</div>" +
        "</div>"
    ));

    $('#' + targetDiv).append( $cardHtml );

    // Attempting to override plot's default style sheet
    //$('#' + iframeId).contents().find("head").css("margin", "0px");
};

function addTabbedCard(targetDiv, iframeMaps, titleString) {
    var expandId = targetDiv + "Expand";

    // Populating Tabs
    var tabNavItems = "";
    var tabPanes = "";
    var iframeMapsLength = iframeMaps.length;
    for (var i = 0; i < iframeMapsLength; i++) {
        var tabId = targetDiv + iframeMaps[i].tabId + "Tab";
        var paneId = targetDiv + iframeMaps[i].tabId + "Pane";
        var tabTitle = iframeMaps[i].titleString;
        var tabiframeLink = iframeMaps[i].iframeLink;

        var tabActiveClass = "";
        var paneActiveClass = "";
        var ariaSelect = "false"

        // Setting first one to be the default
        if (i==0){
          tabActiveClass = "active";
          paneActiveClass = "show active"
          ariaSelect = "true";
        }

        // Nav Item
        tabNavItems += (
          "<li class=\"nav-item\">" +
            "<a class=\"card-link nav-link pl-1 pr-1 " + tabActiveClass + "\" data-toggle=\"tab\" role=\"tab\" aria-selected=\""+ ariaSelect + "\"" +
               "id=\"" + tabId + "\" href=\"#" + paneId + "\" aria-controls=\"" + paneId + "\" " +
               "onclick=\"setExpandLink('"+ expandId + "','"+ tabiframeLink +"');\">" +
               tabTitle +
            "</a>"
        );
        // Corresponding Tab
        tabPanes += (
          "<div class=\"tab-pane fade " + paneActiveClass + "\" id=\"" + paneId + "\" role=\"tabpanel\" aria-labelledby=\"" + tabId + "\">" +
            "<iframe class=\"embed-responsive-item lazyload\" data-src=\"" + tabiframeLink + "\"></iframe>" +
          "</div>"
        );
    }

    var $cardHtml = $((
        "<div class=\"card border-light w-100 h-100 bg-info\">" +
          "<div class=\"card-header p-1 ml-1\">" +
            "<div class=\"row row-cols-2 m-0\">" +
              "<div class=\"col-7 mt-1\">" +
                "<h6 class=\"m-0\">" + titleString + "</h6>" +
              "</div>" +
              "<div class=\"col-5\">" +
                "<ul class=\"nav nav-tabs card-header-tabs justify-content-end h-100\" id=\"tabList\" role=\"tablist\">" +
                  tabNavItems +
                  "<li class=\"nav-item sticky-top\">" +
                     "<a class=\"card-link nav-link pl-0 pr-0\" id=\""+ expandId + "\" href=\"#\" target=\"_blank\">" +
                       "<img src=\"assets/imgs/external-link-square-alt-solid.svg\" width=\"18\" height=\"18\" style=\"opacity: 0.4;\" class=\"img-fluid\"/>" +
                     "</a>" +
                  "</li>" +
                "</ul>" +
              "</div>" +
            "</div>" +
          "</div>" +
          "<div class=\"card-body embed-responsive embed-responsive-4by3\">" +
            "<div class=\"tab-content\">" +
              tabPanes +
            "</div>" +
          "</div>" +
        "</div>"
    ));

    $('#' + targetDiv).append( $cardHtml );

    // Setting expand link to point at the first one
    setExpandLink(expandId, iframeMaps[0].iframeLink);
};

function addDisclaimerAlert(targetDiv) {
  var $alertHtml = $((
      '<div class="alert alert-danger alert-dismissible fade show w-100 mt-2 mb-1" role="alert">' +
        '<strong>CONFIDENTIAL</strong> This content is solely for the consideration of the City of Cape ' +
        'Town\'s Senior Leadership, and <strong>should not</strong> be distributed.' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
      '</div>'
  ));

  $('#' + targetDiv).append( $alertHtml );
}

function addGeneralDisclaimerAlert(targetDiv) {
  var $alertHtml = $((
      '<div class="alert alert-danger alert-dismissible fade show w-100 mt-2 mb-1" role="alert">' +
        '<strong>CONFIDENTIAL</strong> This content is solely for <strong>internal operational use</strong>, ' +
        'and <strong>should not</strong> be distributed.' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
      '</div>'
  ));

  $('#' + targetDiv).append( $alertHtml );
}

function addBetaDisclaimerAlert(targetDiv) {
  var $alertHtml = $((
      '<div class="alert alert-warning alert-dismissible fade show w-100 mt-2 mb-1" role="alert">' +
        'This vulnerability viewer is currently in <strong>Beta testing</strong>, ' +
        'and is liable to change without warning. It should be used with <strong>caution</strong>.' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
      '</div>'
  ));

  $('#' + targetDiv).append( $alertHtml );
}

function addRedirectAlert(targetDiv) {
  var $alertHtml = $((
      '<div class="alert alert-warning fade show w-100 mt-2 mb-1" role="alert">' +
        'You are being redirected to <a href="https://datascience.capetown.gov.za/vulnerability-viewer/ct-vulnerability-viewer.html">' +
        'the new version of the Vulnerability Viewer</a>.<br>' +
        'Click on the link above to go there sooner! ' +
        'It <strong> should have </strong> all of this content and more. Please let the Data Science unit know if it does not.<br>' +
        'When prompted, please use your normal City Windows credentials to log in.' +
      '</div>'
  ));

  $('#' + targetDiv).append( $alertHtml );
}

function addNavbar(targetDiv) {
  const NavbarPages = [
    {title: "Cape Town", link:"ct-covid-dash-city.html"},
    {title: "South Africa", link:"ct-covid-dash-sa.html"},
    {title: "Business Continuity", link:"ct-covid-dash-business-cont.html"},
    {title: "Behavioural", link:"ct-covid-dash-behavioural.html"},
    {title: "International", link:"ct-covid-dash-int.html"}
  ];
  var currentPageFileName = location.href.split("/").slice(-1);

  var navbarItemsHtml = '';
  var navbarLength = NavbarPages.length;
  for (var i = 0; i < navbarLength; i++) {
     navItemClasses = "nav-item"
     navItemLink = NavbarPages[i].link
     navItemContent = NavbarPages[i].title

     if (navItemLink == currentPageFileName) {
        navItemClasses += " active";
        navItemLink = "#";
        navItemContent += '<span class="sr-only">(current)</span>';
     }

     navbarItemsHtml += (
        '<li class="' + navItemClasses +'">' +
          '<a class="nav-link" href="' + navItemLink + '">' + navItemContent + '</a>' +
        '</li>'
     );
  }

  var $navbarHtml = $((
    '<nav class="navbar navbar-expand-lg navbar-light bg-light navbar-fixed-top p-0 align-items-center" id="navbar" style="height:8vh">' +
        '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"' +
                'aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">' +
            '<span class="navbar-toggler-icon"></span>' +
        '</button>' +
        '<a class="navbar-brand h-100 align-middle pl-2" href="ct-covid-dash-city.html" style="max-height:75px">' +
            '<img src="./assets/imgs/rect_city_logo.png" class="h-100 align-middle" alt="">' +
        '</a>' +
        '<div class="collapse navbar-collapse" id="navbarNav">' +
            '<ul class="navbar-nav">' +
              navbarItemsHtml +
            '</ul>' +
        '</div>' +
    '</nav>'
    ));

    $('#' + targetDiv).append( $navbarHtml );
};

function addFooter(targetDiv) {
  var $footerHtml = $((
    '<footer class="pt-3 my-md-3 pt-md-3 border-top">' +
       '<div class="row text-center text-muted">' +
         '<div class="col">' +
           '<img height="125px" src="./assets/imgs/cct_logo_white_clear_bg_cropped.png"/>' +
         '</div>' +
       '</div>' +
       '<div class="row text-center text-muted mt-3">' +
         '<div class="col">' +
           '<p>' +
             'Made with <span class="heart">❤</span> by the Data Science Unit in Organisational Performance Management <br/>' +
              'Notice something wrong? Please' +
              '<a href="mailto:Riaz.Arbi@capetown.gov.za,DelynoJohannes.DuToit@capetown.gov.za,Gordon.Inggs@capetown.gov.za"> let us know</a> straight away!' +
           '</p>' +
           '<p id="assetList">' +
             'We\'ve had a lot of help - to name but a few: ' +
           '</p>' +
         '</div>' +
       '</div>' +
    '</footer>'
  ));

  $('#' + targetDiv).append( $footerHtml );

  $.getJSON('assets/js/city_assets.json', function( data ) {
    var people = data;
    var peopleLength = data.length;

    var $htmlText = $("#assetList").text() + people[0].name;
    for (var i = 1; i < (peopleLength-1); i++) {
      $htmlText += ", " + people[i].name;
    }
    $htmlText += " and " + people[peopleLength-1].name;

    $("#assetList").text($htmlText);
  });
}

function addBackgroundVideoSrc(backgroundVideoSrcId, backgroundVideoId, videoUrl) {
    $("#" + backgroundVideoSrcId).attr('src', videoUrl);

    var backgroundVideo = $("#" + backgroundVideoId)[0]
    backgroundVideo.load();
    backgroundVideo.play();
}
