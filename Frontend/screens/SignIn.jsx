import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  interpolateColor,
} from "react-native-reanimated"
import { useNavigation } from "@react-navigation/native";
import api from "../core/api";
import utils from "../core/utils";
import useGlobal from "../core/globalStore";

// Theme constants
const COLORS = {
  primary: "#4F46E5",
  background: "#F8F9FB",
  light: "#FFFFFF",
  dark: "#202020",
  gray: "#606060",
};

const FONTS = {
  h1: { fontSize: 28, fontWeight: "700" },
  h2: { fontSize: 24, fontWeight: "700" },
  h3: { fontSize: 18, fontWeight: "600" },
  body3: { fontSize: 14, fontWeight: "500" },
  body4: { fontSize: 12, fontWeight: "400" },
};

const SIZES = {
  padding: 16,
  base: 8,
  radius: 12,
};

const SignInScreen = () => {
  const navigation = useNavigation();
  const login = useGlobal((state) => state.login);

  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false)
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const mount = useSharedValue(0)
  const emailFocusSV = useSharedValue(0)
  const passwordFocusSV = useSharedValue(0)
  const btnScale = useSharedValue(1)

  useEffect(() => {
    mount.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })
  }, [])

  useEffect(() => {
    emailFocusSV.value = withTiming(emailFocused ? 1 : 0, { duration: 180 })
  }, [emailFocused])

  useEffect(() => {
    passwordFocusSV.value = withTiming(passwordFocused ? 1 : 0, { duration: 180 })
  }, [passwordFocused])

  const brandStyle = useAnimatedStyle(() => ({
    opacity: mount.value,
    transform: [{ translateY: interpolate(mount.value, [0, 1], [12, 0]) }],
  }))

  const brandUnderline = useAnimatedStyle(() => ({
    width: `${mount.value * 100}%`,
    opacity: mount.value,
  }))

  const cardStyle = useAnimatedStyle(() => ({
    opacity: mount.value,
    transform: [{ translateY: interpolate(mount.value, [0, 1], [18, 0]) }],
  }))

  const emailInputAnimated = useAnimatedStyle(() => ({
    borderColor: interpolateColor(emailFocusSV.value, [0, 1], ["#E0E0E0", COLORS.primary]),
  }))

  const passwordInputAnimated = useAnimatedStyle(() => ({
    borderColor: interpolateColor(passwordFocusSV.value, [0, 1], ["#E0E0E0", COLORS.primary]),
  }))

  const btnAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }))

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.")
      return
    }
    setIsLoading(true)
    try {
      const response = await api.post("signin/", { username: email.trim(), password: password.trim() })
      const { user, tokens } = response.data
      utils.log("✅ Sign In Successful:", user)
      login({ username: email.trim(), password: password.trim() }, user, tokens)
      navigation.navigate("Home")
    } catch (error) {
      Alert.alert("Login Failed", error.response?.data?.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardView}>
        <Animated.View accessible accessibilityRole="header" style={[styles.brandHeader, brandStyle]}>
          <Text style={styles.brand}>Realtime Chat</Text>
          <Animated.View style={[styles.brandUnderline, brandUnderline]} />
          <Text style={styles.tagline}>Connect and Chat in Real-Time</Text>
        </Animated.View>

        <Animated.View style={[styles.card, cardStyle]} accessibilityLabel="Sign in form">
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email or Username</Text>
            <Animated.View style={emailInputAnimated}>
              <TextInput
                style={[styles.input, emailFocused && styles.inputFocused]}
                placeholder="john@example.com or johndoe"
                placeholderTextColor={COLORS.gray}
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                accessibilityLabel="Email or Username"
                returnKeyType="next"
              />
            </Animated.View>            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Animated.View style={[passwordInputAnimated]}>
                <TextInput
                  style={[styles.input, styles.inputWithRightPadding, passwordFocused && styles.inputFocused]}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.gray}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  accessibilityLabel="Password"
                  returnKeyType="done"
                />
              </Animated.View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                onPress={() => setShowPassword((v) => !v)}
                style={styles.inputToggle}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Animated.View style={btnAnimated}>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              onPressIn={() => (btnScale.value = withTiming(0.98, { duration: 90 }))}
              onPressOut={() => (btnScale.value = withTiming(1, { duration: 90 }))}
              accessibilityRole="button"
              accessibilityState={{ disabled: isLoading }}
            >
              {isLoading ? <ActivityIndicator color={COLORS.light} /> : <Text style={styles.buttonText}>Sign In</Text>}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              accessibilityRole="button"
              accessibilityLabel="Go to Sign Up"
            >
              <Text style={[styles.footerText, styles.linkText]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SIZES.padding,
  },
  brandHeader: {
    marginBottom: SIZES.padding * 1.5,
    alignItems: "center",
  },
  brand: {
    ...FONTS.h2,
    color: COLORS.dark,
    letterSpacing: 0.5,
  },
  brandUnderline: {
    marginTop: 6,
    height: 2,
    alignSelf: "stretch",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  tagline: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginTop: SIZES.base * 0.75,
  },
  card: {
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.dark,
    textAlign: "center",
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: SIZES.padding * 2,
  },
  inputContainer: {
    marginBottom: SIZES.padding,
  },
  inputLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.base * 0.5,
    marginLeft: SIZES.base * 0.5,
  },
  input: {
    backgroundColor: COLORS.light,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.75,
    borderRadius: SIZES.radius,
    ...FONTS.body3,
    color: COLORS.dark,
    marginBottom: SIZES.padding * 0.75,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: SIZES.padding * 0.75,
  },
  inputWithRightPadding: {
    paddingRight: SIZES.padding * 3,
  },
  inputToggle: {
    position: "absolute",
    right: SIZES.padding * 0.5,
    top: SIZES.padding * 0.5,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base * 0.5,
    borderRadius: SIZES.radius * 0.5,
  },
  toggleText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: "600",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding * 0.85,
    borderRadius: SIZES.radius,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.light,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SIZES.padding,
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
});
