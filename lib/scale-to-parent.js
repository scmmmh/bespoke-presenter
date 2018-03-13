module.exports = function(options) {
    var element = options.element,
        parent = element.parentNode,
        width = element.offsetWidth,
        height = element.offsetHeight,
        useZoom = options.zoom === 'zoom' || ('zoom' in parent.style && options.zoom !== 'transform'),
        transformProperty = (function(property) {
            var prefixes = 'Moz Webkit O ms'.split(' ');
            return prefixes.reduce(function(currentProperty, prefix) {
                return prefix + property in parent.style ? prefix + property : currentProperty;
            }, property.toLowerCase());
        }('Transform')),
        scale = useZoom ?
            function(ratio) {
                element.style.zoom = ratio;
            } :
            function(ratio) {
                element.style[transformProperty] = 'scale(' + ratio + ')';
            };

        function scale_slide() {
            var xScale = parent.offsetWidth / width,
                yScale = parent.offsetHeight / height;
            scale(Math.min(xScale, yScale));
        }
        scale_slide();
        (options.window || window).addEventListener('resize', scale_slide);
};
