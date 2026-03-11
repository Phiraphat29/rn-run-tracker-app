import { supabase } from '@/services/supabase'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'

import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'


export default function RunDetail() {
    // get id from params through useLocalSearchParams
    const { id } = useLocalSearchParams()

    // create state to store run data
    const [location, setLocation] = useState('')
    const [distance, setDistance] = useState('')
    const [timeOfDay, setTimeOfDay] = useState('เช้า')
    const [image, setImage] = useState('')
    const [updating, setUpdating] = useState(false)

    // fetch data
    const fetchData = async () => {
        const { data, error } = await supabase.from('runs').select('*').eq('id', id).single()

        if (error) throw error

        setLocation(data.location)
        setDistance(data.distance.toString())
        setTimeOfDay(data.time_of_day)
        setImage(data.image_url)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleUpdate = async () => {
        // confirm dialog
        Alert.alert('แก้ไขรายการวิ่ง', 'คุณต้องการบันทึกการแก้ไขหรือไม่', [
            { text: 'ยกเลิก', style: 'cancel' },
            {
                text: 'บันทึก', onPress: async () => {
                    // validation
                    if (!location || !distance) {
                        Alert.alert('คำเตือน', 'กรุณากรอกข้อมูลให้ครบ')
                        return
                    }
                    const { error: updateError } = await supabase.from('runs').update({ location: location, distance: distance, time_of_day: timeOfDay }).eq('id', id)
                    if (updateError) throw updateError

                    Alert.alert('สำเร็จ', 'บันทึกการแก้ไขเรียบร้อย')
                    router.back()
                }
            },
        ])
    }

    const handleDelete = () => {
        // confirm dialog
        Alert.alert('คำเตือน', 'คุณต้องการลบรายการนี้หรือไม่', [
            { text: 'ยกเลิก', style: 'cancel' },
            {
                text: 'ลบ', onPress: async () => {
                    const { error: deleteError } = await supabase.from('runs').delete().eq('id', id)
                    if (deleteError) throw deleteError

                    const { error: storageError } = await supabase.storage.from('run_bk').remove([image.split('/').pop() || ''])
                    if (storageError) throw storageError

                    Alert.alert('สำเร็จ', 'ลบรายการนี้เรียบร้อย')
                    router.back()
                }
            },
        ])
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* ส่วนแสดงรูปภาพ */}
            <View style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.mainImage} resizeMode="cover" />
                ) : (
                    <View style={[styles.mainImage, styles.noImage]}>
                        <Ionicons name="image-outline" size={60} color="#DDD" />
                        <Text style={styles.noImageText}>ไม่มีรูปภาพประกอบ</Text>
                    </View>
                )}
            </View>

            {/* ฟอร์มแก้ไขข้อมูล */}
            <View style={styles.formCard}>
                <Text style={styles.label}>สถานที่</Text>
                <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                />

                <Text style={styles.label}>ระยะทาง (กม.)</Text>
                <TextInput
                    style={styles.input}
                    value={distance}
                    onChangeText={setDistance}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>ช่วงเวลา</Text>
                <View style={styles.row}>
                    {/* {(['เช้า', 'เย็น'] as const).map((time) => (
<TouchableOpacity
              key={time}
              style={[styles.chip, timeOfDay === time && styles.chipActive]}
              onPress={() => setTimeOfDay(time)}
>
<Text style={[styles.chipText, timeOfDay === time && styles.chipTextActive]}>
                {time}
</Text>
</TouchableOpacity>
          ))} */}
                    <TouchableOpacity
                        style={[styles.chip, timeOfDay === 'เช้า' && styles.chipActive]}
                        onPress={() => setTimeOfDay('เช้า')}
                    >
                        <Text style={[styles.chipText, timeOfDay === 'เช้า' && styles.chipTextActive]}>
                            เช้า
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.chip, timeOfDay === 'เย็น' && styles.chipActive]}
                        onPress={() => setTimeOfDay('เย็น')}
                    >
                        <Text style={[styles.chipText, timeOfDay === 'เย็น' && styles.chipTextActive]}>
                            เย็น
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.updateButton, updating && styles.buttonDisabled]}
                    disabled={updating}
                    onPress={handleUpdate}
                >
                    {updating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.updateButtonText}>บันทึกการแก้ไข</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={updating}>
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    <Text style={styles.deleteButtonText}>ลบรายการนี้</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingBottom: 40,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#EEE',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    noImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    noImageText: {
        fontFamily: 'NotoSansThai_400Regular',
        color: '#AAA',
        marginTop: 10,
    },
    formCard: {
        backgroundColor: '#FFF',
        height: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    label: {
        fontFamily: 'NotoSansThai_700Bold',
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
        textTransform: 'uppercase',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingVertical: 10,
        fontFamily: 'NotoSansThai_400Regular',
        fontSize: 18,
        color: '#007AFF',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
    },
    chipActive: {
        backgroundColor: '#007AFF',
    },
    chipText: {
        fontFamily: 'NotoSansThai_400Regular',
        color: '#666',
    },
    chipTextActive: {
        color: '#FFF',
    },
    updateButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
    },
    updateButtonText: {
        color: '#FFF',
        fontFamily: 'NotoSansThai_700Bold',
        fontSize: 16,
    },
    deleteButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
    },
    deleteButtonText: {
        color: '#FF3B30',
        fontFamily: 'NotoSansThai_400Regular',
        marginLeft: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
})