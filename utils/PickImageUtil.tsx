import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default async function PickImageUtil() {
    const [loadingImage, setLoadingImage] = useState(false);
    const [image, setImage] = useState("");
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
        });
    
        if(!result.canceled) {
          setLoadingImage(true);
          deloyImage(result.assets[0].uri)
        }
        else {
            alert('Bạn chưa chọn hình ảnh nào');
        }
      };
      

      const deloyImage = async (uri:string) => {
        const uriParts = uri.split('/');
          const fileName = uriParts[uriParts.length - 1];
          const fileType = `image/${fileName.split('.').pop()}`;
          const formData = new FormData();
          formData.append('file', {
            uri: uri,
            name: fileName,
            type: fileType,
          });
          await axios.post("https://api.microlap.vn/upload/image", formData, {
            headers: {  
              'Content-Type': 'multipart/form-data',
            }
          })
          .then((res) => {
            return res.data.data.image_url;
          })
          .catch((err) => {
            return "https://imexpert.au/wp-content/uploads/2023/08/image-not-found.png";
          })
        }

    return { loadingImage, image, pickImage, deloyImage }
}