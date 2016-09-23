#!/bin/bash
role_str=$1
function get_target_role(){
    ###0 --client
    ###1 --server
    if [ "$1" = "client" ] ; then
        role=0
    fi
    if [ "$1"  = "" ] ;then
        role=0
    fi
    if [ "$1"  = "jquery" ] ;then
        role=1
    fi
    if [ "$1" = "server" ] ; then
        role=2
    fi
    return $role
}

############mian##############
get_target_role $role_str
role=$?
targetDir="../client/"
filename="valley.js"
if [ $role -eq 0 ];then
    config_name="./client_struct.config"
    filename="valley_basic.js"
elif [ $role -eq 1 ];then
    config_name="./client_struct_withjquery.config"
    #filename="valley_jquery.js"
    filename="valley.js"
elif [ $role -eq 2 ];then
    config_name="./server_struct.config"
    targetDir="../server/"
fi
echo "" > "${targetDir}/${filename}"
echo $config_name
cat $config_name | while read LINE
do
    fileName="${LINE}.js"
    if [ ! -f $fileName ] ;then
        echo "${fileName}  not find"
    fi
    #cp $fileName $targetDir     -f
    cat $fileName >> "${targetDir}/${filename}"
done

