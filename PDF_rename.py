
"""
	(Python 3)
    Renames all PDFs downloaded with iMacros javascript downloader
"""

from os import system, walk, path
import string
from glob import glob

def rename_file(name, newname):
    print('mv "'+name+'" "'+newname+'"')
    system('mv "'+name+'" "'+newname+'"')



if __name__=="__main__":
    directories = ['.']
    for entry in walk('.'):
        directories.append(entry[0])
        #print(entry[0])
    
    for dirpath in directories:
        for pdffile in glob(path.join(dirpath,'*xid*')):
            newname = pdffile.split('xid')[0] + '.pdf'
            rename_file(pdffile, newname)
