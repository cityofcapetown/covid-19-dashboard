function updateCityDashboard() {
    $.getJSON('widgets/latest_values.json', function( data ) {
        var latest_update = data.wc_latest_update;
        var latest_tested = data.rsa_latest_tested;
        var latest_confirmed = data.wc_latest_confirmed;
        var latest_deaths = data.rsa_latest_deaths;

        $("#last_updated").text(latest_update);
        $("#tests_conducted").text(latest_tested);
        $("#confirmed_cases").text(latest_confirmed);
        $("#deaths").text(latest_deaths);
    });
};

function updateSADashboard() {
    $.getJSON('widgets/latest_values.json', function( data ) {
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
    $.getJSON('widgets/latest_values.json', function( data ) {
        var latest_update = data.global_last_updated;
        var latest_confirmed = data.global_last_confirmed_val;
        var latest_deaths = data.global_last_deaths_val;

        $("#last_updated").text(latest_update);
        $("#confirmed_cases").text(latest_confirmed);
        $("#deaths").text(latest_deaths);
    });
};