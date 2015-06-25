var render = function(theme, data, meta, require) {
    theme('single-col-fluid', {
        title: 'Asset',
        header: [{
            partial: 'header',
            context: data
        }],
        ribbon: [{
            partial: 'left-nav',
            context: data
        }],
        listassets: [{
            partial: 'view-asset',
            context: data
        }]
    });
};
