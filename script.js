$(document).ready(function() {
    // Initialize Select2 for dropdowns
    $('#currency, #country, #timezone').select2();

    // Populate currency dropdown
    const currencies = ['INR', 'CAD', 'USD', 'EUR', 'GBP', 'AUD', 'SGD'];
    currencies.forEach(currency => {
        $('#currency').append(new Option(currency, currency));
    });

    // Populate country dropdown
    const countries = [
        {name: 'India', code: 'IN'},
        {name: 'Singapore', code: 'SG'},
        {name: 'Australia', code: 'AU'},
        {name: 'United States', code: 'US'},
        {name: 'Canada', code: 'CA'},
        {name: 'United Kingdom', code: 'GB'}
    ];
    countries.forEach(country => {
        $('#country').append(new Option(country.name, country.code));
    });

    // Populate timezone dropdown
    const timezones = moment.tz.names();
    timezones.forEach(timezone => {
        $('#timezone').append(new Option(timezone, timezone));
    });

    // Toggle agency fields visibility
    $('#isAgency').change(function() {
        $('#agencyFields').toggleClass('hidden', !this.checked);
    });

    // Handle form submission
    $('#signupForm').submit(function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email') || undefined,
            phoneNumber: formData.get('phoneNumber') || undefined,
            currency: formData.get('currency'),
            orgDisplayName: formData.get('orgDisplayName'),
            orgName: formData.get('orgName').replace(/^https?:\/\//, ''),
            connectorName: formData.get('connectorName'),
            copySegments: formData.get('copySegments') === 'on',
            country: $('#country option:selected').text(),
            countryCode: formData.get('country'),
            isManager: formData.get('isManager') === 'on',
            timezone: formData.get('timezone'),
            isAgency: formData.get('isAgency') === 'on',
            isWhiteLabeledSignUp: formData.get('isWhiteLabeledSignUp') === 'on',
            platform: formData.get('orgName').replace(/^https?:\/\//, ''),
            industry: formData.get('industry'),
            typeId: 'lifesight',
            appsUsed: formData.get('appsUsed') ? formData.get('appsUsed').split(',') : [],
            nurture: formData.get('isWhiteLabeledSignUp') === 'on' ? false : (formData.get('nurture') === 'on'),
            region: 'us-central-1',
            postSignupStatus: {
                isGoalSet: true,
                shopifyPostInstallInit: true
            }
        };

        if (data.isAgency) {
            data.agencyFields = {
                agencyName: formData.get('agencyName'),
                agencyDomain: formData.get('agencyDomain'),
                workspacesCounter: 0
            };
        }

        const environment = formData.get('environment');
        const apiUrls = {
            'production': 'https://console.platform.lifesight.io',
            'staging': 'https://console-platform-stg.lifesight.io',
            'dev': 'https://console-platform-dev.lifesight.io'
        };

        const apiUrl = `${apiUrls[environment]}/api/v1/internal/user-management/sign-up?products=MMM&MTA=null`;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-moda-apikey': formData.get('apiKey'),
                'x-moda-workspace': 'cdp_global'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            $('#result').html('<h2>Success!</h2><pre>' + JSON.stringify(result, null, 2) + '</pre>');
        })
        .catch(error => {
            $('#result').html('<h2>Error</h2><pre>' + error + '</pre>');
        });
    });
});