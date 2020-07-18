
var Flask = new (function(){
    'use strict';
    return {
        '_endpoints': [["showpostsmobilebytags", ["/blogs_mob/", "/", ".html"], ["tag", "page"]], ["showpostsbytags", ["/blogs/", "/", ".html"], ["tag", "page"]], ["getUpdateOneBlog", ["/update_write_blog/", ".html"], ["post_id"]], ["showpostsmobile", ["/blogs_mob/", ".html"], ["page"]], ["getOneBlog", ["/read_post/", ".html"], ["post_id"]], ["getOneBlogWithSlug", ["/blog_post/", ".html"], ["slug"]], ["showposts", ["/blogs/", ".html"], ["page"]], ["static", ["/static/", ""], ["filename"]], ["postOneBlogWithSlug", ["/write_blog_slug.html"], []], ["publications", ["/publications.html"], []], ["projects", ["/projects.html"], []], ["showMetaData", ["/metadata.html"], []], ["showachive", ["/archive.html"], []], ["about", ["/index.html"], []], ["serve_js", ["/jsglue.js"], []], ["news", ["/news.html"], []]],
        'url_for': function(endpoint, rule) {
            if(typeof rule === "undefined") rule = {};

            var has_everything = false, url = "";

            var is_absolute = false, has_anchor = false, has_scheme;
            var anchor = "", scheme = "";

            if(rule['_external'] === true) {
                is_absolute = true;
                scheme = location.protocol.split(':')[0];
                delete rule['_external'];
            }

            if('_scheme' in rule) {
                if(is_absolute) {
                    scheme = rule['_scheme'];
                    delete rule['_scheme'];
                } else {
                    throw {name:"ValueError", message:"_scheme is set without _external."};
                }
            }

            if('_anchor' in rule) {
                has_anchor = true;
                anchor = rule['_anchor'];
                delete rule['_anchor'];
            }

            for(var i in this._endpoints) {
                if(endpoint == this._endpoints[i][0]) {
                    var url = '';
                    var j = 0;
                    var has_everything = true;
                    var used = {};
                    for(var j = 0; j < this._endpoints[i][2].length; j++) {
                        var t = rule[this._endpoints[i][2][j]];
                        if(typeof t === "undefined") {
                            has_everything = false;
                            break;
                        }
                        url += this._endpoints[i][1][j] + t;
                        used[this._endpoints[i][2][j]] = true;
                    }
                    if(has_everything) {
                        if(this._endpoints[i][2].length != this._endpoints[i][1].length)
                            url += this._endpoints[i][1][j];

                        var first = true;
                        for(var r in rule) {
                            if(r[0] != '_' && !(r in used)) {
                                if(first) {
                                    url += '?';
                                    first = false;
                                } else {
                                    url += '&';
                                }
                                url += r + '=' + rule[r];
                            }
                        }
                        if(has_anchor) {
                            url += "#" + anchor;
                        }

                        if(is_absolute) {
                            return scheme + "://" + location.host + url;
                        } else {
                            return url;
                        }
                    }
                }
            }

            throw {name: 'BuildError', message: "Couldn't find the matching endpoint."};
        }
    };
});