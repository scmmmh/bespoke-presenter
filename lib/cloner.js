module.exports = function(options) {
    var Cloner = function() {
        var cloner = this;
        cloner._observer = new MutationObserver(function() {
            cloner._update();
        });
    };
    Cloner.prototype.clone = function(source, target) {
        this._source = source;
        this._target = target;
        this._observer.disconnect();
        this._observer.observe(this._source, {attributes: true, subtree: true});
    }
    Cloner.prototype._update = function() {
        this._target.innerHTML = this._source.innerHTML;
    }
    return new Cloner();
}
