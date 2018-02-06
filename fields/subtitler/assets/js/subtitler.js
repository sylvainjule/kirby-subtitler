$(document).ready(function() {
	
	/* Play / pause
	---------------------------------------*/

	$(document).on('click', '.subtitler-btn-play', function(e) {
		var _this = $(this),
			_active = _this.find('.subtitler-play, .subtitler-pause').not('.subtitler-hide'),
			_inactive = _this.find('.subtitler-play.subtitler-hide, .subtitler-pause.subtitler-hide'),
			_player = _this.parent().parent().siblings('.subtitler-player'),
			_playerJS = _player[0];

		_active.addClass('subtitler-hide');
		_inactive.removeClass('subtitler-hide');

	    if (_playerJS.paused) {
	    	_playerJS.play();
	    }
	    else {
	    	_playerJS.pause()
	    }
	});

	
	/* Sync timeupdate
	---------------------------------------*/

	startSubtitlerSync();
	$(document).ajaxSuccess(function() {
		startSubtitlerSync()
    });
	function startSubtitlerSync() {
		// Sync each player
		$('.subtitler-player').each(function() {
			$(this).on('loadedmetadata', function() {
				let _player = $(this);
		    		_playerJS = _player[0],
		    		_ctn = _player.parent();

		    	let _time = _playerJS.duration;
		            _time = formatTime(_time);

			    _ctn.find('.subtitler-duration-text').text(_time);
			});

			$(this).on('timeupdate', function() {
				let _player = $(this);
		    	    _playerJS = _player[0],
		    	    _ctn = _player.parent();

		        let _currentTime = _playerJS.currentTime,
		            _maxTime = _playerJS.duration;
		        
		        if (_currentTime == _maxTime) {
		        	_ctn.find('.subtitler-play').removeClass('subtitler-hide');
		        	_ctn.find('.subtitler-pause').addClass('subtitler-hide');
		        	_currentTime = 0;
		        }

		        compareTime(_ctn, _player, _currentTime);

		        let _progressBar = _ctn.find('.subtitler-progress'),
			        _percent = _currentTime * 100 / _maxTime,
			        _currentTimeText = formatTime(_currentTime);
			       
			    _currentTimeText = (_currentTimeText.indexOf('\'') == -1) ? '00\'' + _currentTimeText : _currentTimeText;

			    _progressBar.css('width', _percent +'%');
			    _progressBar.find('.subtitler-handle').text(_currentTimeText);
		    });
		});
	}

	function compareTime(_ctn, _player, _currentTime) {
		var _values = JSON.parse(_player.attr('data-values'));

		// If there's no start pin yet
		if (_ctn.find('.subtitler-start').hasClass('subtitler-hide')) {

			// Check if it's overlapping an existing marker
			var _isOverlapping = false;
			$.each(_values, function(key, value) {
				var _start = parseFloat(value.start),
				    _end = parseFloat(value.end);

				if (_currentTime.between(_start, _end)) {
					_isOverlapping = true;
				}
			});
			if (_isOverlapping) { 
				disableStartButton(_ctn); 
				return false;
			}

			enableStartButton(_ctn);
		}
		else {
			// Check if it's before start
			var _startTime = _ctn.find('.subtitler-start').attr('data-time');
			if (_currentTime <= _startTime) {
				disableEndButton(_ctn);
				return false;
			}

			// Check if it's overlapping an existing marker
			var _isOverlapping = false;
			$.each(_values, function(key, value) {
				var _start = parseFloat(value.start),
				    _end = parseFloat(value.end);

				if (_currentTime.between(_start, _end) || _end.between(_startTime, _currentTime)) {
					_isOverlapping = true;
				}
			});
			if (_isOverlapping) { 
				disableEndButton(_ctn); 
				return false;
			}

			enableEndButton(_ctn);

		}
	}

	/* Draggable progress bars
	---------------------------------------*/

	var _draggingTime = _draggingBar = _draggingPlayer = false;
    // Trigger the following of the cursor
    $(document).on('mousedown', '.subtitler-duration', function(e) {
    	var _this = $(this),
    		_pageX = e.pageX;

		_draggingTime = true,
		_draggingBar = _this.find('.subtitler-progress');
		_draggingPlayer = _this.parent().siblings('.subtitler-player');

        updateBar(_pageX);
    });
    // Follow the cursor (mousemove) or stop when released (mouseup)
    $(document)
        .on('mouseup', function(e) {
            if (_draggingTime) {
                var _pageX = e.pageX;
                updateBar(_pageX);
				_draggingTime = _draggingBar = _draggingPlayer = false;
            }
        })
        .on('mousemove', function(e) {
            if (_draggingTime) {
                var _pageX = e.pageX;
                updateBar(_pageX);
            }
        });
    // Update progress-bar's width and its associated currentTime
    function updateBar(_pageX) {
        var _player = _draggingPlayer,
        	_playerJS = _player[0],
        	_progressBar = _draggingBar;

        var _totalW = _progressBar.parent().width(),
            _maxTime = _playerJS.duration,
            _position = _pageX - _progressBar.offset().left,
            _propPosition = _position * 100 / _totalW ,
            _propPosition = Math.max(0, _propPosition),
            _propPosition = Math.min(_propPosition, 100);

        _progressBar.css('width', _propPosition +'%');
        _playerJS.currentTime = _maxTime * _propPosition / 100;
    };


	/* Subtitle buttons
	---------------------------------------*/

    $(document).on('click', '.subtitler-add-start', function() {
    	var _this = $(this),
    		_ctn = _this.closest('.subtitler-ctn-player'),
    		_player = _ctn.find('.subtitler-player'),
			_playerJS = _player[0],
			_maxTime = _playerJS.duration,
			_currentTime = _playerJS.currentTime,
			_currentTimeProp = _currentTime / _maxTime;

		_ctn.find('.subtitler-start').css('left', _currentTimeProp * 100 + '%').attr({
			'data-time': _currentTime,
			'data-prop': _currentTimeProp
		}).removeClass('subtitler-hide');

		_this.addClass('filled').text(formatTime(_currentTime));
		showEndButtons(_ctn);
    });
    $(document).on('click', '.subtitler-add-end', function() {
    	var _this = $(this),
    		_ctn = _this.closest('.subtitler-ctn-player'),
    		_player = _ctn.find('.subtitler-player'),
			_playerJS = _player[0],
			_maxTime = _playerJS.duration,
			_currentTime = _playerJS.currentTime,
			_currentTimeProp = _currentTime / _maxTime;

		_ctn.find('.subtitler-end').css('left', _currentTimeProp * 100 + '%').attr({
			'data-time': _currentTime,
			'data-prop': _currentTimeProp
		}).removeClass('subtitler-hide');

		_this.addClass('filled').text(formatTime(_currentTime));
		showAddEntryButton(_ctn);
    });
    $(document).on('click', '.subtitler-reset-startend', function() {
    	var _this = $(this),
    		_ctn = _this.closest('.subtitler-ctn-player');

		resetButtons(_ctn);
    });
    $(document).on('click', '.subtitler-add-entry', function() {
    	var _ctn = $(this).closest('.subtitler-ctn-player');

    	// Open the modal
		app.modal.open(_ctn.attr('href'));
    });

    function showEndButtons(_ctn) {
		_ctn.find('.subtitler-add-end, .subtitler-reset-startend').removeClass('inactive');
	}
	function disableStartButton(_ctn) {
		_ctn.find('.subtitler-add-start').not('.inactive').addClass('inactive');
	}
	function enableStartButton(_ctn) {
		_ctn.find('.subtitler-add-start.inactive').removeClass('inactive');
	}
	function disableEndButton(_ctn) {
		_ctn.find('.subtitler-add-end').not('.inactive').addClass('inactive');
	}
	function enableEndButton(_ctn) {
		_ctn.find('.subtitler-add-end.inactive').removeClass('inactive');
	}
	function resetButtons(_ctn) {
		_ctn.find('.subtitler-start:not(.subtitler-hide), .subtitler-end:not(.subtitler-hide)').removeAttr('data-time').removeAttr('data-prop').addClass('subtitler-hide');
		_ctn.find('.subtitler-add-start').removeClass('filled').text('{');
		_ctn.find('.subtitler-add-end').removeClass('filled').text('}');
		_ctn.find('.subtitler-add-end:not(.inactive), .subtitler-reset-startend:not(.inactive)').addClass('inactive');
		_ctn.find('.subtitler-add-entry:not(.inactive)').addClass('inactive');

		compareTime(_ctn, _ctn.find('.subtitler-player'), _ctn.find('.subtitler-player')[0].currentTime);
	}
	function showAddEntryButton(_ctn) {
		_ctn.find('.subtitler-add-entry').removeClass('inactive');
	}
    
});


// Check if a number is between two values
Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

// Convert duration (s -> 00''00'00)
function formatTime(_seconds) {
    var sec_num = parseInt(_seconds, 10),
        hours   = Math.floor(sec_num / 3600),
        minutes = Math.floor((sec_num - (hours * 3600)) / 60),
        seconds = sec_num - (hours * 3600) - (minutes * 60),
        _newTime = '';


    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}


    if (hours == '00') {
        _newTime = minutes +'\''+ seconds;
    }
    else {
        _newTime = hours+'\'\''+ minutes +'\''+ seconds
    }
    return _newTime;
}
