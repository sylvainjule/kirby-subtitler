<?php require_once(__DIR__ . DS . 'translations' . DS . 'helper.php'); ?>

<style>
[data-field="subtitler"] .structure-entries span.index {
    background: #ff6645;
    color: white;
}
</style>


<div class="structure<?php e($field->readonly(), ' structure-readonly') ?>" 
  data-field="subtitler" 
  data-api="<?php __($field->url('sort')) ?>" 
  data-sortable="<?php e($field->sortable() && $field->entries()->count(), 'true', 'false') ?>"
  data-style="<?php echo $field->style() ?>">

<?php echo $field->headline() ?>

  <?php if($file && ($file->type() == 'audio' || $file->type() == 'video')): ?>

  	<?php $values = [];
  		  foreach($field->entries() as $entry) {
	  		  $start = $entry->start();
	  		  $end = $entry->end();
	  		  array_push($values, array('start' => $start, 'end' => $end));
	  	  } ?>

  	<div class="subtitler-ctn-player" href="<?php __($field->url('add')) ?>" data-type="<?php echo $type ?>" data-filename="<?php echo $file->filename() ?>">

		<?php if($file->type() == 'audio'): ?>
  		<audio class="subtitler-player" data-uid="<?php echo $field->page()->uid() ?>" data-fieldname="<?php echo $field->name() ?>" data-values="<?php echo htmlspecialchars(json_encode($values)); ?>">
  			<source src="<?php echo $file->url() ?>" type="<?php echo $file->mime() ?>">
  		</audio>
  		<?php elseif($file->type() == 'video'): ?>
  		<video class="subtitler-player" data-uid="<?php echo $field->page()->uid() ?>" data-fieldname="<?php echo $field->name() ?>" data-values="<?php echo htmlspecialchars(json_encode($values)); ?>">
  			<source src="<?php echo $file->url() ?>" type="<?php echo $file->mime() ?>">
  		</video>
  		<?php endif; ?>

  		<div class="subtitler-progressbar">
  			<div class="subtitler-duration">
  				<div class="subtitler-duration-text">00'00</div>
  				<div class="subtitler-progress">
  					<div class="subtitler-handle">00'00</div>
  				</div>
  				<div class="subtitler-start subtitler-hide">{</div>
  				<div class="subtitler-end subtitler-hide">}</div>
  			</div>
  		</div>
  		<ol class="subtitler-subtitles">
  			<?php foreach($field->entries()->sortBy('start', 'asc') as $entry): ?>
	  			<li class="subtitler-subtitle"
	  				style="left:<?php echo $entry->startprop() * 100 . '%' ?>; width:<?php echo ($entry->endprop() - $entry->startprop()) * 100 . '%' ?>;">
	  			</li>
	  		<?php endforeach; ?>
  		</ol>

  		<div class="subtitler-buttons">
  			<div class="subtitler-buttons-startend">
	  			<div class="subtitler-btn-play">
					<i class="subtitler-play"></i>
					<i class="subtitler-pause subtitler-hide"></i>
	  			</div>
  				<div class="btn btn-rounded subtitler-btn subtitler-btn-blue subtitler-add-start">{</div>
  				<div class="btn btn-rounded subtitler-btn subtitler-btn-blue subtitler-add-end inactive">}</div>
  				<div class="btn btn-rounded subtitler-btn subtitler-btn-blue subtitler-reset-startend inactive"><?php echo subtitlerTranslation('reset') ?></div>
  			</div>
  			<div class="subtitler-buttons-actions">
  				<div class="btn btn-rounded subtitler-btn subtitler-add-entry inactive"><?php echo subtitlerTranslation('add') ?></div>
  			</div>
  		</div>
  	</div>
  <?php endif; ?>

  <div class="structure-entries">
    <?php if(!$field->entries()->count()): ?>
    <div class="structure-empty">
      <?php echo subtitlerTranslation('empty') ?>
    </div>
    <?php else: ?>
    <?php require(__DIR__ . DS . 'styles' . DS . $field->style() . '.php') ?>
    <?php endif ?>
  </div>

</div>