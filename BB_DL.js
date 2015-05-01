
function pathToString(path){
	var returnstring = "";
	for (i=0; i<path.length; i++){
		returnstring += '/' + path[i];
	}
	return returnstring;
}


function clickText(linkText){
	var macro, treatedstring, runcode;
	macro=  "CODE: ";
	macro+= "TAG POS=1 TYPE=A ATTR=TEXT:";
	treatedstring = '\"' + linkText + '\"';
	runcode = macro + treatedstring;
	iimPlay(runcode);
}


function getFolderNumberName(foldernumber){
	var macro1 = "CODE: SET !TIMEOUT 2\n";
	var macro2 = "TAG POS="+foldernumber.toString()+" TYPE=A ATTR=HREF:";
	var macro3 = "/webapps/blackboard/content/listContent.jsp?course_id=*content_id=*_1 EXTRACT=TXT";
	var code = macro1 + macro2 + macro3;
	iimPlay(code);
	return iimGetLastExtract(1);
}


function getFileName(filenumber){
	var macro = "CODE: SET !TIMEOUT 2\n";
	var macro1= "TAG POS=";
	var macro2= " TYPE=A ATTR=HREF:/bbcswebdav/* EXTRACT=TXT";
	code = macro + macro1 + filenumber.toString() + macro2;
	//iimSet("filenum",filenumber);
	iimPlay(code);
	return iimGetLastExtract(1);
}


function downloadFileName(filename, savedir){
	var macro = "CODE: ";
	var macro1 = "ONDOWNLOAD FOLDER=\"" + savedir;
	var macro2 = "\" FILE=\"" + filename + "\" WAIT=YES\n";
	var macro3 = "TAG POS=1 TYPE=A ATTR=TEXT:\"" + filename + "\" CONTENT=EVENT:SAVETARGETAS";
	var code = macro + macro1 + macro2 + macro3;
	iimPlay(code);
}


function downloadAll(savedir){
	var filename;
	var loop=1;
	var retcode;
	do {
		filename = getFileName(loop);
		if (filename != "#EANF#"){
			downloadFileName(filename, savedir);
			loop++;
		}
	} while (filename != "#EANF#");
}



var startpath = prompt("Enter tag to explore:", "Course Materials");
var saveDir = prompt("Enter path to download to:", "~/Documents/BB");
//var startpath = "Course Materials";
//var saveDir = "~/Documents/BB";

clickText(startpath);
var path = [];
path.push(startpath);
var stack = [1];
var retcode;
var last=0;
var foldername;

var downloadedFolders = [];

do {
	abspath = pathToString(path);
	// Download contents of folder if not already downloaded
	if (downloadedFolders.indexOf(abspath) < 0){
		downloadedFolders.push(abspath);
		downloadAll(saveDir + abspath)
	}
	
	// Get name of next folder to enter
	foldername = getFolderNumberName(stack[last]);
	if (foldername != "#EANF#") {
		clickText(foldername);
		path.push(foldername);
		stack.push(1);
		last++;
	} else {
		last--;
		stack.pop();
		path.pop();
		clickText(path[last]);
		stack[last] += 1;
	}
} while (stack.length > 0);

alert("Finished. Please allow time for the files to download.");

