import Ionicons from '@expo/vector-icons/Ionicons'
import { decode } from 'base64-arraybuffer'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../services/supabase'

export default function Add() {
    const [location, setLocation] = useState('')
    const [distance, setDistance] = useState('')
    const [timeOfDay, setTimeOfDay] = useState('เช้า')
    const [image, setImage] = useState<string | null>(null)
    const [base64Image, setBase64Image] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('คุณไม่ได้อนุญาตให้ใช้งานกล้อง')
            return
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri)
            setBase64Image(result.assets[0].base64 || null)
        }
    }

    const handleSubmit = async () => {
        if (!location || !distance || !image) {
            Alert.alert('คำเตือน', 'กรุณากรอกข้อมูล และรูปภาพสถานที่ให้ครบ')
            return
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            Alert.alert('คำเตือน', 'กรุณาเข้าสู่ระบบก่อน')
            return
        }

        setSubmitting(true)
        try {
            let imageUrl = ''
            const fileName = `img_${Date.now()}.jpg`
            const { error: uploadError } = await supabase.storage.from('run_bk').upload(fileName, decode(base64Image || ''), { contentType: 'image/jpeg' })
            if (uploadError) throw uploadError

            imageUrl = supabase.storage.from('run_bk').getPublicUrl(fileName).data.publicUrl

            const { error: insertError } = await supabase.from('runs').insert([
                {
                    user_id: user.id,
                    location: location,
                    distance: distance,
                    time_of_day: timeOfDay,
                    run_date: new Date().toISOString().split('T')[0],
                    image_url: imageUrl,
                }
            ])
            if (insertError) {
                Alert.alert('คำเตือน', 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
                return
            }

            Alert.alert('สำเร็จ', 'บันทึกข้อมูลเรียบร้อย')
            router.back()
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>สถานที่วิ่ง</Text>
                <TextInput style={styles.input} placeholder="เช่น สวน" placeholderTextColor={'#868686'} value={location} onChangeText={setLocation} />
                <Text style={styles.title}>ระยะทาง (กิโลเมตร)</Text>
                <TextInput style={styles.input} placeholder="เช่น 10 กิโลเมตร" keyboardType="numeric" placeholderTextColor={'#868686'} value={distance} onChangeText={setDistance} />
                <Text style={styles.title}>ช่วงเวลาวิ่ง</Text>
                <View style={styles.timeContainer}>
                    <TouchableOpacity style={[styles.timeButton, timeOfDay === 'เช้า' ? styles.timeButtonActive : null]} onPress={() => setTimeOfDay('เช้า')}>
                        <Text style={[styles.timeButtonText, timeOfDay === 'เช้า' ? styles.timeButtonTextActive : null]}>เช้า</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.timeButton, timeOfDay === 'เย็น' ? styles.timeButtonActive : null]} onPress={() => setTimeOfDay('เย็น')}>
                        <Text style={[styles.timeButtonText, timeOfDay === 'เย็น' ? styles.timeButtonTextActive : null]}>เย็น</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>รูปภาพสถานที่</Text>
                <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto}>
                    {image
                        ? (<Image source={{ uri: image }} style={styles.image} />)
                        : (
                            <View style={styles.imageButtonContent}>
                                <Ionicons name="camera" size={24} color="#2C5DFF" />
                                <Text style={styles.imageButtonText}>กดเพื่อถ่ายภาพ</Text>
                            </View>
                        )}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.submitButton, submitting && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={submitting}>
                    {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>บันทึกข้อมูล</Text>}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 20,
        fontFamily: 'NotoSansThai_700Bold',
        color: '#2C5DFF',
        marginBottom: 5,
    },
    input: {
        borderWidth: 2,
        borderColor: '#2C5DFF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        fontFamily: 'NotoSansThai_400Regular',
    },
    timeContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timeButton: {
        borderWidth: 2,
        borderColor: '#2C5DFF',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    timeButtonText: {
        fontSize: 16,
        fontFamily: 'NotoSansThai_400Regular',
        color: '#2C5DFF',
    },
    timeButtonActive: {
        backgroundColor: '#2C5DFF',
    },
    timeButtonTextActive: {
        color: '#ffffff',
    },
    imageButtonContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 200,
        gap: 10,
    },
    imageButton: {
        borderWidth: 2,
        borderColor: '#2C5DFF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageButtonText: {
        fontSize: 16,
        fontFamily: 'NotoSansThai_400Regular',
        color: '#2C5DFF',
    },
    submitButton: {
        backgroundColor: '#2C5DFF',
        borderRadius: 10,
        padding: 10,
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 60,
    },
    submitButtonText: {
        fontSize: 16,
        fontFamily: 'NotoSansThai_700Bold',
        color: '#ffffff',
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
})