/* picomarkdown
 *
 * Github:	https://github.com/developit/picomarkdown
 * Version: 0.1.0
 *
 * A slimmed-down fork of Micromarkdown:
 *
 * Copyright 2014, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://simon.waldherr.eu/license/mit/
 */
(function(root, factory) {
	if (typeof define==='function' && define.amd) {
		define([], factory);
	}
	else if (typeof exports==='object') {
		module.exports = factory();
	}
	else {
		root.picomarkdown = factory();
	}
}(this, function() {
	"use strict";

	var regs = {
		headline : /^(\#{1,6})([^\#\n]+)$/m,
		headline2 : /\n(.*?)\n(={3,}|-{3,})$/g,
		code : /\s\`\`\`\n?([^`]+)\`\`\`/g,
		hr : /^(?:([\*\-_] ?)+)\1\1$/gm,
		lists : /^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,
		bolditalic : /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
		links : /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
		reflinks : /\[([^\]]+)\]\[([^\]]+)\]/g,
		mail : /<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
		url : /<([a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g
	};

	function cssClass(str, strict) {
		if (str.indexOf('/')<0 || strict===true) return '';

		var url = str.split('/');
		url = url[url[1].length===0 ? 2 : 0].split('.');
		return 'class="' + url[url.length - 2].replace(/[^\w\d]/g, '') + url[url.length - 1] + '" ';
	}

	function htmlEscape(str) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}


	/** Parse Markdown into HTML.
	 *  @param {String} markdown
	 *  @returns {String} html
	 */
	function picomarkdown(str, strict) {
		var line, nstatus = 0,
			status, cel, calign, indent, helper, helper1, helper2, count, repstr, stra, trashgc = [],
			casca = 0,
			i = 0,
			j = 0;
		str = '\n' + str + '\n';

		if (strict !== true) {
			regs.lists = /^((\s*(\*|\d\.) [^\n]+)\n)+/gm;
		}

		/* code */
		while ((stra = regs.code.exec(str)) !== null) {
			str = str.replace(stra[0], '<code>\n' + htmlEscape(stra[1]).replace(/\n/gm, '<br/>').replace(/\ /gm, '&nbsp;') + '</code>\n');
		}

		/* headlines */
		while ((stra = regs.headline.exec(str))) {
			count = stra[1].length;
			str = str.replace(stra[0], '<h' + count + '>' + stra[2] + '</h' + count + '>' + '\n');
		}
		while ((stra = regs.headline2.exec(str))) {
			count = stra[2][0]==='=' ? 1 : 2;
			str = str.replace(stra[0], '<h' + count + '>' + stra[1] + '</h' + count + '>' + '\n');
		}

		/* lists */
		while ((stra = regs.lists.exec(str)) !== null) {
			casca = 0;
			if ((stra[0].trim().substr(0, 1) === '*') || (stra[0].trim().substr(0, 1) === '-')) {
				repstr = '<ul>';
			} else {
				repstr = '<ol>';
			}
			helper = stra[0].split('\n');
			helper1 = [];
			status = 0;
			indent = false;
			for (i = 0; i < helper.length; i++) {
				if ((line = /^((\s*)((\*|\-)|\d(\.|\))) ([^\n]+))/.exec(helper[i])) !== null) {
					if ((line[2] === undefined) || (line[2].length === 0)) {
						nstatus = 0;
					} else {
						if (indent === false) {
							indent = line[2].replace(/\t/, '		').length;
						}
						nstatus = Math.round(line[2].replace(/\t/, '		').length / indent);
					}
					while (status > nstatus) {
						repstr += helper1.pop();
						status--;
						casca--;
					}
					while (status < nstatus) {
						if ((line[0].trim().substr(0, 1) === '*') || (line[0].trim().substr(0, 1) === '-')) {
							repstr += '<ul>';
							helper1.push('</ul>');
						} else {
							repstr += '<ol>';
							helper1.push('</ol>');
						}
						status++;
						casca++;
					}
					repstr += '<li>' + line[6] + '</li>' + '\n';
				}
			}
			while (casca > 0) {
				repstr += '</ul>';
				casca--;
			}
			if ((stra[0].trim().substr(0, 1) === '*') || (stra[0].trim().substr(0, 1) === '-')) {
				repstr += '</ul>';
			} else {
				repstr += '</ol>';
			}
			str = str.replace(stra[0], repstr + '\n');
		}

		/* bold and italic */
		for (i = 0; i < 3; i++) {
			while ((stra = regs.bolditalic.exec(str)) !== null) {
				repstr = [];
				if (stra[1] === '~~') {
					str = str.replace(stra[0], '<del>' + stra[2] + '</del>');
				} else {
					switch (stra[1].length) {
					case 1:
						repstr = ['<i>', '</i>'];
						break;
					case 2:
						repstr = ['<b>', '</b>'];
						break;
					case 3:
						repstr = ['<i><b>', '</b></i>'];
						break;
					}
					str = str.replace(stra[0], repstr[0] + stra[2] + repstr[1]);
				}
			}
		}

		/* links */
		while ((stra = regs.links.exec(str)) !== null) {
			if (stra[0].substr(0, 1) === '!') {
				str = str.replace(stra[0], '<img src="' + stra[2] + '" alt="' + stra[1] + '" title="' + stra[1] + '" />\n');
			} else {
				str = str.replace(stra[0], '<a ' + cssClass(stra[2], strict) + 'href="' + stra[2] + '">' + stra[1] + '</a>\n');
			}
		}
		while ((stra = regs.mail.exec(str)) !== null) {
			str = str.replace(stra[0], '<a href="mailto:' + stra[1] + '">' + stra[1] + '</a>');
		}
		while ((stra = regs.url.exec(str)) !== null) {
			repstr = stra[1];
			if (repstr.indexOf('://') === -1) {
				repstr = 'http://' + repstr;
			}
			str = str.replace(stra[0], '<a ' + cssClass(repstr, strict) + 'href="' + repstr + '">' + repstr.replace(/(https:\/\/|http:\/\/|mailto:|ftp:\/\/)/gmi, '') + '</a>');
		}
		while ((stra = regs.reflinks.exec(str)) !== null) {
			helper1 = new RegExp('\\[' + stra[2] + '\\]: ?([^ \n]+)', "gi");
			if ((helper = helper1.exec(str)) !== null) {
				str = str.replace(stra[0], '<a ' + cssClass(helper[1], strict) + 'href="' + helper[1] + '">' + stra[1] + '</a>');
				trashgc.push(helper[0]);
			}
		}
		for (i = 0; i < trashgc.length; i++) {
			str = str.replace(trashgc[i], '');
		}

		/* horizontal line */
		while ((stra = regs.hr.exec(str)) !== null) {
			str = str.replace(stra[0], '\n<hr/>\n');
		}

		str = str.replace(/( {2,}[\n]{1,}|\n\n+)/gmi, '<br/><br/>');
		return str;
	}

	picomarkdown.parse = picomarkdown;
	return picomarkdown;
}));
