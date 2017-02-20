(function($) {
    $.fn.extend({
        iosCheckbox: function() {
            this.destroy = function(){
                $(this).each(function() {
            		$(this).next('.ios-ui-select').remove();
                });
            };
            if ($(this).attr('data-ios-checkbox') === 'true') {
                return;
            }
            $(this).attr('data-ios-checkbox', 'true');
            $(this).each(function() {
                /**
                 * Original checkbox element
                 */
                var org_checkbox = $(this);
                /**
                 * iOS checkbox div
                 */
                var ios_checkbox = jQuery("<div>", {
                    class: 'ios-ui-select'
                }).append(jQuery("<div>", {
                    class: 'inner'
                }));

                // If the original checkbox is checked, add checked class to the ios checkbox.
                if (org_checkbox.is(":checked")) {
                    ios_checkbox.addClass("checked");
                }
                // Hide the original checkbox and print the new one.
                org_checkbox.hide().after(ios_checkbox);
                // Add click event listener to the ios checkbox
                ios_checkbox.click(function() {
                    // Toggel the check state
                    ios_checkbox.toggleClass("checked");
                    // Check if the ios checkbox is checked
                    if (ios_checkbox.hasClass("checked")) {
                        // Update state
                        org_checkbox.prop('checked', true);
                    } else {
                        // Update state
                        org_checkbox.prop('checked', false);
                    }
                });
            });
            return this;
        }
    });
})(jQuery);
( function ( document, window, index )
{
	var inputs = document.querySelectorAll( '.inputfile' );
        
        
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;
		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();
			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});
		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});
}( document, window, 0 ));
function readURL(input) {
    
	if (input.files && input.files[0]) {
               var reader = new FileReader();            
		reader.onload = function (e) {
          debugger;
          console.log(e);
			$('#target').attr('src', e.target.result);
            $('#company_logo').val(e.target.result);
      
		}
		
		reader.readAsDataURL(input.files[0]);
	}
}

function pageselectCallback(page_index, jq){                
    var new_content = jQuery('#hiddenresult > .col-sm-12:eq('+page_index+')').clone();              
    $('#Searchresult').empty().append(new_content);
    return false;
}
function initPagination() {
    var num_entries = jQuery('#hiddenresult > .col-sm-12').length;
    $("#Pagination").pagination(num_entries, {
        callback: pageselectCallback,
        items_per_page:1 // Show only one item per page
    });
 }