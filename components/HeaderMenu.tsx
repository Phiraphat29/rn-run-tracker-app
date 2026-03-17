import { supabase } from "@/services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export const HeaderMenu = () => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userAvatar, setUserAvatar] = useState("");
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "");
                setUserEmail(user.email ?? "");
                setUserAvatar(user.user_metadata?.avatar_url ?? "");
            }
        };
        fetchUser();
    }, []);

    const open = () => {
        setVisible(true);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
        ]).start();
    };

    const close = () => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
            scaleAnim.setValue(0.9);
            setVisible(false);
        });
    };

    const handleSignOut = () => {
        close();
        Alert.alert("ออกจากระบบ", "คุณต้องการออกจากระบบหรือไม่?", [
            { text: "ยกเลิก", style: "cancel" },
            {
                text: "ออกจากระบบ",
                style: "destructive",
                onPress: async () => {
                    await supabase.auth.signOut();
                    router.replace("/login");
                },
            },
        ]);
    };

    return (
        <>
            <TouchableOpacity onPress={open} hitSlop={8} style={styles.kebab}>
                <Ionicons name="ellipsis-vertical" size={22} color="#ffffff" />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close}>
                    <Animated.View
                        style={[
                            styles.menu,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}
                    >
                        <View style={styles.profileRow}>
                            <View style={styles.avatar}>
                                <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
                            </View>
                            <View style={styles.profileInfo}>
                                {userName ? <Text style={styles.name} numberOfLines={1}>{userName}</Text> : null}
                                <Text style={styles.email} numberOfLines={1}>{userEmail}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut} activeOpacity={0.6}>
                            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                            <Text style={styles.signOutText}>ออกจากระบบ</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
    kebab: {
        marginRight: 8,
        padding: 4,
    },
    backdrop: {
        flex: 1,
        alignItems: "flex-end",
    },
    menu: {
        position: "absolute",
        top: 50,
        right: 12,
        width: Math.min(screenWidth * 0.7, 280),
        backgroundColor: "#ffffff",
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#2C5DFF",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#ffffff",
        fontSize: 18,
        fontFamily: "NotoSansThai_700Bold",
    },
    avatarImage: {
        width: 42,
        height: 42,
        borderRadius: 21,
    },
    profileInfo: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 15,
        fontFamily: "NotoSansThai_700Bold",
        color: "#1a1a1a",
    },
    email: {
        fontSize: 13,
        fontFamily: "NotoSansThai_400Regular",
        color: "#888",
        marginTop: 2,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#E5E5E5",
        marginVertical: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        gap: 10,
    },
    signOutText: {
        fontSize: 15,
        fontFamily: "NotoSansThai_400Regular",
        color: "#FF3B30",
    },
});
