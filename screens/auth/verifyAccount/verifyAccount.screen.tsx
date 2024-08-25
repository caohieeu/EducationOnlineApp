import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { styles } from '@/styles/verify';
import { commonStyles } from '@/styles/common';

export default function VerifyAccountScreen() {

    const inputs = useRef<any>([...Array(4)].map(() => React.createRef()))
    const [code, setCode] = useState(new Array(4).fill(''));

    const handleInput = (text:any, index:any) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if(text && index < 3) {
            inputs.current[index + 1].current.focus();
        }

        if(text === "" && index > 0) {
            inputs.current[index - 1].current.focus();
        }
    }

    return (
    <View style={styles.container}>
        <Text style={styles.headerText}>Verification Code</Text>
        <Text style={styles.subText}>We have sent the verification code to your email address</Text>
        <View style={styles.inputContainer}>
            {code.map((value, index) => (
                <TextInput
                    onChangeText={(text) => handleInput(text, index)}
                    ref={inputs.current[index]} 
                    key={index} 
                    style={styles.inputBox}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={code[index]}
                    returnKeyType="done"
                    autoFocus={index === 0} />
            ))}
        </View>
        
        <View style={[commonStyles.buttonContainer, {marginTop: 20}]}>
                <TouchableOpacity>
                    <Text style={commonStyles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
    </View>
    )
}
