/**
* phpBB3 forum functions
* also contains Scripts for Euphoria Theme
*
* (c) 2014 - failz0r
*/

function InitQuickLogin() {

	// check if quick login panel is used at all
	if( $("#login-trigger") == null ) return false;

	$("#login-trigger").obj.onclick = function (e) {
		e.preventDefault();

		var $qform = $("#quicklogin-form") || false;
		var $link  = $(this).parent();

		if ($qform) {
			if ($qform.is(":visible")) {
				$qform.hide();
				$link.removeClass("active");
			} else {
				$qform.obj.style.display = "block";
				$link.addClass("active");
			}
		}

		e.stopPropagation();
		return false;
	}

	$("body").on("click", function(e) {
		$("#login-trigger").parent().removeClass("active");
		$("#quicklogin-form").hide();
	});

	$("#quicklogin-form").on("click", function (e) {
		e.stopPropagation();
	});

        initSelectionPrevention( "mcp-nav-main" );
	initSelectionPrevention( "mcp-nav-sub" );
	initSelectionPrevention( "mcp-box" );

}

var loadedEventHandler = setInterval( function () {
	if( document.readyState == "complete" )
	{
		InitQuickLogin();
		clearInterval( loadedEventHandler );
	}
}, 20 );

/**
* Window popup
*/
function popup(url, width, height, name)
{
	if (!name)
	{
		name = '_popup';
	}

	window.open(url.replace(/&amp;/g, '&'), name, 'height=' + height + ',resizable=yes,scrollbars=yes, width=' + width);
	return false;
}

/**
* Jump to page
*/
function jumpto()
{
	var page = prompt(jump_page, on_page);

	if (page !== null && !isNaN(page) && page == Math.floor(page) && page > 0)
	{
		if (base_url.indexOf('?') == -1)
		{
			document.location.href = base_url + '?start=' + ((page - 1) * per_page);
		}
		else
		{
			document.location.href = base_url.replace(/&amp;/g, '&') + '&start=' + ((page - 1) * per_page);
		}
	}
}

/**
* Mark/unmark checklist
* id = ID of parent container, name = name prefix, state = state [true/false]
*/
function marklist(id, name, state)
{
	var parent = document.getElementById(id);
	if (!parent)
	{
		eval('parent = document.' + id);
	}

	if (!parent)
	{
		return;
	}

	var rb = parent.getElementsByTagName('input');

	for (var r = 0; r < rb.length; r++)
	{
		if (rb[r].name.substr(0, name.length) == name)
		{
			rb[r].checked = state;
		}
	}
}

/**
* Resize viewable area for attached image or topic review panel (possibly others to come)
* e = element
*/
function viewableArea(e, itself)
{
	if (!e) return;
	if (!itself)
	{
		e = e.parentNode;
	}

	if (!e.vaHeight)
	{
		// Store viewable area height before changing style to auto
		e.vaHeight = e.offsetHeight;
		e.vaMaxHeight = e.style.maxHeight;
		e.style.height = 'auto';
		e.style.maxHeight = 'none';
		e.style.overflow = 'visible';
	}
	else
	{
		// Restore viewable area height to the default
		e.style.height = e.vaHeight + 'px';
		e.style.overflow = 'auto';
		e.style.maxHeight = e.vaMaxHeight;
		e.vaHeight = false;
	}
}

/**
* Set display of page element
* s[-1,0,1] = hide,toggle display,show
* type = string: inline, block, inline-block or other CSS "display" type
*/
function dE(n, s, type)
{
	if (!type)
	{
		type = 'block';
	}

	var e = document.getElementById(n);
	if (!s)
	{
		s = (e.style.display == '' || e.style.display == type) ? -1 : 1;
	}
	e.style.display = (s == 1) ? type : 'none';
}

/**
* Alternate display of subPanels
*/
function subPanels(p)
{
	var i, e, t;

	if (typeof(p) == 'string')
	{
		show_panel = p;
	}

	for (i = 0; i < panels.length; i++)
	{
		e = document.getElementById(panels[i]);
		t = document.getElementById(panels[i] + '-tab');

		if (e)
		{
			if (panels[i] == show_panel)
			{
				e.style.display = 'block';
				if (t)
				{
					t.className = 'active';
				}
			}
			else
			{
				e.style.display = 'none';
				if (t)
				{
					t.className = '';
				}
			}
		}
	}
}

/**
* Call print preview
*/
function printPage()
{
	if (is_ie)
	{
		printPreview();
	}
	else
	{
		window.print();
	}
}

/**
* Show/hide groups of blocks
* c = CSS style name
* e = checkbox element
* t = toggle dispay state (used to show 'grip-show' image in the profile block when hiding the profiles)
*/
function displayBlocks(c, e, t)
{
	var s = (e.checked == true) ?  1 : -1;

	if (t)
	{
		s *= -1;
	}

	var divs = document.getElementsByTagName("DIV");

	for (var d = 0; d < divs.length; d++)
	{
		if (divs[d].className.indexOf(c) == 0)
		{
			divs[d].style.display = (s == 1) ? 'none' : 'block';
		}
	}
}

function selectCode(a)
{
	// Get ID of code block
	var e = a.parentNode.parentNode.getElementsByTagName('CODE')[0];

	// Not IE and IE9+
	if (window.getSelection)
	{
		var s = window.getSelection();
		// Safari
		if (s.setBaseAndExtent)
		{
			s.setBaseAndExtent(e, 0, e, e.innerText.length - 1);
		}
		// Firefox and Opera
		else
		{
			// workaround for bug # 42885
			if (window.opera && e.innerHTML.substring(e.innerHTML.length - 4) == '<BR>')
			{
				e.innerHTML = e.innerHTML + '&nbsp;';
			}

			var r = document.createRange();
			r.selectNodeContents(e);
			s.removeAllRanges();
			s.addRange(r);
		}
	}
	// Some older browsers
	else if (document.getSelection)
	{
		var s = document.getSelection();
		var r = document.createRange();
		r.selectNodeContents(e);
		s.removeAllRanges();
		s.addRange(r);
	}
	// IE
	else if (document.selection)
	{
		var r = document.body.createTextRange();
		r.moveToElementText(e);
		r.select();
	}
}

/**
* Play quicktime file by determining it's width/height
* from the displayed rectangle area
*/
function play_qt_file(obj)
{
	var rectangle = obj.GetRectangle();

	if (rectangle)
	{
		rectangle = rectangle.split(',');
		var x1 = parseInt(rectangle[0]);
		var x2 = parseInt(rectangle[2]);
		var y1 = parseInt(rectangle[1]);
		var y2 = parseInt(rectangle[3]);

		var width = (x1 < 0) ? (x1 * -1) + x2 : x2 - x1;
		var height = (y1 < 0) ? (y1 * -1) + y2 : y2 - y1;
	}
	else
	{
		var width = 200;
		var height = 0;
	}

	obj.width = width;
	obj.height = height + 16;

	obj.SetControllerVisible(true);
	obj.Play();
}

/**
* Check if the nodeName of elem is name
* @author jQuery
*/
function is_node_name(elem, name)
{
	return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
}

/**
* Check if elem is in array, return position
* @author jQuery
*/
function is_in_array(elem, array)
{
	for (var i = 0, length = array.length; i < length; i++)
		// === is correct (IE)
		if (array[i] === elem)
			return i;

	return -1;
}

/**
* Find Element, type and class in tree
* Not used, but may come in handy for those not using JQuery
* @author jQuery.find, Meik Sievertsen
*/
function find_in_tree(node, tag, type, class_name)
{
	var result, element, i = 0, length = node.childNodes.length;

	for (element = node.childNodes[0]; i < length; element = node.childNodes[++i])
	{
		if (!element || element.nodeType != 1) continue;

		if ((!tag || is_node_name(element, tag)) && (!type || element.type == type) && (!class_name || is_in_array(class_name, (element.className || element).toString().split(/\s+/)) > -1))
		{
			return element;
		}

		if (element.childNodes.length)
			result = find_in_tree(element, tag, type, class_name);

		if (result) return result;
	}
}

var in_autocomplete = false;
var last_key_entered = '';

/**
* Check event key
*/
function phpbb_check_key(event)
{
	// Keycode is array down or up?
	if (event.keyCode && (event.keyCode == 40 || event.keyCode == 38))
		in_autocomplete = true;

	// Make sure we are not within an "autocompletion" field
	if (in_autocomplete)
	{
		// If return pressed and key changed we reset the autocompletion
		if (!last_key_entered || last_key_entered == event.which)
		{
			in_autocompletion = false;
			return true;
		}
	}

	// Keycode is not return, then return. ;)
	if (event.which != 13)
	{
		last_key_entered = event.which;
		return true;
	}

	return false;
}

/**
* Usually used for onkeypress event, to submit a form on enter
*/
function submit_default_button(event, selector, class_name)
{
	// Add which for key events
	if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode))
		event.which = event.charCode || event.keyCode;

	if (phpbb_check_key(event))
		return true;

	var current = selector['parentNode'];

	// Search parent form element
	while (current && (!current.nodeName || current.nodeType != 1 || !is_node_name(current, 'form')) && current != document)
		current = current['parentNode'];

	// Find the input submit button with the class name
	//current = find_in_tree(current, 'input', 'submit', class_name);
	var input_tags = current.getElementsByTagName('input');
	current = false;

	for (var i = 0, element = input_tags[0]; i < input_tags.length; element = input_tags[++i])
	{
		if (element.type == 'submit' && is_in_array(class_name, (element.className || element).toString().split(/\s+/)) > -1)
			current = element;
	}

	if (!current)
		return true;

	// Submit form
	current.focus();
	current.click();
	return false;
}

/**
* Apply onkeypress event for forcing default submit button on ENTER key press
* The jQuery snippet used is based on http://greatwebguy.com/programming/dom/default-html-button-submit-on-enter-with-jquery/
* The non-jQuery code is a mimick of the jQuery code ;)
*/
function apply_onkeypress_event()
{
	// jQuery code in case jQuery is used
	if (jquery_present)
	{
		jQuery('form input[type=text], form input[type=password]').live('keypress', function (e)
		{
			var default_button = jQuery(this).parents('form').find('input[type=submit].default-submit-action');

			if (!default_button || default_button.length <= 0)
				return true;

			if (phpbb_check_key(e))
				return true;

			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13))
			{
				default_button.click();
				return false;
			}

			return true;
		});

		return;
	}

	var input_tags = document.getElementsByTagName('input');

	for (var i = 0, element = input_tags[0]; i < input_tags.length ; element = input_tags[++i])
	{
		if (element.type == 'text' || element.type == 'password')
		{
			// onkeydown is possible too
			element.onkeypress = function (evt) { submit_default_button((evt || window.event), this, 'default-submit-action'); };
		}
	}
}

////////////////////////////////////////////////////////////////////////////////

// Euphoria Navbar Related JavaScript

// Initialize the selection prevention
function initSelectionPrevention( className )
{
	if( typeof className === "undefined" ) return;

	var objs = document.getElementsByClassName( className );
	if( objs !== "undefined" && objs.length > 0 )
	{
		for( var i = 0; i < objs.length; i++ )
		{
			objs[i].onselectstart = function () { return false; };
		}
	}
}


const NAVBAR_SWITCH_WIDTH = 640; // changes this var for your own needs
var oldNavbarWindowWidth = window.innerWidth;

// toggle a dropdown menu
function toggleNavDropdown( id, visibleValue )
{
	if( typeof visibleValue === "undefined" ) visibleValue = "inline";

	var dropDown = document.getElementById( id );
	if( dropDown === "undefined" ) return false;

	if( dropDown.style.display == "none" || dropDown.style.display == "" )
		dropDown.style.display = visibleValue;
	else
		dropDown.style.display = "none";
}

// instantiate clickbuster
// this is a technique by Ryan Fioravanti (Google Dev)
window.clickbuster = { coordinates: [] };

// try to initialize Navbar Dropdowns
function initNavbarDropdowns ()
{
	// check if we are on a handheld
	window.ishandheld = false;
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		&& document.addEventListener
		&& !(/Firefox/i.test(navigator.userAgent)) )    // do not enable clickbuster for firefox as this is crap!
	{
		window.ishandheld = true;

                window.clickbuster.preventGhostClick = function (x, y)
		{
			window.clickbuster.coordinates.push(x, y);
			window.setTimeout(window.clickbuster.pop, 2500);
		}

		window.clickbuster.pop = function()
		{
			window.clickbuster.coordinates.splice(0, 2);
		};

		window.clickbuster.onClick = function (event) {
			for (var i = 0; i < window.clickbuster.coordinates.length; i += 2) {
				var x = window.clickbuster.coordinates[i];
				var y = window.clickbuster.coordinates[i + 1];
				if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
					event.stopPropagation();
					event.preventDefault();
				}
			}
		}

                document.addEventListener('click', window.clickbuster.onClick, true);
	}

	// initialize the toggles
	var toggles = document.getElementsByClassName( 'nav-toggle' );
	if( toggles !== "undefined" && toggles.length > 0 )
	{
		for( var i = 0; i < toggles.length; i++ )
		{
			toggles[i].style.cursor = "pointer";

			if( !window.ishandheld )
			{
				toggles[i].onclick = function () {
					toggleNavDropdown( this.id + "-dropdown" );
				};
			}
			else
			{
				// add fastclick here
				toggles[i].handleEvent = function (event) {
					switch( event.type ) {
      						case 'touchstart': this.onTouchStart(event); break;
    						case 'touchmove': this.onTouchMove(event); break;
    						case 'touchend': this.onClick(event); break;
    						case 'click': this.onClick(event); break;
					}
				}

				toggles[i].reset = function ()
				{
                                        this.removeEventListener('touchend', this, false);
					document.body.removeEventListener('touchmove', this, false);
				}

				toggles[i].onTouchStart = function (e) {
					e.stopPropagation();

					this.addEventListener('touchend', this, false);
					document.body.addEventListener('touchmove', this, false);

					this.startX = e.touches[0].clientX;
					this.startY = e.touches[0].clientY;
				}

				toggles[i].onTouchMove = function (event) {
                                        if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
						Math.abs(event.touches[0].clientY - this.startY) > 10)
					{
						this.reset();
  					}
				}

				toggles[i].onClick = function (event) {
					event.stopPropagation();
					this.reset();
                                        toggleNavDropdown( this.id + "-dropdown" ); // actual click handler

					if (event.type == 'touchend') {
						window.clickbuster.preventGhostClick(this.startX, this.startY);
					}
				}

				toggles[i].addEventListener( 'touchstart', toggles[i], false );
			}
		}

		window.onresize = function () {
			var targetValue = "";
			if( oldNavbarWindowWidth < NAVBAR_SWITCH_WIDTH && window.innerWidth > NAVBAR_SWITCH_WIDTH )
			{
				targetValue = "inline";
			}
			else if( oldNavbarWindowWidth > NAVBAR_SWITCH_WIDTH && window.innerWidth < NAVBAR_SWITCH_WIDTH )
			{
				targetValue = "none";
			}

			if( targetValue != "" )
			{
			        var tgls = document.getElementsByClassName( 'nav-dropdown' );
				if( tgls !== "undefined" && tgls.length > 0 )
				{
			        	for( var n = 0; n < tgls.length; n++ )
			        	{
						tgls[n].style.display = targetValue;
					}
				}
			}

			oldNavbarWindowWidth = window.innerWidth;
		}
	}

	var subtoggles = document.getElementsByClassName( 'nav-subtoggle' );
	if( subtoggles !== "undefined" && subtoggles.length > 0 )
	{
	        for( var i = 0; i < subtoggles.length; i++ )
	        {
			subtoggles[i].style.cursor = "pointer";
			subtoggles[i].onclick = function () {
			        toggleNavDropdown( this.id + "-dropdown", "block" );
				return false;
			};
		}
	}
}

////////////////////////////////////////////////////////////////////////////////

// Euphoria avatar related functions

function avatar_toggle()
{
	// Get selected value
	var driverSelect = document.getElementById('avatar_driver');
	var selectedDriver = driverSelect.options[driverSelect.selectedIndex].value;
	var checkId = "avatar_option_" + selectedDriver.toString();

	// Hide all avatar options, show selected
	var avatarOptions = document.getElementsByClassName('avatar_option');
	for (var i = 0; i < avatarOptions.length; ++i)
	{
		if (avatarOptions[i].id == checkId)
			avatarOptions[i].style.display = "block";
		else
			avatarOptions[i].style.display = "none";
	}
}


////////////////////////////////////////////////////////////////////////////////
