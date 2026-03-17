import { supabase } from '@/services/supabase'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'

export default function Index() {
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setTimeout(() => {
        router.replace(session ? '/run' : '/login')
      }, 2000)
    }
    checkSession()
  }, [])

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/run.png')} style={styles.logo} />
      <Text style={styles.title}>Run Tracker</Text>
      <Text style={styles.description}>วิ่งเพื่อสุขภาพ </Text>
      <ActivityIndicator size="large" color="#2C5DFF" style={styles.loading} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    marginTop: 20,
    fontFamily: 'NotoSansThai_700Bold',
    color: '#2C5DFF',
  },
  description: {
    fontSize: 20,
    marginTop: 10,
    fontFamily: 'NotoSansThai_400Regular',
  },
  loading: {
    marginTop: '10%',
  },
})