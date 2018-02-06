<div class="modal-content modal-content-<?php echo $modalsize ?>">
  <?php echo $form ?>
</div>


<script>
	(function() {
	    app.modal.root.on('setup', function () {
		    var form = $('.modal .form');

		    var startField = form.find('input[name=start]'),
		        startPropField = form.find('input[name=startprop]'),
		        endField = form.find('input[name=end]'),
		        endPropField = form.find('input[name=endprop]');

		    var _field = form.attr('data-field'),
		    	_field = $('.field-name-'+ _field),
		    	_start = _field.find('.subtitler-start'),
		    	_end = _field.find('.subtitler-end'),
		    	_startTime = _start.attr('data-time'),
		    	_startProp = _start.attr('data-prop'),
		    	_endTime = _end.attr('data-time'),
		    	_endProp = _end.attr('data-prop');

		    startField.val(_startTime);
		    startPropField.val(_startProp);

		    endField.val(_endTime);
		    endPropField.val(_endProp);
	    });
	})();
</script>