import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

export default function Run() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('/add')}>
                <Ionicons name="add" size={30} color="#ffffff" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingButton: {
        position: 'absolute',
        bottom: '10%',
        right: '7%',
        width: 75,
        height: 75,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2C5DFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})