import * as React from "react"
import {
    Button,
    Image,
    View,
    Plaform,
} from "react-native"

import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{
    state = {image:null}
    getpermiss = async()=>{
        if(Plaform.OS!=="web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status!=="granted"){
                alert("soory we need galary permission")
            } 
        }
    }
    uploadImage =  async (uri)=>{
        const data = new FormData()
        let  filename =  uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const filetoupload = {
            uri:uri,
            name:filename,
            type:type
        }
        data.append("digit",filetoupload)
        fetch("http://ae9c-122-161-86-44.ngrok.io/predict-digit",{
            method:"POST",
            body:data,
            headers:{"content-type":"multipart/from-data"}
        })
        .then((response)=>response.json())
        .then((result)=>{console.log("sccess",result)})
        .catch((error)=>{console.error("error", error)})
    }
    pickimage =  async ()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if(!result.cancelled){
                this.setState({
                    image: result.data
                })
                this.uploadImage(result.uri)
            }

        }
        catch(E){
            console.log(E)
        }
    }
    componentDidMount(){
        this.getpermiss()
    }
    render(){
        return(
            <View style={{flex:1 , alignItems:"center" , justifyContent:"center"}}>
                <Button title="pick a Image" onPress={this.pickimage}/>



            </View>
        )
    }


}