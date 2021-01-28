import os
import shutil

githubdir = "C:\\Users\\admin\\Desktop\\GitHub\\"

outdir = os.getcwd() + "\out\\"
outjs = outdir + "js\\"
outdecl = outdir + "declarations\\"

files_to_copy = (
    ["MinecraftUtils", "DMHYT\\WitcheryPE\\Witchery PE\\mod\\WitcheryPE\\lib\\", "DMHYT\\WitcheryPE\\declarations\\"],
    ["MinecraftUtils", "DMHYT\\SolarFluxRebornPE\\mod\\SolarFluxRebornPE\\lib\\", "DMHYT\\SolarFluxRebornPE\\declarations\\"]
)

def copy_lib_to_repo(libname, jsdir, decldir):
    try:
        js = r'{}'.format(outjs + libname + ".js")
        decl = r'{}'.format(outdecl + libname + ".d.ts")
        jsTo = r'{}'.format(githubdir + jsdir + libname + ".js")
        declTo = r'{}'.format(githubdir + decldir + libname + ".d.ts")
        shutil.copyfile(js, jsTo)
        shutil.copyfile(decl, declTo)
        print('Library { ' + libname + " } successfully copied")
        print('Declarations for library { ' + libname + " } successfully copied")
    except:
        print('An error occured while copying { ' + libname + " } library")

    
def copy_libs_to_repos():
    for i in files_to_copy:
        copy_lib_to_repo(i[0], i[1], i[2])

if __name__ == "__main__":
    copy_libs_to_repos()