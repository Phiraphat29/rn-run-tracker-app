import { supabase } from "@/services/supabase";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export const LoginButton = () => {
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        try {
            const redirectUri = makeRedirectUri();

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: redirectUri,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

                if (result.type === "success" && result.url) {
                    console.log("กำลังล้วง Token...");

                    const returnUrl = result.url;

                    if (returnUrl.includes("access_token")) {
                        // หั่น URL เพื่อเอาแค่ก้อนข้อมูลด้านหลัง
                        const paramsStr = returnUrl.includes("#") ? returnUrl.split("#")[1] : returnUrl.split("?")[1];
                        const urlParams = new URLSearchParams(paramsStr);
                        const access_token = urlParams.get("access_token");
                        const refresh_token = urlParams.get("refresh_token");

                        if (access_token && refresh_token) {
                            const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
                            if (sessionError) throw sessionError;

                            Alert.alert("Success", "พร้อมลุยสถิติใหม่แล้ว!");
                            router.replace("/run");
                        }
                    }
                    else if (returnUrl.includes("code=")) {
                        const paramsStr = returnUrl.includes("?") ? returnUrl.split("?")[1] : returnUrl.split("#")[1];
                        const urlParams = new URLSearchParams(paramsStr);
                        const code = urlParams.get("code");

                        if (code) {
                            const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
                            if (sessionError) throw sessionError;

                            Alert.alert("Success", "พร้อมลุยสถิติใหม่แล้ว!");
                            router.replace("/run");
                        }
                    }
                }
            }
        } catch (error: any) {
            console.error(error.message);
            Alert.alert("Login Error", error.message);
        }
    };

    return (
        <TouchableOpacity style={styles.btnSignIn} onPress={handleGoogleSignIn} activeOpacity={0.8}>
            <View style={styles.btn}>
                <Text style={styles.caption}>เข้าสู่ระบบด้วย Google</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    btnSignIn: {
        borderRadius: 10,
        marginTop: 20,
        backgroundColor: "#000000E5",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    caption: {
        fontSize: 20,
        color: "#ffffff",
        fontFamily: "NotoSansThai_700Bold",
    },
});