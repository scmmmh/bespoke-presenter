module.exports = function(target) {
    var runTimer = function() {
        var timer = this;
        timer.startTime = null;
        timer.running = false;
        setInterval(function() {
            if(timer.running) {
                var timePassed = Math.floor((Date.now() - timer.startTime) / 1000);
                var hours = Math.floor(timePassed / 3600);
                timePassed = timePassed - hours * 3600;
                if(hours < 10) {
                    hours = '0' + hours;
                }
                var minutes = Math.floor(timePassed / 60);
                if(minutes < 10) {
                    minutes = '0' + minutes;
                }
                timePassed = timePassed - minutes * 60;
                if(timePassed < 10) {
                    timePassed = '0' + timePassed;
                }
                target.innerHTML = hours + ':' + minutes + ':' + timePassed;
            }
        }, 1000);
    };
    runTimer.prototype.start = function() {
        this.startTime = Date.now();
        this.running = true;
    }
    return new runTimer();
};
