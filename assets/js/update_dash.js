function updateCityDashboard() {
    $.getJSON('widgets/latest_values.json', function( data ) {
        var rsa_latest_update = data.rsa_latest_update;
        var rsa_latest_tested = data.rsa_latest_tested;
        var rsa_latest_confirmed = data.rsa_latest_confirmed;
        var rsa_latest_deaths = data.rsa_latest_deaths;

        $("#last_updated").text(rsa_latest_update);
        $("#tests_conducted").text(rsa_latest_tested);
        $("#confirmed_cases").text(rsa_latest_confirmed);
        $("#deaths").text(rsa_latest_deaths);
    });
};

function updateSADashboard() {
    $.getJSON('widgets/latest_values.json', function( data ) {
        var rsa_latest_update = data.rsa_latest_update;
        var rsa_latest_tested = data.rsa_latest_tested;
        var rsa_latest_confirmed = data.rsa_latest_confirmed;
        var rsa_latest_deaths = data.rsa_latest_deaths;

        $("#last_updated").text(rsa_latest_update);
        $("#tests_conducted").text(rsa_latest_tested);
        $("#confirmed_cases").text(rsa_latest_confirmed);
        $("#deaths").text(rsa_latest_deaths);
    });
};