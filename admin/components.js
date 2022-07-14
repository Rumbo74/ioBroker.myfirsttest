/**
 * If class as identifier is, you have to reinitialise all select elements.
 * @param {string }selector - id or class name, id: #myID, class: .myClass
 * @param {array} data - as array where the data has to be sorted in which order you like to display them
 */
function fillSelect(selector, data){
	let selectInstance =  M.FormSelect.getInstance($(selector));
	if(selectInstance){
		selectInstance.destroy();
	}

	$(selector).empty();
	$(selector).append('<option vlaue="" selected>Choose</option>');

	for(let d in data){
		$(selector).append('<option vlaue="' + data[d] + '">' + data[d] + '</option>');
	}

	instances = M.FormSelect.init($(selector));
}
