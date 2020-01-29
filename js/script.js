$( document ).ready(function() {
	var table1 = new Table({
		id: 'table',
		idPagination: 'table-pagination',
		idHeader: 'table-header',
		perPage: 7
	});
	table1.init();

	$("#select_field").on('click',function() {
		var a = $(this);
		if(a.hasClass('active')){
			a.removeClass('active');
			$('#toggle_form').hide();
		}else{
			a.addClass('active');
			$('#toggle_form').show();
		}
		return false;
	});

	$(document).click( function(event){
		if( $(event.target).closest("#toggle_form").length) 
			return;
			if($('#select_field').hasClass('active')){
				$('#select_field').removeClass('active');
				$('#toggle_form').hide();
			}
		event.stopPropagation();
		return false;
	});

	$('#main__table').sortable({
		containerSelector: 'table',
		itemPath: '> tbody',
		itemSelector: 'tr',
		pullPlaceholder: false,
		placeholder: '<i class="placeholder"></i>',
		onDragStart: function ($item, container, _super) {
			var offset = $item.offset(),
			pointer = container.rootGroup.pointer;
			adjustment = {
				left: pointer.left - offset.left,
				top: pointer.top - offset.top
			};
			_super($item, container);
		},
		onDrag: function ($item, position) {
			$item.css({
				left: position.left - adjustment.left,
				top: position.top - adjustment.top
			});
		}
	});	
});	