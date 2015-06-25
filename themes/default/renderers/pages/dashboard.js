var render = function(theme, data, meta, require) {
    theme('dashboard', {
        title: 'Asset',
        header: [{
            partial: 'header',
            context: data
        }],
        ribbon: [{
            partial: 'dashboard_ribbon',
            context: data
        }],
        listassets: [{
            partial: 'dashboard',
            context: data
        }]
    });
};