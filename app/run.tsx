import { supabase } from '@/services/supabase'
import { RunsType } from '@/types/runstypes'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const runimg = require('../assets/images/run.png')

export default function Run() {
    const [runs, setRuns] = useState<RunsType[]>([])

    const fetchRuns = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('runs')
            .select('*')
            .eq('user_id', user.id)
            .order('run_date', { ascending: false })
        if (error) {
            Alert.alert('คำเตือน', 'ไม่สามารถดึงข้อมูลการวิ่งได้')
            return
        }
        setRuns(data as RunsType[])
    }

    useFocusEffect(
        useCallback(() => {
            fetchRuns()
        }, [])
    )

    // function to render item in flatlist
    const renderItem = ({ item }: { item: RunsType }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/${item.id}`)}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <Image
                    source={{ uri: item.image_url }}
                    style={styles.cardImage}
                />
                <View style={styles.distanceBadge}>
                    <Text style={styles.locationText}>{item.location}</Text>
                    <Text style={styles.dateText}>
                        {(() => {
                            const date = new Date(item.run_date);
                            const buddhistYear = 'พ.ศ. ' + (date.getFullYear() + 543);
                            return new Intl.DateTimeFormat('th-TH', {
                                month: 'long',
                                day: 'numeric',
                            }).format(date) + ' ' + buddhistYear;
                        })()}
                    </Text>
                </View>
                <Text style={styles.distanceText}>{item.distance} km</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            {/* img part */}
            <Image source={runimg} style={styles.logo} />

            {/* run list part */}
            <FlatList data={runs} renderItem={renderItem} style={styles.listPadding} />

            {/* add button part */}
            <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('/add')}>
                <Ionicons name="add" size={30} color="#ffffff" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginTop: 50,
        margin: 'auto'
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        // Shadow สำหรับ iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        // Elevation สำหรับ Android
        elevation: 3,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 10,
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    distanceBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    locationText: {
        fontFamily: 'NotoSansThai_700Bold',
        fontSize: 18,
        color: '#333',
        marginBottom: 4,
    },
    dateText: {
        fontFamily: 'NotoSansThai_400Regular',
        fontSize: 14,
        color: '#888',
    },
    distanceText: {
        fontFamily: 'NotoSansThai_700Bold',
        fontSize: 14,
        color: '#007AFF',
    },
    listPadding: {
        padding: 20,
        paddingBottom: 100, // เว้นที่ให้ FAB
    },
})