module.exports = function(doc, structure) {
    function createElement(template) {
        var node = doc.createElement(template.tag);
        if(template.attrs) {
            for(key in template.attrs) {
                node.setAttribute(key, template.attrs[key]);
            }
        }
        if(template.children) {
            for(var idx = 0; idx < template.children.length; idx++) {
                var child = createElement(template.children[idx]);
                node.appendChild(child);
            }
        }
        return node;
    }
    return createElement(structure);
};
