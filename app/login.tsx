import { LoginButton } from '@/components/LoginButton'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

export default function Login() {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/run.png')} style={styles.logo} />
            <LoginButton />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleIcon: {
        marginBottom: 20,
        width: 70,
        height: 70,
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginBottom: 20,
    },
})