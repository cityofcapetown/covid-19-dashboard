function setExpandLink(expandElementId, link) {
    document.getElementById(expandElementId).href = link;
    return true;
}

function addCard(targetDiv, iframeLink, titleString) {
    var $cardHtml = $((
        "<div class=\"card border-light w-100 h-100 bg-info\">" +
          "<div class=\"card-header p-1\" style=\"height:3rem\">" +
            "<div class=\"row w-100\">" +
              "<div class=\"col-8 mt-1\">" +
                "<h5>" + titleString + "</h5>" +
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
          "<div class=\"card-body embed-responsive embed-responsive-4by3\">" +
            "<iframe class=\"embed-responsive-item\" src=\"" + iframeLink + "\"></iframe>" +
          "</div>" +
        "</div>"
    ));

    $('#' + targetDiv).append( $cardHtml );
};

function addTabbedCard(targetDiv, iframeMaps, titleString) {
    var expandId = targetDiv + "Expand";

    // Populating Tabs
    var tabNavItems = "";
    var tabPanes = "";
    var iframeMapsLength = iframeMaps.length;
    for (var i = 0; i < iframeMapsLength; i++) {
        var tabId = iframeMaps[i].tabId + "Tab";
        var paneId = iframeMaps[i].tabId + "Pane";
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
            "<a class=\"card-link nav-link " + tabActiveClass + "\" data-toggle=\"tab\" role=\"tab\" aria-selected=\""+ ariaSelect + "\"" +
               "id=\"" + tabId + "\" href=\"#" + paneId + "\" aria-controls=\"" + paneId + "\" " +
               "onclick=\"setExpandLink('"+ expandId + "','"+ tabiframeLink +"');\">" +
               tabTitle +
            "</a>"
        );
        // Corresponding Tab
        tabPanes += (
          "<div class=\"tab-pane fade " + paneActiveClass + "\" id=\"" + paneId + "\" role=\"tabpanel\" aria-labelledby=\"" + tabId + "\">" +
            "<iframe class=\"embed-responsive-item\" src=\"" + tabiframeLink + "\"></iframe>" +
          "</div>"
        );
    }

    var $cardHtml = $((
        "<div class=\"card border-light w-100 h-100 bg-info\">" +
          "<div class=\"card-header p-1\" style=\"height:3rem\">" +
            "<div class=\"row w-100\">" +
              "<div class=\"col-8 mt-1\">" +
                "<h5>" + titleString + "</h5>" +
              "</div>" +
              "<div class=\"col-4\">" +
                "<ul class=\"nav nav-tabs card-header-tabs justify-content-end h-100\" id=\"tabList\" role=\"tablist\">" +
                  tabNavItems +
                  "<li class=\"nav-item sticky-top\">" +
                     "<a class=\"card-link nav-link pl-1 pr-0\" id=\""+ expandId + "\" href=\"#\" target=\"_blank\">" +
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
};

function updateCityDashboard() {
    $.getJSON('widgets/private/latest_values.json', function( data ) {
        var latest_update = data.ct_latest_update;
        var latest_tested = data.rsa_latest_tested;
        var latest_confirmed = data.ct_latest_confirmed;
        var latest_deaths = data.rsa_latest_deaths;

        $("#last_updated").text(latest_update);
        $("#tests_conducted").text(latest_tested);
        $("#confirmed_cases").text(latest_confirmed);
        $("#deaths").text(latest_deaths);
    });
};

function updateSADashboard() {
    $.getJSON('widgets/public/latest_values.json', function( data ) {
        var latest_update = data.rsa_latest_update;
        var latest_tested = data.rsa_latest_tested;
        var latest_confirmed = data.rsa_latest_confirmed;
        var latest_deaths = data.rsa_latest_deaths;

        $("#last_updated").text(latest_update);
        $("#tests_conducted").text(latest_tested);
        $("#confirmed_cases").text(latest_confirmed);
        $("#deaths").text(latest_deaths);
    });
};

function updateIntDashboard() {
    $.getJSON('widgets/public/latest_values.json', function( data ) {
        var latest_update = data.global_last_updated;
        var latest_confirmed = data.global_last_confirmed_val;
        var latest_deaths = data.global_last_deaths_val;

        $("#last_updated").text(latest_update);
        $("#confirmed_cases").text(latest_confirmed);
        $("#deaths").text(latest_deaths);
    });
};

function updateBehaviouralDashboard() {
    $.getJSON('widgets/private/behavioural_values.json', function( data ) {
        var last_updated = data.last_updated;
        var mentions = data.mentions;
        var nett_sentiment = data.nett_sentiment;

        $("#last_updated").text(last_updated);
        $("#mentions").text(mentions);
        $("#nett_sentiment").text(nett_sentiment + " %");
    });
};