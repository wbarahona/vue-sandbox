//
// All helpers for handlebars will go here
// ---------------------------------------------------------------------------------------------
module.exports = {
    ucase: ( str ) => {
        return str.fn(this).toUpperCase();
    },
    if_eq: ( a, b, opts ) => {
        if (a === b) {
            return opts.fn(this);
        }

        return opts.inverse(this);
    },
    if_neq: ( a, b, opts ) => {
        if (a !== b) {
            return opts.fn(this);
        }

        return opts.inverse(this);
    },
    modulus: ( a, b, opts ) => {
        if ((a + 1) % b === 0) {
            return opts.fn(this);
        }

        return opts.inverse(this);
    },
    template: ( folder, template ) => {
        const fldr = folder.replace(/\//g, '_');
        const tmplt = template.replace(/\//g, '_');

        const f = handlebars.Handlebars.partials[`${ fldr }/${ tmplt }`];

        if (!f) {
            return 'Partial not loaded';
        }

        return new handlebars.Handlebars.SafeString(f);
    },
    assetPath: (path, context) => {

        return ['/assets', context.data.root.rev[path]].join('/');
    },
    compare: ( v1, op, v2, options ) => {
        const c = {
            eq: function (v1, v2) {
                return v1 === v2;
            },
            neq: function (v1, v2) {
                return v1 !== v2;
            },
            gt: function (v1, v2) {
                return v1 > v2;
            },
            gte: function (v1, v2) {
                return v1 >= v2;
            },
            lt: function (v1, v2) {
                return v1 < v2;
            },
            lt: function (v1, v2) {
                return v1 < v2;
            },
            lte: function (v1, v2) {
                return v1 <= v2;
            },
            and: function (v1, v2) {
                return v1 && v2;
            },
            or: function (v1, v2) {
                return v1 || v2;
            }
        };

        if( Object.prototype.hasOwnProperty.call( c, op ) ) {
            return c[ op ].call( this, v1, v2 ) ? options.fn( this ) : options.inverse( this );
        }

        return options.inverse( this );
    }
};
